const express = require('express');
const app = express();
const port = 3000;
const routes = require('./src/api/endPoints');
const cors = require('cors');

// Middleware para procesar JSON y formularios URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar CORS para permitir solicitudes desde https://www.iblog.click y http://localhost:5173
const allowedOrigins = ['https://www.iblog.click', 'http://localhost:5173'];

app.use(cors({
    origin: function(origin, callback) {
        // Verifica si el origen está en la lista de permitidos
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

// Middleware para manejar las rutas definidas en './src/api/endPoints'
app.use('/', routes);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
