const Pessoa = require('../models/Classes/PessoaClass');
const Consulta = require('../models/Classes/consultaClass');
const {registraNovaConsulta} = require('../models/Queries/ConsultaQuerie')
const {retornaConsultaDeUsuarioLogado} = require('../models/Queries/ConsultaQuerie')

const consultaController = {

  novaConsulta: async (req,res) => {
    try {
      const {data,hora,status,paciente_id,paciente_pessoa_id,funcionario_id,funcionario_pessoa_id,especialidade_id} = req.body;
      
      const consultaObj = new Consulta(null,data,hora,status,paciente_id,paciente_pessoa_id,funcionario_id,funcionario_pessoa_id,especialidade_id)

     res.json(await registraNovaConsulta(consultaObj))
    }
    catch (e) {
      res.json({consultaMessage: 'não foi possivel registrar consulta tente novamente.', result:false})
      console.log(e)
    }
  },

  verificaConsultasPaciente: async (req,res) => {
    const {idPessoa} = req.params  //o id recebido aki é o do paciente
    console.log(idPessoa)
    if(idPessoa) {
      const recebeConsultas = new Pessoa (idPessoa)
      res.json(await retornaConsultaDeUsuarioLogado (recebeConsultas))
    } else {
      res.json({consultaMessage:'o id do paciente que está solicitando consultas pendentes não foi passado', result:false})
    }
  }
}


module.exports = consultaController