const connection = require('../models/db');

module.exports.consultarComentarios = (req, res) => {
    const { idPost } = req.query;

    if (!idPost) {
        return res.status(400).json({ error: 'El ID del post es requerido' });
    }

    const query = `
    SELECT idComentario, idPost, contenido, autor, fechaComentario
    FROM comentarios
    WHERE idPost = ?;
    `;

    connection.query(query, [idPost], (error, results) => {
        if (error) {
            console.error('Error al obtener los comentarios:', error);
            return res.status(500).json({ error: 'Error al obtener los comentarios' });
        }

        res.status(200).json(results);
    });
};
