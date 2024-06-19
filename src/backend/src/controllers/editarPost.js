const connection = require('../models/db');

module.exports.editarPosts = (req, res) => {
    const { titulo, contenido, idCategoria1, idCategoria2, idCategoria3, urlImagen, id } = req.body;
    console.log(id);
    console.log(idCategoria1);
    console.log(idCategoria2);
    console.log(idCategoria3);

    const query = `
    Update posts set titulo=?, contenido=?, idCategoria1=?, idCategoria2=?, idCategoria3=?, urlImagen=? where idPost = ?;
    `;

    connection.query(query, [titulo, contenido, idCategoria1, idCategoria2, idCategoria3, urlImagen, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar post:', err);
            res.status(500).json({ success: false, message: 'Error al Insertar post' });
            return;
        }
        console.log('Post actualizado con exito:', result);
        res.status(200).json({ success: true, message: 'Post actualizado correctamente' });
    });
};