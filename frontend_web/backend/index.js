const http = require('http');
const app = require('./server');
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

// ============================================
// NOTA: CORS YA ESTÁ CONFIGURADO EN server.js
// ============================================

app.set('port', port);
const server = http.createServer(app);
    server.listen(port, host, () => {
        console.log(`Servidor corriendo en http://${host}:${port}`);
    });