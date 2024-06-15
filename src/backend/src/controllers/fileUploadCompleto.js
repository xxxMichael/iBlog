// src/services/fileUploadService.js

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

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
    const storage = multer.memoryStorage(); // Almacenamiento en memoria para procesar el archivo

    const fileFilter = (req, file, cb) => {
      const allowedTypes = /zip|war/;
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedTypes.test(ext)) {
        cb(null, true);
      } else {
        cb(new Error('Solo se permiten archivos ZIP o WAR.'));
      }
    };

    return multer({
      storage: storage,
      fileFilter: fileFilter
    }).single('file');
  }

  async uploadFile(file) {
    const fileExtension = path.extname(file.originalname); // Obtiene la extensión del archivo
    const uniqueName = `${Date.now()}-${uuidv4()}${fileExtension}`; // Nombre único usando fecha y UUID
    const folderPathInBucket = `archivos/${uniqueName}`; // Ruta completa en el bucket
    const fileUrl = `https://${this.bucket}.s3.${this.miRegion}.amazonaws.com/${folderPathInBucket}`;

    const params = {
      Bucket: this.bucket,
      Key: folderPathInBucket,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);

    try {
      await this.s3.send(command);
      return fileUrl;
    } catch (err) {
      console.error('Error al subir el archivo a S3:', err);
      throw err;
    }
  }
}

module.exports = FileUploadServiceCompleto;

