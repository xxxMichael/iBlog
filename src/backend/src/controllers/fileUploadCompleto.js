// src/services/fileUploadService.js

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); // Asegúrate de tener instalado 'uuid' package

class FileUploadServiceCompleto {
    constructor() {
        this.miRegion = 'sa-east-1';
        this.bucket = 'iblog-archivos';
        this.s3 = new S3Client({
            region: this.miRegion,
            credentials: {
                accessKeyId: 'AKIAW3MECZWZXEYINFX7',
                secretAccessKey: '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',
            }
        });
    }
    getMulterUpload() {
        const storage = multer.memoryStorage(); // multer almacena el archivo en la memoria temporalmente

        const fileFilter = (req, file, cb) => {
            const allowedTypes = /zip|war/;
            const extension = file.originalname.split('.').pop().toLowerCase();

            if (allowedTypes.test(extension)) {
                cb(null, true);
            } else {
                cb(new Error('Solo se permiten archivos de tipo .zip y .war.'));
            }
        };

        return multer({
            storage: storage,
            fileFilter: fileFilter
        }).single('file');
    }

    async uploadFile(file) {
        const fileExtension = file.originalname.split('.').pop(); // Obtiene la extensión del archivo
        const uniqueName = `${Date.now()}-${uuidv4()}.${fileExtension}`; // Crea un nombre único usando la fecha y un UUID
        const carpetaInternaBucket = `archivos/${uniqueName}`; // Forma la ruta completa en el bucket
        const urlDocument = `https://${this.bucket}.s3.${this.miRegion}.amazonaws.com/${carpetaInternaBucket}`;

        const params = {
            Bucket: this.bucket,
            Key: carpetaInternaBucket,
            Body: file.buffer, // Aquí es donde se añade el contenido del archivo
            ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(params);

        await this.s3.send(command);

        return urlDocument;
    }
}

module.exports = FileUploadServiceCompleto;
