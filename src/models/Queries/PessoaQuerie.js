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
  async novoRegistroPessoa (pessoaObj,enderecoObj,telefoneObj,loginObj,perfisObj,funcionarioObj, especialidadeObj) {
    const conn = await connection(); 
    try {
    
      await conn.beginTransaction();
      
      let eRes;

      if(enderecoObj.id !== '') { //verifica se o endereço que o cliente inseriu ja existe no banco de dados, caso não exista ele cria um endereço com aqueles dados 
        eRes = enderecoObj.id
      } else{
        eRes = await conn.query(`insert into tbl_endereco (logradouro,bairro,estado,numero,complemento,cep) VALUES (?, ?, ?, ?, ?, ?)`,[enderecoObj.logradouro,enderecoObj.bairro,enderecoObj.estado,enderecoObj.numero,enderecoObj.complemento])
        eRes[0].insertId
      }
      

     const pRes = await conn.query(`insert into tbl_pessoa (nome,cpf,data_nasc,genero,email,data_cad,endereco_id) values (?,?, ?,?,?,?,?)`,[pessoaObj.nome,pessoaObj.cpf,pessoaObj.dataNasc,pessoaObj.genero,pessoaObj.email,pessoaObj.dataDeCadastro,eRes])
        
     const lRes =  await conn.query (`insert into tbl_login (login,senha,status,pessoa_id,pessoa_endereco_id) values (?,?,?,?,?)`, [loginObj.loginPessoa,loginObj.senhaPessoa,loginObj.statusPessoa,pRes[0].insertId,eRes])

     const perfisRes = await conn.query (`insert into tbl_perfis (tipo,login_id,login_pessoa_id,login_pessoa_endereco_id) values (?,?,?,?)`,[perfisObj.tipoPerfil,lRes[0].insertId,pRes[0].insertId,eRes])

      
      telefoneObj.numero.forEach(async (tel) => {
        if(tel.length !== 11 || tel.length !== 10) {
          return
        }
  

      const hasTel =  await conn.query(`select * from tbl_telefone WHERE numero = ?`, [tel])

      if(hasTel[0][0].length != 0) { //caso ja tenha um dos telefones registrado não registra de novo, só vincula o novo registro de cliente ao telefone ja existente.
        await conn.query (`insert into tbl_pessoa_has_tbl_telefone (pessoa_id,telefone_id,pessoa_tbl_endereco_id) values (?,?,?)`,[pRes[0].insertId,hasTel[0][0].id,eRes])
        return
      }

       let tRes = await conn.query (`insert into tbl_telefone (numero) values (?)`,[tel])
       await conn.query (`insert into tbl_pessoa_has_tbl_telefone (pessoa_id,telefone_id,pessoa_tbl_endereco_id) values (?,?,?)`,[pRes[0].insertId,tRes[0].insertId,eRes])
      })


      let pacienteRes = await conn.query (`insert into tbl_paciente (pessoa_id) values (?)`, [pRes[0].insertId])

      console.log(funcionarioObj)

     console.log(funcionarioObj.dataAdmissao)

      if(funcionarioObj !== null && especialidadeObj !== null ) {
        let fRes = await conn.query (`insert into tbl_funcionario (data_admissao, crm, pessoa_id, pessoa_endereco_id) Values (?,?,?,?)`,[funcionarioObj.dataAdmissao,funcionarioObj.crm,pRes[0].insertId, eRes])
          if(funcionarioObj.crm === null) {
            return
          }
        await conn.query (`insert into tbl_funcionario_has_tbl_especialidade (funcionario_id,funcionario_pessoa_id,funcionario_pessoa_endereco_id,especialidade_id) values (?,?,?,?)`, [fRes[0].insertId,pRes[0].insertId,eRes,especialidadeObj.id])
      }



      await conn.commit();
      console.log('cliente cadastrado com sucesso')
        
      return ({cadastro: "usuario registrado com sucesso!!"})
        
      
    } catch (error) {
      await conn.rollback();
      console.log(error)
      return ({cadastro: "usuario não foi registrado!!"})
      
      
    }
  },



  //trabalhando com a tabela especialidades.

  async pegaTodasEspecialidades () {
    const conn = await connection();

    try {
     let res = await conn.query(`select * from tbl_especialidade`)

    console.log(res[0])
     return res[0]
    } 
    catch (e) {
      console.log (e)
    }
  },

  // async pegaEspecialidadePeloId (id) {
  //   const conn = await connection();

  //   try {
  //    let res = await conn.query(`select * from tbl_especialidade where id = ?`,[id])

  //    return res[0][0]
  //   } 
  //   catch (e) {
  //     console.log (e)
  //   }
  // },

  async pegaTodosEnderecos () {

    const conn = await connection();

    try {
     let res = await conn.query(`select * from tbl_endereco`)

     return res[0]
    } 
    catch (e) {
      console.log (e)
    }
    
  },

  async pegaTodosPerfis () {
    const conn = await connection();

    try {
     let res = await conn.query(`select * from tbl_perfis`)

     return res[0]
    } 
    catch (e) {
      console.log (e)
    }
  }

}

module.exports = QuerysPessoa