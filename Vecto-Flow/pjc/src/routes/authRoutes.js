// ============================================================
// authRoutes.js — Rutas de autenticación y gestión de usuarios
// Ubicación: src/routes/authRoutes.js
// Propósito: Define los endpoints HTTP del módulo de autenticación
//            y gestión de usuarios, conectándolos con sus funciones
//            controladoras y middlewares de seguridad.
// Trazabilidad: HU-024 | RF-024 | RNF-12
// ============================================================

// Importa Express y crea un enrutador independiente (Router)
const express = require('express');
const router = express.Router();

// Importa las funciones del controlador de autenticación y usuarios
const { registrar, login, listarUsuarios, actualizarUsuario, desactivarUsuario, listarEstudiantes } 
= require('../controllers/authController');

// Importa los middlewares de seguridad:
// verificarToken → valida el JWT en el header Authorization
// soloAdmin      → permite acceso solo si FKRol = 1 (Administrador)
// soloDocente    → permite acceso solo si FKRol = 3 (Docente)
const { verificarToken, soloAdmin, soloDocente } = require('../middlewares/authMiddleware');


// ─────────────────────────────────────────────
// RUTAS PÚBLICAS — No requieren autenticación
// ─────────────────────────────────────────────

// RUTA: POST /api/auth/registro
// Descripción: Registra un nuevo usuario en el sistema
// Body requerido: { nombre, apellido, correo, contraseña, fkRol }
router.post('/registro', registrar);

// RUTA: POST /api/auth/login
// Descripción: Autentica un usuario existente y retorna un JWT
// Body requerido: { correo, contraseña }
router.post('/login', login);

// ─────────────────────────────────────────────
// RUTAS PROTEGIDAS — Requieren JWT válido + rol Administrador
// Flujo: petición → verificarToken → soloAdmin → controlador
// ─────────────────────────────────────────────

//RUTA: GET /api/auth/usuarios/estudiantes
//Descripción: Retorna solo los usuarios con rol de estudiante (FKRol = 2)
router.get('/usuarios/estudiantes', verificarToken, soloDocente, listarEstudiantes);

// RUTA: GET /api/auth/usuarios
// Descripción: Retorna todos los usuarios con JOIN a ROLES
router.get('/usuarios', verificarToken, soloAdmin, listarUsuarios);

// RUTA: PUT /api/auth/usuarios/:id
// Descripción: Actualiza nombre, apellido, correo y rol de un usuario
// Params: id (PKUsuario)
router.put('/usuarios/:id', verificarToken, soloAdmin, actualizarUsuario);

// RUTA: DELETE /api/auth/usuarios/:id
// Descripción: Soft delete — alterna Estado entre 1 y 0 (no elimina)
// Params: id (PKUsuario)
router.delete('/usuarios/:id', verificarToken, soloAdmin, desactivarUsuario);


// Exporta el router para que app.js lo monte bajo el prefijo /api/auth
module.exports = router;