require('dotenv').config();

// ============================================
// CAMBIADO: mysql2 ES MÁS MODERNO Y RECOMENDADO
// ============================================
const mysql = require('mysql2');

const db = mysql.createPool({
host: process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME,
port: process.env.DB_PORT,
connectionLimit: 10,
waitForConnections: true
});

db.on('connection', () => {
    console.log('Base de datos conectada')
});

db.on('error', (err) => {
    console.error('Error en la conexión MySQL:', err)
});

module.exports = db;