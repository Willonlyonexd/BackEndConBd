const express = require('express');
const { createRoom, joinRoom } = require('../controllers/roomController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const roomController = require('../controllers/roomController'); 
// Ruta para crear una sala (protegida por autenticación)
router.post('/create', authMiddleware, createRoom);

// Ruta para unirse a una sala por código
router.post('/join', authMiddleware, joinRoom);
router.get('/user-rooms', authMiddleware, roomController.getUserRooms);

module.exports = router;
