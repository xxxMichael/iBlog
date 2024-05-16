const express = require('express');
const router = express.Router();
const { ping } = require('../controllers/pinController');
const {login}= require('../controllers/loginController');
const {loginwGmail}= require('../controllers/loginwGmail');
const {checkUsername}= require('../controllers/checkUsername');

router.get('/ping', ping);

router.post('/loginwGmail', loginwGmail);
router.post('/checkUsername', checkUsername);
router.post('/verfRegistro', verfRegistro);

router.post('/login', login);
module.exports= router;