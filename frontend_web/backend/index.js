const http = require('http');
const app = require('./server');
const cors = require('cors');
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost',
        'http://127.0.0.1'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.options('*', cors());
app.set('port', port);

const server = http.createServer(app);
server.listen(port, host, () => {
    console.log(`Servidor corriendo en http://${host}:${port}`);
});