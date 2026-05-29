// ============================================================
// server.js — Punto de entrada del servidor Node.js
// Ubicación: server.js (raíz del proyecto)
// Propósito: Importa la app configurada en app.js, inicializa
//            la conexión a la BD y arranca el servidor HTTP
//            en el puerto definido en las variables de entorno.
// Trazabilidad General: RNF-01 | RNF-03 | RNF-08
// ============================================================

// Importa la aplicación Express ya configurada con middlewares y rutas
// Trazabilidad: RNF-01 (Inyección del framework central de la aplicación)
const app = require('./app');

// Importa db.js para que la conexión a MariaDB se establezca
// al momento de arrancar el servidor (ejecuta el getConnection() de db.js)
// Trazabilidad: RNF-08 (Garantía de inicialización de la capa de persistencia relacional)
require('./src/config/db');

// Lee el puerto desde las variables de entorno (.env → PORT=3000)
// Si no está definido, usa 3000 como valor por defecto
// Trazabilidad: RNF-03 (Configuración adaptativa de red mediante variables de entorno)
const PORT = process.env.PORT || 3000;

// Inicia el servidor HTTP y lo pone a escuchar en el puerto definido
// El callback se ejecuta una sola vez cuando el servidor está listo
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});