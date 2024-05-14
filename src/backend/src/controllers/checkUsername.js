const connection = require('../models/db')

module.exports.checkUsername = (req, res) => {
    const { username } = req.body; // Obtén el nombre de usuario del cuerpo de la solicitud
    console.log(username);
  
    const consulta = 'SELECT * FROM usuarioAutenticado WHERE username = ?';
    try {
      connection.query(consulta, [username], (err, result) => {
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
  