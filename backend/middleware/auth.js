const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Obtener token del header
  let token = req.header('x-auth-token');

  //Verificar si el token viene en formato correcto
  if (!token) {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  // Verificar si no hay token
  if (!token) {
    return res.status(401).json({ success: false, msg: 'No hay token, autorización denegada' });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Añadir usuario al request
    req.usuario = decoded.usuario;
    next();
  } catch (err) {
    console.error('Error en middleware de autenticación:', err);
    res.status(401).json({ success: false, msg: 'Token no válido' });
  }
}
