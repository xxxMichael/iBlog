const connection = require('../models/db');

module.exports.guardarCambios = async (req, res) => {
  const { modalType, data, username } = req.body;

  try {
    let query = '';
    let queryParams = [];

    if (modalType === 'name') {
      const { nombre, apellido } = data;
      query = `
        UPDATE usuarioAutenticado
        SET nombre = ?, apellido = ?
        WHERE username = ?
      `;
      queryParams = [nombre, apellido, username];
    } else if (modalType === 'dateOfBirth') {
      const { fechaNac } = data;
      query = `
        UPDATE usuarioAutenticado
        SET fechaNac = ?
        WHERE username = ?
      `;
      queryParams = [fechaNac, username];
    } else if (modalType === 'country') {
      const { pais } = data;
      query = `
        UPDATE usuarioAutenticado
        SET pais = ?
        WHERE username = ?
      `;
      queryParams = [pais, username];
    } else if (modalType === 'password') {
      const { contra, confirmPassword } = data;
       query = `
    UPDATE usuarioautenticado
    SET contra = ?
    WHERE username = ?;
    `;
      queryParams = [contra, confirmPassword, username];
    } else {
      throw new Error('Tipo de modal no soportado.');
    }

    connection.query(query, queryParams, (err, result) => {
      if (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ success: false, message: 'Error updating user' });
        return;
      }
      console.log('User updated successfully:', result);
      res.status(200).json({ success: true, message: 'User updated successfully.' });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
