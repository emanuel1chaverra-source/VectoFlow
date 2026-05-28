// ============================================================
// metricasRoutes.js — Rutas tabla metricas_desempeno
// Ubicación: src/routes/metricasRoutes.js
// Trazabilidad: HU-020 | RF-020
// ============================================================

const express = require('express');
const router  = express.Router();

const { listarMetricas, crearMetrica } = require('../controllers/metricasController');
const { verificarToken, soloEstudiante } = require('../middlewares/authMiddleware');

// GET  /api/metricas
router.get ('/', verificarToken, soloEstudiante, listarMetricas);

// POST /api/metricas
router.post('/', verificarToken, soloEstudiante, crearMetrica);

module.exports = router;