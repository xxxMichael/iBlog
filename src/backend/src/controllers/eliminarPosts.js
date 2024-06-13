const connection = require('../models/db');

module.exports.eliminarPost = (req, res) => {
    const { id } = req.body;
    console.log(id);

    const query = `
        DELETE posts, comentarios
        FROM posts
        JOIN comentarios ON posts.idPost = comentarios.idPost
        WHERE posts.idPost = ?;
    `;

    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al actualizar post:', err);
            res.status(500).json({ success: false, message: 'Error al Eliminar post' });
            return;
        }
        console.log('Post actualizado con exito:', result);
        res.status(200).json({ success: true, message: 'Post eliminado correctamente' });
    });
};