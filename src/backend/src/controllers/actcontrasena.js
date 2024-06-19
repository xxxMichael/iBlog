const connection = require('../models/db');

module.exports.actcontrasena = (req, res) => {
    const { username, nuevaContra } = req.body;

    if (!username || !nuevaContra) {
        return res.status(400).json({ error: 'El nombre de usuario y la nueva contraseña son requeridos' });
    }

    const query = `
    UPDATE usuarioautenticado
    SET contra = ?
    WHERE username = ?;
    `;

    connection.query(query, [nuevaContra, username], (error, results) => {
        if (error) {
            console.error('Error al actualizar la contraseña:', error);
            return res.status(500).json({ error: 'Error al actualizar la contraseña' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: `No se encontró ningún usuario con el nombre de usuario '${username}'` });
        }

        res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    });
};
