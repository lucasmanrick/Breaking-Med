class Endereco{
    logradouro;
    bairro;
    estado;
    numero;
    complemento;
    cep;
    constructor(logradouroEndereco, bairroEndereco, estadoEndereco, numeroEndereco, complementoEndereco, cepEndereco ){
        this.logradouro = logradouroEndereco;
        this.bairro = bairroEndereco;
        this.estado = estadoEndereco;
        this.numero = numeroEndereco;
        this.complemento = complementoEndereco;
        this.cep = cepEndereco;
    }
}