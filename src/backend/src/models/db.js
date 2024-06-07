const mysql = require('mysql2');

// Crear el pool de conexiones
const pool = mysql.createPool({
  host: 'db-iblog.cfoko6wgu4ul.sa-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Ndgr212004',
  database: 'iBlog',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Manejar errores del pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    handleDisconnect(); // Intentar reconectar en caso de pérdida de conexión
  } else {
    throw err; // Para otros tipos de errores, los arrojamos
  }
});

// Función para manejar la desconexión y reconectar
function handleDisconnect() {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error reconnecting to database:', err);
      setTimeout(handleDisconnect, 2000); // Intentar reconectar después de 2 segundos
    } else {
      console.log('Reconnected to database.');
      if (connection) connection.release();
    }
  });
}

// Función para verificar la conexión inicial
function checkInitialConnection() {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database initially:', err);
      setTimeout(checkInitialConnection, 2000); // Reintentar conexión después de 2 segundos
    } else {
      console.log('Successfully connected to the database.');
      if (connection) connection.release();
    }
  });
}

// Verificar la conexión inicial
checkInitialConnection();

// Exportar el pool para uso en otros módulos
module.exports = pool;