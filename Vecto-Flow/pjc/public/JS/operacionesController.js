const db = require('../config/db');

// FUNCIÓN: ejecutarSuma | POST /api/operaciones/suma
const ejecutarSuma = async (req, res) => {
    try {
        const { FKVectorA, FKVectorB, FKVectorC, FKEjercicio } = req.body;
        const FKEstudiante = req.usuario.id;

        if (!FKVectorA || !FKVectorB)
            return res.status(400).json({ error: 'FKVectorA y FKVectorB son obligatorios.' });

        const [detalleA] = await db.query(
            'SELECT Indice, Valor FROM detalle_vector WHERE FKVector = ? ORDER BY Indice', [FKVectorA]
        );
        const [detalleB] = await db.query(
            'SELECT Indice, Valor FROM detalle_vector WHERE FKVector = ? ORDER BY Indice', [FKVectorB]
        );

        if (detalleA.length === 0 || detalleB.length === 0)
            return res.status(404).json({ error: 'Uno o más vectores no tienen datos.' });
        if (detalleA.length !== detalleB.length)
            return res.status(400).json({ error: 'Los vectores deben tener la misma dimensión.' });

        let resultado = detalleA.map((e, i) => ({
            indice: e.Indice,
            valorA: e.Valor,
            valorB: detalleB[i].Valor,
            total: e.Valor + detalleB[i].Valor
        }));

        if (FKVectorC) {
            const [detalleC] = await db.query(
                'SELECT Indice, Valor FROM detalle_vector WHERE FKVector = ? ORDER BY Indice', [FKVectorC]
            );
            if (detalleC.length !== detalleA.length)
                return res.status(400).json({ error: 'FKVectorC no tiene la misma dimensión.' });
            resultado = resultado.map((e, i) => ({
                ...e, valorC: detalleC[i].Valor,
                total: e.total + detalleC[i].Valor
            }));
        }

        const [op] = await db.query(
            `INSERT INTO operaciones_suma (FechaOperacion, FKEstudiante, FKVectorA, FKVectorB, FKVectorC, FKEjercicio)
             VALUES (NOW(), ?, ?, ?, ?, ?)`,
            [FKEstudiante, FKVectorA, FKVectorB, FKVectorC || null, FKEjercicio || null]
        );

        res.status(201).json({ mensaje: 'Suma ejecutada.', PKOperacion: op.insertId, resultado });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// FUNCIÓN: listarOperaciones | GET /api/operaciones
const listarOperaciones = async (req, res) => {
    try {
        const FKEstudiante = req.usuario.id;
        const [rows] = await db.query(
            `SELECT o.PKOperacion, o.FechaOperacion,
                    va.NombreVector AS VectorA, vb.NombreVector AS VectorB,
                    vc.NombreVector AS VectorC, e.Titulo AS Ejercicio
             FROM operaciones_suma o
             INNER JOIN vectores va ON o.FKVectorA = va.PKVector
             INNER JOIN vectores vb ON o.FKVectorB = vb.PKVector
             LEFT  JOIN vectores vc ON o.FKVectorC = vc.PKVector
             LEFT  JOIN ejercicios e ON o.FKEjercicio = e.PKEjercicio
             WHERE o.FKEstudiante = ?
             ORDER BY o.FechaOperacion DESC`,
            [FKEstudiante]
        );
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// FUNCIÓN: eliminarOperacion | DELETE /api/operaciones/:id
const eliminarOperacion = async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM operaciones_suma WHERE PKOperacion = ?', [req.params.id]
        );
        if (result.affectedRows === 0)
            return res.status(404).json({ error: 'Operación no encontrada.' });
        res.json({ mensaje: 'Operación eliminada.' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { ejecutarSuma, listarOperaciones, eliminarOperacion };