const connection = require('../models/db');

module.exports.verificarUser = (req, res) => {
    const { codigo } = req.body;
    console.log('verificar usuario');
    const selectQuery = 'SELECT * FROM usuarionoAutenticado WHERE codigoConf = ?';
    const insertQuery = 'INSERT INTO usuarioAutenticado (nombre, apellido, username, email, contra, fechaRegistro, rol, fechaNac, pais,cantPosts,urlImagenPerfil) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,0,"https://i.pinimg.com/564x/8e/12/91/8e129152d188f56e83f754d93de0c202.jpg");'
    const deleteQuery = 'DELETE FROM usuarionoAutenticado WHERE codigoConf = ?';
    
    connection.query(selectQuery, [codigo], (err, results) => {
        if (err) {
            console.error('Error al verificar código:', err);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
            return;
        }

        if (results.length > 0) {
            const { nombre, apellido, username, email, contra, fechaRegistro, rol, fechaNac, pais } = results[0];

            connection.query(insertQuery, [nombre, apellido, username, email, contra, fechaRegistro, rol, fechaNac, pais], (err, insertResult) => {
                if (err) {
                    console.error('Error al insertar usuario autenticado:', err);
                    res.status(500).json({ success: false, message: 'Error interno del servidor' });
                    return;
                }

                console.log('Usuario autenticado insertado exitosamente:', insertResult);

                // Eliminar el usuario no autenticado
                connection.query(deleteQuery, [codigo], (err, deleteResult) => {
                    if (err) {
                        console.error('Error al eliminar usuario no autenticado:', err);
                        res.status(500).json({ success: false, message: 'Error interno del servidor' });
                        return;
                    }

                    console.log('Usuario no autenticado eliminado exitosamente:', deleteResult);
                    res.status(200).json({ success: true, message: 'Usuario autenticado correctamente' });
                });
            });
        } else {
            console.log("invalido");
            res.status(404).json({ success: false, message: 'Código de verificación inválido' });
        }
    });
};
