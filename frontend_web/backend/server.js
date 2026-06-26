// server.js
// Importar rutas de productos
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const usersRoutes = require('./routes/userRoutes');
const app = express();
const productRoutes = require('./routes/productRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const tournamentRoutes = require('./routes/tournamentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const studentRoutes = require('./routes/studentRoutes');


 // Middlewares globales
 app.use(logger('dev'));
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));
 
 // ============================================
 // CONFIGURACIÓN CORS UNIFICADA (SOLO UNA VEZ)
 // ============================================
 app.use(cors({
   origin: [
     'http://10.1.196.157',
     'http://10.1.196.157:5173',
     'http://localhost',
     'http://localhost:5173',
     'http://127.0.0.1',
     'http://127.0.0.1:5173'
   ],
   credentials: true,
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
 }));

 // Documentación de swagger
 const swaggerOptions = {
   swaggerOptions: {
     docExpansion: 'list',
     defaultModelsExpandDepth: -1,
     defaultModelExpandDepth: 1,
     displayRequestDuration: true,
     filter: false,
     layout: 'BaseLayout',
     showExtensions: true,
     showCommonExtensions: true,
     deepLinking: true,
     persistAuthorization: true,
     tagsSorter: 'alpha',
     operationsSorter: function(a, b) {
       const methodOrder = { 'post': 1, 'get': 2, 'put': 3, 'delete': 4 };
       return methodOrder[a.get('method')] - methodOrder[b.get('method')];
     }
   }
 };

 app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

 // ============================================
 // RUTAS UNIFICADAS (TODAS EN PLURAL POR ESTÁNDAR REST)
 // ============================================
 app.use('/api/users', usersRoutes);
 app.use('/api/products', productRoutes);
 app.use('/api/categories', categoryRoutes);  // ← CAMBIADO: /categories (plural)
 app.use('/api/schedules', scheduleRoutes);
 app.use('/api/tournaments', tournamentRoutes);
 app.use('/api/students', studentRoutes);

 // Endpoints de prueba
 app.get('/', (req, res) => {
     res.send('Ruta raíz del Backend');
 });

 app.get('/test', (req, res) => {
     res.send('Ruta TEST');
 });

 // Manejo de errores
 app.use((err, req, res, next) => {
     console.log(err);
     res.status(err.status || 500).send(err.stack);
 });

 console.log('📚 Swagger disponible en: http://10.1.196.157:3000/api-docs'); // Cambiar url

 module.exports = app;