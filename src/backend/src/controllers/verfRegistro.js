const connection = require('../models/db');

module.exports.verfRegistro = (req, res) => {
    const { correoElectronico } = req.body;
    console.log(correoElectronico);

    const consultaAutenticado = 'SELECT * FROM usuarioAutenticado WHERE email = ?';
    const consultaNoAutenticado = 'SELECT * FROM usuarionoAutenticado WHERE email = ?';

    try {
        connection.query(consultaAutenticado, [correoElectronico], (err, resultAutenticado) => {
            console.log("dentro try antes if error");
            if (err) {
                console.log(err);

                return res.status(500).send(err);

            }
            console.log("despues if error ante del if result autenticado");
            if (resultAutenticado.length > 0) {
                return res.send({ message: 'Usuario existente' });
            }
            connection.query(consultaNoAutenticado, [correoElectronico], (err, resultNoAutenticado) => {
                if (err) {
                    return res.status(500).send(err);

                }
                if (resultNoAutenticado.length > 0) {
                    console.log("segundo if resultado autenticado");

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
