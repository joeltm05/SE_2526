import sequelize, { Spot } from '../src/models/index.js';

(async () => {
  try {
    await sequelize.authenticate();
    const count = await Spot.count();
    if (count === 0) {
      const spots = Array.from({ length: 30 }).map((_, i) => ({ label: `P${i + 1}`, status: 'free' }));
      await Spot.bulkCreate(spots);
      console.log('Seeded 30 spots.');
    } else {
      console.log('Spots already exist, skipping.');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
