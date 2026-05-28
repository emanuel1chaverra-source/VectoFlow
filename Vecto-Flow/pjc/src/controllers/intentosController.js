// ============================================================
// intentosController.js — CRUD de Intentos de Ejercicio (sin vista)
// Ubicación: src/controllers/intentosController.js
// Trazabilidad: HU-026 | RF-026 | RNF-07
// ============================================================

const db = require('../config/db');

// READ — Listar todos los intentos
// HU-026 | RF-026
const listarIntentos = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT i.*, a.FKEstudiante, a.FKEjercicio
            FROM intentos_ejercicio i
            INNER JOIN asignaciones a ON i.FKAsignacion = a.PKAsignacion
            ORDER BY i.PKIntento DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error('Error listarIntentos:', err);
        res.status(500).json({ error: 'Error al obtener intentos.' });
    }
};

// CREATE — Registrar nuevo intento
// HU-027 | RF-027
const crearIntento = async (req, res) => {
    const { NumeroIntento, TiempoSegundos, Calificacion, Observacion, FKAsignacion, FKOperacion } = req.body;
    if (!NumeroIntento || !FKAsignacion)
        return res.status(400).json({ error: 'Número de intento y asignación son obligatorios.' });
    try {
        const [result] = await db.query(
            `INSERT INTO intentos_ejercicio 
             (NumeroIntento, FechaIntento, TiempoSegundos, Calificacion, Observacion, FKAsignacion, FKOperacion)
             VALUES (?, NOW(), ?, ?, ?, ?, ?)`,
            [NumeroIntento, TiempoSegundos || null, Calificacion || null, Observacion || null, FKAsignacion, FKOperacion || null]
        );
        res.json({ ok: true, mensaje: 'Intento registrado correctamente.', id: result.insertId });
    } catch (err) {
        console.error('Error crearIntento:', err);
        res.status(500).json({ error: 'Error al registrar intento.' });
    }
};

// UPDATE — Editar intento
// HU-028 | RF-028
const editarIntento = async (req, res) => {
    const { id } = req.params;
    const { Calificacion, Observacion, TiempoSegundos } = req.body;
    try {
        await db.query(
            `UPDATE intentos_ejercicio SET Calificacion = ?, Observacion = ?, TiempoSegundos = ? WHERE PKIntento = ?`,
            [Calificacion || null, Observacion || null, TiempoSegundos || null, id]
        );
        res.json({ ok: true, mensaje: 'Intento actualizado correctamente.' });
    } catch (err) {
        console.error('Error editarIntento:', err);
        res.status(500).json({ error: 'Error al editar intento.' });
    }
};

// DELETE — Eliminar intento
// HU-029 | RF-029
const eliminarIntento = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM intentos_ejercicio WHERE PKIntento = ?', [id]);
        res.json({ ok: true, mensaje: 'Intento eliminado correctamente.' });
    } catch (err) {
        console.error('Error eliminarIntento:', err);
        res.status(500).json({ error: 'Error al eliminar intento.' });
    }
};

module.exports = { listarIntentos, crearIntento, editarIntento, eliminarIntento };