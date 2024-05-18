const connection = require('../models/db');

module.exports.registron = (req) => {
  const { email, username, password , nombre,apellido, pais, fechnac } = req.body;

    const query = `
    INSERT INTO usuarioAutenticado (nombre, apellido, username, email, contra, fechaRegistro, rol, fechaNac, pais)
    VALUES (?, ?, ?, ?, ?, CURRENT_DATE, 'Bronce', ?, ?)
  `;


  connection.query(query,  [nombre, apellido, username,email,password ], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return;
    }
    console.log('User inserted successfully:', result);
  });
};

