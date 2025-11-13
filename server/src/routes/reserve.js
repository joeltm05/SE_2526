import express from 'express';
import { Spot, Reservation } from '../models/index.js';
import { notifyPush } from '../notifications.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

function parseReserveBody(body) {
    const plate = String(body?.plate || '').trim();
    const minutes = Math.max(15, Math.min(240, Number(body?.minutes || 30)));
    const token = body?.pushToken ? String(body.pushToken) : undefined; // optional FCM token
    if (!plate || plate.length < 2) {
        return { ok: false, error: 'Matrícula inválida.' };
    }
    return { ok: true, data: { plate, minutes, token } };
}

// Requer login para reservar lugar
router.post('/', requireAuth, async (req, res) => {
    const parsed = parseReserveBody(req.body);
    if (!parsed.ok) return res.status(400).json({ error: parsed.error });
    const { plate, minutes, token } = parsed.data;

    // Find free spot
    const spot = await Spot.findOne({ where: { status: 'free' }, order: [['id', 'ASC']] });
    if (!spot) return res.status(409).json({ error: 'Sem lugares livres para reservar.' });

    const now = new Date();
    const expiresAt = new Date(now.getTime() + minutes * 60 * 1000);

    // Mark spot reserved
    spot.status = 'reserved';
    spot.currentPlate = plate;
    await spot.save();

    const reservation = await Reservation.create({ plate, spotId: spot.id, reservedAt: now, expiresAt, status: 'active' });

    if (token) await notifyPush(token, 'Reserva confirmada', `Lugar ${spot.label} reservado até ${expiresAt.toLocaleString()}.`);

    res.json({ ok: true, spot: { id: spot.id, label: spot.label }, reservationId: reservation.id, expiresAt });
});

export default router;
