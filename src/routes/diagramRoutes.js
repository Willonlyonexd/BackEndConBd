const express = require('express');
const router = express.Router();
const diagramController = require('../controllers/diagramController');

// Ruta para guardar el diagrama
router.post('/api/rooms/:roomCode/diagram', diagramController.saveDiagram);

// Otras rutas...

module.exports = router;
