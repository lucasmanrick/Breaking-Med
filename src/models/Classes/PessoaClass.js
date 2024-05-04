class Pessoa {
  constructor (nomeDaPessoa,cpf,dataNasc,genero,email,dataDeCadastro,enderecoId='') {
    this.nome = nomeDaPessoa,
    this.cpf = cpf,
    this.dataNasc = dataNasc,
    this.genero = genero,
    this.email = email,
    this.dataDeCadastro = dataDeCadastro
    if(enderecoId !== '') {
      this.enderecoId = enderecoId
    }
  }

  criarNovaPessoa() {
    
  }
}