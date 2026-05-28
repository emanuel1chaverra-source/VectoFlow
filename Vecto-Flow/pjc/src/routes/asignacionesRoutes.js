// src/routes/asignacionesRoutes.js
const express = require('express');
const router  = express.Router();
const { listarAsignaciones, crearAsignacion, editarAsignacion, toggleAsignacion } = require('../controllers/asignacionesController');
const { verificarToken, soloDocente } = require('../middlewares/authMiddleware');

router.get('/',         verificarToken, listarAsignaciones);
router.post('/',        verificarToken, soloDocente, crearAsignacion);
router.put('/:id',      verificarToken, soloDocente, editarAsignacion);
router.patch('/:id',    verificarToken, soloDocente, toggleAsignacion);

module.exports = router;