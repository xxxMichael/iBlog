const connection = require('../models/db');

module.exports.almacenarPost = (req, res) => {
  const { dueño, titulo, contenido, urlImagen, fechaPublicacion, idCategoria1, idCategoria2, idCategoria3 } = req.body;
  console.log(dueño);
  console.log(fechaPublicacion);
  console.log(idCategoria1);
  console.log(idCategoria2);
  console.log(idCategoria3);

  const query = `
  INSERT INTO posts (dueño, titulo, contenido, urlImagen, fechaPublicacion, idCategoria1, idCategoria2, idCategoria3 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(query, [dueño, titulo, contenido, urlImagen, fechaPublicacion, idCategoria1, idCategoria2, idCategoria3], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      res.status(500).json({ success: false, message: 'Error al Insertar post' });
      return;
    }
    console.log('User inserted successfully:', result);
    res.status(200).json({ success: true, message: 'Post agregado correctamente' });
  });
};