class Perfis{
    constructor(id='', tipoPerfil='', loginPerfilId=0, loginPessoaId=0, loginPessoaEnderecoId=0){
        this.id = id;
        this.tipoPessoa = tipoPerfil;
        this.loginPerfilId = loginPerfilId;
        this.loginPessoaId = loginPessoaId;
        this.loginPessoaEnderecoId = loginPessoaEnderecoId;
    }
}

module.exports = Perfis