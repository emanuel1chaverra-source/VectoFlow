// src/routes/sesionesRoutes.js
const express = require('express');
const router  = express.Router();
const { listarSesiones, crearSesion, cerrarSesion, toggleSesion, misSesiones } = require('../controllers/sesionesController');
const { verificarToken, soloDocente } = require('../middlewares/authMiddleware');

router.get('/mis-sesiones', verificarToken, misSesiones);
router.get('/',             verificarToken, soloDocente, listarSesiones);
router.post('/',            verificarToken, crearSesion);
router.put('/:id',          verificarToken, soloDocente, cerrarSesion);
router.patch('/:id',        verificarToken, soloDocente, toggleSesion);

module.exports = router;