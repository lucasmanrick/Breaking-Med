const { connection } = require(`../../config/db`);


const QuerieConsulta = {
  async registraNovaConsulta(consultaObj) {
    const conn = await connection();
    try {
      await conn.beginTransaction();

      if(consultaObj.dataConsulta === '' || consultaObj.horaConsulta === '' || consultaObj.statusConsulta === 0 || consultaObj.statusConsulta === 0 || consultaObj.pacientePessoaId === 0 || consultaObj.funcionarioId === 0 || consultaObj.funcionarioPessoaId === 0 || consultaObj.especialidadeId === 0) {
        return {consultaMessage: 'não foi possivel marcar a consulta, pois falta informações para o registro da mesma, insira todos campos corretamente', result:false }
      }



      const verificaConsultasAtivas = await conn.query('select * from tbl_consulta where status=1 AND paciente_id=?', [consultaObj.paciente_id])
      
      if(verificaConsultasAtivas[0].length >= 5) {
        return {consultaMessage: 'não foi possivel marcar a consulta, pois o usuário tem muitas consultas pendentes', result:false }
      }

      const cRes = await conn.query('insert into tbl_consulta (data,hora,status,paciente_id,paciente_pessoa_id,funcionario_id,funcionario_pessoa_id,especialidade_id) VALUES (?,?,?,?,?,?,?,?)', [consultaObj.dataConsulta,consultaObj.horaConsulta,consultaObj.statusConsulta,consultaObj.pacienteId,consultaObj.pacientePessoaId,consultaObj.funcionarioId,consultaObj.funcionarioPessoaId,consultaObj.especialidadeId])
      console.log(cRes)

      if(cRes[0].affectedRows === 1) {
        const pacientName = await conn.query('select nome from tbl_pessoa where id=?',[consultaObj.pacientePessoaId])
        const doctorName = await conn.query('select nome from tbl_pessoa where id=?',[consultaObj.funcionarioPessoaId])
        await conn.commit();
        return {consultaMessage: 'consulta registrada com sucesso', result:true, moreInfos:{data:consultaObj.dataConsulta, hora:consultaObj.horaConsulta, pacientName: pacientName[0][0], doctorName:doctorName[0][0] }}
      }

     
    } catch (e) {
      console.log(e)
      await conn.rollback();
      return {consultaMessage: 'não foi possivel registrar consulta tente novamente.', result:false}
    } 
  },
  retornaConsultaDeUsuarioLogado: async (pacienteObj) => {
    const conn = await connection();

    let returnMessage;
    try{
      const pegaConsultasDoUsuario = await conn.query('select * from tbl_consulta where paciente_pessoa_id=? and status=1',[pacienteObj.id]) 
      
      if(pegaConsultasDoUsuario[0].length !== 0) {
        returnMessage = {consultaMessage:'o usuario tem consultas pendentes',result:true, moreInfos:[]}
        returnMessage.moreInfos = pegaConsultasDoUsuario[0]
        returnMessage.moreInfos.forEach(async(el,index) => {
          //idconsulta, nome paciente, diagnostico, medicação, especialidade. para o medico
          //data, hora, status,nome do medico, nome do paciente e especialidade. para o paciente.
          el.status = 'ativo'
          let pegaNomeMedicoEEspecialidade = await conn.query('select p.nome, e.desc_especialidade from tbl_especialidade as e join tbl_funcionario_has_tbl_especialidade as the on the.especialidade_id=e.id join tbl_funcionario as f on the.funcionario_id=f.id join tbl_pessoa as p on p.id=f.pessoa_id where e.id=?',[el.especialidade_id])
          returnMessage.moreInfos[index].dadosMedico = pegaNomeMedicoEEspecialidade[0]
        })
        console.log(returnMessage)
        return returnMessage
      }else {
        return {consultaMessage:'não tem consultas pendentes do usuario requisitante',result:false}
      } 
    }
    catch(e) {
      console.log(e)
    }
  }
}

module.exports = QuerieConsulta;