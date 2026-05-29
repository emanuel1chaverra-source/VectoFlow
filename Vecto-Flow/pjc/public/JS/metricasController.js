const db = require('../config/db');

// CU-19 | RF-019 | HU-019 | RNF-04 — registrarMetrica()
// FUNCIÓN: registrarMetrica | POST /api/metricas
const registrarMetrica = async (req, res) => {
    try {
        const { Intentos, TiempoSegundos, Aciertos, FKOperacion } = req.body;
        if (!Intentos || !TiempoSegundos || Aciertos === undefined || !FKOperacion)
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });

        const [result] = await db.query(
            `INSERT INTO metricas_desempeno (Intentos, TiempoSegundos, Aciertos, FechaRegistro, FKOperacion)
             VALUES (?, ?, ?, NOW(), ?)`,
            [Intentos, TiempoSegundos, Aciertos, FKOperacion]
        );
        res.status(201).json({ mensaje: 'Métrica registrada.', PKMetrica: result.insertId });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// CU-19 | RF-019 | HU-019 | RNF-06 — misMetricas()
// FUNCIÓN: misMetricas | GET /api/metricas/mis-metricas
const misMetricas = async (req, res) => {
    try {
        const FKEstudiante = req.usuario.id;
        const [rows] = await db.query(
            `SELECT m.PKMetrica, m.Intentos, m.TiempoSegundos, m.Aciertos, m.FechaRegistro,
                    o.FechaOperacion, o.PKOperacion
             FROM metricas_desempeno m
             INNER JOIN operaciones_suma o ON m.FKOperacion = o.PKOperacion
             WHERE o.FKEstudiante = ?
             ORDER BY m.FechaRegistro DESC`,
            [FKEstudiante]
        );
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// CU-22 | RF-021 | HU-021 | RNF-08 — metricasEstudiante()
// FUNCIÓN: metricasEstudiante | GET /api/metricas/estudiante/:id (solo docente)
const metricasEstudiante = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT m.*, o.FechaOperacion, u.Nombre, u.Apellido
             FROM metricas_desempeno m
             INNER JOIN operaciones_suma o ON m.FKOperacion = o.PKOperacion
             INNER JOIN usuarios u ON o.FKEstudiante = u.PKUsuario
             WHERE o.FKEstudiante = ?
             ORDER BY m.FechaRegistro DESC`,
            [req.params.id]
        );
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { registrarMetrica, misMetricas, metricasEstudiante };