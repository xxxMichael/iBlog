const connection = require('../models/db');

module.exports.obtenerUrlImagenPerfil = (req, res) => {
    const { dueño } = req.query;
    const query = `
    SELECT urlImagenPerfil FROM usuarioAutenticado WHERE username = ?
    `;
    connection.query(query, [dueño], (error, results) => {
        if (error) {
            console.error('Error al obtener la URL de imagen de perfil:', error);
            return res.status(500).json({ error: 'Error al obtener la URL de imagen de perfil' });
        }
        if (results.length > 0) {
            res.status(200).json({ urlImagenPerfil: results[0].urlImagenPerfil });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    });
};

