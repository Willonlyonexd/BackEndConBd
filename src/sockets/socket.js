// Socket para añadir entidad
socket.on('add_entity', (data) => {
  console.log(`Usuario ${data.username} ha agregado la entidad: ${data.nodeData.key}`);
  
  // Emitir la nueva entidad a todos los usuarios en la sala
  io.to(data.roomCode).emit('entity_added', data.nodeData);
});

// Socket para eliminar entidad
socket.on('delete_entity', (data) => {
  console.log(`Usuario ${data.username} ha eliminado la entidad: ${data.nodeId}`);

  socket.on('add_attribute', (data) => {
    console.log(`Usuario ${data.username} ha añadido el atributo: ${data.nodeId} - ${data.attribute}`);
    
    // Emitir el nuevo atributo a todos los usuarios en la sala
    socket.to(data.roomCode).emit('attribute_added', { nodeId: data.nodeId, attribute: data.attribute });
  });

  // Socket para eliminar enlace
socket.on('delete_link', (data) => {
  console.log(`Usuario ${data.username} ha eliminado el enlace: ${data.linkId}`);
  
  // Emitir a todos los usuarios en la sala sobre el enlace eliminado
  io.to(data.roomCode).emit('link_deleted', { linkId: data.linkId });
});
  
  socket.on('add_method', (data) => {
    console.log(`Usuario ${data.username} ha añadido el método: ${data.nodeId} - ${data.method}`);
    
    // Emitir el nuevo método a todos los usuarios en la sala
    socket.to(data.roomCode).emit('method_added', { nodeId: data.nodeId, method: data.method });
  });

  socket.on('rename_entity', (data) => {
    console.log(`Usuario ${data.username} ha renombrado la entidad: ${data.nodeId} a ${data.newName}`);
    
    // Emit the new name to all users in the room
    io.to(data.roomCode).emit('entity_renamed', { nodeId: data.nodeId, newName: data.newName });
  });
  // Emitir la eliminación a todos los usuarios en la sala
  io.to(data.roomCode).emit('entity_deleted', { nodeId: data.nodeId });
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