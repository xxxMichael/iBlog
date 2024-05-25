const connection = require('../models/db');

module.exports.consultarCatego = (req, res) => {
  // Realizar la consulta SQL para seleccionar todas las categorías
  const sql = 'SELECT * FROM categorias';

  // Ejecutar la consulta
  connection.query(sql, (error, results) => {
    if (error) {
      // Manejar errores de consulta
      console.error('Error al consultar categorías:', error);
      return res.status(500).json({ error: 'Error al consultar categorías' });
    }

    // Enviar las categorías recuperadas como respuesta
    res.status(200).json(results);
  });
};
