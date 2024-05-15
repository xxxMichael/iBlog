/* eslint-disable no-undef */
const connection = require('../models/db')
const jwt = require('jsonwebtoken')
module.exports.loginwGmail = (req, res) => {
    const { email } = req.body;
    console.log(email);
    const consulta = 'SELECT * FROM usuarioAutenticado where email = ?';
    try {
        connection.query(consulta, [email], (err, result) => {
            if (err) {
                res.send(err);
            }
            if (result !== undefined) {
                if (result.length > 0) {
                    const token = jwt.sign({ username: result[0].username }, "stack", { expiresIn: '2m' })
                    res.send({ token });
                } else {
                    console.log('usuario incorrecto');
                    res.send({ message: 'Por favor registrese primero' });
                }
            }
            console.log(result);
        })
    } catch (error) {
        console.log(error);
    }
}