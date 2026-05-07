const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTRO
const registrar = async (req, res) => {
    const { nombre, apellido, correo, contraseña, fkRol } = req.body;
    try {
        const [existe] = await db.query('SELECT * FROM USUARIOS WHERE Correo = ?', [correo]);
        if (existe.length > 0) return res.status(400).json({ error: 'El correo ya está registrado' });

        const hash = await bcrypt.hash(contraseña, 10);
        await db.query(
            'INSERT INTO USUARIOS (Nombre, Apellido, Correo, Contraseña, FechaRegistro, FKRol) VALUES (?, ?, ?, ?, NOW(), ?)',
            [nombre, apellido, correo, hash, fkRol]
        );
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// LOGIN
const login = async (req, res) => {
    const { correo, contraseña } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM USUARIOS WHERE Correo = ?', [correo]);
        if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

        const usuario = rows[0];
        const valido = await bcrypt.compare(contraseña, usuario.Contraseña);
        if (!valido) return res.status(401).json({ error: 'Contraseña incorrecta' });

        const token = jwt.sign(
            { id: usuario.PKUsuario, rol: usuario.FKRol },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ token, usuario: { id: usuario.PKUsuario, nombre: usuario.Nombre, rol: usuario.FKRol } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { registrar, login };