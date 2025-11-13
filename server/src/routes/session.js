import express from 'express';
import { ParkingSession, Spot } from '../models/index.js';

const router = express.Router();

router.get('/:plate', async (req, res) => {
    const { plate } = req.params;
    const session = await ParkingSession.findOne({ where: { plate, status: ['parked', 'paid'] }, include: [Spot] });
    if (!session) return res.json({ active: false });
    res.json({
        active: true,
        status: session.status,
        plate: session.plate,
        spot: session.Spot ? { id: session.Spot.id, label: session.Spot.label } : null,
        entryTime: session.entryTime,
        allowedExitUntil: session.allowedExitUntil,
    });
});

export default router;
