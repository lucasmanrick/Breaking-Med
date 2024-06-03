const Consulta = require('../models/Classes/consultaClass')
const {registraNovaConsulta} = require('../models/Queries/ConsultaQuerie')

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

  consultasPendentes: async (req,res) => {
    try{
     let consultaReturn = retornaConsultasAtivas()

    }catch(e) {
      console.log(e)
    }
  },

  verificaConsultasPaciente: async (req,res) => {
    
  }
}


module.exports = consultaController