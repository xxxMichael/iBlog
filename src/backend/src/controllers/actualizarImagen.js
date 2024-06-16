const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid'); // Asegúrate de tener instalado 'uuid' package

class ActualizarImagen {
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
        const storage = multer.memoryStorage(); // multer almacena el archivo de forma temporal.

        const fileFilter = (req, file, cb) => {
            const allowedTypes = /jpeg|jpg|png/;
            const extension = file.mimetype.split('/')[1];

            if (allowedTypes.test(extension)) {
                cb(null, true);
            } else {
                cb(new Error('Solo se permiten imágenes de tipo jpg, jpeg y png.'));
            }
        };

        return multer({
            storage: storage,
            fileFilter: fileFilter
        }).single('file');
    }

    async uploadFile(file, fileName) {
        const carpetaInternaBucket = `imagenes/${fileName}`; // Usar fileName recibido como parte de la ruta
        let urlImagen = `https://${this.bucket}.s3.${this.miRegion}.amazonaws.com/${carpetaInternaBucket}`;

        const redimensionBuffer = await sharp(file.buffer)
            .resize({ width: 560, height: 450, fit: 'inside' })
            .toBuffer();

        const params = {
            Bucket: this.bucket,
            Key: carpetaInternaBucket,
            Body: redimensionBuffer,
            ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(params);

        await this.s3.send(command);

        return urlImagen;
    }

    getMulterUploadCompleto() {
        const storage = multer.memoryStorage(); // multer almacena el archivo de forma temporal.

        const fileFilter = (req, file, cb) => {
            const allowedTypes = /zip|war/;
            const extension = file.mimetype.split('/')[1];

            if (allowedTypes.test(extension)) {
                cb(null, true);
            } else {
                cb(new Error('Solo se permiten archivos zip y war'));
            }
        };

        return multer({
            storage: storage,
            fileFilter: fileFilter
        }).single('file');
    }

    async uploadFileCompleto(file, fileName) {
        const carpetaInternaBucket = `archivos/${fileName}`; // Usar fileName recibido como parte de la ruta
        let urlDocumento = `https://${this.bucket}.s3.${this.miRegion}.amazonaws.com/${carpetaInternaBucket}`;

        const params = {
            Bucket: this.bucket,
            Key: carpetaInternaBucket,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(params);

        await this.s3.send(command);

        return urlDocumento;
    }

}

module.exports = ActualizarImagen;
