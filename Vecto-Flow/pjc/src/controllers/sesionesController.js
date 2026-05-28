// ============================================================
// sesionesController.js — CRUD de Sesiones (con vista)
// Ubicación: src/controllers/sesionesController.js
// Trazabilidad: HU-018 | RF-018 | RNF-06
// ============================================================

const db = require('../config/db');

// READ — Listar todas las sesiones
// HU-018 | RF-018
const listarSesiones = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT s.*, u.Nombre, u.Apellido
            FROM sesiones s
            INNER JOIN usuarios u ON s.FKUsuario = u.PKUsuario
            ORDER BY s.PKSesion DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error('Error listarSesiones:', err);
        res.status(500).json({ error: 'Error al obtener sesiones.' });
    }
};

// CREATE — Registrar nueva sesión
// HU-019 | RF-019
const crearSesion = async (req, res) => {
    const { FKUsuario, IPAcceso, Dispositivo } = req.body;
    if (!FKUsuario)
        return res.status(400).json({ error: 'El usuario es obligatorio.' });
    try {
        const [result] = await db.query(
            `INSERT INTO sesiones (FechaInicio, FechaFin, IPAcceso, Dispositivo, Estado, FKUsuario)
             VALUES (NOW(), NULL, ?, ?, 1, ?)`,
            [IPAcceso || null, Dispositivo || null, FKUsuario]
        );
        res.json({ ok: true, mensaje: 'Sesión registrada.', id: result.insertId });
    } catch (err) {
        console.error('Error crearSesion:', err);
        res.status(500).json({ error: 'Error al registrar sesión.' });
    }
};

// UPDATE — Cerrar sesión (registrar FechaFin)
// HU-020 | RF-020
const cerrarSesion = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(
            'UPDATE sesiones SET FechaFin = NOW(), Estado = 0 WHERE PKSesion = ?', [id]
        );
        res.json({ ok: true, mensaje: 'Sesión cerrada correctamente.' });
    } catch (err) {
        console.error('Error cerrarSesion:', err);
        res.status(500).json({ error: 'Error al cerrar sesión.' });
    }
};

// DELETE (soft) — Activar/Desactivar sesión
// HU-021 | RF-021
const toggleSesion = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(
            'UPDATE sesiones SET Estado = NOT Estado WHERE PKSesion = ?', [id]
        );
        res.json({ ok: true, mensaje: 'Estado de sesión actualizado.' });
    } catch (err) {
        console.error('Error toggleSesion:', err);
        res.status(500).json({ error: 'Error al cambiar estado.' });
    }
};

// GET /api/sesiones/mis-sesiones — Solo las sesiones del usuario autenticado
// HU-018 | RF-018
const misSesiones = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM sesiones WHERE FKUsuario = ? ORDER BY PKSesion DESC',
            [req.usuario.id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener sesiones.' });
    }
};

module.exports = { listarSesiones, crearSesion, cerrarSesion, toggleSesion, misSesiones };