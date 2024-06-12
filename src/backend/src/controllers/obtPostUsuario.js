const connection = require('../models/db');

module.exports.consultarpostsUsuario = (req, res) => {
    const { usuarioP } = req.query;
    const query = `
        SELECT p.idPost, p.titulo, p.contenido, p.urlImagen,
        c1.nombre AS categoria1,
        c2.nombre AS categoria2,
        c3.nombre AS categoria3,
        c1.id AS idcategoria1,
        c2.id AS idcategoria2,
        c3.id AS idcategoria3
        FROM posts p
        LEFT JOIN categorias c1 ON p.idCategoria1 = c1.id
        LEFT JOIN categorias c2 ON p.idCategoria2 = c2.id
        LEFT JOIN categorias c3 ON p.idCategoria3 = c3.id
        WHERE dueño=?;

    `;
    connection.query(query, [usuarioP], (error, results) => {
        if (error) {
            console.error('Error al obtener los posts:', error);
            return res.status(500).json({ error: 'Error al obtener los posts' });
        }
        res.status(200).json(results);
    });
};
