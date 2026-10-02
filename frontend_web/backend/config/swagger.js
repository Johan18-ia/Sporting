const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

// ============================================
// VARIABLES DE ENTORNO PARA FLEXIBILIDAD
// ============================================
const HOST = process.env.HOST || '10.1.202.105';
const PORT = process.env.PORT || 3000;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sporting Club API',
      version: '1.0.0',
      description: 'API REST para la gestión de usuarios, estudiantes, categorías, horarios, productos y torneos.',
      contact: {
        name: 'Jhon Jolman Cordoba Irua',
        email: 'jolmanjhon@gmail.com'
      }
    },
    servers: [
      {
        url: `http://${HOST}:${PORT}`,
        description: 'Servidor local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            message: {
              type: 'string'
            },
            data: {}
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID auto-generado'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario'
            },
            name: {
              type: 'string',
              description: 'Nombre del usuario'
            },
            lastname: {
              type: 'string',
              description: 'Apellido del usuario'
            },
            role: {
              type: 'string',
              enum: ['admin', 'seller', 'user'],
              description: 'Rol del usuario'
            },
            phone: {
              type: 'string'
            },
            image: {
              type: 'string'
            },
            is_active: {
              type: 'integer',
              enum: [0, 1]
            }
          },
          example: {
            email: "juan@example.com",
            name: "Juan",
            lastname: "Pérez",
            role: "user"
          }
        },
        Login: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email'
            },
            password: {
              type: 'string'
            }
          },
          example: {
            email: "usuario@example.com",
            password: "miContraseña123"
          }
        },
        UserInput: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            id: {
              type: 'integer'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6
            },
            name: {
              type: 'string'
            },
            lastname: {
              type: 'string'
            },
            phone: {
              type: 'string'
            },
            image: {
              type: 'string'
            },
            role: {
              type: 'string',
              enum: ['admin', 'seller', 'user']
            }
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            category_year: {
              type: 'integer'
            },
            description: {
              type: 'string'
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            nombre: {
              type: 'string'
            },
            descripcion: {
              type: 'string'
            },
            precio: {
              type: 'number'
            },
            stock: {
              type: 'integer'
            },
            imagen: {
              type: 'string'
            },
            categoria: {
              type: 'string'
            }
          }
        },
        Schedule: {
          type: 'object',
          required: ['id_category', 'day_of_week', 'start_time', 'end_time'],
          properties: {
            id: {
              type: 'integer'
            },
            id_category: {
              type: 'integer'
            },
            day_of_week: {
              type: 'string',
              enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
            },
            start_time: {
              type: 'string',
              pattern: '^([01]\\d|2[0-3]):[0-5]\\d$'
            },
            end_time: {
              type: 'string',
              pattern: '^([01]\\d|2[0-3]):[0-5]\\d$'
            },
            field_name: {
              type: 'string'
            }
          }
        },
        Tournament: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            name: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            id_category: {
              type: 'integer'
            },
            tournament_date: {
              type: 'string',
              format: 'date-time'
            },
            location: {
              type: 'string'
            },
            max_teams: {
              type: 'integer'
            },
            status: {
              type: 'string'
            },
            students: {
              type: 'array',
              items: {}
            }
          }
        },
        Student: {
          type: 'object',
          required: ['user_id', 'document'],
          properties: {
            id: {
              type: 'integer'
            },
            user_id: {
              type: 'integer'
            },
            document: {
              type: 'string'
            },
            category_id: {
              type: 'integer'
            },
            birth_date: {
              type: 'string',
              format: 'date'
            },
            address: {
              type: 'string'
            },
            emergency_contact_name: {
              type: 'string'
            },
            emergency_contact_phone: {
              type: 'string'
            },
            status: {
              type: 'string'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string'
            },
            message: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  apis: [
    path.join(__dirname, '../routes/*.js').replace(/\\/g, '/'),
    path.join(__dirname, '../server.js').replace(/\\/g, '/')
  ]
};
module.exports = swaggerJsdoc(options);