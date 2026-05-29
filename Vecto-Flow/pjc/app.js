// ============================================================
// app.js — Configuración central de la aplicación Express
// Ubicación: app.js (raíz del proyecto)
// Propósito: Inicializa Express, configura middlewares globales,
//            monta las rutas y expone la app para server.js
// Trazabilidad General: HU-001 al HU-029 | RF-001 al RF-029 | RNF-01 al RNF-12
// ============================================================

// Trazabilidad: RNF-01 (Uso de Framework Express)
const express = require('express');

// cors: middleware que permite peticiones desde otros orígenes (dominios)
// Trazabilidad: RNF-02 (Seguridad y CORS)
const cors = require('cors');

// Carga las variables de entorno desde el archivo .env
// Trazabilidad: RNF-03 (Configuración de Entorno Seguro)
require('dotenv').config();

// Trazabilidad: RNF-01 (Instanciación de Aplicación Central)
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

// Trazabilidad: HU-001 al HU-009 | RF-001 al RF-009
const vectoresRoutes = require('../pjc/src/routes/vectoresRoutes');
app.use('/api/vectores', vectoresRoutes);

// ─────────────────────────────────────────────────────────────
// Rutas — Categorías de Ejercicio
// Trazabilidad: HU-010 al HU-013 | RF-010 al RF-013
// Registra las rutas REST para el CRUD de categorías.
// Endpoint base: /api/categorias
// ─────────────────────────────────────────────────────────────
const categoriasRoutes = require('../pjc/src/routes/categoriasRoutes');

// ─────────────────────────────────────────────────────────────
// Rutas — Ejercicios
// Trazabilidad: HU-014 al HU-017 | RF-014 al RF-017
// Registra las rutas REST para el CRUD de ejercicios.
// Endpoint base: /api/ejercicios
// ─────────────────────────────────────────────────────────────
const ejerciciosRoutes = require('../pjc/src/routes/ejerciciosRoutes');

// Monta las rutas de categorías en el prefijo /api/categorias
app.use('/api/categorias', categoriasRoutes);

// Monta las rutas de ejercicios en el prefijo /api/ejercicios
app.use('/api/ejercicios', ejerciciosRoutes);

// Trazabilidad: HU-018 al HU-021 | RF-018 al RF-021
const sesionesRoutes     = require('../pjc/src/routes/sesionesRoutes');

// Trazabilidad: HU-022 al HU-025 | RF-022 al RF-025
const asignacionesRoutes = require('../pjc/src/routes/asignacionesRoutes');

// Trazabilidad: HU-026 al HU-029 | RF-026 al RF-029
const intentosRoutes = require('../pjc/src/routes/intentosRouters');

app.use('/api/sesiones',     sesionesRoutes);
app.use('/api/asignaciones', asignacionesRoutes);
app.use('/api/intentos',     intentosRoutes);


// Trazabilidad: HU-001 al HU-003 (Detalles de vector posicional)
const detalleVectorRoutes = require('../pjc/src/routes/detalleVectorRoutes');

// Trazabilidad: HU-006 | HU-008 (Operaciones aritméticas)
const operacionesRoutes   = require('../pjc/src/routes/operacionesRoutes');

// Trazabilidad: HU-025 | HU-029 (Reportes y métricas de rendimiento)
const metricasRoutes      = require('../pjc/src/routes/metricasRoutes');

app.use('/api/detalle-vector', detalleVectorRoutes);
app.use('/api/operaciones',    operacionesRoutes);
app.use('/api/metricas',       metricasRoutes);

app.use('/api', require('./src/routes/detalleVectorRoutes'));
app.use('/api', require('./src/routes/operacionesRoutes'));
app.use('/api', require('./src/routes/metricasRoutes'));

// Ruta de prueba para verificar que la API está activa
app.get('/api', (req, res) => {
    res.json({ mensaje: '✅ API VectoFlow funcionando' });
});

module.exports = app;