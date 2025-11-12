const fs = require('fs');
const path = require('path');
const http = require('http');
const jwt = require('jsonwebtoken');
const { Utilizador, Perfil, TokenBlacklist } = require('../models');

const { jwtSecret } = require('../conf/token.conf');

require('dotenv').config();

const authenticateTokenIf = async (req, res, next) => {
    const { table } = req;
    if (table === 'utilizador')
        return next();
    return authenticateToken(req, res, next);
}

const authenticateToken = async (req, res, next) => {

    if (process.env.DEVELOP === 'true') {
        console.warn('[AVISO] Autenticação desativada - todas as rotas estão públicas!');
        req.user = { id: 0, nome: 'Test User', Perfil: { tipo: 'gestor_admin' } };
        req.tokenData = {};
        return next();
    }

    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token)
            return res.status(401).json({
                success: false,
                message: 'Token de acesso requerido'
            });

        if (await TokenBlacklist.findOne({ where: { token } }))
            return res.status(401).json({
                success: false,
                message: 'Token inválido (revogado)'
            });

        const decoded_token = jwt.verify(token, jwtSecret);

        const user = await Utilizador.findByPk(decoded_token.id, {
            include: [{
                model: Perfil,
                as: 'Perfil'
            }],
            attributes: { exclude: ['password'] }
        });

        if (!user)
            return res.status(401).json({
                success: false,
                message: 'Token inválido - utilizador não encontrado'
            });

        req.user = user;
        req.tokenData = decoded_token;

        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError')
            return res.status(403).json({
                success: false,
                message: 'Token inválido' + error
            });

        if (error.name === 'TokenExpiredError')
            return res.status(403).json({
                success: false,
                message: 'Token expirado'
            });

        console.error('Erro na autenticação:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

/**
 * Middleware para verificar se o utilizador tem um perfil específico
 * @param {string|array} allowedProfiles - Perfis permitidos ('formador', 'formando', 'gestor_admin')
 */
const requireProfile = (allowedProfiles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilizador não autenticado'
                });
            }

            // Converter para array se for string
            const profiles = Array.isArray(allowedProfiles) ? allowedProfiles : [allowedProfiles];

            // Verificar se o utilizador tem um dos perfis permitidos
            const hasPermission = await req.user.checkPerfil(...profiles);

            if (!hasPermission)
                return res.status(403).json({
                    success: false,
                    message: 'Acesso negado - perfil insuficiente',
                    requiredProfiles: profiles,
                    userProfile: req.user.Perfil?.tipo
                });

            next();

        } catch (error) {
            console.error('Erro na verificação de perfil:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    };
};

/**
 * Middleware para verificar se o utilizador é administrador
 */
const requireAdmin = requireProfile('gestor_admin');

/**
 * Middleware para verificar se o utilizador é formador
 */
const requireFormador = requireProfile('formador');

/**
 * Middleware para verificar se o utilizador é formando
 */
const requireFormando = requireProfile('formando');

/**
 * Middleware para verificar se o utilizador é formador ou administrador
 */
const requireFormadorOrAdmin = requireProfile(['formador', 'gestor_admin']);


const logPath = path.join(__dirname, '../logs/op.log');

module.exports = {
    authenticateToken,
    authenticateTokenIf,
    requireProfile,
    requireAdmin,
    requireFormador,
    requireFormando,
    requireFormadorOrAdmin
};

