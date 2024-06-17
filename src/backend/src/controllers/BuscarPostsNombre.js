const connection = require('../models/db');

module.exports.BuscarPostsNombre = (req, res) => {
    const nombre = req.query.nombre;

    const query = `
    SELECT 
        p.idPost, 
        p.dueño, 
        p.titulo, 
        p.contenido, 
        p.fechaPublicacion, 
        p.urlImagen, 
        p.urlDocumento,
        u.urlImagenPerfil  
    FROM 
        posts p
    LEFT JOIN 
        usuarioAutenticado u ON p.dueño = u.username  
    WHERE 
        p.idCategoria1 = ? OR p.idCategoria2 = ? OR p.idCategoria3 = ?
    ORDER BY 
        p.fechaPublicacion DESC
    LIMIT 
        35;
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
