// ============================================================
// detalleVectorRoutes.js — Rutas tabla detalle_vector
// Ubicación: src/routes/detalleVectorRoutes.js
// Trazabilidad: HU-019 | RF-019 | RNF-06
// ============================================================

const express = require('express');
const router  = express.Router();

const { obtenerDetalleVector } = require('../controllers/detalleVectorController');
const { verificarToken, soloEstudiante } = require('../middlewares/authMiddleware');

// GET /api/detalle-vector/:fkVector
router.get('/:fkVector', verificarToken, soloEstudiante, obtenerDetalleVector);

module.exports = router; 