const connection = require('../models/db');

module.exports.verfRegistro = (req, res) => {
    const { correoElectronico, password } = req.body;
    console.log(correoElectronico, password);
    
    const consultaAutenticado = 'SELECT * FROM usuarioAutenticado WHERE correoElectronico = ?';
    const consultaNoAutenticado = 'SELECT * FROM usuarioNoAutenticado WHERE correoElectronico = ?';
    
    try {
        connection.query(consultaAutenticado, [correoElectronico], (err, resultAutenticado) => {
            if (err) {
                res.send(err);
            }
            console.log(resultAutenticado);
            if (resultAutenticado.length > 0) {
                res.send({ message: 'Usuario existente' });
            } 
            connection.query(consultaNoAutenticado, [correoElectronico], (err, resultNoAutenticado) => {
                if (err) {
                    res.send(err);
                }
                console.log(resultNoAutenticado);
                if (resultNoAutenticado.length > 0) {
                    res.send({ message: 'El usuario está pendiente de autenticación' });
                } 
            });
        });
    } catch (error) {
        console.log(error);
    }
};
