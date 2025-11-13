import express from 'express';
import { ParkingSession, Spot } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';
import { calcAmount } from '../utils/tariff.js';

const router = express.Router();

// calcAmount moved to utils/tariff.js for testability

function parsePlate(body) {
    const plate = String(body?.plate || '').trim();
    if (!plate || plate.length < 2) return { ok: false, error: 'Matrícula inválida.' };
    return { ok: true, plate };
}

// Pagamento protegido
router.post('/payment', requireAuth, async (req, res) => {
    const parsed = parsePlate(req.body);
    if (!parsed.ok) return res.status(400).json({ error: parsed.error });
    const { plate } = parsed;
    const session = await ParkingSession.findOne({ where: { plate, status: ['parked', 'paid'] }, include: [Spot] });
    if (!session) return res.status(404).json({ error: 'Sessão não encontrada.' });
    const amount = calcAmount(session.entryTime);
    // Mark paid here for simplicity; in real world, integrate a payment gateway and confirm
    session.status = 'paid';
    session.amountPaid = amount;
    session.allowedExitUntil = new Date(Date.now() + 15 * 60 * 1000);
    await session.save();
    res.json({ ok: true, amount, allowedExitUntil: session.allowedExitUntil, spot: session.Spot?.label || null });
});

// Confirmação de saída protegida
router.post('/confirm', requireAuth, async (req, res) => {
    const parsed = parsePlate(req.body);
    if (!parsed.ok) return res.status(400).json({ error: parsed.error });
    const { plate } = parsed;
    const session = await ParkingSession.findOne({ where: { plate, status: ['paid'] }, include: [Spot] });
    if (!session) return res.status(404).json({ error: 'Sessão não encontrada ou não paga.' });

    if (!session.allowedExitUntil || new Date(session.allowedExitUntil).getTime() < Date.now()) {
        return res.status(403).json({ error: 'Janela de saída de 15 minutos expirada. Efetue novo pagamento.' });
    }

    // finalize
    session.status = 'exited';
    session.exitTime = new Date();
    await session.save();

    if (session.Spot) {
        const spot = session.Spot;
        spot.status = 'free';
        spot.currentPlate = null;
        await spot.save();
    }

    res.json({ ok: true });
});

export default router;
