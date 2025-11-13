// Authentication routes: register and login
// Uses only allowed dependencies (express, sequelize, jsonwebtoken, dotenv)
// Password hashing implemented with Node crypto (pbkdf2) to avoid extra libs

import express from 'express';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const router = express.Router();

// Simple PBKDF2 hashing
const HASH_ITERATIONS = 120000; // balance speed/security
const HASH_KEYLEN = 64;
const HASH_DIGEST = 'sha512';

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
    const derived = crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEYLEN, HASH_DIGEST).toString('hex');
    return `${salt}$${derived}`; // store salt + hash
}

function verifyPassword(password, stored) {
    const [salt, hash] = stored.split('$');
    const attempt = crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEYLEN, HASH_DIGEST).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(attempt, 'hex'));
}

function signToken(user) {
    const secret = process.env.JWT_SECRET || 'dev-secret-change-me';
    return jwt.sign({ sub: user.id, email: user.email, role: user.role }, secret, { expiresIn: '12h' });
}

// Register
router.post('/register', async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password || password.length < 6) {
        return res.status(400).json({ error: 'Email e password (>=6) são obrigatórios.' });
    }
    try {
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(409).json({ error: 'Email já registado.' });
        const passwordHash = hashPassword(password);
        const user = await User.create({ email, passwordHash });
        const token = signToken(user);
        res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (e) {
        console.error('Register error', e);
        res.status(500).json({ error: 'Erro ao registar.' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Credenciais em falta.' });
    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !verifyPassword(password, user.passwordHash)) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }
        const token = signToken(user);
        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (e) {
        console.error('Login error', e);
        res.status(500).json({ error: 'Erro ao autenticar.' });
    }
});

export default router;
