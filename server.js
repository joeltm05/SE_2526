const app = require('./app');
const db = require('./models');
const cron = require('node-cron');
const { cleanExpiredTokens, syncFileDb } = require('./tasks');

const runTasks = async () => {
  await cleanExpiredTokens();
  await syncFileDb();
};

cron.schedule('0 * * * *', runTasks);

(async () => {
  try {
    await runTasks();
    await db.sequelize.syncDB();
    app.listen(process.env.PORT, () => { process.stdout.write(' ✅\n'); });
  } catch (error) {
    console.error('❌ Erro ao iniciar o servidor ou sincronizar modelos:', error);
    process.exit(1);
  }
})();
