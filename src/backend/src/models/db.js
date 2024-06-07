const mysql = require('mysql2');

const dbConfig = {
    host: 'db-iblog.cfoko6wgu4ul.sa-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Ndgr212004',
    database: 'iBlog'
};

let connection;

function handleDisconnect() {
    connection = mysql.createConnection(dbConfig);

    connection.connect(function(err) {
        if (err) {
            console.error('Error conectando a la base de datos:', err);
            setTimeout(handleDisconnect, 2000); // Intenta reconectar después de 2 segundos
        } else {
            console.log('Conexión establecida.');
        }
    });

    connection.on('error', function(err) {
        console.error('Error en la conexión a la base de datos:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect(); // Reconecta si la conexión se pierde
        } else {
            throw err;
        }
    });
}

handleDisconnect();

module.exports = connection;