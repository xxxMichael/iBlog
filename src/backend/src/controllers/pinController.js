const conection = require('../models/db')

module.exports.ping = (req, res) => {
    const consulta = 'SELECT * FROM usuarioAutenticado';
    try  {
        conection.query(consulta, (err, results) => {
            console.log(results);
            res.json(results);
        });
    } catch (e) {

    }
}