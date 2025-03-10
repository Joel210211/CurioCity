const mongoose = require('mongoose');
const Curso = require('./models/Curso');

// Conectar a la base de datos
mongoose.connect('mongodb://localhost:27017/tu_base_de_datos', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Datos de prueba
const cursosData = [
  // Matemáticas - Primer Grado
  {
    titulo: 'Matemáticas Básicas',
    descripcion: 'Curso introductorio de matemáticas',
    grado: 'Primer Grado',
    materia: 'Matemáticas',
    contenido: [
      {
        titulo: 'Sumas y Restas',
        descripcion: 'Aprende a sumar y restar con ejemplos prácticos.',
        recursos: ['https://example.com/sumas', 'https://example.com/restas'],
        actividades: [
          {
            tipo: 'ejercicio',
            titulo: 'Suma hasta 20',
            descripcion: 'Resuelve las siguientes sumas:',
            problemas: [
              '5 + 3 = ?',
              '12 + 5 = ?',
              '7 + 8 = ?',
              '15 + 4 = ?'
            ]
          },
          {
            tipo: 'ejercicio',
            titulo: 'Resta hasta 10',
            descripcion: 'Resuelve las siguientes restas:',
            problemas: [
              '10 - 4 = ?',
              '8 - 3 = ?',
              '7 - 5 = ?',
              '9 - 6 = ?'
            ]
          },
          {
            tipo: 'juego',
            titulo: 'Encuentra el número',
            descripcion: 'Juego interactivo para practicar números del 1 al 20'
          }
        ]
      },
      {
        titulo: 'Números hasta el 100',
        descripcion: 'Aprende a contar y escribir números hasta el 100',
        recursos: ['https://example.com/numeros', 'https://example.com/conteo'],
        actividades: [
          {
            tipo: 'ejercicio',
            titulo: 'Conteo de 10 en 10',
            descripcion: 'Practica el conteo de 10 en 10 hasta llegar a 100',
            problemas: [
              'Completa: 10, 20, __, 40, __',
              'Completa: 5, 15, __, 35, __',
              'Cuenta de 10 en 10 empezando desde 5'
            ]
          },
          {
            tipo: 'juego',
            titulo: 'La recta numérica',
            descripcion: 'Ubica los números en la recta numérica del 1 al 100'
          }
        ]
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
        recursos: ['https://example.com/multiplicacion', 'https://example.com/division'],
        actividades: [
          {
            tipo: 'ejercicio',
            titulo: 'Tablas de multiplicar',
            descripcion: 'Practica las tablas del 1 al 5',
            problemas: [
              '2 x 3 = ?',
              '4 x 4 = ?',
              '5 x 2 = ?',
              '3 x 5 = ?'
            ]
          },
          {
            tipo: 'ejercicio',
            titulo: 'División básica',
            descripcion: 'Divisiones simples',
            problemas: [
              '10 ÷ 2 = ?',
              '15 ÷ 3 = ?',
              '20 ÷ 4 = ?',
              '25 ÷ 5 = ?'
            ]
          },
          {
            tipo: 'juego',
            titulo: 'Carrera de multiplicación',
            descripcion: 'Juego para practicar las tablas de multiplicar'
          },
          {
            tipo: 'problema',
            titulo: 'Problemas de multiplicación',
            descripcion: 'Resuelve problemas usando multiplicación',
            problemas: [
              'Si tienes 4 cajas con 3 lápices cada una, ¿cuántos lápices tienes en total?',
              'En una granja hay 5 gallinas y cada una pone 2 huevos. ¿Cuántos huevos hay en total?',
              'Si cada día ahorras 3 monedas, ¿cuántas monedas tendrás en 4 días?'
            ]
          }
        ]
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
        titulo: 'Fracciones y Decimales',
        descripcion: 'Introducción a las fracciones y su uso.',
        actividades: [
          {
            tipo: 'ejercicio',
            titulo: 'Fracciones equivalentes',
            descripcion: 'Encuentra fracciones equivalentes',
            problemas: [
              '1/2 = ?/4',
              '2/3 = ?/6',
              '3/4 = ?/8',
              'Representa gráficamente 1/4 y 2/8'
            ]
          },
          {
            tipo: 'problema',
            titulo: 'Problemas con fracciones',
            descripcion: 'Resuelve problemas de la vida cotidiana',
            problemas: [
              'Si tienes 3/4 de una pizza y comes 1/4, ¿cuánto queda?',
              'Necesitas 2/3 de taza de azúcar para una receta. Si quieres hacer el doble, ¿cuánto necesitas?'
            ]
          },
          {
            tipo: 'juego',
            titulo: 'Dominó de fracciones',
            descripcion: 'Relaciona fracciones con su representación gráfica'
          },
          {
            tipo: 'ejercicio',
            titulo: 'Comparación de fracciones',
            descripcion: 'Ordena las siguientes fracciones de menor a mayor',
            problemas: [
              '1/2, 1/4, 3/4',
              '2/3, 1/3, 4/3'
            ]
          }
        ]
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
        recursos: ['https://example.com/decimales'],
        actividades: [
          {
            tipo: 'ejercicio',
            titulo: 'Lectura de decimales',
            descripcion: 'Aprende a leer y escribir números decimales',
            problemas: [
              'Lee el número: 3.14',
              'Escribe con números: tres enteros veinticinco centésimos',
              'Ordena de menor a mayor: 2.5, 2.05, 2.15'
            ]
          },
          {
            tipo: 'ejercicio',
            titulo: 'Operaciones con decimales',
            descripcion: 'Suma y resta de números decimales',
            problemas: [
              '3.5 + 2.7 = ?',
              '8.3 - 4.1 = ?',
              '10.5 + 5.8 = ?'
            ]
          },
          {
            tipo: 'problema',
            titulo: 'Problemas con decimales',
            descripcion: 'Resuelve problemas de la vida real con decimales',
            problemas: [
              'Juan tiene $5.75 y María $3.25. ¿Cuánto dinero tienen entre los dos?',
              'Si un lápiz cuesta $2.50 y compras 3, ¿cuánto pagarás?'
            ]
          }
        ]
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
        recursos: ['https://example.com/porcentajes'],
        actividades: [
          {
            tipo: 'ejercicio',
            titulo: 'Cálculo de porcentajes',
            descripcion: 'Aprende a calcular porcentajes básicos',
            problemas: [
              'Calcula el 50% de 200',
              'Encuentra el 25% de 80',
              '¿Cuál es el 10% de 350?'
            ]
          },
          {
            tipo: 'problema',
            titulo: 'Descuentos y ofertas',
            descripcion: 'Resuelve problemas con descuentos',
            problemas: [
              'Una camisa cuesta $100. Si tiene un 30% de descuento, ¿cuánto cuesta?',
              'Si ahorras el 15% de tu mesada de $200, ¿cuánto ahorras?'
            ]
          },
          {
            tipo: 'juego',
            titulo: 'Porcentajes en la vida diaria',
            descripcion: 'Identifica porcentajes en situaciones cotidianas'
          }
        ]
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
        recursos: ['https://example.com/algebra'],
        actividades: [
          {
            tipo: 'ejercicio',
            titulo: 'Expresiones algebraicas',
            descripcion: 'Aprende a trabajar con variables',
            problemas: [
              'Si x = 5, calcula 2x + 3',
              'Simplifica: 3x + 2x',
              'Resuelve: x + 5 = 12'
            ]
          },
          {
            tipo: 'problema',
            titulo: 'Problemas algebraicos',
            descripcion: 'Plantea y resuelve ecuaciones',
            problemas: [
              'La edad de Juan más 7 es igual a 15. ¿Qué edad tiene Juan?',
              'El doble de un número más 3 es igual a 11. ¿Cuál es el número?'
            ]
          }
        ]
      }
    ]
  },
  // Lengua - Primer Grado
  {
    titulo: 'Lengua y Literatura',
    descripcion: 'Desarrolla tus habilidades de lectura y escritura',
    grado: 'Primer Grado',
    materia: 'Lengua',
    contenido: [
      {
        titulo: 'Lectura Inicial',
        descripcion: 'Primeros pasos en la lectura',
        recursos: [
          'https://example.com/lectura-inicial',
          'https://example.com/primeras-lecturas'
        ],
        actividades: [
          {
            tipo: 'lectura',
            titulo: 'El patito travieso',
            descripcion: 'Cuento corto con preguntas de comprensión',
            texto: 'Había una vez un patito muy travieso...',
            preguntas: [
              '¿Cómo era el patito?',
              '¿Qué le gustaba hacer?',
              '¿Qué aprendió al final?'
            ]
          },
          {
            tipo: 'ejercicio',
            titulo: 'Vocales',
            descripcion: 'Identifica las vocales en palabras simples',
            palabras: ['casa', 'mesa', 'pato', 'libro']
          },
          {
            tipo: 'escritura',
            titulo: 'Mi familia',
            descripcion: 'Escribe oraciones simples sobre tu familia',
            problemas: [
              'Escribe el nombre de cada miembro de tu familia',
              'Describe a tu mamá o papá',
              'Cuenta qué te gusta hacer con tu familia'
            ]
          },
          {
            tipo: 'juego',
            titulo: 'Sopa de letras',
            descripcion: 'Encuentra palabras básicas',
            palabras: ['casa', 'perro', 'gato', 'sol', 'luna']
          }
        ]
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
        titulo: 'Lectura y Comprensión',
        descripcion: 'Mejora tu comprensión lectora',
        actividades: [
          {
            tipo: 'lectura',
            titulo: 'El bosque encantado',
            descripcion: 'Lee el cuento y responde las preguntas',
            texto: 'En un bosque mágico vivían diferentes criaturas...',
            preguntas: [
              '¿Quiénes son los personajes principales?',
              '¿Cuál es el problema en la historia?',
              '¿Cómo se resuelve el conflicto?'
            ]
          },
          {
            tipo: 'gramática',
            titulo: 'Sustantivos y adjetivos',
            descripcion: 'Identifica sustantivos y adjetivos en oraciones',
            ejercicios: [
              'El perro grande',
              'La casa azul',
              'El árbol alto'
            ]
          },
          {
            tipo: 'escritura',
            titulo: 'Escribir un cuento corto',
            descripcion: 'Crea una historia con inicio, desarrollo y final'
          }
        ]
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
        titulo: 'Narrativa y Comprensión',
        descripcion: 'Escritura de cuentos y análisis de textos',
        actividades: [
          {
            tipo: 'lectura',
            titulo: 'La leyenda del arcoíris',
            descripcion: 'Lee la leyenda y analiza sus elementos',
            texto: 'Hace mucho tiempo, todos los colores del mundo...',
            preguntas: [
              '¿Cuáles son los personajes principales?',
              '¿Qué mensaje nos deja la historia?',
              'Identifica el inicio, desarrollo y final'
            ]
          },
          {
            tipo: 'escritura',
            titulo: 'Creación de historias',
            descripcion: 'Escribe tu propia historia usando la estructura narrativa',
            pasos: [
              'Elige tus personajes',
              'Define el escenario',
              'Plantea un conflicto',
              'Desarrolla la solución'
            ]
          },
          {
            tipo: 'gramática',
            titulo: 'Verbos y tiempos',
            descripcion: 'Identifica y usa correctamente los tiempos verbales',
            ejercicios: [
              'Presente: Yo canto, tú...',
              'Pasado: Ella bailó, ellos...',
              'Futuro: Nosotros iremos, ustedes...'
            ]
          },
          {
            tipo: 'proyecto',
            titulo: 'Diario creativo',
            descripcion: 'Escribe entradas diarias usando diferentes estilos narrativos'
          }
        ]
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
        recursos: ['https://example.com/analisis'],
        actividades: [
          {
            tipo: 'lectura',
            titulo: 'Tipos de textos',
            descripcion: 'Identifica diferentes tipos de textos',
            ejemplos: [
              'Texto narrativo: cuentos y novelas',
              'Texto informativo: noticias y artículos',
              'Texto instructivo: recetas y manuales'
            ]
          },
          {
            tipo: 'escritura',
            titulo: 'Creación de textos',
            descripcion: 'Escribe diferentes tipos de textos',
            problemas: [
              'Escribe una noticia sobre un evento escolar',
              'Crea una receta de tu plato favorito',
              'Redacta un cuento de aventuras'
            ]
          }
        ]
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
        recursos: ['https://example.com/escritura'],
        actividades: [
          {
            tipo: 'escritura',
            titulo: 'Creación de poesía',
            descripcion: 'Aprende diferentes estilos poéticos',
            problemas: [
              'Escribe un poema usando rimas',
              'Crea un haiku sobre la naturaleza',
              'Escribe un acróstico con tu nombre'
            ]
          },
          {
            tipo: 'narrativa',
            titulo: 'Escritura de cuentos',
            descripcion: 'Desarrolla historias creativas',
            pasos: [
              'Crea personajes principales',
              'Establece el escenario',
              'Desarrolla el conflicto',
              'Escribe el desenlace'
            ]
          },
          {
            tipo: 'proyecto',
            titulo: 'Revista escolar',
            descripcion: 'Crea una revista con diferentes tipos de textos',
            problemas: [
              'Escribe un artículo de opinión',
              'Crea una sección de entrevistas',
              'Diseña una sección de entretenimiento'
            ]
          }
        ]
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
        recursos: ['https://example.com/literatura'],
        actividades: [
          {
            tipo: 'lectura',
            titulo: 'Mitos y leyendas',
            descripcion: 'Explora historias clásicas',
            problemas: [
              'Lee y analiza el mito de Dédalo e Ícaro',
              'Compara diferentes versiones de una leyenda',
              'Crea tu propia leyenda urbana'
            ]
          },
          {
            tipo: 'análisis',
            titulo: 'Análisis literario',
            descripcion: 'Aprende a analizar textos literarios',
            problemas: [
              'Identifica los elementos de una novela corta',
              'Analiza los personajes principales y secundarios',
              'Describe el contexto histórico de la obra'
            ]
          },
          {
            tipo: 'proyecto',
            titulo: 'Teatro escolar',
            descripcion: 'Adapta una obra clásica al teatro',
            pasos: [
              'Selecciona una obra clásica',
              'Adapta el guión',
              'Asigna personajes',
              'Prepara la representación'
            ]
          }
        ]
      }
    ]
  },
  // Ciencias - Primer Grado
  {
    titulo: 'Ciencias Naturales',
    descripcion: 'Explora el mundo natural',
    grado: 'Primer Grado',
    materia: 'Ciencias',
    contenido: [
      {
        titulo: 'Los Animales',
        descripcion: 'Conoce diferentes tipos de animales',
        actividades: [
          {
            tipo: 'clasificación',
            titulo: 'Animales domésticos y salvajes',
            descripcion: 'Clasifica los siguientes animales',
            animales: ['perro', 'león', 'gato', 'tigre', 'conejo']
          },
          {
            tipo: 'observación',
            titulo: 'Partes de los animales',
            descripcion: 'Identifica las partes principales de diferentes animales'
          },
          {
            tipo: 'experimento',
            titulo: 'Crecimiento de una planta',
            descripcion: 'Observa y registra el crecimiento de una semilla'
          },
          {
            tipo: 'cuestionario',
            titulo: 'Hábitats animales',
            descripcion: 'Relaciona cada animal con su hábitat'
          }
        ]
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
        descripcion: 'Conoce las partes de una planta y su función',
        actividades: [
          {
            tipo: 'experimento',
            titulo: 'Germinación de semillas',
            descripcion: 'Observa y registra el crecimiento de diferentes tipos de semillas',
            materiales: [
              'Semillas de frijol',
              'Algodón',
              'Agua',
              'Vaso transparente'
            ]
          },
          {
            tipo: 'identificación',
            titulo: 'Partes de la planta',
            descripcion: 'Identifica y nombra las partes de diferentes plantas',
            partes: [
              'Raíz',
              'Tallo',
              'Hojas',
              'Flores',
              'Frutos'
            ]
          },
          {
            tipo: 'investigación',
            titulo: 'Tipos de plantas',
            descripcion: 'Investiga sobre plantas de tu región'
          }
        ]
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
        recursos: ['https://example.com/ecosistemas'],
        actividades: [
          {
            tipo: 'investigación',
            titulo: 'Tipos de ecosistemas',
            descripcion: 'Investiga sobre diferentes ecosistemas',
            problemas: [
              'Describe el ecosistema del desierto',
              'Investiga los animales de la selva tropical',
              'Compara ecosistemas marinos y terrestres'
            ]
          },
          {
            tipo: 'proyecto',
            titulo: 'Maqueta de ecosistema',
            descripcion: 'Crea una maqueta de un ecosistema',
            materiales: [
              'Cartón o caja',
              'Plastilina',
              'Papel de colores',
              'Pegamento'
            ]
          }
        ]
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
        recursos: ['https://example.com/tierra'],
        actividades: [
          {
            tipo: 'investigación',
            titulo: 'Sistema Solar',
            descripcion: 'Explora los planetas y sus características',
            problemas: [
              'Describe las características de cada planeta',
              'Compara los tamaños de los planetas',
              'Investiga sobre los movimientos de la Tierra'
            ]
          },
          {
            tipo: 'experimento',
            titulo: 'Fases de la Luna',
            descripcion: 'Comprende las fases lunares',
            materiales: [
              'Linterna',
              'Pelota de ping pong',
              'Papel negro',
              'Palillo'
            ]
          },
          {
            tipo: 'proyecto',
            titulo: 'Maqueta del Sistema Solar',
            descripcion: 'Crea una representación del sistema solar',
            materiales: [
              'Bolas de diferentes tamaños',
              'Pinturas',
              'Cartulina negra',
              'Alambre'
            ]
          }
        ]
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
        recursos: ['https://example.com/fisica'],
        actividades: [
          {
            tipo: 'experimento',
            titulo: 'Fuerzas y movimiento',
            descripcion: 'Experimenta con diferentes fuerzas',
            materiales: [
              'Carritos de juguete',
              'Rampas',
              'Pesas pequeñas',
              'Cronómetro'
            ]
          },
          {
            tipo: 'investigación',
            titulo: 'Energía y sus formas',
            descripcion: 'Estudia diferentes tipos de energía',
            problemas: [
              'Identifica formas de energía en tu casa',
              'Explica la transformación de energía',
              'Investiga sobre energías renovables'
            ]
          },
          {
            tipo: 'proyecto',
            titulo: 'Máquinas simples',
            descripcion: 'Construye y explica máquinas simples',
            materiales: [
              'Poleas',
              'Palancas',
              'Planos inclinados',
              'Materiales reciclados'
            ]
          }
        ]
      }
    ]
  },
  // Música - Primer Grado
  {
    titulo: 'Música y Ritmo',
    descripcion: 'Introducción a la música',
    grado: 'Primer Grado',
    materia: 'Música',
    contenido: [
      {
        titulo: 'Ritmos Básicos',
        descripcion: 'Aprende ritmos simples',
        actividades: [
          {
            tipo: 'ritmo',
            titulo: 'Palmadas rítmicas',
            descripcion: 'Sigue el patrón de palmadas'
          },
          {
            tipo: 'canto',
            titulo: 'Canciones infantiles',
            descripcion: 'Aprende y canta melodías simples'
          },
          {
            tipo: 'instrumentos',
            titulo: 'Conoce los instrumentos',
            descripcion: 'Identifica sonidos de instrumentos básicos'
          },
          {
            tipo: 'movimiento',
            titulo: 'Baile y expresión',
            descripcion: 'Muévete al ritmo de la música'
          }
        ]
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
        descripcion: 'Aprende sobre ritmos y melodías',
        actividades: [
          {
            tipo: 'práctica',
            titulo: 'Patrones rítmicos',
            descripcion: 'Reproduce secuencias rítmicas más complejas'
          },
          {
            tipo: 'teoría',
            titulo: 'Notas musicales',
            descripcion: 'Aprende las notas básicas en el pentagrama'
          },
          {
            tipo: 'interpretación',
            titulo: 'Canciones simples',
            descripcion: 'Interpreta melodías sencillas con instrumentos básicos'
          }
        ]
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
        recursos: ['https://example.com/composicion'],
        actividades: [
          {
            tipo: 'teoría',
            titulo: 'Elementos musicales',
            descripcion: 'Aprende sobre melodía, ritmo y armonía',
            ejemplos: [
              'Identifica la melodía principal',
              'Crea patrones rítmicos',
              'Reconoce acordes básicos'
            ]
          },
          {
            tipo: 'práctica',
            titulo: 'Composición básica',
            descripcion: 'Crea pequeñas melodías',
            pasos: [
              'Elige una escala musical',
              'Crea un patrón rítmico',
              'Combina notas para formar una melodía'
            ]
          },
          {
            tipo: 'proyecto',
            titulo: 'Banda escolar',
            descripcion: 'Forma parte de un conjunto musical',
            actividades: [
              'Elige un instrumento',
              'Practica en grupo',
              'Prepara una presentación'
            ]
          }
        ]
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
        recursos: ['https://example.com/teoria'],
        actividades: [
          {
            tipo: 'lectura',
            titulo: 'Lectura musical',
            descripcion: 'Aprende a leer partituras',
            ejercicios: [
              'Identifica notas en el pentagrama',
              'Lee ritmos básicos',
              'Reconoce símbolos musicales'
            ]
          },
          {
            tipo: 'práctica',
            titulo: 'Interpretación',
            descripcion: 'Interpreta piezas musicales simples',
            piezas: [
              'Melodías populares',
              'Canciones tradicionales',
              'Composiciones básicas'
            ]
          },
          {
            tipo: 'proyecto',
            titulo: 'Concierto grupal',
            descripcion: 'Prepara una presentación musical'
          }
        ]
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
        recursos: ['https://example.com/historia'],
        actividades: [
          {
            tipo: 'investigación',
            titulo: 'Períodos musicales',
            descripcion: 'Explora diferentes épocas de la música',
            temas: [
              'Música medieval y renacentista',
              'Período barroco y clásico',
              'Música contemporánea'
            ]
          },
          {
            tipo: 'análisis',
            titulo: 'Géneros musicales',
            descripcion: 'Estudia diferentes estilos de música',
            géneros: [
              'Música clásica',
              'Jazz y blues',
              'Rock y pop'
            ]
          },
          {
            tipo: 'proyecto',
            titulo: 'Presentación musical histórica',
            descripcion: 'Prepara una presentación sobre un período musical'
          }
        ]
      }
    ]
  },
  // Plástica - Primer Grado
  {
    titulo: 'Arte y Creatividad',
    descripcion: 'Explora tu creatividad',
    grado: 'Primer Grado',
    materia: 'Plástica',
    contenido: [
      {
        titulo: 'Colores y Formas',
        descripcion: 'Aprende sobre colores y formas básicas',
        actividades: [
          {
            tipo: 'dibujo',
            titulo: 'Mi familia',
            descripcion: 'Dibuja a los miembros de tu familia'
          },
          {
            tipo: 'pintura',
            titulo: 'Mezcla de colores',
            descripcion: 'Experimenta mezclando colores primarios'
          },
          {
            tipo: 'collage',
            titulo: 'Paisaje con recortes',
            descripcion: 'Crea un paisaje usando diferentes materiales'
          },
          {
            tipo: 'modelado',
            titulo: 'Figuras con plastilina',
            descripcion: 'Modela figuras básicas con plastilina'
          }
        ]
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
        titulo: 'Técnicas Mixtas',
        descripcion: 'Explora diferentes técnicas artísticas',
        actividades: [
          {
            tipo: 'pintura',
            titulo: 'Acuarelas',
            descripcion: 'Aprende técnicas básicas de acuarela'
          },
          {
            tipo: 'collage',
            titulo: 'Collage creativo',
            descripcion: 'Crea composiciones usando diferentes materiales'
          },
          {
            tipo: 'dibujo',
            titulo: 'Dibujo con lápices de colores',
            descripcion: 'Técnicas de sombreado y mezcla de colores'
          }
        ]
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
        recursos: ['https://example.com/grabado'],
        actividades: [
          {
            tipo: 'técnica',
            titulo: 'Grabado en relieve',
            descripcion: 'Aprende técnicas básicas de grabado',
            materiales: [
              'Goma eva',
              'Gubias',
              'Tintas',
              'Rodillo'
            ]
          },
          {
            tipo: 'proyecto',
            titulo: 'Estampación creativa',
            descripcion: 'Crea diseños usando sellos y plantillas',
            materiales: [
              'Cartón',
              'Pinturas',
              'Papel',
              'Materiales naturales'
            ]
          },
          {
            tipo: 'exposición',
            titulo: 'Galería de grabados',
            descripcion: 'Organiza una exposición con tus obras'
          }
        ]
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
        recursos: ['https://example.com/arte-digital'],
        actividades: [
          {
            tipo: 'digital',
            titulo: 'Dibujo digital',
            descripcion: 'Aprende a usar herramientas de dibujo digital',
            herramientas: [
              'Tableta gráfica',
              'Software de dibujo',
              'Herramientas de edición'
            ]
          },
          {
            tipo: 'diseño',
            titulo: 'Diseño gráfico básico',
            descripcion: 'Crea carteles y diseños simples',
            proyectos: [
              'Diseño de logo',
              'Cartel para evento escolar',
              'Tarjeta de felicitación'
            ]
          },
          {
            tipo: 'animación',
            titulo: 'Animación básica',
            descripcion: 'Crea animaciones simples',
            pasos: [
              'Storyboard',
              'Diseño de personajes',
              'Animación cuadro por cuadro'
            ]
          }
        ]
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
        recursos: ['https://example.com/proyectos'],
        actividades: [
          {
            tipo: 'multimedia',
            titulo: 'Arte multimedia',
            descripcion: 'Combina diferentes técnicas artísticas',
            técnicas: [
              'Fotografía',
              'Video',
              'Instalación artística'
            ]
          },
          {
            tipo: 'exposición',
            titulo: 'Exposición final',
            descripcion: 'Prepara una exposición de arte',
            pasos: [
              'Selección de obras',
              'Montaje de exposición',
              'Presentación al público'
            ]
          },
          {
            tipo: 'portfolio',
            titulo: 'Portfolio artístico',
            descripcion: 'Crea tu portfolio de trabajos',
            elementos: [
              'Selección de mejores obras',
              'Documentación del proceso',
              'Presentación digital'
            ]
          }
        ]
      }
    ]
  },
  // Inglés - Primer Grado
  {
    titulo: 'Inglés Básico',
    descripcion: 'Primeros pasos en inglés',
    grado: 'Primer Grado',
    materia: 'Inglés',
    contenido: [
      {
        titulo: 'Saludos y Presentaciones',
        descripcion: 'Aprende a saludar y presentarte en inglés',
        actividades: [
          {
            tipo: 'vocabulario',
            titulo: 'Saludos básicos',
            descripcion: 'Aprende y practica: Hello, Hi, Good morning, Bye',
            palabras: ['Hello', 'Hi', 'Good morning', 'Good bye']
          },
          {
            tipo: 'diálogo',
            titulo: 'Mi nombre es...',
            descripcion: 'Practica presentándote en inglés'
          },
          {
            tipo: 'canción',
            titulo: 'The Greeting Song',
            descripcion: 'Aprende saludos con una canción divertida'
          },
          {
            tipo: 'juego',
            titulo: 'Memory Game',
            descripcion: 'Encuentra pares de palabras en inglés'
          }
        ]
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
        titulo: 'Vocabulario y Expresiones',
        descripcion: 'Amplía tu vocabulario en inglés',
        actividades: [
          {
            tipo: 'vocabulario',
            titulo: 'Los colores y números',
            descripcion: 'Aprende colores y números hasta el 20',
            palabras: [
              'Red, Blue, Green, Yellow',
              'Numbers from 11 to 20'
            ]
          },
          {
            tipo: 'conversación',
            titulo: 'Preguntas básicas',
            descripcion: 'Aprende a hacer y responder preguntas simples',
            ejemplos: [
              'What is your name?',
              'How old are you?',
              'Where do you live?'
            ]
          },
          {
            tipo: 'juego',
            titulo: 'Simon Says',
            descripcion: 'Juego para practicar comandos en inglés'
          }
        ]
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
        recursos: ['https://example.com/lectura'],
        actividades: [
          {
            tipo: 'lectura',
            titulo: 'Reading comprehension',
            descripcion: 'Practice reading and understanding texts',
            textos: [
              'Short stories',
              'Simple articles',
              'Comic strips'
            ]
          },
          {
            tipo: 'vocabulario',
            titulo: 'Vocabulary building',
            descripcion: 'Learn new words and expressions',
            temas: [
              'Daily routines',
              'School subjects',
              'Hobbies and interests'
            ]
          },
          {
            tipo: 'conversación',
            titulo: 'Speaking practice',
            descripcion: 'Practice speaking in English',
            actividades: [
              'Role-playing',
              'Show and tell',
              'Group discussions'
            ]
          }
        ]
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
        recursos: ['https://example.com/escritura'],
        actividades: [
          {
            tipo: 'writing',
            titulo: 'Creative writing',
            descripcion: 'Write short stories and descriptions',
            ejercicios: [
              'Write a story about your last vacation',
              'Describe your best friend',
              'Create a diary entry'
            ]
          },
          {
            tipo: 'grammar',
            titulo: 'Grammar practice',
            descripcion: 'Learn and practice grammar rules',
            temas: [
              'Present perfect',
              'Past continuous',
              'Future with "going to"'
            ]
          },
          {
            tipo: 'proyecto',
            titulo: 'Class magazine',
            descripcion: 'Create an English class magazine',
            secciones: [
              'News articles',
              'Interviews',
              'Stories and poems'
            ]
          }
        ]
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
        recursos: ['https://example.com/conversacion'],
        actividades: [
          {
            tipo: 'speaking',
            titulo: 'Public speaking',
            descripcion: 'Practice giving presentations in English',
            temas: [
              'My favorite book/movie',
              'My future plans',
              'Environmental issues'
            ]
          },
          {
            tipo: 'debate',
            titulo: 'Debate club',
            descripcion: 'Participate in English debates',
            tópicos: [
              'Social media',
              'School uniforms',
              'Healthy eating'
            ]
          },
          {
            tipo: 'proyecto',
            titulo: 'Mini documentary',
            descripcion: 'Create and present a documentary in English',
            pasos: [
              'Choose a topic',
              'Research and script writing',
              'Filming and editing',
              'Presentation'
            ]
          }
        ]
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