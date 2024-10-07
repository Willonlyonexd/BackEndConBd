const db = require('../config/db');

// Crear un nuevo usuario
const createUser = async (name, email, password) => {
  const text = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [name, email, password];
  const res = await db.query(text, values);
  return res.rows[0];
};

// Buscar un usuario por correo electrónico
const findUserByEmail = async (email) => {
  const text = `SELECT * FROM users WHERE email = $1;`;
  const res = await db.query(text, [email]);
  return res.rows[0];
};
// Función para obtener las salas donde el usuario es colaborador
const findRoomsByUser = async (userId) => {
  const text = `
    SELECT r.* FROM rooms r
    JOIN room_users ru ON r.id = ru.room_id
    WHERE ru.user_id = $1 AND ru.role = 'collaborator'
  `;
  const values = [userId];
  const res = await db.query(text, values);
  return res.rows;
};

module.exports = {
  createUser,
  findUserByEmail,
  findRoomsByUser,
};
