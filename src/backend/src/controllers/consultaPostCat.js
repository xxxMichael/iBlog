const connection = require('../models/db');

module.exports.consultaPostCat = (req, res) => {
    const { categoriaId } = req.query;

    if (!categoriaId) {
        return res.status(400).json({ error: 'El ID de la categoría es requerido' });
    }

    const query = `
    SELECT p.idPost, p.dueño, p.titulo, p.contenido, p.fechaPublicacion, p.urlImagen, p.urlDocumento
    FROM posts p
    WHERE p.idCategoria1 = ? OR p.idCategoria2 = ? OR p.idCategoria3 = ?;
    `;

    connection.query(query, [categoriaId, categoriaId, categoriaId], (error, results) => {
        if (error) {
            console.error('Error al obtener los posts:', error);
            return res.status(500).json({ error: 'Error al obtener los posts' });
        }

        res.status(200).json(results);
    });
};
