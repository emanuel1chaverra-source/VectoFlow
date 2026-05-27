// ============================================================
// app.js — Configuración central de la aplicación Express
// Ubicación: app.js (raíz del proyecto)
// Propósito: Inicializa Express, configura middlewares globales,
//            monta las rutas y expone la app para server.js
// ============================================================

const express = require('express');

// cors: middleware que permite peticiones desde otros orígenes (dominios)
const cors = require('cors');

// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

const app = express();

// ─────────────────────────────────────────────
// MIDDLEWARES GLOBALES
// ─────────────────────────────────────────────

// Habilita CORS para todas las rutas y todos los orígenes
app.use(cors());

// Permite que Express parsee el body de las peticiones en formato JSON
app.use(express.json());

// Sirve archivos estáticos (HTML, CSS, JS del frontend) desde la carpeta 'public'
app.use(express.static('public'));

// ─────────────────────────────────────────────
// RUTAS
// ─────────────────────────────────────────────

// Monta todas las rutas de autenticación y gestión de usuarios bajo /api/auth
// Rutas públicas:    POST /api/auth/registro | POST /api/auth/login
// Rutas protegidas:  GET/PUT/DELETE /api/auth/usuarios (solo Admin)
app.use('/api/auth', require('./src/routes/authRoutes'));
const vectoresRoutes = require('../pjc/src/routes/vectoresRoutes');
app.use('/api/vectores', vectoresRoutes);

// Ruta de prueba para verificar que la API está activa
app.get('/api', (req, res) => {
    res.json({ mensaje: '✅ API VectoFlow funcionando' });
});

module.exports = app;