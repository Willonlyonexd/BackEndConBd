const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

// Ruta para el registro de usuario
router.post('/register', register);

// Ruta para el inicio de sesión
router.post('/login', login);

module.exports = router;
