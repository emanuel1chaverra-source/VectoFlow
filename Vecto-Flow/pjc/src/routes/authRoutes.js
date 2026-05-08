// ============================================================
// authRoutes.js — Rutas de autenticación
// Ubicación: src/routes/authRoutes.js
// Propósito: Define los endpoints HTTP del módulo de autenticación
//            y los conecta con sus funciones controladoras.
// ============================================================

// Importa Express y crea un enrutador independiente (Router)
// El Router permite modularizar las rutas en archivos separados
const express = require('express');
const router = express.Router();

// Importa las funciones del controlador de autenticación
// registrar → maneja POST /registro
// login     → maneja POST /login
const { registrar, login } = require('../controllers/authController');

// ─────────────────────────────────────────────
// RUTA: POST /api/auth/registro
// Descripción: Registra un nuevo usuario en el sistema
// Body requerido: { nombre, apellido, correo, contraseña, fkRol }
// Controlador: registrar (authController.js)
// ─────────────────────────────────────────────
router.post('/registro', registrar);

// ─────────────────────────────────────────────
// RUTA: POST /api/auth/login
// Descripción: Autentica un usuario existente y retorna un JWT
// Body requerido: { correo, contraseña }
// Controlador: login (authController.js)
// ─────────────────────────────────────────────
router.post('/login', login);

// Exporta el router para que app.js lo monte bajo el prefijo /api/auth
module.exports = router;
