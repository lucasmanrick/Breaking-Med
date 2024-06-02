const Consulta = require('../models/Classes/consultaClass')

const consultaController = {
  novaConsulta: async (req,res) => {
    try {
      const {data,hora,status,paciente_id,paciente_pessoa_id,funcionario_id,funcionario_pessoa_id,especialidade_id} = req.body;
      
      const consultaObj = new Consulta(null,data,hora,status,paciente_id,paciente_pessoa_id,funcionario_id,funcionario_pessoa_id,especialidade_id)


    }
    catch (e) {
      console.log(e)
    }
  },

  consultasPendentes: async (req,res) => {
    try{
     let consultaReturn = retornaConsultasAtivas()

    }catch(e) {
      console.log(e)
    }
  }
}


module.exports = consultaController