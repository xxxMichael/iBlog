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
            res.status(500).json({ success: false, message: 'Error al eliminar post' });
            return;
        }

        console.log('Post y comentarios eliminados con éxito:', result);

        // Update cantPost
        const queryUpdateCantPost = `
        UPDATE usuarioAutenticado SET cantPost = cantPost - 1 WHERE username = ?;
        `;

        connection.query(queryUpdateCantPost, [dueño], (err, result) => {
            if (err) {
                console.error('Error al actualizar cantPost:', err);
                res.status(500).json({ success: false, message: 'Error al actualizar cantPost' });
                return;
            }

            console.log('cantPost actualizado con éxito:', result);

            // Check the updated cantPost
            const querySelectCantPost = `
            SELECT cantPost FROM usuarioAutenticado WHERE username = ?
            `;

            connection.query(querySelectCantPost, [dueño], (err, results) => {
                if (err) {
                    console.error('Error al obtener cantPost:', err);
                    res.status(500).json({ success: false, message: 'Error al obtener cantPost' });
                    return;
                }

                const cantPost = results[0].cantPost;
                let rango = '';

                if (cantPost > 50) {
                    rango = 'Diamante';
                } else if (cantPost > 25) {
                    rango = 'Oro';
                } else if (cantPost > 10) {
                    rango = 'Plata';
                } else {
                    rango = 'Bronce'; // Assuming the default rank is Bronce for <= 10 posts
                }

                const queryUpdateRango = `
                UPDATE usuarioAutenticado SET rango = ? WHERE username = ?
                `;

                connection.query(queryUpdateRango, [rango, dueño], (err, result) => {
                    if (err) {
                        console.error('Error al actualizar rango:', err);
                        res.status(500).json({ success: false, message: 'Error al actualizar rango' });
                        return;
                    }

                    console.log('rango actualizado con éxito:', result);
                    res.status(200).json({ success: true, message: 'Post eliminado, cantPost y rango actualizados correctamente' });
                });
            });
        });
    });
};
