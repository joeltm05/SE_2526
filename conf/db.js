const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    // logging: console.log
    logging: false
  },
);
// console.log(sequelize);


async function testDbConnection() {
  try {
    await sequelize.authenticate();
    console.log('📦 Conexão com o banco de dados PostgreSQL estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Não foi possível conectar ao banco de dados:', error);
    process.exit(1);
  }
}

testDbConnection();

module.exports = sequelize;