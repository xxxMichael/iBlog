const express = require('express');
const app = express();
const port = 3000;
const routes = require('./src/api/endPoints');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar CORS para permitir todas las solicitudes
app.use(cors());

app.use('/', routes);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
