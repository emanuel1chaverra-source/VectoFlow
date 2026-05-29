// ============================================================
// categoriasController.js — CRUD de Categorías de Ejercicio
// Ubicación: src/controllers/categoriasController.js
// Trazabilidad: HU-010 | RF-010 | RNF-05
// ============================================================

const db = require('../config/db');

// CU-20 | RF-020 | HU-020 | RNF-06 — listarCategorias()
// READ — Listar todas las categorías
const listarCategorias = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categorias_ejercicio ORDER BY PKCategoria DESC');
        res.json(rows);
    } catch (err) {
        console.error('Error listarCategorias:', err);
        res.status(500).json({ error: 'Error al obtener categorías.' });
    }
};

// CU-20 | RF-020 | HU-020 | RNF-06 — crearCategoria()
// CREATE — Crear nueva categoría
const crearCategoria = async (req, res) => {
    const { NombreCategoria, Descripcion } = req.body;
    if (!NombreCategoria)
        return res.status(400).json({ error: 'El nombre de la categoría es obligatorio.' });
    try {
        const [result] = await db.query(
            'INSERT INTO categorias_ejercicio (NombreCategoria, Descripcion, Estado) VALUES (?, ?, 1)',
            [NombreCategoria, Descripcion || null]
        );
        res.json({ ok: true, mensaje: 'Categoría creada correctamente.', id: result.insertId });
    } catch (err) {
        console.error('Error crearCategoria:', err);
        res.status(500).json({ error: 'Error al crear la categoría.' });
    }
};

// CU-20 | RF-020 | HU-020 | RNF-06 — editarCategoria()
// UPDATE — Editar categoría
const editarCategoria = async (req, res) => {
    const { id } = req.params;
    const { NombreCategoria, Descripcion } = req.body;
    if (!NombreCategoria)
        return res.status(400).json({ error: 'El nombre es obligatorio.' });
    try {
        await db.query(
            'UPDATE categorias_ejercicio SET NombreCategoria = ?, Descripcion = ? WHERE PKCategoria = ?',
            [NombreCategoria, Descripcion || null, id]
        );
        res.json({ ok: true, mensaje: 'Categoría actualizada correctamente.' });
    } catch (err) {
        console.error('Error editarCategoria:', err);
        res.status(500).json({ error: 'Error al editar la categoría.' });
    }
};

// CU-20 | RF-020 | HU-020 | RNF-11 — toggleCategoria()
// DELETE (soft) — Activar/Desactivar categoría
const toggleCategoria = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(
            'UPDATE categorias_ejercicio SET Estado = NOT Estado WHERE PKCategoria = ?', [id]
        );
        res.json({ ok: true, mensaje: 'Estado de categoría actualizado.' });
    } catch (err) {
        console.error('Error toggleCategoria:', err);
        res.status(500).json({ error: 'Error al cambiar estado.' });
    }
};

module.exports = { listarCategorias, crearCategoria, editarCategoria, toggleCategoria };