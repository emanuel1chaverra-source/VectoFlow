// ============================================================
// detalleVectorController.js — Controlador tabla detalle_vector
// Ubicación: src/controllers/detalleVectorController.js
// Propósito: Retorna los elementos atómicos (índice por índice)
//            de un vector específico para visualización.
// Trazabilidad: HU-019 | RF-019 | RNF-06
// ============================================================

const db = require('../config/db');

// ─────────────────────────────────────────────
// FUNCIÓN: obtenerDetalleVector
// Método HTTP: GET /api/detalle-vector/:fkVector
// Acceso: Estudiante autenticado
// Retorna: arreglo de { PKDetalle, Indice, Valor } ordenado por Indice
// ─────────────────────────────────────────────
const obtenerDetalleVector = async (req, res) => {
    const { fkVector } = req.params;

    try {
        const [rows] = await db.query(
            `SELECT PKDetalle, Indice, Valor
             FROM detalle_vector
             WHERE FKVector = ?
             ORDER BY Indice ASC`,
            [fkVector]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { obtenerDetalleVector };