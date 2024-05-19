const connection = require('../models/db');

module.exports.registroNormal = (req, res) => {
  const { email, username, password, nombre, apellido, pais, fechaNac } = req.body;

  const query = `
    INSERT INTO usuarionoAutenticado (nombre, apellido, username, email, contra, fechaRegistro, rol, fechaNac, pais)
    VALUES (?, ?, ?, ?, ?, CURRENT_DATE, 'Bronce', ?, ?)
  `;

  connection.query(query, [nombre, apellido, username, email, password, fechaNac, pais], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      res.status(500).json({ success: false, message: 'Error inserting user' });
      return;
    }
    console.log('User inserted successfully:', result);
    res.status(200).json({ success: true, message: 'User inserted successfully. Please log in.' });
  });
};
