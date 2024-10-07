const express = require('express');
const cors = require('cors');
const http = require('http');  // Importar http para el servidor
const { Server } = require('socket.io');  // Importar Socket.IO
require('dotenv').config();
const authRoutes = require('./src/routes/authRoutes');
const roomRoutes = require('./src/routes/roomRoutes');  
const diagramRoutes = require('./src/routes/diagramRoutes');  



const app = express();
app.use(cors());
app.use(express.json());
// Crear el servidor HTTP y pasar la instancia de Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://sw-1-front-willonlyonexds-projects.vercel.app/",
    methods: ["GET", "POST"]
  }
});

// Almacenar usuarios conectados por sala
const usersInRooms = {};

// Configuración básica de Socket.IO
io.on('connection', (socket) => {
  console.log('Usuario conectado', socket.id);

// Unirse a una sala específica
socket.on('join_room', (roomCode, username) => {
  socket.join(roomCode);

  // Escuchar evento para agregar entidad
  socket.on('add_entity', (data) => {
    // Emitir a todos los usuarios en la sala sobre la nueva entidad
    socket.to(data.roomCode).emit('entity_added', { nodeData: data.nodeData });
  });
// Escuchar evento para eliminar entidad
socket.on('delete_entity', (data) => {
  console.log(`Usuario ${data.username} ha eliminado la entidad: ${data.nodeId}`);
  socket.to(data.roomCode).emit('entity_deleted', { nodeId: data.nodeId });
});

socket.on('add_attribute', (data) => {
  console.log(`Usuario ${data.username} ha añadido el atributo: ${data.nodeId} - ${data.attribute}`);
  
  // Emitir el nuevo atributo a todos los usuarios en la sala
  io.to(data.roomCode).emit('attribute_added', { nodeId: data.nodeId, attribute: data.attribute });
});

socket.on('add_method', (data) => {
  console.log(`Usuario ${data.username} ha añadido el método: ${data.nodeId} - ${data.method}`);
  
  // Emitir el nuevo método a todos los usuarios en la sala
  io.to(data.roomCode).emit('method_added', { nodeId: data.nodeId, method: data.method });
});

socket.on('rename_entity', (data) => {
  console.log(`Usuario ${data.username} ha renombrado la entidad: ${data.nodeId} a ${data.newName}`);
  
  // Emit the new name to all users in the room
  io.to(data.roomCode).emit('entity_renamed', { nodeId: data.nodeId, newName: data.newName });
});

  // Verificar si el usuario ya está en la lista de usuarios de la sala
  const existingUser = usersInRooms[roomCode]?.find(user => user.username === username);

  if (existingUser) {
    // Si el usuario ya está en la sala, solo actualizamos su estado a conectado
    existingUser.connected = true;
    existingUser.socketId = socket.id;
  } else {
    // Si el usuario no está en la sala, lo añadimos
    if (!usersInRooms[roomCode]) {
      usersInRooms[roomCode] = [];
    }
    usersInRooms[roomCode].push({ socketId: socket.id, username, connected: true });
  }

  console.log(`Usuario con ID: ${socket.id} (${username}) se ha unido a la sala: ${roomCode}`);

  // Enviar la lista actualizada de usuarios a todos los de la sala
  io.to(roomCode).emit('users_in_room', usersInRooms[roomCode]);

  // Emitir un mensaje a los demás en la sala
  socket.to(roomCode).emit('user_joined', `${username} se ha unido a la sala.`);
});



  // Escuchar cuando un usuario envía un mensaje
  socket.on('send_message', (data) => {
    io.to(data.roomCode).emit('receive_message', data);
  });



// Escuchar el evento para agregar una relación de asociación
socket.on('add_association', (data) => {
  console.log(`Relación de asociación añadida entre ${data.fromNode} y ${data.toNode}`);
  
  // Emitir el nuevo enlace (relación) a todos los usuarios en la sala
  io.to(data.roomCode).emit('association_added', {
    fromNode: data.fromNode,
    toNode: data.toNode,
    category: data.category, // Esto podría ser 'Association'
    fromText: data.fromText,
    toText: data.toText,
  });
});


socket.on('add_association_direct', (data) => {
  console.log(`Relación de asociación directa añadida entre ${data.fromNode} y ${data.toNode}`);
  
  // Emitir el nuevo enlace (relación directa) a todos los usuarios en la sala
  io.to(data.roomCode).emit('association_direct_added', {
    fromNode: data.fromNode,
    toNode: data.toNode,
    category: data.category, // 'AssociationDirect'
    fromText: data.fromText,
    toText: data.toText,
  });
});

socket.on('add_composition', (data) => {
  console.log(`Relación de composición añadida entre ${data.fromNode} y ${data.toNode}`);

  // Emitir el nuevo enlace (relación de composición) a todos los usuarios en la sala
  io.to(data.roomCode).emit('composition_added', {
    fromNode: data.fromNode,
    toNode: data.toNode,
    category: data.category, // 'Composition'
    fromText: data.fromText,
    toText: data.toText,
  });
});


// Escuchar el evento para agregar una relación de agregación
socket.on('add_aggregation', (data) => {
  console.log(`Relación de agregación añadida entre ${data.fromNode} y ${data.toNode}`);

  // Emitir el nuevo enlace (relación de agregación) a todos los usuarios en la sala
  io.to(data.roomCode).emit('aggregation_added', {
    fromNode: data.fromNode,
    toNode: data.toNode,
    category: data.category, // 'Aggregation'
    fromText: data.fromText,
    toText: data.toText,
  });
});


// Escuchar el evento para agregar una relación de generalización
socket.on('add_generalization', (data) => {
  console.log(`Relación de generalización añadida entre ${data.fromNode} y ${data.toNode}`);

  // Emitir el nuevo enlace (relación de generalización) a todos los usuarios en la sala
  io.to(data.roomCode).emit('generalization_added', {
    fromNode: data.fromNode,
    toNode: data.toNode,
    category: data.category, // 'Generalization'
    fromText: data.fromText,
    toText: data.toText,
  });
});

// Escuchar el evento para agregar una relación de recursividad
socket.on('add_recursion', (data) => {
  console.log(`Relación recursiva añadida en el nodo ${data.nodeId}`);

  // Emitir la nueva relación recursiva a todos los usuarios en la sala
  io.to(data.roomCode).emit('recursion_added', {
    nodeId: data.nodeId,
    category: data.category, // 'Recursion'
    fromText: data.fromText,
    toText: data.toText,
  });
});

// Escuchar el evento para agregar una relación de muchos a muchos
socket.on('add_many_to_many', (data) => {
  console.log(`Relación de muchos a muchos añadida entre ${data.fromNodeId} y ${data.toNodeId}`);

  // Emitir la nueva relación a todos los usuarios en la sala
  io.to(data.roomCode).emit('many_to_many_added', {
    fromNodeId: data.fromNodeId,
    toNodeId: data.toNodeId,
    intermediateNodeId: data.intermediateNodeId, // ID de la entidad intermedia
    fromText: data.fromText,
    toText: data.toText,
  });
});

// Escuchar el evento para agregar una relación de dependencia
socket.on('add_dependency', (data) => {
  console.log(`Relación de dependencia añadida entre ${data.fromNodeId} y ${data.toNodeId}`);

  // Emitir la nueva relación de dependencia a todos los usuarios en la sala
  io.to(data.roomCode).emit('dependency_added', {
    fromNodeId: data.fromNodeId,
    toNodeId: data.toNodeId,
    fromText: data.fromText,
    toText: data.toText,
  });
});
// Escuchar evento para eliminar enlace
socket.on('delete_link', (data) => {
  console.log(`Usuario ${data.username} ha eliminado el enlace: ${data.linkId}`);
  
  // Emitir a todos los usuarios en la sala sobre el enlace eliminado
  socket.to(data.roomCode).emit('link_deleted', { linkId: data.linkId });
});


// Manejo del mensaje de chat entrante
socket.on('chat_message', (data) => {
  console.log(`Mensaje de chat recibido en la sala ${data.roomCode}: ${data.message}`);

  // Enviar el mensaje a todos los usuarios de la sala
  io.to(data.roomCode).emit('chat_message_broadcast', data.message);
});

// Escuchar el evento para actualizar la posición de un nodo
socket.on('update_node_position', (data) => {
  console.log(`Posición del nodo ${data.nodeId} actualizada a ${data.newPosition}`);

  // Emitir la nueva posición a todos los usuarios en la sala
  io.to(data.roomCode).emit('node_position_updated', {
    nodeId: data.nodeId,
    newPosition: data.newPosition,
  });
});


// Escuchar los cambios en los textos de los enlaces (fromText y toText)
socket.on('update_link_text', (data) => {
  const { roomCode, fromNode, toNode, fromText, toText } = data;

  // Propagar los cambios a todos los usuarios en la misma sala
  socket.to(roomCode).emit('link_text_updated', {
    fromNode,
    toNode,
    fromText,
    toText
  });
});



  // Desconectar
  socket.on('disconnect', () => {
    console.log('Usuario desconectado', socket.id);

    // Encontrar el usuario desconectado y actualizar su estado
    for (const roomCode in usersInRooms) {
      usersInRooms[roomCode] = usersInRooms[roomCode].map(user => {
        if (user.socketId === socket.id) {
          return { ...user, connected: false };
        }
        return user;
      });

      // Enviar la lista actualizada de usuarios a todos los de la sala
      io.to(roomCode).emit('users_in_room', usersInRooms[roomCode]);
    }
  });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);  // Usamos las rutas de salas
app.use('/api', diagramRoutes);  // Usar las rutas de diagramas

// Puerto
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
