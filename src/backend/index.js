/* eslint-disable no-undef */
const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
const port = 443;
const routes = require('./src/api/endPoints');
const cors = require('cors');

// Configuración para leer los certificados SSL
const options = {
    key: fs.readFileSync('ruta/de/tu/llave-privada.pem'),
    cert: fs.readFileSync('ruta/de/tu/certificado-publico.pem')
};

app.use(express.json()); //interpreta el json
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Permitir solicitudes desde cualquier origen
app.use('/', routes);

// Crear servidor HTTPS
https.createServer(options, app).listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
