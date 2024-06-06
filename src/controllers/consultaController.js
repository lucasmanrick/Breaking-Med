const Pessoa = require('../models/Classes/PessoaClass');
const Consulta = require('../models/Classes/consultaClass');
const {registraNovaConsulta} = require('../models/Queries/ConsultaQuerie');
const {retornaConsultaDeUsuarioLogado} = require('../models/Queries/ConsultaQuerie');
const {cancelaAgendamentoConsulta} = require('../models/Queries/ConsultaQuerie');
const {verificaExistenciaDeUmUsuario} = require('../models/Queries/PessoaQuerie');
const {retornaConsultasAdm} = require ('../models/Queries/ConsultaQuerie');
const {retornaEspecialidadesEFuncionarioVinculado} = require('../models/Queries/ConsultaQuerie')

const consultaController = {

  retornaEspecialidadesEFuncionario: async (req,res) => {
    const {funcionarioId} = req.params
    let result;
    if(funcionarioId) {
       result = await retornaEspecialidadesEFuncionarioVinculado(funcionarioId)
      res.json(result)
    }else {
       result = await retornaEspecialidadesEFuncionarioVinculado()
      res.json(result)
    }
  },
  retornaTodasConsultas: async (req,res) => {
    try {
      const retornoConsulta = await retornaConsultasAdm()
      res.json(retornoConsulta)
    }
    catch(e) {
      console.log(e)
      res.json({consultaMessage:'não foi possivel retornar consultas ao adm, por favor tente novamente', result:false})
    }
  },

  novaConsulta: async (req,res) => {
    try {
      const {data,hora,status,cpfPaciente,funcionario_id,funcionario_pessoa_id,especialidade_id} = req.body;
      
      const verificaExistenciaPaciente = await verificaExistenciaDeUmUsuario(cpfPaciente)
      let consultaObj;

      
      console.log(verificaExistenciaPaciente)
      if(verificaExistenciaPaciente.result === true) {
        consultaObj = new Consulta(null,data,hora,status,verificaExistenciaPaciente.moreInfos.pac_id,verificaExistenciaPaciente.moreInfos.id ,funcionario_id,funcionario_pessoa_id,especialidade_id)
      }else {
        res.json(verificaExistenciaPaciente)
        return
      }

     
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
  },

  cancelaConsulta: async (req,res) => {
    const {idDaConsulta} = req.params;
    if(!idDaConsulta) {
      return{consultaMessage:'o id da consulta não chegou corretamente ao servidor, tente novamente!',result:false}
    } 

   return(await cancelaAgendamentoConsulta(idDaConsulta))
  }
}


module.exports = consultaController