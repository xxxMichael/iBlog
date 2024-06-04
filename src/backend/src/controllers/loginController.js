/* eslint-disable no-undef */
const connection = require('../models/db');
const jwt = require('jsonwebtoken');

module.exports.login = (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);

    const consulta = 'SELECT * FROM usuarioAutenticado WHERE (username = ? OR email = ?) AND contra = ?';

    try {
        connection.query(consulta, [username, username, password], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result && result.length > 0) {
                const token = jwt.sign({    username: result[0].username,
                    rol: result[0].rol}, "stack", { expiresIn: '2d' })
                return res.send({ token });
            } else {
                console.log('usuario incorrecto');
                return res.status(401).send({ message: 'Usuario o contraseña incorrectos' });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Internal server error' });
    }
}
