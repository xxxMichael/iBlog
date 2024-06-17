const connection = require('../models/db');

module.exports.registrarGmail = (req, res) => {
  const { email, username, password, nombre, apellido } = req.body;

  const query = `
    INSERT INTO usuarioAutenticado (nombre, apellido, username, email, contra, fechaRegistro, rol, fechaNac, pais, cantPosts)
    VALUES (?, ?, ?, ?, ?, CURRENT_DATE, 'Bronce', null, null, 0)
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
