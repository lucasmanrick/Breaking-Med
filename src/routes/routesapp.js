const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const pessoaControllers = require('../controllers/pessoaController')
const consultaController = require('../controllers/consultaController')
const redirecionamentoControllers = require('../controllers/redirecionamento')

function verifyJWT(req, res, next){
    const token = req.headers['authorization'];

    console.log(token)
    console.log(process.env.SECRET)

    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      console.log(err)
      console.log(decoded)
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      next();
    });
}



function verifyJWTMedico(req, res, next){
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, process.env.MEDIC, function(err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    
    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    next();
  });
}


function verifyJWTPaciente(req, res, next){
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, process.env.PACIENT, function(err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    
    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    next();
  });
}


// router.get('/Registros', controllers.)

// rotas para registrar novo Usuario - ADM
router.get('/RegisterPage', pessoaControllers.direcionamentoCadastroUsuario)
router.get('/RegistroUsuario',verifyJWT, pessoaControllers.retornaTodasEspecialidades) //retorna todas especialidades para o adminsitrador registrar um novo usuario
router.post('/RegistroUsuario',verifyJWT ,pessoaControllers.registroDeUsuario) //registra um novo usuario se tiver o token ou seja se tiver permissao de adm


// rotas para registro de consulta-ADM
router.get('/DadosParaRegistroConsulta',verifyJWT, consultaController.retornaEspecialidadesEFuncionario) //abre a pagina e retorna todas especialidades e os funcionarios vinculados a ela para conseguirmos agendar uma consulta.
router.post('/NovaConsulta' ,verifyJWT,consultaController.novaConsulta) //para o administrador agendar uma nova consulta passamos essa rota no formulario

// rotas para cancelamento de consulta-ADM
router.get('/Consulta',verifyJWT, consultaController.retornaTodasConsultas) //abre pagina e retorna todas as consultas ativas para posteriormente conseguirmos desfazer o agendamento.
router.put('/Consulta',verifyJWT,consultaController.cancelaConsulta)//para cancelar um agendamento.



//medico

router.get('/ConsultasMedico',verifyJWTMedico,consultaController.verificaConsultasMedico)


//paciente
router.get('/ConsultaPaciente',verifyJWTPaciente,consultaController.verificaConsultasPaciente) //retorna todas consultas do paciente logado



//home
router.get('/home', pessoaControllers.direcionamentoHome )

//login
router.get('/login', pessoaControllers.direcionamentoLogin) // abre pagina de login
router.post('/login',pessoaControllers.verificaEntrada) // verifica se o login passado existe e retorna token para ter acesso ao site.



module.exports = router;