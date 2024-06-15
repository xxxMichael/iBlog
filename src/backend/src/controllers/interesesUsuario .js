const connection = require('../models/db');

module.exports.interesesUsuario = (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'El nombre de usuario es requerido' });
    }

    const query = `
        SELECT categoria1, categoria2, categoria3
        FROM usuarioAutenticado
        WHERE username = ?;
    `;

    connection.query(query, [username], (error, results) => {
        if (error) {
            console.error('Error al obtener los intereses del usuario:', error);
            return res.status(500).json({ error: 'Error al obtener los intereses del usuario' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado o no tiene intereses definidos' });
        }

        const { categoria1, categoria2, categoria3 } = results[0];

        // Obtener los nombres de las categorías
        const categoriasIds = [categoria1, categoria2, categoria3].filter(id => id !== null);

        const categoriasQuery = `
            SELECT id, nombre
            FROM categorias
            WHERE id IN (?);
        `;

        connection.query(categoriasQuery, [categoriasIds], (error, categoriasResults) => {
            if (error) {
                console.error('Error al obtener los nombres de las categorías:', error);
                return res.status(500).json({ error: 'Error al obtener los nombres de las categorías' });
            }

            // Mapear los resultados a un objeto con id y nombre de categoría
            const categorias = categoriasResults.map(categoria => ({
                id: categoria.id,
                nombre: categoria.nombre
            }));

            res.status(200).json(categorias);
        });
    });
};
