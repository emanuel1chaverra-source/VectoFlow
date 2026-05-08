// ============================================================
// db.js — Configuración y conexión a la base de datos
// Ubicación: src/config/db.js
// Propósito: Crear y exportar el pool de conexiones a MariaDB
//            usando variables de entorno para mayor seguridad.
// ============================================================

// Importa el módulo mysql2, que permite conectarse a MySQL/MariaDB
// Se usa la versión con soporte a Promesas (mysql2/promise se activa más abajo)
const mysql = require('mysql2');

// Carga las variables definidas en el archivo .env al objeto process.env
// Esto evita hardcodear credenciales directamente en el código
require('dotenv').config();

// Crea un pool de conexiones en lugar de una conexión simple.
// Un pool reutiliza conexiones activas, mejorando el rendimiento
// cuando múltiples usuarios hacen peticiones simultáneas.
const pool = mysql.createPool({
    host: process.env.DB_HOST,         // Dirección del servidor de BD (ej: localhost)
    user: process.env.DB_USER,         // Usuario de la base de datos (ej: root)
    password: process.env.DB_PASSWORD, // Contraseña del usuario de BD
    database: process.env.DB_NAME,     // Nombre de la base de datos (VectoFlow)
    port: process.env.DB_PORT          // Puerto de conexión (por defecto MariaDB: 3306)
});

// Convierte el pool a su versión con soporte de Promesas (async/await)
// Esto permite usar await db.query(...) en lugar de callbacks
const db = pool.promise();

// Prueba inmediata de conexión al iniciar el servidor.
// Si la conexión es exitosa, imprime confirmación en consola.
// Si falla (credenciales incorrectas, BD apagada, etc.), muestra el error.
db.getConnection()
    .then(() => console.log('✅ Conectado a MariaDB - VectoFlow'))
    .catch(err => console.error('❌ Error de conexión:', err.message));

// Exporta el objeto db para que otros módulos (authController, etc.)
// puedan importarlo y ejecutar consultas SQL
module.exports = db;
