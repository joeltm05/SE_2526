const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../conf/db'); // Your Sequelize instance
const basename = path.basename(__filename);
const db = {};
require('dotenv').config();

// 1. First Pass: Load all models into the `db` object
fs
    .readdirSync(__dirname)
    .filter(file =>
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.endsWith('.model.js')
    )
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

// 2. Second Pass: Call `associate` method for all models
// This is where relationships are defined after all models are loaded
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// IMPORTANT: Assign db.sequelize here BEFORE trying to modify its properties
db.sequelize = sequelize;
db.Sequelize = Sequelize;

const syncOrder = process.env.SYNC_ORDER
    ? process.env.SYNC_ORDER.split(',').map(v => v.trim())
    : [];
// Now, db.sequelize exists, so you can set its 'sync' property
db.sequelize.syncDB = async function (options) {
    console.log('🚀 Starting custom Sequelize sync order...');
    for (const modelName of syncOrder)
        if (db[modelName]) {
            await db[modelName].sync({ ...options, alter: true });
            process.stdout.write((modelName === syncOrder[0] ? 'Synced model\'s: ' : ', ') + modelName /*+ (modelName === syncOrder[syncOrder.length - 1] ? '\n' : '')*/);
        } else
            console.warn(`Model "${modelName}" not found in db object. Please ensure model file exists and is correctly named.`);
};

module.exports = db;