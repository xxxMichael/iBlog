const express = require('express');
const router = express.Router();
const { ping } = require('../controllers/pinController');
const {login}= require('../controllers/loginController');
const {loginwGmail}= require('../controllers/loginwGmail');
const {checkUsername}= require('../controllers/checkUsername');
const {verfRegistro}= require('../controllers/verfRegistro');
const {registrarGmail}= require('../controllers/registrarGmail');
const {registroNormal}= require('../controllers/registroNormal');
const {verificarUser}= require('../controllers/verificarUser');
const {checkEmail}= require('../controllers/checkEmail');
const {emailController}= require('../controllers/emailController');
const {actualizarContra}= require('../controllers/actualizarContra');
const {consultarCatego}= require('../controllers/consultarCatego');

router.get('/ping', ping);
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

router.post('/login', login);
module.exports= router;