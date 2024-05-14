/* eslint-disable no-undef */
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'dbappwebposts.cb6sqegycy1o.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'MRC58252',
    database: 'blogmodelamiento'
});
module.exports = connection;
