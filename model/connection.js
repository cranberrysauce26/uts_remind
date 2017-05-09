var mysql = require('mysql');

var connection = mysql.createConnection({
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

/*
mysql://b29fdba7caf7c2:f267e3ea@us-cdbr-iron-east-03.cleardb.net/heroku_2f48b67f25455c5?reconnect=true
*/

connection.connect();

module.exports = connection;
