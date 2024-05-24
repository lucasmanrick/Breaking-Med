const express = require('express');
const router = express.Router();

const controllers = require('../controllers/pessoaController')


// router.get('/Registros', controllers.)
router.post('/RegistroCliente', controllers.registroDeUsuario)
router.get('/RegistroCliente', controllers.pegaDadosParaRegistro)

module.exports = router;