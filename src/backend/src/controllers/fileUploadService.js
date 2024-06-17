// src/services/fileUploadService.js

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid'); // Asegúrate de tener instalado 'uuid' package

class FileUploadService {
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
      fileFilter: fileFilter,
      limits: {
        fileSize: 2 * 1024 * 1024, // 2 MB limite de tamaño
      }
    }).single('file');
  }

  async uploadFile(file) {
    const fileExtension = file.originalname.split('.').pop(); // Obtiene la extensión del archivo
    const uniqueName = `${Date.now()}-${uuidv4()}.${fileExtension}`; // Crea un nombre único usando la fecha y un UUID
    const carpetaInternaBucket = `imagenes/${uniqueName}`; // Forma la ruta completa en el bucket
    const urlImagen = `https://${this.bucket}.s3.${this.miRegion}.amazonaws.com/${carpetaInternaBucket}`;

    const redimensionBuffer = await sharp(file.buffer)
      .resize({ width: 560, height: 450, fit: 'inside' }) // Utiliza solo el ancho y sin agrandar imágenes pequeñas
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
        cb(new Error('Solo se permiten archivos de tipo zip y war.'));
      }
    };

    return multer({
      storage: storage,
      fileFilter: fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB limite de tamaño
      }
    }).single('file');
  }

  async uploadFileCompleto(file) {
    const fileExtension = file.originalname.split('.').pop(); // Obtiene la extensión del archivo
    const uniqueName = `${Date.now()}-${uuidv4()}.${fileExtension}`; // Crea un nombre único usando la fecha y un UUID
    const carpetaInternaBucket = `archivos/${uniqueName}`; // Forma la ruta completa en el bucket
    const urlDocumento = `https://${this.bucket}.s3.${this.miRegion}.amazonaws.com/${carpetaInternaBucket}`;

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

module.exports = FileUploadService;
