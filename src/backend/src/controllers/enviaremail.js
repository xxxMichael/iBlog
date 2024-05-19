const connection = require('../models/db').promise(); // Agrega .promise() al final para obtener la versión de promesas
const { sendEmail } = require('./resend');

function generarCodigoAleatorio(longitud) {
    const caracteres = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let codigo = '';

    for (let i = 0; i < longitud; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        codigo += caracteres[indice];
    }

    return codigo;
}async function generarCodigoVerificacion() {
    const codigoVerificacion = generarCodigoAleatorio(6);

    if (connection) {
        try {
            console.log(codigoVerificacion);
            // Ejecuta la consulta SQL para verificar la existencia del código de verificación
            const [rows, fields] = await connection.query(
                'SELECT codigoConf FROM usuarionoAutenticado WHERE codigoConf = ?',
                [codigoVerificacion]
            );
            console.log(rows, fields);
                // Verifica si la consulta SQL devolvió resultados
            if (rows && rows.length > 0) {
                // Si el código ya existe, genera uno nuevo recursivamente
                return generarCodigoVerificacion();
            } else {
                // Si es único, devuelve el código
                return codigoVerificacion;
            }
        } catch (error) {
            // Maneja cualquier error que ocurra durante la ejecución de la consulta
            console.error('Error en la conexión:', error.message);
            return null;
        }
    } else {
        // Maneja el caso donde no se pudo establecer la conexión a la base de datos
        console.error('No se pudo establecer la conexión a la base de datos');
        return null;
    }
}


module.exports = { generarCodigoVerificacion, sendEmail };
