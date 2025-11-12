const express = require('express');
const app = express();

app.use('/auth', require('./auth.routes'));
app.use('/files', require('./files.routes'));
app.use(require('./main.routes'));

module.exports = app;