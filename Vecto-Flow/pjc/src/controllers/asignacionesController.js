// ============================================================
// asignacionesController.js — CRUD de Asignaciones (sin vista)
// Ubicación: src/controllers/asignacionesController.js
// Trazabilidad: HU-022 | RF-022 | RNF-06
// ============================================================

const db = require('../config/db');

// CU-21 | RF-020 | HU-020 | RNF-06 — listarAsignaciones()
// READ — Listar todas las asignaciones
const listarAsignaciones = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT a.*, 
                   e.Titulo AS NombreEjercicio,
                   u.Nombre AS NombreEstudiante,
                   d.Nombre AS NombreDocente
            FROM asignaciones a
            INNER JOIN ejercicios e ON a.FKEjercicio = e.PKEjercicio
            INNER JOIN usuarios u  ON a.FKEstudiante = u.PKUsuario
            INNER JOIN usuarios d  ON a.FKDocente    = d.PKUsuario
            ORDER BY a.PKAsignacion DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error('Error listarAsignaciones:', err);
        res.status(500).json({ error: 'Error al obtener asignaciones.' });
    }
};

// CU-21 | RF-020 | HU-020 | RNF-06 — crearAsignacion()
// CREATE — Crear nueva asignación
const crearAsignacion = async (req, res) => {
    const { FechaAsignacion, FechaLimite, FKEjercicio, FKEstudiante, FKDocente } = req.body;
    if (!FechaAsignacion || !FKEjercicio || !FKEstudiante || !FKDocente)
        return res.status(400).json({ error: 'Fecha, ejercicio, estudiante y docente son obligatorios.' });
    try {
        const [result] = await db.query(
            `INSERT INTO asignaciones (FechaAsignacion, FechaLimite, Estado, FKEjercicio, FKEstudiante, FKDocente)
             VALUES (?, ?, 1, ?, ?, ?)`,
            [FechaAsignacion, FechaLimite || null, FKEjercicio, FKEstudiante, FKDocente]
        );
        res.json({ ok: true, mensaje: 'Asignación creada correctamente.', id: result.insertId });
    } catch (err) {
        console.error('Error crearAsignacion:', err);
        res.status(500).json({ error: 'Error al crear asignación.' });
    }
};

// CU-21 | RF-020 | HU-020 | RNF-06 — editarAsignacion()
// UPDATE — Editar asignación
const editarAsignacion = async (req, res) => {
    const { id } = req.params;
    const { FechaLimite, FKEjercicio, FKEstudiante } = req.body;
    try {
        await db.query(
            `UPDATE asignaciones SET FechaLimite = ?, FKEjercicio = ?, FKEstudiante = ? WHERE PKAsignacion = ?`,
            [FechaLimite || null, FKEjercicio, FKEstudiante, id]
        );
        res.json({ ok: true, mensaje: 'Asignación actualizada correctamente.' });
    } catch (err) {
        console.error('Error editarAsignacion:', err);
        res.status(500).json({ error: 'Error al editar asignación.' });
    }
};

// CU-21 | RF-020 | HU-020 | RNF-11 — toggleAsignacion()
// DELETE (soft) — Activar/Desactivar asignación
const toggleAsignacion = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(
            'UPDATE asignaciones SET Estado = NOT Estado WHERE PKAsignacion = ?', [id]
        );
        res.json({ ok: true, mensaje: 'Estado de asignación actualizado.' });
    } catch (err) {
        console.error('Error toggleAsignacion:', err);
        res.status(500).json({ error: 'Error al cambiar estado.' });
    }
};

module.exports = { listarAsignaciones, crearAsignacion, editarAsignacion, toggleAsignacion };