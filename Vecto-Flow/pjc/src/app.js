const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/api', (req, res) => {
    res.json({ mensaje: '✅ API VectoFlow funcionando' });
});

module.exports = app;