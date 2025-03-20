const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Obtener token del header
  let token = req.header('x-auth-token');

  // Verificar si el token viene en formato Authorization: Bearer
  if (!token) {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  // Verificar si no hay token
  if (!token) {
    console.log('No se encontró token válido, rechazando solicitud');
    return res.status(401).json({ 
      success: false, 
      msg: 'No hay token, autorización denegada' 
    });
  }

  try {
    // Verificar token
    const secretKey = process.env.JWT_SECRET;
    
    if (!secretKey) {
      console.error('ERROR: JWT_SECRET no está definido en variables de entorno');
      return res.status(500).json({ 
        success: false, 
        msg: 'Error de configuración del servidor' 
      });
    }
    
    const decoded = jwt.verify(token, secretKey);
    
    // Añadir usuario al request
    req.usuario = decoded.usuario;
    next();
  } catch (err) {
    console.error('Error al verificar token:', err.message);
    res.status(401).json({ 
      success: false, 
      msg: 'Token no válido',
      error: err.message
    });
  }
};
