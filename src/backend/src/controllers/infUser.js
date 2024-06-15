const jwt = require('jsonwebtoken');
const connection = require('../models/db');

module.exports.infUser = (req, res) => {
    const { username } = req.body; 
    const consulta = 'SELECT * FROM usuarioAutenticado WHERE username = ?';

    try {
        connection.query(consulta, [username], (err, result) => {
            if (err) {
                console.error('Error al consultar la base de datos:', err);
                return res.status(500).json({ error: 'Error al consultar la base de datos' });
            }

            if (result.length > 0) {
                // Generar el token con los datos del usuario
                const token = jwt.sign({
                    username: result[0].username,
                    rol: result[0].rol,
                    categoria1: result[0].categoria1,
                    categoria2: result[0].categoria2,
                    categoria3: result[0].categoria3
                }, "stack", { expiresIn: '2d' });

                res.json({ token });
            } else {
                res.status(404).json({ message: 'Usuario no encontrado' });
            }
        });
    } catch (error) {
        console.error('Error en el manejo de la solicitud:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};
