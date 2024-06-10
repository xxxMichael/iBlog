const connection = require('../models/db');

module.exports.BuscarPostsNombre = (req, res) => {
    const nombre = req.query.nombre;

    const query = `
        SELECT * FROM posts
        WHERE titulo LIKE ? OR SOUNDEX(titulo) = SOUNDEX(?)
        ORDER BY fechaPublicacion DESC
        LIMIT 20
    `;

    connection.query(query, [`%${nombre}%`, nombre], (error, results) => {
        if (error) {
            console.error('Error al buscar posts por nombre:', error);
            return res.status(500).json({ error: 'Error al buscar posts por nombre' });
        }
        console.log(results);
        res.status(200).json(results);
    });
};
