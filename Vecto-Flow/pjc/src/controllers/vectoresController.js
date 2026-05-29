// ============================================================
// vectoresController.js — Lógica para guardar suma de vectores
// Ubicación: src/controllers/vectoresController.js
// Trazabilidad: HU-005 | HU-008 | RF-005 | RNF-08
// ============================================================

const db = require('../config/db');

/* ── guardarSuma ────
 * Recibe los vectores de entrada y el resultado desde el frontend,
 * los guarda en: dimension, vectores, detalle_vector y operaciones_suma.
 * Usa transacción para garantizar integridad: todo o nada.
 * Trazabilidad código: HU-005 | HU-008 | RF-005
 */
const guardarSuma = async (req, res) => {
    const { vectores, resultado, dim } = req.body;
    const FKEstudiante = req.usuario.id; // Viene del token JWT

    // Validación básica
    if (!vectores || !resultado || !dim) {
        return res.status(400).json({ error: 'Datos incompletos.' });
    }

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // ── PASO 1: Buscar o crear la dimensión ──
        const [dimRows] = await conn.query(
            'SELECT PKDimension FROM dimension WHERE Tamaño = ?', [dim]
        );
        let FKDimension;
        if (dimRows.length > 0) {
            FKDimension = dimRows[0].PKDimension;
        } else {
            const [ins] = await conn.query(
                'INSERT INTO dimension (Tamaño) VALUES (?)', [dim]
            );
            FKDimension = ins.insertId;
        }

        // ── PASO 2: Insertar cada vector de entrada (A, B, extras) y sus detalles ──
        const PKsVectores = [];
        for (const vec of vectores) {
            const [v] = await conn.query(
                'INSERT INTO vectores (NombreVector, FKDimension, FKUsuario) VALUES (?, ?, ?)',
                [vec.nombre, FKDimension, FKEstudiante]
            );
            const PKVector = v.insertId;
            PKsVectores.push(PKVector);

            // Insertar cada celda del vector en detalle_vector
            for (let i = 0; i < vec.valores.length; i++) {
                await conn.query(
                    'INSERT INTO detalle_vector (Indice, Valor, FKVector) VALUES (?, ?, ?)',
                    [i, vec.valores[i], PKVector]
                );
            }
        }

        // ── PASO 3: Insertar el vector resultado C y sus detalles ──
        const [vC] = await conn.query(
            'INSERT INTO vectores (NombreVector, FKDimension, FKUsuario) VALUES (?, ?, ?)',
            ['C', FKDimension, FKEstudiante]
        );
        const PKVectorC = vC.insertId;

        for (let i = 0; i < resultado.length; i++) {
            await conn.query(
                'INSERT INTO detalle_vector (Indice, Valor, FKVector) VALUES (?, ?, ?)',
                [i, resultado[i], PKVectorC]
            );
        }

        // ── PASO 4: Registrar la operación en operaciones_suma ──
        await conn.query(
            `INSERT INTO operaciones_suma 
             (FechaOperacion, FKEstudiante, FKVectorA, FKVectorB, FKVectorC) 
             VALUES (NOW(), ?, ?, ?, ?)`,
            [FKEstudiante, PKsVectores[0], PKsVectores[1], PKVectorC]
        );

        await conn.commit();
        res.json({ ok: true, mensaje: '✅ Suma guardada correctamente en la base de datos.' });

    } catch (err) {
        await conn.rollback();
        console.error('Error guardarSuma:', err);
        res.status(500).json({ error: 'Error al guardar la suma en la base de datos.' });
    } finally {
        conn.release();
    }
};

module.exports = { guardarSuma };