const connection = require('../models/db');

module.exports.actualizarContra = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    res.status(400).json({ error: 'Correo electrónico y nueva contraseña son requeridos' });
    return;
  }

  try {
    // Hashear la nueva contraseña antes de guardarla en la base de datos
   // const hashedPassword = await bcrypt.hash(newPassword, 10);

    const consulta = 'UPDATE usuarioAutenticado SET contra = ? WHERE email = ?';
    connection.query(consulta, [newPassword, email], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }

      if (result.affectedRows > 0) {
        res.json({ message: 'Contraseña actualizada con éxito' });
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
