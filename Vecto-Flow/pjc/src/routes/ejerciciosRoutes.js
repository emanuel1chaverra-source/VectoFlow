// Ubicación: src/routes/ejerciciosRoutes.js
const express = require('express');
const router  = express.Router();
const { listarEjercicios, crearEjercicio, editarEjercicio, toggleEjercicio } = require('../controllers/ejerciciosController');
const { verificarToken, soloDocente } = require('../middlewares/authMiddleware');

router.get('/',         verificarToken, listarEjercicios);
router.post('/',        verificarToken, soloDocente, crearEjercicio);
router.put('/:id',      verificarToken, soloDocente, editarEjercicio);
router.patch('/:id',    verificarToken, soloDocente, toggleEjercicio);

module.exports = router;