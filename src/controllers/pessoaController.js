const Pessoa = require('../models/Classes/PessoaClass');
const endereco = require('../models/Classes/enderecoClass')
const login = require ('../models/Classes/loginClass')
const perfis = require ('../models/Classes/perfisClass')
const consulta = require ('../models/Classes/consultaClass')
const {novoRegistroPessoa} = require('../models/Queries/PessoaQuerie')



const controllers = {
  registroDeCliente: async (req,res) => {
    try{
      const {nome,cpf,genero,dataNasc,email,dataCad,logradouro,bairro,estado,numero,complemento,cep,telefones,login,senha,personPerfil,crm} = req.body;
    
      const personObj = new Pessoa (null)  
    }catch (e) {
      console.log(e)
    }
  }

}