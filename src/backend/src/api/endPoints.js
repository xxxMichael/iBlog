const express = require('express');
const router = express.Router();
//const fileUpload = require('express-fileupload');
const { ping } = require('../controllers/pinController');
const { login } = require('../controllers/loginController');
const { loginwGmail } = require('../controllers/loginwGmail');
const { checkUsername } = require('../controllers/checkUsername');
const { verfRegistro } = require('../controllers/verfRegistro');
const { registrarGmail } = require('../controllers/registrarGmail');
const { registroNormal } = require('../controllers/registroNormal');
const { verificarUser } = require('../controllers/verificarUser');
const { checkEmail } = require('../controllers/checkEmail');
const { emailController } = require('../controllers/emailController');
const { actualizarContra } = require('../controllers/actualizarContra');
const { consultarCatego } = require('../controllers/consultarCatego');
const { consultaPostCat } = require('../controllers/consultaPostCat');
const { almacenarPost } = require('../controllers/almacenarPost');
const { consultarComentarios } = require('../controllers/consultarComentarios');
const { agregarComentario } = require('../controllers/agregarComentario');
const { eliminarComentario } = require('../controllers/eliminarComentario');
const { guardarIntereses } = require('../controllers/guardarIntereses');
const { consultarpostsall } = require('../controllers/consultarpostsall');
const { BuscarPostsNombre } = require('../controllers/BuscarPostsNombre');
const { consultarUser } = require('../controllers/consultarUser');
const { guardarCambios } = require('../controllers/guardarCambios');
const { consultarpostsUsuario } = require('../controllers/obtPostUsuario');
const { editarPosts } = require('../controllers/editarPost');
const FileUploadService = require('../controllers/fileUploadService');
const FileUploadServiceCompleto = require('../controllers/fileUploadCompleto');
const ActualizarImagen = require('../controllers/actualizarImagen');
const S3Service = require("../controllers/eliminarImagen");
const { eliminarPost } = require('../controllers/eliminarPosts');
const { infUser } = require('../controllers/infUser');
const {interesesUsuario } = require('../controllers/interesesUsuario ');
const fileUploadService = new FileUploadService();
const fileUploadServiceCompleto = new FileUploadServiceCompleto();
const actualizarImagen = new ActualizarImagen();
const s3Service = new S3Service();



//router.use(fileUpload());
router.post('/guardarIntereses', guardarIntereses);
router.post('/guardarCambios', guardarCambios);
router.get('/consultarpostsUsuario', consultarpostsUsuario);
router.post('/infUser', infUser);
router.post('/interesesUsuario', interesesUsuario);
router.get('/consultarpostsall', consultarpostsall);
router.get('/BuscarPostsNombre', BuscarPostsNombre);
router.get('/ping', ping);
router.post('/consultaPostCat', consultaPostCat);
router.get('/consultarComentarios', consultarComentarios);
router.post('/agregarComentario', agregarComentario);
router.delete('/eliminarComentario', eliminarComentario);
router.post('/registrarGmail', registrarGmail);
router.post('/registroNormal', registroNormal);
router.post('/checkEmail', checkEmail);
router.post('/emailController', emailController);
router.post('/actualizarContra', actualizarContra);
router.get('/consultarCatego', consultarCatego);
router.post('/loginwGmail', loginwGmail);
router.post('/checkUsername', checkUsername);
router.post('/verfRegistro', verfRegistro);
router.post('/verificarUser', verificarUser);
router.post('/almacenarPost', almacenarPost);
router.get('/consultarUser', consultarUser);
router.post('/actualizarPost', editarPosts);
router.post('/login', login);
router.post('/eliminarPost', eliminarPost);

router.post('/subida', (req, res) => {
  const upload = fileUploadService.getMulterUpload();

  upload(req, res, async (err) => {
    if (err) {
      console.log("error desde upload: ", err);
      return res.status(400).json({ mensaje: "error desde upload" });
    }

    try {
      const urlImagen = await fileUploadService.uploadFile(req.file);
      return res.status(200).json({ urlImagen: urlImagen, mensaje: "archivo subido correctamente" });
    } catch (error) {
      console.log("error al ejecutar send, ", error);
      return res.status(400).json({ mensaje: "error al ejecutar comando, por favor intentar nuevamente" });
    }
  });
});

router.post('/subidaA', (req, res) => {
  const upload = fileUploadServiceCompleto.getMulterUpload();

  upload(req, res, async (err) => {
    if (err) {
      console.log("error desde upload: ", err);
      return res.status(400).json({ mensaje: "error desde upload" });
    }

    try {
      const urlDocumento = await fileUploadServiceCompleto.uploadFile(req.file);
      return res.status(200).json({ urlDocumento: urlDocumento, mensaje: "archivo subido correctamente" });
    } catch (error) {
      console.log("error al ejecutar send, ", error);
      return res.status(400).json({ mensaje: "error al ejecutar comando, por favor intentar nuevamente" });
    }
  });
});


router.post('/actualizarI', (req, res) => {
  const upload = actualizarImagen.getMulterUpload();

  upload(req, res, async (err) => {
    if (err) {
      console.log("error desde upload: ", err);
      return res.status(400).json({ mensaje: "error desde upload" });
    }

    try {
      const fileName = req.body.fileName; // Obtener el nombre del archivo desde el cuerpo de la solicitud
      const urlImagen = await actualizarImagen.uploadFile(req.file, fileName); // Pasar fileName como argumento a uploadFile
      return res.status(200).json({ urlImagen: urlImagen, mensaje: "archivo actualizado correctamente" });
    } catch (error) {
      console.log("error al ejecutar send, ", error);
      return res.status(400).json({ mensaje: "error al ejecutar comando, por favor intentar nuevamente" });
    }
  });
});

router.post("/eliminarI", async function (req, res) {
  try {
    const { nombreI } = req.body;
    console.log('Nombre del archivo recibido:', nombreI);

    if (!nombreI) {
      return res.status(400).json({ error: "Nombre de archivo no proporcionado" });
    }
    const resultado = await s3Service.eliminarArchivo(nombreI);

    return res.status(200).json(resultado);
  } catch (error) {
    //console.log("Error en el endpoint de eliminación:", error);
    return res.status(500).json({ error: "Error en EndPoints" });
  }
});

module.exports = router;