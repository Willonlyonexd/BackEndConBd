const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

// Registro de usuario
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya está registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en la base de datos
    const user = await User.createUser(name, email, hashedPassword);

    // Generar el token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({ token, userId: user.id });
  } catch (error) {
    res.status(500).json({ message: 'Error en el registro del usuario' });
  }
};

// Inicio de sesión de usuario
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByEmail(email);
    if (!user) {
      console.log("Usuario no encontrado");
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    // Aquí mostramos la contraseña que está en la base de datos y la que se está enviando
    console.log("Contraseña enviada:", password);
    console.log("Contraseña almacenada (hash):", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Contraseña incorrecta");
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',  // Valor por defecto si no se define en .env
    });
    
    console.log("Inicio de sesión exitoso");
    res.status(200).json({ token, userId: user.id });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ message: 'Error en el inicio de sesión' });
  }
};


