// ============================================================
// ejerciciosController.js — CRUD de Ejercicios
// Ubicación: src/controllers/ejerciciosController.js
// Trazabilidad: HU-014 | RF-014 | RNF-05
// ============================================================

const db = require('../config/db');

// CU-20 | RF-020 | HU-020 | RNF-06 — listarEjercicios()
// READ — Listar todos los ejercicios con su categoría
const listarEjercicios = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT e.*, c.NombreCategoria
            FROM ejercicios e
            INNER JOIN categorias_ejercicio c ON e.FKCategoria = c.PKCategoria
            ORDER BY e.PKEjercicio DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error('Error listarEjercicios:', err);
        res.status(500).json({ error: 'Error al obtener ejercicios.' });
    }
};

// CU-20 | RF-020 | HU-020 | RNF-06 — crearEjercicio()
// CREATE — Crear nuevo ejercicio
const crearEjercicio = async (req, res) => {
    const { Titulo, Descripcion, FKDocente, FKCategoria } = req.body;
    if (!Titulo || !FKDocente || !FKCategoria)
        return res.status(400).json({ error: 'Título, docente y categoría son obligatorios.' });
    try {
        const [result] = await db.query(
            `INSERT INTO ejercicios (Titulo, Descripcion, FechaCreacion, Estado, FKDocente, FKCategoria)
             VALUES (?, ?, CURDATE(), 1, ?, ?)`,
            [Titulo, Descripcion || null, FKDocente, FKCategoria]
        );
        res.json({ ok: true, mensaje: 'Ejercicio creado correctamente.', id: result.insertId });
    } catch (err) {
        console.error('Error crearEjercicio:', err);
        res.status(500).json({ error: 'Error al crear el ejercicio.' });
    }
};

// CU-20 | RF-020 | HU-020 | RNF-06 — editarEjercicio()
// UPDATE — Editar ejercicio
const editarEjercicio = async (req, res) => {
    const { id } = req.params;
    const { Titulo, Descripcion, FKCategoria } = req.body;
    if (!Titulo || !FKCategoria)
        return res.status(400).json({ error: 'Título y categoría son obligatorios.' });
    try {
        await db.query(
            `UPDATE ejercicios SET Titulo = ?, Descripcion = ?, FKCategoria = ? WHERE PKEjercicio = ?`,
            [Titulo, Descripcion || null, FKCategoria, id]
        );
        res.json({ ok: true, mensaje: 'Ejercicio actualizado correctamente.' });
    } catch (err) {
        console.error('Error editarEjercicio:', err);
        res.status(500).json({ error: 'Error al editar el ejercicio.' });
    }
};

// CU-20 | RF-020 | HU-020 | RNF-11 — toggleEjercicio()
// DELETE (soft) — Activar/Desactivar ejercicio
const toggleEjercicio = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(
            'UPDATE ejercicios SET Estado = NOT Estado WHERE PKEjercicio = ?', [id]
        );
        res.json({ ok: true, mensaje: 'Estado del ejercicio actualizado.' });
    } catch (err) {
        console.error('Error toggleEjercicio:', err);
        res.status(500).json({ error: 'Error al cambiar estado.' });
    }
};

module.exports = { listarEjercicios, crearEjercicio, editarEjercicio, toggleEjercicio };