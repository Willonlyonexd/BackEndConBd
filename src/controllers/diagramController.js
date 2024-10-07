// controllers/diagramController.js
const db = require('../config/db');

// Controlador para guardar o actualizar un diagrama
exports.saveDiagram = async (req, res) => {
  const { roomCode } = req.params;
  const { diagramData } = req.body; // Asegúrate de que diagramData se esté recibiendo correctamente

  try {
    // Guardar el diagrama en la base de datos
    const result = await db.query(
      `INSERT INTO room_diagrams (room_id, diagram_data, created_at) VALUES ($1, $2, NOW())`,
      [roomCode, diagramData]
    );
    return res.status(201).json({ message: "Diagrama guardado exitosamente" });
  } catch (error) {
    console.error("Error al guardar el diagrama:", error);
    return res.status(500).json({ error: "Error al guardar el diagrama" });
  }
};
// controllers/diagramController.js
exports.loadDiagram = async (req, res) => {
  const { roomId } = req.params; // Obtenemos roomId de los parámetros

  try {
    const diagram = await db.query('SELECT diagram_data FROM room_diagrams WHERE room_id = $1', [roomId]);

    if (diagram.rows.length > 0) {
      return res.status(200).json({ data: diagram.rows[0].diagram_data });
    } else {
      return res.status(404).json({ message: 'Diagrama no encontrado' });
    }
  } catch (error) {
    console.error('Error al cargar el diagrama:', error);
    res.status(500).json({ message: 'Error al cargar el diagrama' });
  }
};
