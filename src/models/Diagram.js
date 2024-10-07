// models/Diagram.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Asegúrate de tener configurada tu conexión

const Diagram = sequelize.define('Diagram', {
  roomCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  data: {
    type: DataTypes.TEXT, // Almacena el JSON como texto
    allowNull: false
  }
});

module.exports = Diagram;
