const connection = require('../models/db');

module.exports.eliminarPost = (req, res) => {
    const { id, dueño } = req.body;
    console.log(id);
    console.log(dueño);

    const queryDelete = `
        DELETE posts, comentarios
        FROM posts
        LEFT JOIN comentarios ON posts.idPost = comentarios.idPost
        WHERE posts.idPost = ?;
    `;

    connection.query(queryDelete, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar post:', err);
            res.status(500).json({ success: false, message: 'Error al Eliminar post' });
            return;
        }

        console.log('Post y comentarios eliminados con éxito:', result);

        // Update cantPost
        const queryUpdate = `
        UPDATE usuarioAutenticado SET cantPost = cantPost - 1 WHERE username = ?;
        `;

        connection.query(queryUpdate, [dueño], (err, result) => {
            if (err) {
                console.error('Error al actualizar cantPost:', err);
                res.status(500).json({ success: false, message: 'Error al actualizar cantPost' });
                return;
            }

            console.log('cantPost actualizado con éxito:', result);
            res.status(200).json({ success: true, message: 'Post eliminado y cantPost actualizado correctamente' });
        });
    });
};
