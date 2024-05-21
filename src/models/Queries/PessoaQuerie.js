const { connection } = require(`../../config/db`);
const Login = require("../Classes/loginClass");



const QuerysPessoa = {
 async SelecionarTodosRegistrosDePessoa() {
    try {
      const conn = await connection();
      const [rows] = await conn.query('select * from tbl_pessoa;');
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async novoRegistroPessoa (pessoaObj,enderecoObj,telefoneObj,loginObj,perfisObj,pacienteObj,funcionarioObj, especialidadeObj) {
    const conn = await connection(); 
    try {
    
      await conn.beginTransaction();
      
     const eRes = await conn.query(`insert into tbl_endereco (logradouro,bairro,estado,numero,complemento,cep) VALUES (?, ?, ?, ?, ?, ?)`,[enderecoObj.logradouro,enderecoObj.bairro,enderecoObj.estado,enderecoObj.numero,enderecoObj.complemento,])

     const pRes = await conn.query(`insert into tbl_pessoa (nome,cpf,data_nasc,genero,email,data_cad,endereco_id) values (?,?, ?,?,?,?,?)`,[pessoaObj.nome,pessoaObj.cpf,pessoaObj.dataNasc,pessoaObj.genero,pessoaObj.email,pessoaObj.dataDeCadastro,eRes[0].insertId])
        
     const lRes =  await conn.query (`insert into tbl_login (login,senha,status,pessoa_id,pessoa_endereco_id) values (?,?,?,?,?)`, [loginObj.loginPessoa,loginObj.senhaPessoa,loginObj.statusPessoa,pRes[0].insertId,eRes[0].insertId])

     const perfisRes = await conn.query (`insert into tbl_perfis (tipo,login_id,login_pessoa_id,login_pessoa_endereco_id) values (?,?,?,?)`,[perfisObj.tipoPerfil,lRes[0].insertId,pRes[0].insertId,eRes[0].insertId])

      
      telefoneObj.forEach(async function insertingTel (tel) {
       let tRes = await conn.query (`insert into tbl_telefones (numero) values (?)`,[tel])
        await conn.query (`insert into tbl_pessoa_has_tbl_telefone (pessoa_id,telefone_id,pessoa_tbl_endereco_id) values (?,?,?)`,[pRes[0].insertId,tRes[0].insertId,eRes[0].insertId])
      })


      let pacienteRes = await conn.query (`insert into tbl_paciente (pessoa_id) values (?)`, [pRes[0].insertId])

      
     

      if(funcionarioObj !== null && especialidadeObj !== null ) {
        let fRes = await conn.query (`insert into tbl_funcionario (data_admissao, crm, pessoa_id, pessoa_endereco_id) Values (?,?,?,?)`,[funcionarioObj.dataAdmissao,funcionarioObj.crm,funcionar,pRes[0].insertId, eRes[0].insertId])
          if(funcionarioObj.crm === null) {
            return
          }
        await conn.query (`insert into tbl_funcionario_has_tbl_especialidade (funcionario_id,funcionario_pessoa_id,funcionario_pessoa_endereco_id,especialidade_id) values (?,?,?,?)`, [fRes[0].insertId,pRes[0].insertId,eRes[0].insertId,especialidadeRes[0].insertId])
      }



      await conn.commit();
      console.log('transação concluida com sucesso')
        
        return rows;
        
      
    } catch (error) {
      await conn.rollback();
      console.log('houve algum problema durante o registro do funcionario.')

      throw error;
    }
  },

  async pegaTodasEspecialidades () {
    const conn = await connection();

    try {
     let res = await conn.query(`select * from tbl_especialidade`)
     console.log(res)
      console.log(res[0][0])

     return res
    } 
    catch (e) {
      console.log (e)
    }
  }
}

module.exports = QuerysPessoa