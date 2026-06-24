const http = require('http');
const app = require('./server');
const cors = require('cors');
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';
// Configuración CORS
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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
// Manejar preflight CORS
app.options('*', cors());
app.set('port', port);
const server = http.createServer(app);
    server.listen(port, host, () => {
        console.log(`Servidor corriendo en http://${host}:${port}`);
    });