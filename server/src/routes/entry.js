import express from 'express';
import { Spot, ParkingSession, Reservation } from '../models/index.js';
import { notifyPush } from '../notifications.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

function parseEntryBody(body) {
    const plate = String(body?.plate || '').trim();
    const token = body?.pushToken ? String(body.pushToken) : undefined; // optional FCM token for push
    if (!plate || plate.length < 2) {
        return { ok: false, error: 'Matrícula inválida.' };
    }
    return { ok: true, data: { plate, token } };
}

async function assignSpotForEntry(plate) {
    // Prioritize reserved spot for this plate
    const now = new Date();
    const reservation = await Reservation.findOne({
        where: { plate, status: 'active' },
        order: [['reservedAt', 'DESC']],
    });
    let spot = null;
    if (reservation && new Date(reservation.expiresAt) > now) {
        spot = await Spot.findByPk(reservation.spotId);
        reservation.status = 'used';
        await reservation.save();
    }
    if (!spot) {
        spot = await Spot.findOne({ where: { status: 'free' }, order: [['id', 'ASC']] });
    }
    return spot;
}

// Requer login para registar entrada (evita uso abusivo do endpoint)
router.post('/', requireAuth, async (req, res) => {
    const parsed = parseEntryBody(req.body);
    if (!parsed.ok) return res.status(400).json({ error: parsed.error });
    const { plate, token } = parsed.data;

    // Check existing active session
    const existing = await ParkingSession.findOne({ where: { plate, status: ['parked', 'paid'] } });
    if (existing) return res.status(400).json({ error: 'Matrícula já tem sessão ativa.' });

    const spot = await assignSpotForEntry(plate);
    if (!spot) return res.status(409).json({ error: 'Sem lugares disponíveis.' });

    spot.status = 'occupied';
    spot.currentPlate = plate;
    await spot.save();

    const session = await ParkingSession.create({ plate, spotId: spot.id, status: 'parked', entryTime: new Date() });

    // Optional push notification (if client provided FCM token)
    if (token) await notifyPush(token, 'Entrada registada', `O seu veículo ${plate} ficou no lugar ${spot.label}.`);

    res.json({ ok: true, spot: { id: spot.id, label: spot.label }, sessionId: session.id });
});

export default router;
