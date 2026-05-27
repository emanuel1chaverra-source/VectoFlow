// ============================================================
// vectoresRoutes.js — Rutas del módulo de vectores
// Ubicación: src/routes/vectoresRoutes.js
// ============================================================

const express    = require('express');
const router     = express.Router();
const { guardarSuma } = require('../controllers/vectoresController');
const { verificarToken } = require('../middlewares/authMiddleware');

// POST /api/vectores/guardar-suma — Requiere JWT válido
router.post('/guardar-suma', verificarToken, guardarSuma);

module.exports = router;