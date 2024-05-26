const connection = require('../models/db');

module.exports.GuardarPost = async (req, res) => {
    const { dueño, titulo, contenido, urlImagen, urlDocumento, idCategoria1,
        idCategoria2, idCategoria3, fechaPublicacion } = req.body;
    const [nombre1, nombre2] = nombre.split(' ');
    const [apellido1, apellido2] = apellido.split(' ');


    const personaQuery = 'INSERT INTO personas (nombre1, nombre2, apellido1, apellido2, cedula) VALUES (?, ?, ?, ?, ?)';
    const personaValues = [nombre1 || '', nombre2 || '', apellido1 || '', apellido2 || '', cedula];

    try {
        connection.query(personaQuery, personaValues, (error, personaResults) => {
            if (error) {
                console.error('Error inserting data into Persona MySQL:', error);
                return res.status(500).json({ message: 'Error al crear persona' });
            }
            const idPersona = personaResults.insertId;

            const estudianteQuery = 'INSERT INTO estudiantes (idPersona, carrera, fecha, tema) VALUES (?, ?, ?, ?)';
            const estudianteValues = [idPersona, carrera, fechaAprovacion, tema];

            connection.query(estudianteQuery, estudianteValues, (error, estudianteResults) => {
                if (error) {
                    console.error('Error inserting data into MySQL:', error);
                    return res.status(500).json({ message: 'Error al crear estudiante' });
                }
                res.status(201).json({ message: 'Estudiante creado exitosamente', id: estudianteResults.insertId });
            });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Internal server error' });

    }

}