const db = require('../models'); // Your database models
const { validationResult } = require('express-validator'); // For request validation

// const getModel = t => {
//     const m = t.split('_')
//         .map(word =>
//             word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//         )
//         .join('');
//     console.log(m);
//     if (!db[m]) throw new Error(`Table/model '${t}' not found.`);
//     return db[m];
// };

const getModel = t => {

    if (!/^[a-z][a-z0-9_]*$/.test(t)) {
        throw new Error(`Invalid table name format: ${t}`);
    }

    const m = t.split('_')
        .map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join('');

    if (!db[m])
        throw new Error(`Table/model '${t}' (resolved to ${m}) not found. Available models: ${Object.keys(db).join(', ')}`);
    return db[m];
};

const validateRequest = req => {
    if (!validationResult(req).isEmpty()) throw new Error('Invalid request data');
};

// assincronos -> id, cursos

exports.getAll = async (req, res) => {
    try {
        validateRequest(req);
        const m = await getModel(req.params.table);
        const data = await m.findAll();
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};

exports.getOne = async (req, res) => {
    try {
        validateRequest(req);
        const m = getModel(req.params.table);
        const d = await m.findByPk(req.params.id);
        if (!d) throw new Error('Record not found');
        res.json(d);
    } catch (err) {
        console.log(err);
        res.status(404).json({ error: err.message });
    }
};

exports.getFilteredData = async (req, res) => {
    try {
        const query = req.query;
        validateRequest(req);
        const m = getModel(req.params.table);
        for (const key in query)
            if (!Object.keys(m.rawAttributes).includes(key))
                throw new Error(`Coluna ${key} inválida!`);
        const d = await m.findAll({ where: query });
        if (!d || !d.length) throw new Error('Recod not found!');
        res.json(d);
    } catch (err) {
        console.log(err);
        res.status(404).json({ error: err.message });
    }
};

// exports.getOne = async (req, res) => {
//     try {
//         validateRequest(req);
//         const model = getModel(req.params.table);

//         let data;

//         switch (req.params.table) {
//             case 'assincronos':
//                 data = await model.findByPk({
//                     id: req.params.id,
//                     curso: req.params.curso
//                 });
//                 break;

//             default:
//                 data = await model.findByPk(req.params.id);
//                 break;
//         }

//         if (!data) throw new Error('Record not found');
//         res.json(data);
//     } catch (err) {
//         res.status(404).json({ error: err.message });
//     }
// };


exports.createRow = async (req, res) => {
    try {
        validateRequest(req);
        const m = getModel(req.params.table);
        res.status(201).json((Array.isArray(req.body)) ? await m.bulkCreate(req.body) : await m.create(req.body));
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};


exports.updateRow = async (req, res) => {
    try {
        validateRequest(req);
        const model = getModel(req.params.table);
        const [updated] = await model.update(req.body, { where: { id: req.params.id } });
        if (!updated) throw new Error('Record not found');
        res.json(await model.findByPk(req.params.id));
    } catch (err) {
        console.log(err);
        res.status(404).json({ error: err.message });
    }
};

exports.deleteRow = async (req, res) => {
    try {
        validateRequest(req);
        const _deleted = await getModel(req.params.table).destroy({ where: { id: req.params.id } });
        if (!_deleted) throw new Error('Record not found');
        res.json({ success: true, deleted: _deleted, message: 'Record deleted' });
    } catch (err) {
        console.log(err);
        res.status(404).json({ error: err.message });
    }
};