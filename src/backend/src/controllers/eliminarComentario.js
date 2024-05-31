const connection = require('../models/db');

module.exports.eliminarComentario = (req, res) => {
    const { idComentario } = req.query;

    if (!idComentario) {
        return res.status(400).json({ error: 'El ID del comentario es requerido' });
    }

    const query = `
    DELETE FROM comentarios
    WHERE idComentario = ?;
    `;

    connection.query(query, [idComentario], (error, results) => {
        if (error) {
            console.error('Error al eliminar el comentario:', error);
            return res.status(500).json({ error: 'Error al eliminar el comentario' });
        }

        res.status(200).json({ message: 'Comentario eliminado exitosamente' });
    });
};
