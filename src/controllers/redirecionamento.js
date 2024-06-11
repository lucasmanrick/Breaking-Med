

const redirecionamentoControllers = {
  direcionamentoConsultasPaciente: (req,res) => {
    res.render('pages/consultaPaciente')
  },

  direcionamentoConsultasMedicas: (req,res) => {
    res.render('pages/consultaMedico')
  },

  direcionamentoAgendamentoConsulta: (req,res) => {
    res.render('pages/agendamentoConsulta')
  },

  direcionamentoCadastroUsuario: (req,res) => {
    res.render('pages/cadastroPessoa')
  },

  direcionamentoLogin: (req,res) => {
    res.render('pages/telaLogin')
  },


  direcionamentoHome: (req,res) => {
    res.render('pages/home')
  },

}


module.exports = redirecionamentoControllers