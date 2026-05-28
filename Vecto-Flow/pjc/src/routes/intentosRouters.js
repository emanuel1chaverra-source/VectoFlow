const express = require('express');
const router  = express.Router();
const { listarIntentos, crearIntento, editarIntento, eliminarIntento } = require('../controllers/intentosController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/',       verificarToken, listarIntentos);
router.post('/',      verificarToken, crearIntento);
router.put('/:id',    verificarToken, editarIntento);
router.delete('/:id', verificarToken, eliminarIntento);

module.exports = router;