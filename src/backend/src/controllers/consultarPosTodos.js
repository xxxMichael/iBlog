const connection = require('../models/db');

module.exports.consultaPostCat = (req, res) => {

    const query = `
        SELECT * from posts
    `;

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los posts:', error);
            return res.status(500).json({ error: 'Error al obtener los posts' });
        }

        res.status(200).json(results);
    });
};
