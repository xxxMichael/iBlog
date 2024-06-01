const connection = require('../models/db');

module.exports.agregarComentario = (req, res) => {
    const { idPost, contenido, autor } = req.body;

    if (!idPost || !contenido || !autor) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const query = `
    INSERT INTO comentarios (idPost, contenido, autor)
    VALUES (?, ?, ?);
    `;

    connection.query(query, [idPost, contenido, autor], (error, results) => {
        if (error) {
            console.error('Error al agregar el comentario:', error);
            return res.status(500).json({ error: 'Error al agregar el comentario' });
        }

        res.status(201).json({ message: 'Comentario agregado exitosamente' });
    });
};
