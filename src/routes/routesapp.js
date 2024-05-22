const express = require('express');
const router = express.Router();

const controllers = require('../controllers/pessoaController')


// router.get('/Registros', controllers.)
router.post('/RegistroCliente', controllers.registroDeCliente)
router.get('/RegistroCliente', controllers.pegaDadosParaRegistro)

module.exports = router;