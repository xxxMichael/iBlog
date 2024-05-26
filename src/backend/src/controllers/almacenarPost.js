const connection = require('../models/db');

module.exports.almacenarPost = async (req, res) => {
    const { dueño, titulo, contenido, urlImagen, urlDocumento, idCategoria1,
        idCategoria2, idCategoria3, fechaPublicacion } = req.body;


    const postQuery = 'INSERT INTO posts (dueño, titulo, contenido, urlImagen, urlDocumento,idCategoria1,idCategoria2,idCategoria3,fechaPublicacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const postValues = [dueño || '', titulo || '', contenido || '', urlImagen || '', urlDocumento || '', idCategoria1
        || '', idCategoria2 || '', idCategoria3 || '', fechaPublicacion];

    try {
        connection.query(postQuery, postValues, (error) => {
            if (error) {
                console.error('Error inserting data into Persona MySQL:', error);
                return res.status(500).json({ message: 'Error al guardar POST' });
            }
            return res.status(201).json({ message: 'Post creado Exitosamente' });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Internal server error' });

    }

}