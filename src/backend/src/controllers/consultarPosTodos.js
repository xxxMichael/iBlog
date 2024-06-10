const connection = require('../models/db');

module.exports.consultaPostCat = (req, res) => {
    const { categoria1, categoria2, categoria3 } = req.body;

    // Consulta SQL para obtener los posts
    const query = `
        SELECT * 
        FROM posts
        WHERE categoria1 = ? OR categoria2 = ? OR categoria3 = ?
        GROUP BY idPost
        ORDER BY fechaPublicacion DESC
    `;

    // Ejecutar la consulta SQL
    connection.query(query, [categoria1, categoria2, categoria3], (error, results) => {
        if (error) {
            console.error('Error al obtener los posts:', error);
            return res.status(500).json({ error: 'Error al obtener los posts' });
        }

        res.status(200).json(results);
    });
};
