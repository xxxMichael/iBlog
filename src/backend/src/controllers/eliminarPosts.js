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

        // Update cantPosts
        const queryUpdateCantPost = `
        UPDATE usuarioAutenticado SET cantPosts = cantPosts - 1 WHERE username = ?;
        `;

        connection.query(queryUpdateCantPost, [dueño], (err, result) => {
            if (err) {
                console.error('Error al actualizar cantPosts:', err);
                res.status(500).json({ success: false, message: 'Error al actualizar cantPosts' });
                return;
            }

            console.log('cantPosts actualizado con éxito:', result);

            // Check the updated cantPosts
            const querySelectCantPost = `
            SELECT cantPosts FROM usuarioAutenticado WHERE username = ?
            `;

            connection.query(querySelectCantPost, [dueño], (err, results) => {
                if (err) {
                    console.error('Error al obtener cantPosts:', err);
                    res.status(500).json({ success: false, message: 'Error al obtener cantPosts' });
                    return;
                }

                const cantPosts = results[0].cantPosts;
                let rango = '';

                if (cantPosts > 50) {
                    rango = 'Diamante';
                } else if (cantPosts > 25) {
                    rango = 'Oro';
                } else if (cantPosts > 10) {
                    rango = 'Plata';
                } else {
                    rango = 'Bronce'; // Assuming the default rank is Bronce for <= 10 posts
                }

                const queryUpdateRango = `
                UPDATE usuarioAutenticado SET rol = ? WHERE username = ?
                `;

                connection.query(queryUpdateRango, [rango, dueño], (err, result) => {
                    if (err) {
                        console.error('Error al actualizar rango:', err);
                        res.status(500).json({ success: false, message: 'Error al actualizar rango' });
                        return;
                    }

                    console.log('rango actualizado con éxito:', result);
                    res.status(200).json({ success: true, message: 'Post eliminado, cantPosts y rango actualizados correctamente' });
                });
            });
        });
    });
};
