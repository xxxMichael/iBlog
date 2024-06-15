const connection = require('../models/db');

module.exports.guardarIntereses = (req, res) => {
    const { categorias, username } = req.body; // Ahora recibimos el array de categorías seleccionadas y el username

    // Verificamos si se han seleccionado exactamente 3 categorías
    if (!Array.isArray(categorias) || categorias.length !== 3) {
        return res.status(400).json({ error: 'Se requieren exactamente 3 categorías seleccionadas' +categorias+ username });
    }

    // Verificamos si se ha proporcionado el username
    if (!username) {
        return res.status(400).json({ error: 'Se requiere el username' });
    }

    // Realizamos el UPDATE en la tabla usuarioAutenticado
    const query = `
        UPDATE usuarioAutenticado 
        SET 
            categoria1 = ?,
            categoria2 = ?,
            categoria3 = ?
        WHERE username = ?;
    `;

    // Agregamos el username al final del array de categorías
    const queryValues = [...categorias, username];

    connection.query(query, queryValues, (error, results) => {
        if (error) {
            console.error('Error al actualizar las categorías:', error);
            return res.status(500).json({ error: 'Error al actualizar las categorías' });
        }

        res.status(200).json({ message: 'Categorías actualizadas exitosamente' });
    });
};
