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
    const queryUpdateCantPost = `
    UPDATE usuarioAutenticado SET cantPosts = cantPosts + 1 WHERE username = ?;
    `;

    connection.query(queryUpdateCantPost, [dueño], (err, result) => {
      if (err) {
        console.error('Error updating cantPost:', err);
        res.status(500).json({ success: false, message: 'Error al actualizar cantPost' });
        return;
      }

      console.log('cantPost updated successfully:', result);

      // Check the updated cantPost
      const querySelectCantPost = `
      SELECT cantPosts FROM usuarioAutenticado WHERE username = ?;
      `;

      connection.query(querySelectCantPost, [dueño], (err, results) => {
        if (err) {
          console.error('Error fetching cantPost:', err);
          res.status(500).json({ success: false, message: 'Error al obtener cantPost' });
          return;
        }

        const cantPost = results[0].cantPosts;
        let rango = '';

        if (cantPost > 50) {
          rango = 'Diamante';
        } else if (cantPost > 25) {
          rango = 'Oro';
        } else if (cantPost > 10) {
          rango = 'Plata';
        } else {
          rango = 'Bronce';
        }

        if (rango) {
          const queryUpdateRango = `
            UPDATE usuarioAutenticado SET rol = ? WHERE username = ?;
          `;

          connection.query(queryUpdateRango, [rango, dueño], (err, result) => {
            if (err) {
              console.error('Error updating rango:', err);
              res.status(500).json({ success: false, message: 'Error al actualizar rango' });
              return;
            }

            if (result.affectedRows === 0) {
              // No se actualizaron filas, usuario no encontrado
              res.status(404).json({ success: false, message: 'Usuario no encontrado' });
              return;
            }

            // Si la actualización fue exitosa, obtener los detalles del usuario
            const queryGetUser = `
              SELECT username, rol, categoria1, categoria2, categoria3 FROM usuarioAutenticado WHERE username = ?;
            `;

            connection.query(queryGetUser, [dueño], (err, rows) => {
              if (err) {
                console.error('Error fetching updated user details:', err);
                res.status(500).json({ success: false, message: 'Error al obtener detalles del usuario actualizado' });
                return;
              }

              if (rows.length === 0) {
                res.status(404).json({ success: false, message: 'Usuario no encontrado después de la actualización' });
                return;
              }


            });
          });
        } else {
          res.status(200).json({ success: true, message: 'Post agregado y cantPost actualizado correctamente' });
        }
      });
    });
  });
};
