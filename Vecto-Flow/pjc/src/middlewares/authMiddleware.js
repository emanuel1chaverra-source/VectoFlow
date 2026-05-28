// ============================================================
// authMiddleware.js — Middlewares de seguridad y autorización
// Ubicación: src/middlewares/authMiddleware.js
// Propósito: Protege rutas verificando el token JWT y validando
//            que el usuario tenga el rol requerido (Admin).
// Trazabilidad: HU-024 | RF-024 | RNF-12
// ============================================================

const jwt = require('jsonwebtoken');

// ─────────────────────────────────────────────
// MIDDLEWARE: verificarToken
// Propósito: Extrae y valida el token JWT del header Authorization.
//            Si es válido, inyecta los datos del usuario en req.usuario
//            para que los siguientes middlewares/controladores los usen.
// Uso: router.get('/ruta', verificarToken, controlador)
// ─────────────────────────────────────────────
const verificarToken = (req, res, next) => {
    // El token llega en el header como: Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Si no hay token, la petición no está autenticada
    if (!token)
        return res.status(401).json({ error: 'Acceso denegado. Token requerido.' });

    try {
        // Verifica la firma del token con la clave secreta del .env
        // Si es válido, decoded contiene el payload: { id, rol }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // Inyecta los datos del usuario en la petición
        next();                // Continúa al siguiente middleware o controlador
    } catch (err) {
        // El token fue alterado, expiró o es inválido
        res.status(403).json({ error: 'Token inválido o expirado.' });
    }
};

// ─────────────────────────────────────────────
// MIDDLEWARE: soloAdmin
// Propósito: Permite el acceso únicamente a usuarios con FKRol = 1
//            (Administrador). Debe usarse después de verificarToken.
// Uso: router.get('/ruta', verificarToken, soloAdmin, controlador)
// ─────────────────────────────────────────────
const soloAdmin = (req, res, next) => {
    // req.usuario fue inyectado por verificarToken
    // FKRol = 1 corresponde al rol Administrador en la tabla ROLES
    if (req.usuario.rol !== 1)
        return res.status(403).json({ error: 'Acceso denegado. Solo administradores.' });
    next();
};

// Middleware — Solo Docentes
// Trazabilidad: HU-010 | RF-010
const soloDocente = (req, res, next) => {
    if (req.usuario.rol !== 3) {
        return res.status(403).json({ error: 'Acceso denegado. Solo docentes.' });
    }
    next();
};

// Middleware — Solo Estudiantes (FKRol = 2)
const soloEstudiante = (req, res, next) => {
    if (req.usuario.rol !== 2){
        return res.status(403).json({ error: 'Acceso denegado. Solo estudiantes.' });
    }
    next();
};

module.exports = { verificarToken, soloAdmin, soloDocente, soloEstudiante };

