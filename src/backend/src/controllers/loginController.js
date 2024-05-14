/* eslint-disable no-undef */
const connection = require('../models/db')
const jwt = require('jsonwebtoken')
module.exports.login = (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);

    const consulta = 'SELECT * FROM usuarioAutenticado where username = ? AND contra = ?';
    try {
        connection.query(consulta, [username, password], (err, result) => {
            if (err) {
                res.send(err);
            }
            console.log(result);
            if (result.length > 0) {
                const token = jwt.sign({ username }, "stack", { expiresIn: '2m' })
                res.send({ token });
            } else {
                console.log('usuario incorrecto ');
                res.send({ message: 'usuario incorrecto' });
            }
        })
    } catch (error) {
        console.log(error);
    }
}