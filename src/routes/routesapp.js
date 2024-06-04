const express = require('express');
const router = express.Router();

const pessoaControllers = require('../controllers/pessoaController')
const consultaController = require('../controllers/consultaController')

// router.get('/Registros', controllers.)
router.post('/RegistroCliente', pessoaControllers.registroDeUsuario)
router.post('/Consulta', consultaController.novaConsulta)
router.get('/ConsultaPaciente/:idPessoa', consultaController.verificaConsultasPaciente)

module.exports = router;