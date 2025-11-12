const upload = require('./upload.middleware');
const { validateId, validateColumn, validateBody } = require('./routes.middleware');
const { authenticateToken, authenticateTokenIf, requireProfile, requireAdmin, requireFormador, requireFormando, requireFormadorOrAdmin } = require('./auth.middleware');
const { validateRegister, validateLogin, validateUpdatePassword } = require('./validation.middleware');
const { checkNotf } = require('./notify.middleware');

module.exports = {
    upload,
    validateId,
    validateColumn,
    validateBody,
    authenticateToken,
    authenticateTokenIf,
    requireProfile,
    requireAdmin,
    requireFormador,
    requireFormando,
    requireFormadorOrAdmin,
    validateRegister,
    validateLogin,
    validateUpdatePassword,
    checkNotf
};
