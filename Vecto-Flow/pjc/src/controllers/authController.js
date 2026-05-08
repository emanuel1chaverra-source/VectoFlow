// ============================================================
// authController.js — Controlador de autenticación
// Ubicación: src/controllers/authController.js
// Propósito: Contiene la lógica de negocio para REGISTRO y LOGIN
//            de usuarios. Maneja cifrado de contraseñas y JWT.
// ============================================================

// Importa la conexión a la base de datos (pool con promesas)
const db = require('../config/db');

// bcryptjs: librería para cifrar contraseñas con hash seguro (salt rounds)
// Nunca se guarda la contraseña en texto plano en la BD
const bcrypt = require('bcryptjs');

// jsonwebtoken: genera y verifica tokens JWT para autenticación sin sesión
// El token se envía al frontend y se usa en cada petición protegida
const jwt = require('jsonwebtoken');


// ─────────────────────────────────────────────
// FUNCIÓN: registrar
// Método HTTP esperado: POST /api/auth/registro
// Body esperado: { nombre, apellido, correo, contraseña, fkRol }
// ─────────────────────────────────────────────
const registrar = async (req, res) => {
    // Extrae los campos del cuerpo de la petición HTTP
    const { nombre, apellido, correo, contraseña, fkRol } = req.body;

    try {
        // Verifica si ya existe un usuario con ese correo en la tabla USUARIOS
        // Previene registros duplicados
        const [existe] = await db.query('SELECT * FROM USUARIOS WHERE Correo = ?', [correo]);
        if (existe.length > 0) return res.status(400).json({ error: 'El correo ya está registrado' });

        // Cifra la contraseña con bcrypt usando 10 rondas de salt
        // El resultado es un hash irreversible que se guarda en la BD
        const hash = await bcrypt.hash(contraseña, 10);

        // Inserta el nuevo usuario en la tabla USUARIOS con todos sus datos
        // FechaRegistro se genera automáticamente con NOW() de MySQL
        await db.query(
            'INSERT INTO USUARIOS (Nombre, Apellido, Correo, Contraseña, FechaRegistro, FKRol) VALUES (?, ?, ?, ?, NOW(), ?)',
            [nombre, apellido, correo, hash, fkRol]
        );

        // Responde con código 201 (Created) y mensaje de éxito
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });

    } catch (err) {
        // Si ocurre cualquier error inesperado (BD caída, campo inválido, etc.)
        // responde con código 500 (Internal Server Error) y el mensaje del error
        res.status(500).json({ error: err.message });
    }
};


// ─────────────────────────────────────────────
// FUNCIÓN: login
// Método HTTP esperado: POST /api/auth/login
// Body esperado: { correo, contraseña }
// ─────────────────────────────────────────────
const login = async (req, res) => {
    // Extrae correo y contraseña del cuerpo de la petición
    const { correo, contraseña } = req.body;

    try {
        // Busca al usuario en la BD por su correo electrónico
        const [rows] = await db.query('SELECT * FROM USUARIOS WHERE Correo = ?', [correo]);

        // Si no se encontró ningún usuario con ese correo, responde 404
        if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

        // Toma el primer (y único) resultado de la consulta
        const usuario = rows[0];

        // Compara la contraseña ingresada con el hash almacenado en la BD
        // bcrypt.compare retorna true si coinciden, false si no
        const valido = await bcrypt.compare(contraseña, usuario.Contraseña);
        if (!valido) return res.status(401).json({ error: 'Contraseña incorrecta' });

        // Genera un token JWT firmado con la clave secreta del .env
        // El payload incluye el ID y rol del usuario para autorización posterior
        // El token expira en 8 horas (sesión de trabajo)
        const token = jwt.sign(
            { id: usuario.PKUsuario, rol: usuario.FKRol }, // Payload: datos del usuario
            process.env.JWT_SECRET,                         // Clave secreta desde .env
            { expiresIn: '8h' }                             // Tiempo de expiración
        );

        // Responde con el token y datos básicos del usuario
        // El frontend almacena el token (localStorage/sessionStorage) para futuras peticiones
        res.json({ token, usuario: { id: usuario.PKUsuario, nombre: usuario.Nombre, rol: usuario.FKRol } });

    } catch (err) {
        // Manejo de errores inesperados del servidor
        res.status(500).json({ error: err.message });
    }
};

// Exporta ambas funciones para que authRoutes.js pueda usarlas
module.exports = { registrar, login };
