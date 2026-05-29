// ============================================================
// authController.js — Controlador de autenticación y usuarios
// Ubicación: src/controllers/authController.js
// Propósito: Contiene la lógica de negocio para REGISTRO, LOGIN
//            y CRUD de usuarios (listar, actualizar, desactivar).
// Trazabilidad: HU-024 | RF-024 | RNF-11 | RNF-12
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
// Trazabilidad: CU-24 | RF-024 | HU-024 | RNF-25
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
// Trazabilidad: CU-24 | RF-024 | HU-024 | RNF-12
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

        // Verifica si el usuario está activo (Estado = 1)
        // Un administrador puede desactivar cuentas; si Estado = 0 no puede ingresar
        if (usuario.Estado === 0)
            return res.status(403).json({ error: 'Usuario desactivado. Contacta al administrador.' });

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
        // El frontend almacena el token en localStorage para futuras peticiones
        res.json({ token, usuario: { id: usuario.PKUsuario, nombre: usuario.Nombre, rol: usuario.FKRol } });

    } catch (err) {
        // Manejo de errores inesperados del servidor
        res.status(500).json({ error: err.message });
    }
};


// ─────────────────────────────────────────────
// FUNCIÓN: listarUsuarios
// Método HTTP esperado: GET /api/usuarios
// Acceso: Solo Administrador (requiere verificarToken + soloAdmin)
// Trazabilidad: CU-24 | RF-024 | HU-024 | RNF-12
// ─────────────────────────────────────────────
const listarUsuarios = async (req, res) => {
    try {
        // Consulta todos los usuarios con JOIN a ROLES para obtener el nombre del rol
        // Se ordena por FechaRegistro descendente (más recientes primero)
        const [rows] = await db.query(
            `SELECT u.PKUsuario, u.Nombre, u.Apellido, u.Correo,
                    u.FechaRegistro, u.Estado, u.FKRol, r.NombreRol
             FROM usuarios u
             INNER JOIN roles r ON u.FKRol = r.PKRol
             ORDER BY u.FechaRegistro DESC`
        );

        // Retorna el arreglo de usuarios en formato JSON
        res.json(rows);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────
// FUNCIÓN: actualizarUsuario
// Método HTTP esperado: PUT /api/usuarios/:id
// Params: id (PKUsuario del usuario a modificar)
// Body esperado: { nombre, apellido, correo, fkRol }
// Acceso: Solo Administrador (requiere verificarToken + soloAdmin)
// Trazabilidad: CU-24 | RF-024 | HU-024 | RNF-06
// ─────────────────────────────────────────────
const actualizarUsuario = async (req, res) => {
    // Extrae el ID del usuario desde los parámetros de la URL (/api/usuarios/5)
    const { id } = req.params;
    const { nombre, apellido, correo, fkRol } = req.body;

    try {
        // Verifica que el usuario exista antes de intentar actualizarlo
        const [existe] = await db.query('SELECT * FROM USUARIOS WHERE PKUsuario = ?', [id]);
        if (existe.length === 0)
            return res.status(404).json({ error: 'Usuario no encontrado' });

        // Previene que se asigne un correo que ya usa otro usuario
        const [duplicado] = await db.query(
            'SELECT * FROM USUARIOS WHERE Correo = ? AND PKUsuario != ?', [correo, id]
        );
        if (duplicado.length > 0)
            return res.status(400).json({ error: 'El correo ya está en uso por otro usuario' });

        // Actualiza los campos del usuario en la BD
        await db.query(
            'UPDATE USUARIOS SET Nombre = ?, Apellido = ?, Correo = ?, FKRol = ? WHERE PKUsuario = ?',
            [nombre, apellido, correo, fkRol, id]
        );

        res.json({ mensaje: 'Usuario actualizado correctamente' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// ─────────────────────────────────────────────
// FUNCIÓN: desactivarUsuario
// Método HTTP esperado: DELETE /api/usuarios/:id
// Propósito: Soft delete — alterna el Estado entre 1 (activo) y 0 (inactivo)
//            NO elimina el registro para preservar integridad referencial
// Acceso: Solo Administrador (requiere verificarToken + soloAdmin)
// Trazabilidad: CU-24 | RF-024 | HU-024 | RNF-11
// ─────────────────────────────────────────────
const desactivarUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        // Obtiene el estado actual del usuario para alternarlo
        const [rows] = await db.query('SELECT Estado FROM USUARIOS WHERE PKUsuario = ?', [id]);
        if (rows.length === 0)
            return res.status(404).json({ error: 'Usuario no encontrado' });

        // Si estaba activo (1) lo desactiva (0), si estaba inactivo (0) lo reactiva (1)
        const nuevoEstado = rows[0].Estado === 1 ? 0 : 1;
        await db.query('UPDATE USUARIOS SET Estado = ? WHERE PKUsuario = ?', [nuevoEstado, id]);

        const msg = nuevoEstado === 0 ? 'Usuario desactivado' : 'Usuario reactivado';
        res.json({ mensaje: msg, estado: nuevoEstado });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────
// FUNCIÓN: listarEstudiantes
// Método HTTP esperado: GET /api/usuarios/estudiantes
// Acceso: Docente
// Trazabilidad: CU-22 | RF-021 | HU-021 | RNF-08
// ─────────────────────────────────────────────
const listarEstudiantes = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT u.PKUsuario, u.Nombre, u.Apellido, u.Correo, u.Estado
            FROM usuarios u
            INNER JOIN roles r ON u.FKRol = r.PKRol
            WHERE r.NombreRol = 'Estudiante'
            ORDER BY u.Nombre ASC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Exporta todas las funciones para que authRoutes.js pueda usarlas
module.exports = { registrar, login, listarUsuarios, actualizarUsuario, desactivarUsuario, listarEstudiantes };