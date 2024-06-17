const connection = require('../models/db');
const { generarCodigoVerificacion, sendEmail } = require('./enviaremail');

module.exports.registroNormal = async (req, res) => {
  const { email, username, password, nombre, apellido, pais, fechaNac } = req.body;

  try {
    const codigoVerificacion = await generarCodigoVerificacion();
    if (!codigoVerificacion) {
      throw new Error('No se pudo generar el código de verificación.');
    }

    const enviado = await sendEmail(codigoVerificacion, email);
    if (!enviado) {
      throw new Error('No se pudo enviar el correo de verificación.');
    }

    // Calcula la fecha de expiración sumando 30 minutos a la fecha y hora actual
    const fechaExp = new Date(Date.now() + 30 * 60000); // 30 minutos en milisegundos
    const fechaExpFormatted = fechaExp.toISOString().slice(0, 19).replace('T', ' ');

    const query = `
      INSERT INTO usuarionoAutenticado (nombre, apellido, username, email, contra, fechaRegistro, rol, fechaNac, pais, codigoConf, fechaExp, cantPosts)
      VALUES (?, ?, ?, ?, ?, CURRENT_DATE, 'Bronce', ?, ?, ?, ?, 0)
    `;

    connection.query(query, [nombre, apellido, username, email, password, fechaNac, pais, codigoVerificacion, fechaExpFormatted], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        res.status(500).json({ success: false, message: 'Error inserting user' });
        return;
      }
      console.log('User inserted successfully:', result);
      res.status(200).json({ success: true, message: 'User inserted successfully. Please log in.' });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
