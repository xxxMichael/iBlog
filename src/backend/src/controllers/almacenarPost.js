const connection = require('../models/db');
const { uploadImageToS3 } = require('../controllers/s3Uploader');  // Ajusta la ruta según la ubicación de tu archivo s3Uploader

module.exports.almacenarPost = async (req, res) => {
    const { dueño, titulo, contenido, urlDocumento, idCategoria1, idCategoria2, idCategoria3, fechaPublicacion } = req.body;
    let urlImagen = '';

    if (req.files && req.files.image) {
        const imageFile = req.files.image;
        try {
            urlImagen = await uploadImageToS3(imageFile.data, imageFile.name);
        } catch (error) {
            return res.status(500).json({ message: 'Error al subir la imagen' });
        }
    }

    const postQuery = 'INSERT INTO posts (dueño, titulo, contenido, urlImagen, urlDocumento, idCategoria1, idCategoria2, idCategoria3, fechaPublicacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const postValues = [dueño || '', titulo || '', contenido || '', urlImagen || '', urlDocumento || '', idCategoria1 || '', idCategoria2 || '', idCategoria3 || '', fechaPublicacion];

    try {
        connection.query(postQuery, postValues, (error) => {
            if (error) {
                console.error('Error inserting data into Persona MySQL:', error);
                return res.status(500).json({ message: 'Error al guardar POST' });
            }
            return res.status(201).json({ message: 'Post creado Exitosamente' });
        });
    } catch (error) {
        console.log('ERROR GENERAL');
        return res.status(500).send({ message: 'Internal server error' });
    }
};
