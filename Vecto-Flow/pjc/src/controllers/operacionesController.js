// ============================================================
// operacionesController.js — Controlador tabla operaciones_suma
// Ubicación: src/controllers/operacionesController.js
// Propósito: CRUD de operaciones de suma. Solo backend, sin visual.
// Trazabilidad: HU-014 | RF-014
// ============================================================

const db = require('../config/db');

// ─────────────────────────────────────────────
// FUNCIÓN: listarOperaciones
// Método HTTP: GET /api/operaciones
// Acceso: Estudiante autenticado
// Retorna todas las operaciones del estudiante logueado
// con JOIN a vectores y ejercicios para contexto completo.
// ─────────────────────────────────────────────
const listarOperaciones = async (req, res) => {
    const idEstudiante = req.usuario.id;

    try {
        const [rows] = await db.query(
            `SELECT 
                o.PKOperacion,
                o.FechaOperacion,
                o.FKVectorA,
                o.FKVectorB,
                o.FKVectorC,
                o.FKEjercicio,
                va.NombreVector AS VectorA,
                vb.NombreVector AS VectorB,
                vc.NombreVector AS VectorC,
                e.Titulo  AS Ejercicio
             FROM operaciones_suma o
             INNER JOIN vectores va ON o.FKVectorA = va.PKVector
             INNER JOIN vectores vb ON o.FKVectorB = vb.PKVector
             LEFT  JOIN vectores vc ON o.FKVectorC = vc.PKVector
             LEFT  JOIN ejercicios e ON o.FKEjercicio = e.PKEjercicio
             WHERE o.FKEstudiante = ?
             ORDER BY o.FechaOperacion DESC`,
            [idEstudiante]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────
// FUNCIÓN: crearOperacion
// Método HTTP: POST /api/operaciones
// Acceso: Estudiante autenticado
// Body: { fkVectorA, fkVectorB, fkVectorC (opcional), fkEjercicio (opcional) }
// ─────────────────────────────────────────────
const crearOperacion = async (req, res) => {
    const idEstudiante = req.usuario.id;
    const { fkVectorA, fkVectorB, fkVectorC, fkEjercicio } = req.body;

    if (!fkVectorA || !fkVectorB)
        return res.status(400).json({ error: 'fkVectorA y fkVectorB son obligatorios' });

    try {
        const [result] = await db.query(
            `INSERT INTO operaciones_suma 
                (FechaOperacion, FKEstudiante, FKVectorA, FKVectorB, FKVectorC, FKEjercicio)
             VALUES (NOW(), ?, ?, ?, ?, ?)`,
            [idEstudiante, fkVectorA, fkVectorB, fkVectorC || null, fkEjercicio || null]
        );
        res.status(201).json({ 
            mensaje: 'Operación registrada exitosamente', 
            pkOperacion: result.insertId 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────
// FUNCIÓN: eliminarOperacion
// Método HTTP: DELETE /api/operaciones/:id
// Acceso: Estudiante autenticado (solo sus propias operaciones)
// ─────────────────────────────────────────────
const eliminarOperacion = async (req, res) => {
    const idEstudiante = req.usuario.id;
    const { id } = req.params;

    try {
        const [existe] = await db.query(
            'SELECT * FROM operaciones_suma WHERE PKOperacion = ? AND FKEstudiante = ?',
            [id, idEstudiante]
        );
        if (existe.length === 0)
            return res.status(404).json({ error: 'Operación no encontrada' });

        await db.query('DELETE FROM operaciones_suma WHERE PKOperacion = ?', [id]);
        res.json({ mensaje: 'Operación eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────
// FUNCIÓN: listarOperacionesEstudiante
// Método HTTP: GET /api/operaciones/estudiante/:id
// Acceso: Docente autenticado
// Retorna operaciones de un estudiante específico (para vista Docente)
// ─────────────────────────────────────────────
const listarOperacionesEstudiante = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query(
            `SELECT 
                o.PKOperacion,
                o.FechaOperacion,
                o.FKVectorA,
                o.FKVectorB,
                o.FKVectorC,
                o.FKEjercicio,
                va.NombreVector AS VectorA,
                vb.NombreVector AS VectorB,
                vc.NombreVector AS VectorC,
                e.Titulo  AS Ejercicio
             FROM operaciones_suma o
             INNER JOIN vectores va ON o.FKVectorA = va.PKVector
             INNER JOIN vectores vb ON o.FKVectorB = vb.PKVector
             LEFT  JOIN vectores vc ON o.FKVectorC = vc.PKVector
             LEFT  JOIN ejercicios e ON o.FKEjercicio = e.PKEjercicio
             WHERE o.FKEstudiante = ?
             ORDER BY o.FechaOperacion DESC`,
            [id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { listarOperaciones, crearOperacion, eliminarOperacion, listarOperacionesEstudiante };