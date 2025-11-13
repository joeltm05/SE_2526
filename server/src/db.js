import { Sequelize } from 'sequelize';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const DIALECT = process.env.DB_DIALECT || 'sqlite'; // 'sqlite' or 'postgres'

let sequelize;
if (DIALECT === 'postgres') {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is required for postgres dialect');
  }
  const useSSL = (process.env.DB_SSL || '').toLowerCase() === 'true';
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: useSSL
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : undefined,
  });
} else {
  const storage = process.env.SQLITE_FILE || path.join(process.cwd(), 'data', 'parking.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage,
    logging: false,
  });
}

export default sequelize;
