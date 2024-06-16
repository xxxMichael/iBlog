const connection = require('../models/db');

module.exports.consultarPostUsername = (req, res) => {
    const { username } = req.query; // Se espera que el username esté en los parámetros de la URL

    if (!username) {
        return res.status(400).json({ error: 'El nombre de usuario es requerido' });
    }

    const query = `
    SELECT p.idPost, p.dueño, p.titulo, p.contenido, p.fechaPublicacion, p.urlImagen, p.urlDocumento
    FROM posts p
    WHERE p.dueño = ?;
    `;

    connection.query(query, [username], (error, results) => {
        if (error) {
            console.error('Error al obtener los posts del usuario:', error);
            return res.status(500).json({ error: 'Error al obtener los posts del usuario' });
        }
        res.status(200).json(results);
    });
};
