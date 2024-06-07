const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'db-iblog.cfoko6wgu4ul.sa-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Ndgr212004',
  database: 'iBlog',
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0
});

module.exports = pool;