const express = require('express');
const router = express.Router();

const pessoaControllers = require('../controllers/pessoaController')
const consultaController = require('../controllers/consultaController')


function verifyJWT(req, res, next){
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      next();
    });
}


// router.get('/Registros', controllers.)

//adm
router.get('/RegistroCliente', pessoaControllers.retornaTodasEspecialidades) //retorna todas especialidades para o adminsitrador registrar um novo usuario
router.post('/RegistroCliente',verifyJWT ,pessoaControllers.registroDeUsuario) //registra um novo usuario se tiver o token ou seja se tiver permissao de adm



router.post('/Consulta',verifyJWT ,consultaController.novaConsulta) //para o administrador agendar uma nova consulta
router.put('/Consulta/:idDaConsulta',verifyJWT,consultaController.cancelaConsulta)




//paciente
router.get('/ConsultaPaciente/:idPessoa',consultaController.verificaConsultasPaciente)
router.post('/login',pessoaControllers.verificaEntrada)



module.exports = router;