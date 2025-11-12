const { body } = require('express-validator');

/**
 * Validações para registro de utilizador
 */
const validateRegister = [
    body('username')
        .isLength({ min: 3, max: 50 })
        .withMessage('Username deve ter entre 3 e 50 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username só pode conter letras, números e underscore e deve começar por estgv ou aluno'),

    body('nome')
        .isLength({ min: 2, max: 100 })
        .withMessage('Nome deve ter entre 2 e 100 caracteres')
        .trim(),

    body('email')
        .isEmail()
        .withMessage('Email deve ter um formato válido')
        .isLength({ max: 50 })
        .withMessage('Email deve ter no máximo 50 caracteres')
        .normalizeEmail()
        .matches(/^(pv28262@alunos.estgv.ipv.pt|pv23018@alunos.estgv.ipv.pt|22693@alunos.estgv.ipv.pt|estgv17405@alunos.estgv.ipv.pt|[a-zA-Z0-9_-]+@(pt\.softinsa\.com))$/)
        .withMessage('Email deve ser do domínio pt.softinsa.com'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password deve ter pelo menos 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password deve conter pelo menos uma letra minúscula, uma maiúscula e um número'),

    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Confirmação de password não confere');
            }
            return true;
        }),

    body('telemovel')
        .isMobilePhone('pt-PT')
        .withMessage('Número de telemóvel deve ser válido (formato português)')
        .isLength({ max: 14 })
        .withMessage('Telemóvel deve ter no máximo 14 caracteres'),

    body('endereco')
        .isLength({ min: 5 })
        .withMessage('Endereço deve ter pelo menos 5 caracteres')
        .trim(),

    body('data_nascimento')
        .isISO8601()
        .withMessage('Data de nascimento deve estar no formato YYYY-MM-DD'),

    body('sexo')
        .isIn(['M', 'F'])
        .withMessage('Sexo deve ser M (Masculino) ou F (Feminino)'),

    body('descricao')
        .isLength({ min: 10 })
        .withMessage('Descrição deve ter pelo menos 10 caracteres')
        .trim(),

    body('tipo')
        .isInt({ min: 1, max: 3 })
        .withMessage('Tipo deve ser um número entre 1 e 3 (1=formando, 2=formador, 3=gestor_admin)')
];

/**
 * Validações para login
 */
const validateLogin = [
    body('login')
        .notEmpty()
        .withMessage('Username ou email é obrigatório')
        .isLength({ min: 3 })
        .withMessage('Login deve ter pelo menos 3 caracteres'),

    body('password')
        .notEmpty()
        .withMessage('Password é obrigatória')
        .isLength({ min: 6 })
        .withMessage('Password deve ter pelo menos 6 caracteres')
];

/**
 * Validações para alteração de password
 */
const validateUpdatePassword = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Password atual é obrigatória'),

    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('Nova password deve ter pelo menos 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Nova password deve conter pelo menos uma letra minúscula, uma maiúscula e um número'),

    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Confirmação de password não confere');
            }
            return true;
        })
];

module.exports = {
    validateRegister,
    validateLogin,
    validateUpdatePassword,
};

