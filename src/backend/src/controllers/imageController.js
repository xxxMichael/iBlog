const multer = require('multer');
const path = require('path');

// Configuración de multer para el almacenamiento de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../imagenesPublicaciones'); // Carpeta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        // Generar un nombre de archivo único
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Controlador para subir una imagen
const subirImagen = upload.single('image');

module.exports = { subirImagen };
