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
  async novoRegistroPessoa (pessoaObj,enderecoObj,telefoneObj,loginObj,perfisObj,) {
    try {
      const conn = await connection();
      
     const eRes = await conn.query(`insert into tbl_endereco (logradouro,bairro,estado,numero,complemento,cep) VALUES ('?', '?', '?', '?', '?', '?')`,[enderecoObj.logradouro,enderecoObj.bairro,enderecoObj.estado,enderecoObj.numero,enderecoObj.complemento,])

     const pRes = await conn.query(`insert into tbl_pessoa (nome,cpf,data_nasc,genero,email,data_cad,endereco_id) values ('?','?', '?','?','?','?','?')`,[pessoaObj.nome,pessoaObj.cpf,pessoaObj.dataNasc,pessoaObj.genero,pessoaObj.email,pessoaObj.dataDeCadastro,eRes[0].insertId])
        
     const lRes =  await conn.query (`insert into tbl_login (login,senha,status,pessoa_id,pessoa_endereco_id) values ('?','?','?','?','?')`, [loginObj.loginPessoa,loginObj.senhaPessoa,loginObj.statusPessoa,pRes[0].insertId,eRes[0].insertId])

     const perfisRes = await conn.query (`insert into tbl_perfis (tipo,login_id,login_pessoa_id,login_pessoa_endereco_id) values ('?','?','?','?')`,[perfisObj.tipoPerfil,lRes[0].insertId,pRes[0].insertId,eRes[0].insertId])

      const recebeIdsTelefone = []
      
      telefoneObj.numero.forEach(async function insertingTel (tel) {
       let tRes = await conn.query (`insert into tbl_telefones (numero) values ('${tel.numero}}')`)
        recebeIdsTelefone.push(tRes[0].insertId)
      })
        
      const returnAll = Promise.all(insertingTel)

      recebeIdsTelefone.forEach(async (el) => {
        await conn.query (`insert into tbl_pessoa_has_tbl_telefone (pessoa_id,telefone_id,pessoa_tbl_endereco_id) values ('?','?','?')`,[pRes[0].insertId,el,eRes[0].insertId])
      })

        return rows;
        
      
    } catch (error) {
      throw error;
    }
  }
}

module.exports = QuerysPessoa