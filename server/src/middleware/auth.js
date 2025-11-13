import jwt from 'jsonwebtoken';

// Middleware que exige token JWT válido (Authorization: Bearer <token>)
export function requireAuth(req, res, next) {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Token em falta.' });
    try {
        const secret = process.env.JWT_SECRET || 'dev-secret-change-me';
        const payload = jwt.verify(token, secret);
        req.user = { id: payload.sub, email: payload.email, role: payload.role };
        next();
    } catch (e) {
        return res.status(401).json({ error: 'Token inválido.' });
    }
}

// Variante permissiva: se existir token válido anexa req.user, senão continua.
export function optionalAuth(req, res, next) {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return next();
    try {
        const secret = process.env.JWT_SECRET || 'dev-secret-change-me';
        const payload = jwt.verify(token, secret);
        req.user = { id: payload.sub, email: payload.email, role: payload.role };
    } catch (_) {
        // Ignorar erros, segue sem user
    }
    next();
}
