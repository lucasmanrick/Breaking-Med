const Pessoa = require('../models/Classes/PessoaClass');
const Endereco = require('../models/Classes/enderecoClass')
const Perfis = require ('../models/Classes/perfisClass')
const Consulta = require ('../models/Classes/consultaClass')
const {novoRegistroPessoa} = require('../models/Queries/PessoaQuerie');
const Login = require('../models/Classes/loginClass');



const controllers = {
  registroDeCliente: async (req,res) => {
    try{
      const {nome,cpf,genero,dataNasc,email,dataCad,logradouro,bairro,estado,numero,complemento,cep,telefones,login,senha,personPerfil,crm} = req.body;
    
      const personObj = new Pessoa (null,nome,cpf,dataNasc,genero,email,dataCad)
      const enderecoObj = new Endereco (null,logradouro,bairro,estado,numero,complemento,cep)

      function randomizaSenha () {
        let passReceive = ''
        for(let i = 0; i <= 7; i++) {
          let numActualy = Math.floor(Math.random() * 10)
          passReceive += numActualy.toString()
          console.log(passReceive)
        }
      }
      
      const loginObj = new Login (null,cpf,) 
    }catch (e) {
      console.log(e)
    }
  }

}


module.exports = controllers