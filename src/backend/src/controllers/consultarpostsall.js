const connection = require('../models/db');

module.exports.consultarpostsall = (req, res) => {

    const query = `
        SELECT * FROM posts
        ORDER BY fechaPublicacion DESC
    `;

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los primeros 20 posts:', error);
            return res.status(500).json({ error: 'Error al obtener los primeros 20 posts' });
        }

        res.status(200).json(results);
    });
};
