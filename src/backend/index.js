/* eslint-disable no-undef */
const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
const port = 3000;
const routes = require('./src/api/endPoints');
const cors = require('cors');

// Configuración para leer los certificados SSL
const options = {
    key: fs.readFileSync('./src/certificates/key.pem'),
    cert: fs.readFileSync('./src/certificates/csr.pem')
};

app.use(express.json()); //interpreta el json
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Permitir solicitudes desde cualquier origen
app.use('/', routes);

// Crear servidor HTTPS
https.createServer(options, app).listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
