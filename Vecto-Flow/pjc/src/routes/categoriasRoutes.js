// Ubicación: src/routes/categoriasRoutes.js
const express = require('express');
const router  = express.Router();
const { listarCategorias, crearCategoria, editarCategoria, toggleCategoria } = require('../controllers/categoriasController');
const { verificarToken, soloDocente } = require('../middlewares/authMiddleware');

router.get('/',         verificarToken, listarCategorias);
router.post('/',        verificarToken, soloDocente, crearCategoria);
router.put('/:id',      verificarToken, soloDocente, editarCategoria);
router.patch('/:id',    verificarToken, soloDocente, toggleCategoria);

module.exports = router;