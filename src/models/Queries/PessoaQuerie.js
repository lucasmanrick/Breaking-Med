const { connection } = require(`../../config/db`);



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
      
     const res = await conn.query(`insert into tbl_endereco (logradouro,bairro,estado,numero,complemento,cep) VALUES ('${enderecoObj.logradouro}', '${enderecoObj.bairro}', '${enderecoObj.estado}', '${enderecoObj.numero}', '${enderecoObj.complemento}', '${enderecoObj.cep}')`)

     await conn.query(`insert into tbl_pessoa (nome,cpf,data_nasc,genero,email,data_cad,endereco_id) values ('${pessoaObj.nome}','${pessoaObj.cpf}', '${pessoaObj.dataNasc}','${pessoaObj.genero}','${pessoaObj.email}','${pessoaObj.dataDeCadastro}','${res[0].insertId}')`)
        
      telefoneObj.forEach(async (tel) => {
        await conn.query (`insert into tbl_telefones (numero) values ('${tel.numero}}')`)
      })
        
        return rows;
        
      
    } catch (error) {
      throw error;
    }
  }
}