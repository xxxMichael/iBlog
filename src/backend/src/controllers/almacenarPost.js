const connection = require('../models/db');

module.exports.almacenarPost = (req, res) => {
  const { dueño, titulo, contenido, urlImagen, fechaPublicacion } = req.body;

  const query = `
  INSERT INTO posts (dueño, titulo, contenido, urlImagen, fechaPublicacion) VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(query, [dueño, titulo, contenido, urlImagen, fechaPublicacion], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      res.status(500).json({ success: false, message: 'Error inserting post' });
      return;
    }
    console.log('User inserted successfully:', result);
    res.status(200).json({ success: true, message: 'Post agregado correctamente' });
  });
};