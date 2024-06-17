const connection = require('../models/db');

module.exports.consultaPostCat = (req, res) => {
    const { categoriaId } = req.body; // Ahora se espera que categoriaId esté en el cuerpo de la solicitud POST

    if (!categoriaId) {
        return res.status(400).json({ error: 'El ID de la categoría es requerido' });
    }

    if (categoriaId === '*' || (Array.isArray(categoriaId) && categoriaId.includes('*'))) {
        const query = `
       SELECT p.idPost, p.dueño, p.titulo, p.contenido, p.fechaPublicacion, p.urlImagen, p.urlDocumento
FROM posts p
ORDER BY p.fechaPublicacion DESC
LIMIT 35;
        `;
        connection.query(query, (error, results) => {
            if (error) {
                console.error('Error al obtener los posts:', error);
                return res.status(500).json({ error: 'Error al obtener los posts' });
            }
            res.status(200).json(results);
        });
    } else if (Array.isArray(categoriaId)) {
        const placeholders = categoriaId.map(() => '(p.idCategoria1 = ? OR p.idCategoria2 = ? OR p.idCategoria3 = ?)').join(' OR ');
        const query = `
        SELECT p.idPost, p.dueño, p.titulo, p.contenido, p.fechaPublicacion, p.urlImagen, p.urlDocumento
        FROM posts p
        WHERE ${placeholders};
        `;
        const queryParams = [];
        categoriaId.forEach(id => {
            queryParams.push(id, id, id);
        });

        connection.query(query, queryParams, (error, results) => {
            if (error) {
                console.error('Error al obtener los posts:', error);
                return res.status(500).json({ error: 'Error al obtener los posts' });
            }
            res.status(200).json(results);
        });
    } else {
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
    }
};
