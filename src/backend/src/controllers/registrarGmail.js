const connection = require('../models/db');

module.exports.registrarGmail = (data) => {
    const query = `
    INSERT INTO usuarioAutenticado (nombre, apellido, username, email, contra, fechaRegistro, rol, fechaNac, pais)
    VALUES (?, ?, ?, ?, ?, CURRENT_DATE, 'Bronce', ?, ?)
  `;
  const values = [
    data.nombre,
    data.apellido,
    data.username,
    data.email,
    data.password, // Asegúrate de almacenar una versión hasheada de la contraseña
    data.fechaNac || null, // Ajusta según tus necesidades si tienes la fecha de nacimiento
    data.pais || null // Ajusta según tus necesidades si tienes el país
  ];
  console.log(data.nombre,
    data.apellido,
    data.username,
    data.email,
    data.password);
  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return;
    }
    console.log('User inserted successfully:', result);
  });
};

