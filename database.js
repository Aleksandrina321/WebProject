var mysql = require('mysql');

// Create connection 
const db = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'mysqlSaniWeb24',
	database : 'webproject'
});

//Connect to MySQL
db.connect(err => {
    if (err) {
        throw err;
    } 
    console.log("MySQL Connected");
});

module.exports = db;