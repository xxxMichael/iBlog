const connection = require('../models/db');

module.exports.verfRegistro = (req, res) => {
    const { correoElectronico, password } = req.body;
    console.log(correoElectronico, password);
    
    const consultaAutenticado = 'SELECT * FROM usuarioAutenticado WHERE correoElectronico = ?';
    const consultaNoAutenticado = 'SELECT * FROM usuarioNoAutenticado WHERE correoElectronico = ?';
    
    try {
        connection.query(consultaAutenticado, [correoElectronico], (err, resultAutenticado) => {
            if (err) {
                return res.status(500).send(err);
            }
            console.log(resultAutenticado);
            if (resultAutenticado.length > 0) {
                return res.send({ message: 'Usuario existente' });
            } 
            connection.query(consultaNoAutenticado, [correoElectronico], (err, resultNoAutenticado) => {
                if (err) {
                    return res.status(500).send(err);
                }
                console.log(resultNoAutenticado);
                if (resultNoAutenticado.length > 0) {
                    return res.send({ message: 'El usuario está pendiente de autenticación' });
                }
                
                // Si no se encuentra el usuario en ninguna de las tablas
                return res.send({ message: 'Usuario no encontrado' });
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Internal server error' });
    }
};
