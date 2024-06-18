const connection = require('../models/db');

module.exports.actualizarImagenPerfil = (req, res) => {
    const {dueño, urlImagen} = req.body;
    console.log(dueño);
    console.log(urlImagen);

    const query = `
    Update usuarioAutenticado set urlImagenPerfil=? where username = ?;
    `;

    connection.query(query, [urlImagen,dueño], (err, result) => {
        if (err) {
            console.error('Error al actualizar post:', err);
            res.status(500).json({ success: false, message: 'Error al Actualizar url foto perfil' });
            return;
        }
        console.log('Post actualizado con exito:', result);
        res.status(200).json({ success: true, message: 'Foto actualizada correctamente' });
    });
};