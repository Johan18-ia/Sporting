const http = require('http');
const app = require('./server');
const cors = require('cors');
const port = process.env.PORT || 3000; // cambiar a el pueto de la que la maquina este escuchando
const host = process.env.HOST || '192.168.56.1'; // Cambiar a la ip con la de tu máquina Comando: ipconfig en el terminal

// IP de maquinas
// maquina JC: 192.168.56.1

// Configuración CORS --
app.use(cors({
    origin: [
            'http://192.168.56.1', // Cambiar a la ip con la de tu máquina Comando: ipconfig en el terminal
            'http://localhost',
            'http://127.0.0.1'
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