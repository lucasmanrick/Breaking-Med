class Perfis{
    constructor(tipoPerfil, loginPerfilId, loginPessoaId, loginPessoaEnderecoId){
        this.tipoPessoa = tipoPerfil;
        this.loginPerfilId = loginPerfilId;
        this.loginPessoaId = loginPessoaId;
        this.loginPessoaEnderecoId = loginPessoaEnderecoId;
    }
}

module.exports = Perfis