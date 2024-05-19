const connection = require('../models/db')

module.exports.checkEmail = (req, res) => {
    const { email } = req.body; // Obtén el nombre de usuario del cuerpo de la solicitud
  
    const consulta = 'SELECT email FROM usuarioAutenticado WHERE email = ?';
    try {
      connection.query(consulta, [email], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error interno del servidor' });
          return;
        }
        console.log(result);
        if (result.length > 0) {
          res.json({ exists: true });
        } else {
          res.json({ exists: false });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  