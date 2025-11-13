import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import sequelize, { Spot, ParkingSession, Reservation } from '../src/models/index.js';

dotenv.config();

// Ensure data folder for sqlite
if ((process.env.DB_DIALECT || 'sqlite') === 'sqlite') {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Database synced.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
