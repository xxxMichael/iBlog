const connection = require('../models/db');

module.exports.consultarUser = (req, res) => {
  // Obtener el username del token en el encabezado de autorización
  const { username } = req.query;
  console.log(username);
  // Realizar la consulta SQL para seleccionar los datos del usuario con el username proporcionado
  const sql = `SELECT nombre,username,apellido,fechaRegistro,rol,fechaNac,pais,email,urlImagenPerfil FROM usuarioAutenticado WHERE username = ?`;

  connection.query(sql, [username], (error, results) => {
    if (error) {
      console.error('Error al consultar usuario:', error);
      console.log(error);
      return res.status(500).json({ error: 'Error al consultar usuario' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    console.log(results);

    res.status(200).json(results[0]);
  });
};
