const connection = require('../models/db');

module.exports.consultarpostsUsuario = (req, res) => {
    const { usuarioP } = req.query;
    const query = `
        SELECT * FROM posts WHERE dueño = ?;
    `;
    connection.query(query, [usuarioP], (error, results) => {
        if (error) {
            console.error('Error al obtener los posts:', error);
            return res.status(500).json({ error: 'Error al obtener los posts' });
        }
        res.status(200).json(results);
    });
};
