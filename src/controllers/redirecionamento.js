const Pessoa = require('../models/Classes/PessoaClass');
const Endereco = require('../models/Classes/enderecoClass')
const Perfis = require ('../models/Classes/perfisClass')
const Consulta = require ('../models/Classes/consultaClass')
const {novoRegistroPessoa} = require('../models/Queries/PessoaQuerie');
const {retornaEspecialidade} = require('../models/Queries/PessoaQuerie');
const {logandoCliente} = require('../models/Queries/PessoaQuerie')
const Login = require('../models/Classes/loginClass');
const Telefone = require('../models/Classes/telefoneClass');
const Funcionario = require('../models/Classes/funcionarioClass');
const Paciente = require('../models/Classes/pacienteClass');
const Especialidade = require('../models/Classes/especialidadeClass');



/*
 
*/ 

const redirecionamentoControllers = {
  direcionamentoConsultasPaciente: (req,res) => {
    res.render('pages/consultaPaciente')
  },

  direcionamentoConsultasMedicas: (req,res) => {
    res.render('pages/consultaMedico')
  },

  direcionamentoAgendamentoConsulta: (req,res) => {
    res.render('pages/agendamentoConsulta')
  },

  direcionamentoCadastroUsuario: (req,res) => {
    res.render('pages/cadastroPessoa')
  },

  direcionamentoLogin: (req,res) => {
    res.render('pages/telaLogin')
  },


  direcionamentoHome: (req,res) => {
    res.render('pages/home')
  },

}


module.exports = redirecionamentoControllers