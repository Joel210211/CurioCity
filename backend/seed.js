const mongoose = require('mongoose');
const Curso = require('./models/Curso');

// Conectar a la base de datos
mongoose.connect('mongodb://localhost:27017/tu_base_de_datos', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Datos de prueba
const cursosData = [
  // Matemáticas
  {
    titulo: 'Matemáticas Básicas',
    descripcion: 'Curso introductorio de matemáticas',
    grado: 'Primer Grado',
    materia: 'Matemáticas',
    contenido: [
      {
        titulo: 'Sumas y Restas',
        descripcion: 'Aprende a sumar y restar con ejemplos prácticos.',
        recursos: ['https://example.com/sumas', 'https://example.com/restas']
      }
    ]
  },
  {
    titulo: 'Matemáticas Intermedias',
    descripcion: 'Curso de matemáticas para segundo grado',
    grado: 'Segundo Grado',
    materia: 'Matemáticas',
    contenido: [
      {
        titulo: 'Multiplicación y División',
        descripcion: 'Aprende a multiplicar y dividir con ejemplos.',
        recursos: ['https://example.com/multiplicacion', 'https://example.com/division']
      }
    ]
  },
  {
    titulo: 'Matemáticas Avanzadas',
    descripcion: 'Curso de matemáticas para tercer grado',
    grado: 'Tercer Grado',
    materia: 'Matemáticas',
    contenido: [
      {
        titulo: 'Fracciones',
        descripcion: 'Introducción a las fracciones y su uso.',
        recursos: ['https://example.com/fracciones']
      }
    ]
  },
  {
    titulo: 'Matemáticas para Cuarto Grado',
    descripcion: 'Curso de matemáticas para cuarto grado',
    grado: 'Cuarto Grado',
    materia: 'Matemáticas',
    contenido: [
      {
        titulo: 'Decimales',
        descripcion: 'Aprende sobre números decimales.',
        recursos: ['https://example.com/decimales']
      }
    ]
  },
  {
    titulo: 'Matemáticas para Quinto Grado',
    descripcion: 'Curso de matemáticas para quinto grado',
    grado: 'Quinto Grado',
    materia: 'Matemáticas',
    contenido: [
      {
        titulo: 'Porcentajes',
        descripcion: 'Entiende los porcentajes y su aplicación.',
        recursos: ['https://example.com/porcentajes']
      }
    ]
  },
  {
    titulo: 'Matemáticas para Sexto Grado',
    descripcion: 'Curso de matemáticas para sexto grado',
    grado: 'Sexto Grado',
    materia: 'Matemáticas',
    contenido: [
      {
        titulo: 'Álgebra Básica',
        descripcion: 'Introducción al álgebra y sus conceptos.',
        recursos: ['https://example.com/algebra']
      }
    ]
  },
  // Lengua
  {
    titulo: 'Lengua y Literatura',
    descripcion: 'Desarrolla tus habilidades de lectura y escritura',
    grado: 'Primer Grado',
    materia: 'Lengua',
    contenido: [
      {
        titulo: 'Cuentos Cortos',
        descripcion: 'Lectura y comprensión de cuentos cortos.',
        recursos: ['https://example.com/cuentos']
      }
    ]
  },
  {
    titulo: 'Lengua y Literatura Avanzada',
    descripcion: 'Desarrolla tus habilidades de lectura y escritura',
    grado: 'Segundo Grado',
    materia: 'Lengua',
    contenido: [
      {
        titulo: 'Lectura de Poesía',
        descripcion: 'Explora la poesía y su análisis.',
        recursos: ['https://example.com/poesia']
      }
    ]
  },
  {
    titulo: 'Lengua y Literatura para Tercer Grado',
    descripcion: 'Desarrolla tus habilidades de lectura y escritura',
    grado: 'Tercer Grado',
    materia: 'Lengua',
    contenido: [
      {
        titulo: 'Narrativa',
        descripcion: 'Escritura de cuentos y relatos.',
        recursos: ['https://example.com/narrativa']
      }
    ]
  },
  {
    titulo: 'Lengua y Literatura para Cuarto Grado',
    descripcion: 'Desarrolla tus habilidades de lectura y escritura',
    grado: 'Cuarto Grado',
    materia: 'Lengua',
    contenido: [
      {
        titulo: 'Análisis de Textos',
        descripcion: 'Aprende a analizar diferentes tipos de textos.',
        recursos: ['https://example.com/analisis']
      }
    ]
  },
  {
    titulo: 'Lengua y Literatura para Quinto Grado',
    descripcion: 'Desarrolla tus habilidades de lectura y escritura',
    grado: 'Quinto Grado',
    materia: 'Lengua',
    contenido: [
      {
        titulo: 'Escritura Creativa',
        descripcion: 'Fomenta la creatividad en la escritura.',
        recursos: ['https://example.com/escritura']
      }
    ]
  },
  {
    titulo: 'Lengua y Literatura para Sexto Grado',
    descripcion: 'Desarrolla tus habilidades de lectura y escritura',
    grado: 'Sexto Grado',
    materia: 'Lengua',
    contenido: [
      {
        titulo: 'Literatura Clásica',
        descripcion: 'Introducción a la literatura clásica.',
        recursos: ['https://example.com/literatura']
      }
    ]
  },
  // Ciencias
  {
    titulo: 'Ciencias Naturales',
    descripcion: 'Explora el mundo de la ciencia',
    grado: 'Primer Grado',
    materia: 'Ciencias',
    contenido: [
      {
        titulo: 'Los Animales',
        descripcion: 'Aprende sobre diferentes tipos de animales.',
        recursos: ['https://example.com/animales']
      }
    ]
  },
  {
    titulo: 'Ciencias Naturales para Segundo Grado',
    descripcion: 'Explora el mundo de la ciencia',
    grado: 'Segundo Grado',
    materia: 'Ciencias',
    contenido: [
      {
        titulo: 'Las Plantas',
        descripcion: 'Conoce las partes de una planta y su función.',
        recursos: ['https://example.com/plantas']
      }
    ]
  },
  {
    titulo: 'Ciencias Naturales para Tercer Grado',
    descripcion: 'Explora el mundo de la ciencia',
    grado: 'Tercer Grado',
    materia: 'Ciencias',
    contenido: [
      {
        titulo: 'El Cuerpo Humano',
        descripcion: 'Aprende sobre las partes del cuerpo humano.',
        recursos: ['https://example.com/cuerpo']
      }
    ]
  },
  {
    titulo: 'Ciencias Naturales para Cuarto Grado',
    descripcion: 'Explora el mundo de la ciencia',
    grado: 'Cuarto Grado',
    materia: 'Ciencias',
    contenido: [
      {
        titulo: 'Ecosistemas',
        descripcion: 'Conoce los diferentes ecosistemas del planeta.',
        recursos: ['https://example.com/ecosistemas']
      }
    ]
  },
  {
    titulo: 'Ciencias Naturales para Quinto Grado',
    descripcion: 'Explora el mundo de la ciencia',
    grado: 'Quinto Grado',
    materia: 'Ciencias',
    contenido: [
      {
        titulo: 'La Tierra y el Espacio',
        descripcion: 'Aprende sobre la Tierra y el sistema solar.',
        recursos: ['https://example.com/tierra']
      }
    ]
  },
  {
    titulo: 'Ciencias Naturales para Sexto Grado',
    descripcion: 'Explora el mundo de la ciencia',
    grado: 'Sexto Grado',
    materia: 'Ciencias',
    contenido: [
      {
        titulo: 'Física Básica',
        descripcion: 'Introducción a conceptos básicos de física.',
        recursos: ['https://example.com/fisica']
      }
    ]
  },
  // Música
  {
    titulo: 'Música y Ritmo',
    descripcion: 'Explora el mundo de la música',
    grado: 'Primer Grado',
    materia: 'Música',
    contenido: [
      {
        titulo: 'Instrumentos Musicales',
        descripcion: 'Conoce los diferentes instrumentos musicales.',
        recursos: ['https://example.com/instrumentos']
      }
    ]
  },
  {
    titulo: 'Música para Segundo Grado',
    descripcion: 'Explora el mundo de la música',
    grado: 'Segundo Grado',
    materia: 'Música',
    contenido: [
      {
        titulo: 'Ritmos y Melodías',
        descripcion: 'Aprende sobre ritmos y melodías.',
        recursos: ['https://example.com/ritmos']
      }
    ]
  },
  {
    titulo: 'Música para Tercer Grado',
    descripcion: 'Explora el mundo de la música',
    grado: 'Tercer Grado',
    materia: 'Música',
    contenido: [
      {
        titulo: 'Cantos y Canciones',
        descripcion: 'Aprende a cantar y disfrutar de la música.',
        recursos: ['https://example.com/cantos']
      }
    ]
  },
  {
    titulo: 'Música para Cuarto Grado',
    descripcion: 'Explora el mundo de la música',
    grado: 'Cuarto Grado',
    materia: 'Música',
    contenido: [
      {
        titulo: 'Composición Musical',
        descripcion: 'Introducción a la composición musical.',
        recursos: ['https://example.com/composicion']
      }
    ]
  },
  {
    titulo: 'Música para Quinto Grado',
    descripcion: 'Explora el mundo de la música',
    grado: 'Quinto Grado',
    materia: 'Música',
    contenido: [
      {
        titulo: 'Teoría Musical',
        descripcion: 'Aprende los fundamentos de la teoría musical.',
        recursos: ['https://example.com/teoria']
      }
    ]
  },
  {
    titulo: 'Música para Sexto Grado',
    descripcion: 'Explora el mundo de la música',
    grado: 'Sexto Grado',
    materia: 'Música',
    contenido: [
      {
        titulo: 'Historia de la Música',
        descripcion: 'Conoce la historia de la música a través de los tiempos.',
        recursos: ['https://example.com/historia']
      }
    ]
  },
  // Plástica
  {
    titulo: 'Arte y Creatividad',
    descripcion: 'Desarrolla tu creatividad con diferentes técnicas artísticas',
    grado: 'Primer Grado',
    materia: 'Plástica',
    contenido: [
      {
        titulo: 'Dibujo y Pintura',
        descripcion: 'Introducción al dibujo y la pintura.',
        recursos: ['https://example.com/dibujo']
      }
    ]
  },
  {
    titulo: 'Arte para Segundo Grado',
    descripcion: 'Desarrolla tu creatividad con diferentes técnicas artísticas',
    grado: 'Segundo Grado',
    materia: 'Plástica',
    contenido: [
      {
        titulo: 'Técnicas de Collage',
        descripcion: 'Aprende a hacer collages creativos.',
        recursos: ['https://example.com/collage']
      }
    ]
  },
  {
    titulo: 'Arte para Tercer Grado',
    descripcion: 'Desarrolla tu creatividad con diferentes técnicas artísticas',
    grado: 'Tercer Grado',
    materia: 'Plástica',
    contenido: [
      {
        titulo: 'Escultura',
        descripcion: 'Introducción a la escultura y el modelado.',
        recursos: ['https://example.com/escultura']
      }
    ]
  },
  {
    titulo: 'Arte para Cuarto Grado',
    descripcion: 'Desarrolla tu creatividad con diferentes técnicas artísticas',
    grado: 'Cuarto Grado',
    materia: 'Plástica',
    contenido: [
      {
        titulo: 'Técnicas de Grabado',
        descripcion: 'Aprende sobre técnicas de grabado.',
        recursos: ['https://example.com/grabado']
      }
    ]
  },
  {
    titulo: 'Arte para Quinto Grado',
    descripcion: 'Desarrolla tu creatividad con diferentes técnicas artísticas',
    grado: 'Quinto Grado',
    materia: 'Plástica',
    contenido: [
      {
        titulo: 'Arte Digital',
        descripcion: 'Introducción al arte digital y sus herramientas.',
        recursos: ['https://example.com/arte-digital']
      }
    ]
  },
  {
    titulo: 'Arte para Sexto Grado',
    descripcion: 'Desarrolla tu creatividad con diferentes técnicas artísticas',
    grado: 'Sexto Grado',
    materia: 'Plástica',
    contenido: [
      {
        titulo: 'Proyectos Artísticos',
        descripcion: 'Desarrolla proyectos artísticos completos.',
        recursos: ['https://example.com/proyectos']
      }
    ]
  },
  // Inglés
  {
    titulo: 'Inglés Básico',
    descripcion: 'Curso introductorio de inglés',
    grado: 'Primer Grado',
    materia: 'Inglés',
    contenido: [
      {
        titulo: 'Vocabulario Básico',
        descripcion: 'Aprende palabras y frases básicas en inglés.',
        recursos: ['https://example.com/vocabulario-basico']
      }
    ]
  },
  {
    titulo: 'Inglés Intermedio',
    descripcion: 'Curso de inglés para segundo grado',
    grado: 'Segundo Grado',
    materia: 'Inglés',
    contenido: [
      {
        titulo: 'Frases Comunes',
        descripcion: 'Aprende frases comunes en inglés.',
        recursos: ['https://example.com/frases-comunes']
      }
    ]
  },
  {
    titulo: 'Inglés Avanzado',
    descripcion: 'Curso de inglés para tercer grado',
    grado: 'Tercer Grado',
    materia: 'Inglés',
    contenido: [
      {
        titulo: 'Gramática Básica',
        descripcion: 'Introducción a la gramática inglesa.',
        recursos: ['https://example.com/gramatica-basica']
      }
    ]
  },
  {
    titulo: 'Inglés para Cuarto Grado',
    descripcion: 'Curso de inglés para cuarto grado',
    grado: 'Cuarto Grado',
    materia: 'Inglés',
    contenido: [
      {
        titulo: 'Lectura y Comprensión',
        descripcion: 'Desarrolla habilidades de lectura en inglés.',
        recursos: ['https://example.com/lectura']
      }
    ]
  },
  {
    titulo: 'Inglés para Quinto Grado',
    descripcion: 'Curso de inglés para quinto grado',
    grado: 'Quinto Grado',
    materia: 'Inglés',
    contenido: [
      {
        titulo: 'Escritura en Inglés',
        descripcion: 'Aprende a escribir en inglés.',
        recursos: ['https://example.com/escritura']
      }
    ]
  },
  {
    titulo: 'Inglés para Sexto Grado',
    descripcion: 'Curso de inglés para sexto grado',
    grado: 'Sexto Grado',
    materia: 'Inglés',
    contenido: [
      {
        titulo: 'Conversación en Inglés',
        descripcion: 'Desarrolla habilidades de conversación en inglés.',
        recursos: ['https://example.com/conversacion']
      }
    ]
  }
];

// Insertar datos de prueba
Curso.insertMany(cursosData)
  .then(() => {
    console.log('Datos de prueba insertados correctamente');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error al insertar datos de prueba:', err);
    mongoose.connection.close();
  });