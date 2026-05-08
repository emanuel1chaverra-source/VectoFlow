// ============================================================
// app.js — Configuración central de la aplicación Express
// Ubicación: app.js (raíz del proyecto)
// Propósito: Inicializa Express, configura middlewares globales,
//            monta las rutas y expone la app para server.js
// ============================================================

// Importa el framework Express para crear la aplicación web/API
const express = require('express');

// cors: middleware que permite peticiones desde otros orígenes (dominios)
// Necesario para que el frontend (HTML/JS) pueda consumir la API
// sin ser bloqueado por la política de Same-Origin del navegador
const cors = require('cors');

// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

// Crea la instancia principal de la aplicación Express
const app = express();

// ─────────────────────────────────────────────
// MIDDLEWARES GLOBALES
// Se ejecutan en orden para cada petición entrante
// ─────────────────────────────────────────────

// Habilita CORS para todas las rutas y todos los orígenes
// En producción se debería restringir a dominios específicos
app.use(cors());

// Permite que Express parsee el body de las peticiones en formato JSON
// Sin esto, req.body estaría undefined en los controladores
app.use(express.json());

// Sirve archivos estáticos (HTML, CSS, JS del frontend) desde la carpeta 'public'
// Permite acceder a login.html, registro.html, etc. directamente desde el navegador
app.use(express.static('public'));

// ─────────────────────────────────────────────
// RUTAS
// ─────────────────────────────────────────────

// Monta todas las rutas de autenticación bajo el prefijo /api/auth
// Ejemplo: POST /api/auth/login → authRoutes.js → authController.js
app.use('/api/auth', require('./src/routes/authRoutes'));

// Ruta de prueba para verificar que la API está activa
// Útil para health checks o pruebas rápidas desde el navegador
app.get('/api', (req, res) => {
    res.json({ mensaje: '✅ API VectoFlow funcionando' });
});

// Exporta la app para que server.js la use al iniciar el servidor HTTP
module.exports = app;
