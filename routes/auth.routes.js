const express = require('express');
const router = express.Router();

// Importar controllers e middlewares
// const { registerUser, loginUser, logoutUser, getAuthUser, updatePassword, verifyToken, sendMail, sendNotification, pushToken } = require('../controllers');
const { registerUser, loginUser, logoutUser, getAuthUser, updatePassword, verifyToken, sendMail, sendNotification } = require('../controllers');
const { authenticateToken, requireFormador, requireFormadorOrAdmin, validateRegister, validateLogin, validateUpdatePassword } = require('../middlewares');

/**
 * @route   POST /api/auth/register
 * @desc    Registrar novo utilizador
 * @access  Public
 */
router.post('/register', validateRegister, registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Login do utilizador
 * @access  Public
 */
router.post('/login', validateLogin, loginUser);

/**
 * @route   GET /api/auth/user_data
 * @desc    Obter perfil do utilizador autenticado
 * @access  Private
 */
router.get('/user-data', authenticateToken, getAuthUser);

/**
 * @route   PUT /api/auth/update-password
 * @desc    Alterar password do utilizador
 * @access  Private
 */
router.put('/update-password',
    authenticateToken,
    validateUpdatePassword,
    updatePassword
);

/**
 * @route   POST /api/auth/verify-token
 * @desc    Verificar se o token JWT é válido
 * @access  Public
 */
router.post('/verify-token', verifyToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout (invalidar token no frontend)
 * @access  Private
 * @note    Como JWT é stateless, o logout é feito no frontend removendo o token
 */
router.post('/logout', authenticateToken, logoutUser);



/**
 * @route   GET /api/auth/formador-only
 * @desc    Rota protegida por perfil - apenas para formadores
 * @access  Private (Formador only)
 */
router.get('/formador-only',
    authenticateToken,
    requireFormador,
    (req, res) => {
        res.json({
            success: true,
            message: 'Acesso autorizado para formador',
            user: req.user.nome,
            profile: req.user.Perfil?.tipo
        });
    }
);

/**
 * @route   GET /api/auth/formador-or-admin
 * @desc    Rota para formadores ou administradores
 * @access  Private (Formador or Admin)
 */
router.get('/formador-or-admin',
    authenticateToken,
    requireFormadorOrAdmin,
    (req, res) => {
        res.json({
            success: true,
            message: 'Acesso autorizado para formador ou administrador',
            user: req.user.nome,
            profile: req.user.Perfil?.tipo
        });
    }
);

router.post('/mail', sendMail);
router.post('/notify', sendNotification);

// router.post('/push-token', authenticateToken, pushToken);

module.exports = router;

