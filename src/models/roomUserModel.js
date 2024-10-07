const db = require('../config/db');

// Función para verificar si el usuario ya está en una sala
const findUserInRoom = async (userId, roomId) => {
  const text = `
    SELECT * FROM room_users
    WHERE user_id = $1 AND room_id = $2;
  `;
  const values = [userId, roomId];
  const res = await db.query(text, values);
  
  return res.rows[0];  // Retorna el usuario si existe, o undefined si no está
};

// Función para agregar un usuario a una sala
const addUserToRoom = async (userId, roomId, role) => {
  const text = `
    INSERT INTO room_users (user_id, room_id, role)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [userId, roomId, role];
  const res = await db.query(text, values);
  
  return res.rows[0];  // Retorna el nuevo registro en room_users
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


module.exports = {
  addUserToRoom,
  findUserInRoom,
  findRoomsByUser,
};
