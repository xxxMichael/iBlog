const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

class S3Service {
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

  async eliminarArchivo(fileName) {
    const bucket = "iblog-archivos";
    const carpetaInternaBucket = `imagenes/${fileName}`;
    try {
      let paramsBorrar = {
        Bucket: bucket,
        Key: carpetaInternaBucket
      }
      const commandoBorrar = new DeleteObjectCommand(paramsBorrar);

      const response = await this.s3.send(commandoBorrar);
      console.log(response);

      return { mensaje: "Archivo borrado correctamente" };
    } catch (error) {
      console.error("Error al eliminar archivo:", error);
      throw error; // Puedes manejar el error de otra manera según tus necesidades
    }
  }
  async eliminarArchivoCompleto(fileName) {
    const bucket = "iblog-archivos";
    const carpetaInternaBucket = `archivos/${fileName}`;
    try {
      let paramsBorrar = {
        Bucket: bucket,
        Key: carpetaInternaBucket
      }
      const commandoBorrar = new DeleteObjectCommand(paramsBorrar);

      const response = await this.s3.send(commandoBorrar);
      console.log(response);

      return { mensaje: "Archivo borrado correctamente" };
    } catch (error) {
      console.error("Error al eliminar archivo:", error);
      throw error; // Puedes manejar el error de otra manera según tus necesidades
    }
  }
}

module.exports = S3Service;
