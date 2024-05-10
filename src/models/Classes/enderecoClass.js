class Endereco{
  constructor(id='', logradouroEndereco='', bairroEndereco='', estadoEndereco='', numeroEndereco='', complementoEndereco='', cepEndereco='' ){
    this.id = id;
      this.logradouroEndereco = logradouroEndereco;
      this.bairroEndereco = bairroEndereco;
      this.estadoEndereco = estadoEndereco;
      this.numeroEndereco = numeroEndereco;
      this.complementoEndereco = complementoEndereco;
      this.cepEndereco = cepEndereco;
  }
}


module.exports = {Endereco};

