const { body, param, validationResult } = require('express-validator');
const db = require('../models');

function generateValidations(table, isArray = false) {
    const model = db[table];
    if (!model) return [];

    return Object.entries(model.rawAttributes).map(([field, attr]) => {
        if (attr.autoIncrement) return null;

        const fieldPath = isArray ? `*.${field}` : field;

        if (attr.allowNull === false) return body(fieldPath).notEmpty().withMessage(`${field} is required`);
        return null;
    }).filter(Boolean);
}

const validateId = [
    param('id').isInt(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    }
];
const validateColumn = [
    
];


const validateBody = (req, res, next) => {
    Promise.all(generateValidations(req.params.table, Array.isArray(req.body)).map(v => v.run(req)))
        .then(() => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
            next();
        })
        .catch(next);
};

module.exports = { validateId, validateColumn, validateBody };
