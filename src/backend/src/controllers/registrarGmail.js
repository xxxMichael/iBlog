const connection = require('../models/db');

module.exports.registrarGmail = (req, res) => {
  const { email, username, password, nombre, apellido } = req.body;

  const query = `
    INSERT INTO usuarioAutenticado (nombre, apellido, username, email, contra, fechaRegistro, rol, fechaNac, pais, cantPosts,urlImagenPerfil)
    VALUES (?, ?, ?, ?, ?, CURRENT_DATE, 'Bronce', null, null, 0,"https://i.pinimg.com/564x/8e/12/91/8e129152d188f56e83f754d93de0c202.jpg")
  `;

  connection.query(query, [nombre, apellido, username, email, password], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      res.status(500).json({ success: false, message: 'Error inserting user' });
      return;
    }
    console.log('User inserted successfully:', result);
    res.status(200).json({ success: true, message: 'User inserted successfully. Please log in.' });
  });
};
