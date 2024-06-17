const connection = require('../models/db');

module.exports.almacenarPost = (req, res) => {
  const { dueño, titulo, contenido, urlImagen, urlDocumento, fechaPublicacion, idCategoria1, idCategoria2, idCategoria3 } = req.body;
  console.log(dueño);
  console.log(fechaPublicacion);
  console.log(idCategoria1);
  console.log(idCategoria2);
  console.log(idCategoria3);
  console.log(urlDocumento);

  const queryInsert = `
  INSERT INTO posts (dueño, titulo, contenido, urlImagen, urlDocumento, fechaPublicacion, idCategoria1, idCategoria2, idCategoria3 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(queryInsert, [dueño, titulo, contenido, urlImagen, urlDocumento, fechaPublicacion, idCategoria1, idCategoria2, idCategoria3], (err, result) => {
    if (err) {
      console.error('Error inserting post:', err);
      res.status(500).json({ success: false, message: 'Error al Insertar post' });
      return;
    }

    console.log('Post inserted successfully:', result);

    // Update cantPost
    const queryUpdate = `
    UPDATE usuarioAutenticado SET cantPost = cantPost + 1 WHERE username = ?
    `;

    connection.query(queryUpdate, [dueño], (err, result) => {
      if (err) {
        console.error('Error updating cantPost:', err);
        res.status(500).json({ success: false, message: 'Error al actualizar cantPost' });
        return;
      }

      console.log('cantPost updated successfully:', result);
      res.status(200).json({ success: true, message: 'Post agregado y cantPost actualizado correctamente' });
    });
  });
};
