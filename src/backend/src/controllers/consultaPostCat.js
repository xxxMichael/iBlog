const connection = require('../models/db');

module.exports.consultaPostCat = (req, res) => {
    const { categoriaId } = req.query;

    if (!categoriaId) {
        return res.status(400).json({ error: 'El ID de la categoría es requerido' });
    }

    const query = `
        SELECT p.id, p.titulo, p.contenido 
        FROM posts p
        INNER JOIN categorias c ON p.categoria_id = c.id
        WHERE c.id = ?
    `;

    connection.query(query, [categoriaId], (error, results) => {
        if (error) {
            console.error('Error al obtener los posts:', error);
            return res.status(500).json({ error: 'Error al obtener los posts' });
        }

        res.status(200).json(results);
    });
};
