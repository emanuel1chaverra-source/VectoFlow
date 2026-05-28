// ============================================================
// operacionesRoutes.js — Rutas tabla operaciones_suma
// Ubicación: src/routes/operacionesRoutes.js
// Trazabilidad: HU-014 | RF-014
// ============================================================

const express = require('express');
const router  = express.Router();

const { listarOperaciones, crearOperacion, eliminarOperacion, listarOperacionesEstudiante } = require('../controllers/operacionesController');
const { verificarToken, soloEstudiante, soloDocente } = require('../middlewares/authMiddleware');

// GET /api/operaciones/estudiante/:id — Para vista Docente
router.get('/estudiante/:id', verificarToken, soloDocente, listarOperacionesEstudiante);

// GET    /api/operaciones
router.get   ('/',    verificarToken, soloEstudiante, listarOperaciones);

// POST   /api/operaciones
router.post  ('/',    verificarToken, soloEstudiante, crearOperacion);

// DELETE /api/operaciones/:id
router.delete('/:id', verificarToken, soloEstudiante, eliminarOperacion);

module.exports = router;