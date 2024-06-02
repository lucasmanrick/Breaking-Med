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
  async novoRegistroPessoa(pessoaObj, enderecoObj, telefoneObj, loginObj, perfisObj, funcionarioObj, especialidadeObj) {
    const conn = await connection();
    try {

      await conn.beginTransaction();


      let confirmaExistenciaRegistro = await conn.query('select id from tbl_pessoa where cpf=? ;', [pessoaObj.cpf])
      console.log(confirmaExistenciaRegistro)
      if(confirmaExistenciaRegistro[0].length > 0) {
        return { cadastroMessage: "usuario ja possui um cadastro", result: false }
      }

      //confirmação se o endereço do novo usuario ja existe

      let confirmaExistenciaEndereco = await conn.query(`select id from tbl_endereco where cep=? AND numero=?;`, [enderecoObj.cep,enderecoObj.numero])

      let eRes;

      if(confirmaExistenciaEndereco[0].length > 0) {
        eRes = confirmaExistenciaEndereco[0][0].id
      } else {
        eRes = await conn.query(`insert into tbl_endereco (logradouro,bairro,estado,numero,complemento,cep) VALUES (?,?,?,?,?,?)`, [enderecoObj.logradouro, enderecoObj.bairro, enderecoObj.estado, enderecoObj.numero, enderecoObj.complemento,enderecoObj.cep])
        eRes = eRes[0].insertId   
      }

      //confirmação se o usuario ja não possui um cadastro.

      const pRes = await conn.query(`insert into tbl_pessoa (nome,cpf,data_nasc,genero,email,data_cad,endereco_id) values (?,?,?,?,?,?,?)`, [pessoaObj.nome,pessoaObj.cpf,pessoaObj.dataNasc,pessoaObj.genero,pessoaObj.email,pessoaObj.dataDeCadastro,eRes])


      const lRes = await conn.query(`insert into tbl_login (login,senha,status,pessoa_id,pessoa_endereco_id) values (?,?,?,?,?)`, [loginObj.loginPessoa, loginObj.senhaPessoa, loginObj.statusPessoa, pRes[0].insertId,eRes])

      const perfisRes = await conn.query(`insert into tbl_perfis (tipo,login_id,login_pessoa_id,login_pessoa_endereco_id) values (?,?,?,?)`, [perfisObj.tipoPerfil, lRes[0].insertId, pRes[0].insertId,eRes])

      if (telefoneObj.numero.length !== 0) {
        telefoneObj.numero.forEach(async (tel,index) => {
           let parse = tel.toString()

          if (parse.length === 10 || parse.length === 11) {
          const hasTel = await conn.query(`select * from tbl_telefone WHERE numero=?`, [tel])
          if (hasTel[0].length != 0) { //caso ja tenha um dos telefones registrado não registra de novo, só vincula o novo registro de cliente ao telefone ja existente
            await conn.query(`insert into tbl_pessoa_has_tbl_telefone (pessoa_id,telefone_id,pessoa_tbl_endereco_id) values (?,?,?)`, [pRes[0].insertId, hasTel[0][0].id,eRes])
            return
          }
          let tRes = await conn.query(`insert into tbl_telefone (numero) values (?)`, [tel])
          await conn.query(`insert into tbl_pessoa_has_tbl_telefone (pessoa_id,telefone_id,pessoa_tbl_endereco_id) values (?,?,?)`, [pRes[0].insertId, tRes[0].insertId,eRes])
        }
        })

      }


      let pacienteRes = await conn.query(`insert into tbl_paciente (pessoa_id) values (?)`, [pRes[0].insertId])

      if (funcionarioObj !== null && especialidadeObj !== null) {
        let fRes = await conn.query(`insert into tbl_funcionario (data_admissao, crm, pessoa_id, pessoa_endereco_id) Values (?,?,?,?)`, [funcionarioObj.dataAdmissao, funcionarioObj.crm, pRes[0].insertId,eRes])
        if (funcionarioObj.crm === null) {
          return
        }
        await conn.query(`insert into tbl_funcionario_has_tbl_especialidade (funcionario_id,funcionario_pessoa_id,funcionario_pessoa_endereco_id,especialidade_id) values (?,?,?,?)`, [fRes[0].insertId, pRes[0].insertId,eRes, especialidadeObj.id])
      }



      await conn.commit();

      return { cadastroMessage: "usuario registrado com sucesso!!", result: true }


    } catch (error) {
      await conn.rollback();

      return { cadastroMessage: `usuario não foi registrado devido ao erro: ${error}`, result: false }


    }
  },

  async selecionaTodasEspecialidades () {
    const conn = await connection();
    let results = await conn.query()

    
  }


}

module.exports = QuerysPessoa