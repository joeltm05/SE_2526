import express from 'express';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import sequelize from './models/index.js';
import spotsRouter from './routes/spots.js';
import entryRouter from './routes/entry.js';
import reserveRouter from './routes/reserve.js';
import sessionRouter from './routes/session.js';
import exitRouter from './routes/exit.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
// Basic JSON body parsing
app.use(express.json());

// Minimal CORS handling without external package
// Reads CORS_ORIGIN from env (fallback '*'), and allows common headers/methods
app.use((req, res, next) => {
    const origin = process.env.CORS_ORIGIN || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/spots', spotsRouter);
app.use('/api/entry', entryRouter);
app.use('/api/reserve', reserveRouter);
app.use('/api/session', sessionRouter);
app.use('/api/exit', exitRouter);

const PORT = process.env.PORT || 3001;

async function start() {
    await sequelize.authenticate();
    // optional: do not auto sync here; scripts handle schema

    // Optionally serve the production frontend if it exists (single-service deploy)
    // Looks for ../web/dist (relative to server/) which is the Vite build output
    try {
        const distPath = path.resolve(process.cwd(), '..', 'web', 'dist');
        const indexHtml = path.join(distPath, 'index.html');
        if (fs.existsSync(indexHtml)) {
            app.use(express.static(distPath));
            // Fallback to index.html for client-side routing, excluding API routes
            app.get(/^(?!\/api\/).*/, (req, res) => res.sendFile(indexHtml));
            console.log(`[static] Serving frontend from ${distPath}`);
        } else {
            console.log('[static] Frontend build not found; API-only mode');
        }
    } catch (e) {
        console.log('[static] Static serving disabled', e?.message || e);
    }

    app.listen(PORT, () => console.log(`Server listening on :${PORT}`));
}

start();
