const connection = require('../models/db');

module.exports.guardarIntereses = (req, res) => {
    const { categorias } = req.body; // Ahora recibimos un array de categorías seleccionadas

    // Verificamos si se han seleccionado exactamente 3 categorías
    if (!Array.isArray(categorias) || categorias.length !== 3) {
        return res.status(400).json({ error: 'Se requieren exactamente 3 categorías seleccionadas' });
    }

    // Realizamos el UPDATE en la tabla usuarioAutenticado
    const query = `
        UPDATE usuarioAutenticado 
        SET 
            categoria1 = ?,
            categoria2 = ?,
            categoria3 = ?
    `;

    connection.query(query, categorias, (error, results) => {
        if (error) {
            console.error('Error al actualizar las categorías:', error);
            return res.status(500).json({ error: 'Error al actualizar las categorías' });
        }

        res.status(200).json({ message: 'Categorías actualizadas exitosamente' });
    });
};
