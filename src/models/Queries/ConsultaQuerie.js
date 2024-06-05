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
        return {consultaMessage: 'consulta registrada com sucesso', result:true, moreInfos:{data:consultaObj.dataConsulta, hora:consultaObj.horaConsulta, pacientName: pacientName[0][0].nome, doctorName:doctorName[0][0].nome }}
      }

     
    } catch (e) {
      console.log(e)
      await conn.rollback();
      return {consultaMessage: 'não foi possivel registrar consulta tente novamente.', result:false}
    } 
  },

  retornaConsultaDeUsuarioLogado: async (pessoaObj) => {
    const conn = await connection();
    let returnMessage;
    try {
      const pegaConsultasDoUsuario = await conn.query('select id as idConsulta,data as dataConsulta,hora as horaConsulta,status as statusConsulta,paciente_id,paciente_pessoa_id,funcionario_id,funcionario_pessoa_id,especialidade_id from tbl_consulta where paciente_pessoa_id=? and status=1', [pessoaObj.id]);
    
      if (pegaConsultasDoUsuario[0].length !== 0) {
        returnMessage = { consultaMessage: 'O usuário tem consultas pendentes', result: true };
        returnMessage.moreInfos = pegaConsultasDoUsuario[0];
    
        const promessasConsultas = returnMessage.moreInfos.map(async (el) => {
          el.status = 'ativo';
          const pegaNomeMedicoEEspecialidade = await conn.query('select p.nome as nomeDoMedico, e.desc_especialidade as consultaEspecialidade from tbl_especialidade as e join tbl_funcionario_has_tbl_especialidade as the on the.especialidade_id=e.id join tbl_funcionario as f on the.funcionario_id=f.id join tbl_pessoa as p on p.id=f.pessoa_id where e.id=?', [el.especialidade_id]);
          el.dadosMedico = pegaNomeMedicoEEspecialidade[0][0];
          el.dadosMedico.funcionario_id = el.funcionario_id
          el.dadosMedico.funcionario_pessoa_id = el.funcionario_pessoa_id
          el.dadosMedico.especialidade_id = el.especialidade_id;

          delete el.funcionario_id;
          delete el.funcionario_pessoa_id;
          delete el.especialidade_id;
          delete el.paciente_id;
          delete el.paciente_pessoa_id;
          return el;
        });
    
        // Aguarda todas as queries serem executdas antes de prosseguir com o returnr message
        returnMessage.moreInfos = await Promise.all(promessasConsultas);
        return returnMessage;
      }
    } catch (e) {
      console.error('não foi possivel verificar as consultas do usuario, por favor tente novamente erro:', e);
    }
  },

  cancelaAgendamentoConsulta: async (idConsulta) => {
    const conn = await connection ();

    const consultaASerCancelada = conn.query('Update tbl_consulta set status=0 WHERE ID=?',[idConsulta])

    if(consultaASerCancelada[0].affectedRows === 1) {
      return {consultaMessage:`o Agendamento de ID ${idConsulta} foi cancelado`, result:true}
    }else {
      return {consultaMessage:`a solicitação foi enviada porem nenhum agendamento foi alterado, por favor tente novamente`, result:false}
    }
    
  }
}

module.exports = QuerieConsulta;