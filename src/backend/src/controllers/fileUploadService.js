// src/services/fileUploadService.js

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const sharp = require('sharp');

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
    return multer({ storage: storage }).single('file');
  }

  async uploadFile(file) {
    const carpetaInternaBucket = 'imagenes/imagenPost.jpg';
    const urlImagen = `https://${this.bucket}.s3.${this.miRegion}.amazonaws.com/${carpetaInternaBucket}`;

    const redimensionBuffer = await sharp(file.buffer)
      .resize({ width: '665px', height: '450px', fit: 'cover' })
      .toBuffer();

    const params = {
      Bucket: this.bucket,
      Key: carpetaInternaBucket,
      Body: redimensionBuffer,
      ContentType: 'image/jpg',
    };

    const command = new PutObjectCommand(params);

    await this.s3.send(command);

    return urlImagen;
  }
}

module.exports = FileUploadService;
