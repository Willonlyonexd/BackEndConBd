const Room = require('../models/roomModel');
const RoomUser = require('../models/roomUserModel');  // Asegúrate de importar esto
// Crear una sala
exports.createRoom = async (req, res) => {
  const { roomName } = req.body;
  const adminId = req.userId;  // Obtenemos el userId del token JWT

  try {
    // Crear la sala
    const room = await Room.createRoom(roomName, adminId);

    // Insertar al admin en room_users
    await RoomUser.addUserToRoom(adminId, room.id, 'admin');

    res.status(201).json(room);  // Retornar la sala creada
  } catch (error) {
    console.error('Error creando la sala:', error);  // Log para identificar problemas
    res.status(500).json({ message: 'Error creando la sala' });
  }
};

// Unirse a una sala mediante el código de sala
exports.joinRoom = async (req, res) => {
  const { roomCode } = req.body;
  const userId = req.userId;  // Obtenemos el userId del token JWT

  console.log('Room code recibido:', roomCode);
  console.log('User ID:', userId);

  try {
    const room = await Room.findRoomByCode(roomCode);
    if (!room) {
      return res.status(404).json({ message: 'Sala no encontrada' });
    }

    // Verificar si el usuario ya está en la sala
    const userInRoom = await RoomUser.findUserInRoom(userId, room.id);
    if (userInRoom) {
      // El usuario ya está en la sala, permitirle reingresar
      return res.status(200).json({ message: 'Usuario ya está en la sala', room_name: room.room_name });
    }

    // Si no está en la sala, agregarlo como colaborador
    await RoomUser.addUserToRoom(userId, room.id, 'collaborator');

    // Enviar el nombre de la sala en la respuesta
    res.status(200).json({ message: 'Unido a la sala', room_name: room.room_name });
  } catch (error) {
    console.error('Error al intentar unirse a la sala:', error);
    res.status(500).json({ message: 'Error al intentar unirse a la sala' });
  }
};


// Obtener todas las salas donde el usuario es admin o colaborador
exports.getUserRooms = async (req, res) => {
  const userId = req.userId;  // Obtenemos el userId del token JWT

  try {
    // Obtener las salas donde el usuario es admin
    const adminRooms = await Room.findRoomsByAdmin(userId);
    
    // Obtener las salas donde el usuario es colaborador
    const collaboratorRooms = await RoomUser.findRoomsByUser(userId);
    console.log('Admin Rooms:', adminRooms);
    console.log('Collaborator Rooms:', collaboratorRooms);

    res.status(200).json({
      adminRooms,
      collaboratorRooms
    });
  } catch (error) {
    console.error('Error obteniendo las salas del usuario:', error);
    res.status(500).json({ message: 'Error obteniendo las salas del usuario' });
  }
};

