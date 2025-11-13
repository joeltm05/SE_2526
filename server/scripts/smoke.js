// Simple smoke script to verify ESM imports and tariff logic
import { calcAmount } from '../src/utils/tariff.js';
import '../src/models/index.js';

const entry = new Date(Date.now() - 32 * 60000); // 32 minutes ago
const amount = calcAmount(entry, new Date());
console.log('calcAmount(32min) =', amount);
