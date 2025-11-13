import express from 'express';
import { Spot } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const spots = await Spot.findAll({ order: [['id', 'ASC']] });
    res.json(spots);
});

export default router;
