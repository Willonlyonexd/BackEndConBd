const db = require('../config/db');

// Función para generar un código único de 4 dígitos
const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
};

// Función para obtener las salas donde el usuario es admin
const findRoomsByAdmin = async (userId) => {
  const text = `SELECT * FROM rooms WHERE admin_id = $1`;
  const values = [userId];
  const res = await db.query(text, values);
  return res.rows;
};

// Función para obtener las salas donde el usuario es colaborador
const findRoomsByUser = async (userId) => {
  const text = `
    SELECT r.*
    FROM rooms r
    JOIN room_users ru ON r.id = ru.room_id
    WHERE ru.user_id = $1 AND ru.role = 'collaborator';
  `;
  const values = [userId];
  const res = await db.query(text, values);
  return res.rows;
};

// Crear una nueva sala
const createRoom = async (roomName, adminId) => {
  const roomCode = generateRoomCode();  // Generar el código único de 4 dígitos
  const text = `
    INSERT INTO rooms (room_name, room_code, admin_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [roomName, roomCode, adminId];
  const res = await db.query(text, values);
  return res.rows[0];  // Retorna la sala creada
};

// Buscar sala por código
const findRoomByCode = async (roomCode) => {
  const text = `
    SELECT * FROM rooms WHERE room_code = $1;
  `;
  const res = await db.query(text, [roomCode]);
  return res.rows[0];  // Retorna la sala si existe
};

module.exports = {
  createRoom,
  findRoomByCode,
  findRoomsByAdmin,
  findRoomsByUser  // Exportar la nueva función para obtener salas como colaborador
};
