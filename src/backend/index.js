const express = require('express');
const app = express();
const port = 3000;
const routes = require('./src/api/endPoints');
const cors = require('cors');
const { S3Client, DeleteObjectCommand, PutObjectCommand} = require('@aws-sdk/client-s3'); // REQUIRE aws
const multer = require('multer');
const sharp = require('sharp');

app.use(express.json()); // interpreta el json
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Permitir solicitudes desde cualquier origen
app.use('/', routes);

const miRegion = 'sa-east-1';
let s3 = new S3Client({
  region: miRegion,
  credentials: {
    accessKeyId: 'AKIAW3MECZWZXEYINFX7',
    secretAccessKey: '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',
  }
});
app.post("/subida", function(req, res){
    let bucket = "iblog-archivos";
    let carpetaInternaBucket = "imagenes/imagenPost.jpg";
    let urlImagen = "https://" + bucket + ".s3." + miRegion + ".amazonaws.com/" + carpetaInternaBucket; // ruta de imagen
    // Multer
    const storage = multer.memoryStorage(); // multer almacena el archivo de forma temporal.
    const upload = multer({storage: storage});
  
    //FUNCIÓN DE SUBIDA S3
    upload.single('file')(req, res, async(err) => {
      if(err) console.log("error desde upload: ", err);
      else{
        // Redimensionamos la imagen antes de subirla a s3
        const redimensionBuffer = await sharp(req.file.buffer)
        .resize({width: 600, height: 600, fit: 'cover'})
        .toBuffer();
  
        const params = {
          Bucket: bucket,
          Key: carpetaInternaBucket,
          Body: redimensionBuffer,
          ContentType: 'image/jpg',
        }
  
        // SUBIR LA IMAGEN
        const command = new PutObjectCommand(params);
        await s3.send(command)
        .then(response => {
          return res.status(200).json({urlImagen: urlImagen, mensaje: "archivo subido correctamente"});
        })
        .catch((error) =>{
          console.log("error al ejecutar send, ", error);
          return res.status(400).json({mensaje: "error al ejecutar comando, por favor intentar nuevamente"});
        });
      }
    });
  });



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});