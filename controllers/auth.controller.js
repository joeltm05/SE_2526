const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const { Sequelize, Utilizador, Perfil, TokenBlacklist, PushToken } = require('../models');
const { admin, notify } = require('../conf/firebase');
require('dotenv').config();

// Configuração do JWT
const { jwtSecret } = require('../conf/token.conf');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

/**
 * Registrar novo utilizador
 */
const registerUser = async (req, res) => {
    try {
        // Verificar erros de validação
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({
                success: false,
                message: 'Dados inválidos',
                errors: errors.array()
            });

        const {
            username,
            nome,
            email,
            password,
            telemovel,
            endereco,
            papel,
            data_nascimento,
            sexo,
            descricao,
            tipo // ID do perfil (1=formando, 2=formador, 3=gestor_admin)
        } = req.body;


        if (await Utilizador.findOne({
            where: {
                // [db.Sequelize.Op.or]: [
                [Sequelize.Op.or]: [
                    { username },
                    { email }
                ]
            }
        }))
            return res.status(409).json({
                success: false,
                message: 'Username ou email já existe'
            });

        if (!(await Perfil.findByPk(tipo)))
            return res.status(400).json({
                success: false,
                message: 'Tipo de perfil inválido'
            });

        const saltRounds = 12; // pwd hash
        const newUser = await Utilizador.create({
            username,
            nome,
            email,
            password: await bcrypt.hash(password, saltRounds),
            telemovel,
            endereco,
            papel,
            data_nascimento: data_nascimento ? new Date(data_nascimento) : null,
            sexo,
            descricao,
            tipo,
            criacao: new Date(),
            papel_date: new Date()
        });

        const userWithProfile = await Utilizador.findByPk(newUser.id, {
            include: [{
                model: Perfil,
                as: 'Perfil'
            }],
            attributes: { exclude: ['password'] }
        });

        const token = jwt.sign(
            {
                id: userWithProfile.id,
                username: userWithProfile.username,
                email: userWithProfile.email,
                tipo: userWithProfile.tipo,
                papel: userWithProfile.papel
            },
            jwtSecret,
            { expiresIn: JWT_EXPIRES_IN + 'h' }
        );

        res.status(201).json({
            success: true,
            message: 'Utilizador registrado com sucesso',
            data: {
                user: userWithProfile,
                token
            }
        });

    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Login do utilizador
 */
const loginUser = async (req, res) => {
    try {
        // Verificar erros de validação
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({
                success: false,
                message: 'Dados inválidos',
                errors: errors.array()
            });

        const { login, password } = req.body; // login pode ser username ou email

        // Buscar utilizador por username ou email
        const user = await Utilizador.findOne({
            where: {
                // [db.Sequelize.Op.or]: [
                [Sequelize.Op.or]: [
                    { username: login },
                    { email: login }
                ]
            },
            include: [{
                model: Perfil,
                as: 'Perfil'
            }]
        });

        if (!user)
            return res.status(401).json({
                success: false,
                message: 'Username inválido'
            });
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid)
            return res.status(401).json({
                success: false,
                message: 'Password inválida'
            });

        await user.update({ logado: true });

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
                tipo: user.tipo,
                papel: user.papel
            },
            jwtSecret,
            { expiresIn: JWT_EXPIRES_IN + 'h' }
        );

        // Remover password dos dados retornados
        const userWithoutPassword = { ...user.toJSON() };
        delete userWithoutPassword.password;

        res.json({
            success: true,
            message: 'Login realizado com sucesso',
            data: {
                user: userWithoutPassword,
                token
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Logout do Utilizador
 */
const logoutUser = async (req, res) => {
    const { user } = req;
    const token = req.headers['authorization']?.split(' ')[1];

    if (!user.logado)
        return res.status(400).json({
            success: false,
            message: 'O utilizador já está deslogado.'
        });
    await user.update({ logado: false });

    const decoded = jwt.decode(token);
    const exp = decoded?.exp;

    if (!exp)
        return res.status(400).json({
            success: false,
            message: 'Token inválido - sem data de expiração'
        });

    await TokenBlacklist.create({
        token,
        expiracao: new Date(exp * 1000)
    });

    res.json({
        success: true,
        message: 'Logout realizado com sucesso. Remova o token do armazenamento local.'
    });
}

/**
 * Obter perfil do utilizador autenticado
 */
const getAuthUser = async (req, res) => {
    try {
        const user = await Utilizador.findByPk(req.user.id, {
            include: [{
                model: Perfil,
                as: 'Perfil'
            }],
            attributes: { exclude: ['password'] }
        });

        if (!user)
            return res.status(404).json({
                success: false,
                message: 'Utilizador não encontrado'
            });

        res.json({
            success: true,
            data: {
                user
            }
        });

    } catch (error) {
        console.error('Erro ao obter perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Alterar password
 */
const updatePassword = async (req, res) => {
    try {
        // Verificar erros de validação
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Dados inválidos',
                errors: errors.array()
            });
        }

        const { currentPassword, newPassword } = req.body;

        // Buscar utilizador
        const user = await Utilizador.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilizador não encontrado'
            });
        }

        if (!(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(401).json({
                success: false,
                message: 'Password atual incorreta'
            });
        }

        const saltRounds = 12;//pwd hash
        await user.update({ password: await bcrypt.hash(newPassword, saltRounds) });

        res.json({
            success: true,
            message: 'Password alterada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao alterar password:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Verificar token JWT
 */
const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token não fornecido'
            });
        }

        const decoded = jwt.verify(token, jwtSecret);

        // Verificar se o utilizador ainda existe
        const user = await Utilizador.findByPk(decoded.id, {
            include: [{
                model: Perfil,
                as: 'Perfil'
            }],
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }

        res.json({
            success: true,
            message: 'Token válido',
            data: {
                user,
                tokenData: decoded
            }
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError')
            return res.status(403).json({
                success: false,
                message: 'Token inválido'
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

const sendMail = async (req, res) => {
    const { to, subject, text, html } = req.body;

    if (!to || !subject || (!text && !html))
        return res.status(400).json({ error: 'Missing required fields' });

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN
            }
        });

        const mail = await transporter.sendMail({
            from: process.env.MAIL,
            to,
            subject,
            text,
            html
        });
        if (!mail)
            return res.status(500).json({ error: 'Failed to send email to ' + to });
        res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, error: 'Failed to send email' });
    }
};
const sendNotification = async (req, res) => {
    const { _title, _body, _user } = req.body;

    if (!_title)
        return res.status(400).json({ error: `Title's attribute empty!` });
    if (!_body)
        return res.status(400).json({ error: `Body's attribute empty!` });
    const user = await (/^\d+$/.test(_user)
        ? Utilizador.findByPk(_user)
        : Utilizador.findOne({ where: { username: _user } })
    );
    if (!user)
        return res.status(400).json({ error: `User's attribute invalid!` });
    const _tokens = await PushToken.findAll({ where: { utilizador: user.id } });
    if (!_tokens.length)
        return res.status(400).json({ error: `${user.username} doesn't have an token associated!` });

    try {
        const results = await Promise.all(
            _tokens.map(t => notify(t.token, _title, _body))
        );
        return res.json({ success: true, response });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
// const pushToken = (req, res) => {

// };


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getAuthUser,
    updatePassword,
    verifyToken,
    sendMail,
    sendNotification
    // pushToken
};

