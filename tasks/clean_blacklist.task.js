const { TokenBlacklist } = require('../models');
const { Op } = require('sequelize');

const cleanExpiredTokens = async () => {
    console.log('🧹 A limpar tokens expirados da blacklist...');
    try {
        const count = await TokenBlacklist.destroy({
            where: {
                expiracao: {
                    [Op.lt]: new Date()
                }
            }
        });
        console.log(`🧼 ${count} token(s) expirado(s) apagado(s) da blacklist.`);
    } catch (error) {
        console.error('Erro ao limpar tokens expirados:', error.message);
    }
};

module.exports = {
    cleanExpiredTokens
};