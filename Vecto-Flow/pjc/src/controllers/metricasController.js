// ============================================================
// metricasController.js — Controlador tabla metricas_desempeno
// Ubicación: src/controllers/metricasController.js
// Propósito: Registra y consulta métricas de desempeño del
//            estudiante por operación. Solo backend, sin visual.
// Trazabilidad: HU-020 | RF-020
// ============================================================

const db = require('../config/db');

// ─────────────────────────────────────────────
// FUNCIÓN: listarMetricas
// Método HTTP: GET /api/metricas
// Acceso: Estudiante autenticado
// Retorna métricas del estudiante con JOIN a operaciones_suma
// ─────────────────────────────────────────────
const listarMetricas = async (req, res) => {
    const idEstudiante = req.usuario.id;

    try {
        const [rows] = await db.query(
            `SELECT 
                m.PKMetrica,
                m.Intentos,
                m.TiempoSegundos,
                m.Aciertos,
                m.FechaRegistro,
                m.FKOperacion,
                o.FechaOperacion
             FROM metricas_desempeno m
             INNER JOIN operaciones_suma o ON m.FKOperacion = o.PKOperacion
             WHERE o.FKEstudiante = ?
             ORDER BY m.FechaRegistro DESC`,
            [idEstudiante]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────
// FUNCIÓN: crearMetrica
// Método HTTP: POST /api/metricas
// Acceso: Estudiante autenticado
// Body: { intentos, tiempoSegundos, aciertos, fkOperacion }
// ─────────────────────────────────────────────
const crearMetrica = async (req, res) => {
    const { intentos, tiempoSegundos, aciertos, fkOperacion } = req.body;

    if (!fkOperacion)
        return res.status(400).json({ error: 'fkOperacion es obligatorio' });

    try {
        const [result] = await db.query(
            `INSERT INTO metricas_desempeno 
                (Intentos, TiempoSegundos, Aciertos, FechaRegistro, FKOperacion)
             VALUES (?, ?, ?, NOW(), ?)`,
            [intentos || 0, tiempoSegundos || 0, aciertos || 0, fkOperacion]
        );
        res.status(201).json({ 
            mensaje: 'Métrica registrada exitosamente', 
            pkMetrica: result.insertId 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { listarMetricas, crearMetrica };