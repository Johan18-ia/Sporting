// ====================================================
// ARCHIVO PRINCIPAL DEL BACKEND
// ====================================================
const http = require('http');
const app = require('./server');
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

// ============================================
// NOTA: CORS YA ESTÁ CONFIGURADO EN server.js
// NO CONFIGURAR CORS AQUÍ PARA EVITAR DUPLICACIÓN
// ============================================

app.set('port', port);

const server = http.createServer(app);

server.listen(port, host, () => {
    console.log(`========================================`);
    console.log(`🚀 Servidor corriendo en http://${host}:${port}`);
    console.log(`📚 Swagger disponible en http://${host}:${port}/api-docs`);
    console.log(`========================================`);
});

// ============================================
// MANEJO DE ERRORES DEL SERVIDOR
// ============================================
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requiere permisos elevados`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} ya está en uso`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});