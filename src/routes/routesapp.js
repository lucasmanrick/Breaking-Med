const router = express.Router();

const controllers = require('../controllers/pessoaController')


router.post('/RegistroCliente', controllers.registroDeCliente)

module.exports = router;