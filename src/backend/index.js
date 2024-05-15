/* eslint-disable no-undef */
const express = require('express');
const app = express();
const port = 3000;
const routes = require('./src/api/endPoints')
const cors = require('cors');
app.use(express.json()); //interpreta el json
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Permitir solicitudes desde cualquier origen

app.use('/', routes)
app.listen(port, () => {
    console.log(`listen on port  ${port} `)
})