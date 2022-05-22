const mysql = require('mysql');
const express = require('express');
var bodyParser = require('body-parser');
const path = require('path');

var await = require('await')

const session = require('express-session');
var flash = require('connect-flash');

const app = express();

var database = require('./database');

var md5 = require('md5');

app.set('view engine', 'ejs');

app.use(bodyParser.json());

  
app.use(session({
	secret:'webslesson',
    cookie: {maxAge : 60000},
    saveUninitialized: false,
    resave: false
}));

app.use(flash());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));


// http://localhost:3000/
app.get('/', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/views/pages/login.html'));
});


// http://localhost:3000/auth
app.post('/auth', function(request, response) {
	// Capture the input fields
	let email = request.body.email;
	let password = request.body.password;
	let dcryptPassword = md5(password);
	
	// Ensure the input fields exists and are not empty
	if (email && password) {

		database.query('SELECT password FROM users WHERE email = ? LIMIT 1', [email], 
			(error, results, fields)=> {
				if (results.length > 0) {

					request.session.loggedin = true;
			 		request.session.email = email;

					if (dcryptPassword == results[0].password) {
						response.redirect('/sample_data');
					}
					else {
						response.send('Incorrect Email and/or Password!');
					}
				} else {
					response.send('Incorrect Email and/or Password!');
				}	
				
				response.end();
			});
	} else {
			response.send('Please enter Email and Password!');
			response.end();
	}
});

		


app.get("/sample_data", function(request, response, next){

	var query = "SELECT * FROM employees ORDER BY id ASC";

	database.query(query, function(error, data){

		if(error)
		{
			throw error; 
		}
		else
		{
			response.render('pages/sample_data', {title:'All employees', action:'list', sampleData:data, message: request.flash('success')});
		}

	});
});


app.get("/sample_data/add", function(request, response, next){

	//const message = request.flash('success');

	response.render("pages/sample_data", {title:'Insert Data into MySQL', action:'add'});

});

app.post("/add_sample_data", function(request, response, next){

	var full_names = request.body.full_names;

	var address = request.body.address;

	var phone_number = request.body.phone_number;

	var department = request.body.department;

	var position = request.body.position;

	var salary = request.body.salary;

	var query = `
	INSERT INTO employees 
	(full_names, address, phone_number, department, position, salary) 
	VALUES ("${full_names}", "${address}", "${phone_number}", "${department}", "${position}", "${salary}")
	`;

	database.query(query, function(error, data){

		if(error)
		{
			throw error;
		}	
		else
		{
			request.flash('success', 'Employee added successfully!');
			response.redirect("/sample_data");
		}
	});

});


app.get('/sample_data/edit/:id', function(request, response, next){

	var id = request.params.id;

	var query = `SELECT * FROM employees WHERE id = "${id}"`;

	//const message = request.flash('success');

	database.query(query, function(error, data){

		response.render('pages/sample_data', {title: 'Edit MySQL Table Data', action:'edit', sampleData:data[0]});

	});

});


app.post('/edit/:id', function(request, response, next){

	var id = request.params.id;

	var full_names = request.body.full_names;

	var address = request.body.address;

	var phone_number = request.body.phone_number;

	var department = request.body.department;

	var position = request.body.position;

	var salary = request.body.salary;

	var query = `
	UPDATE employees 
	SET full_names = "${full_names}", 
	address = "${address}", 
	phone_number = "${phone_number}", 
	department = "${department}",
	position = "${position}",
	salary = "${salary}"
	WHERE id = "${id}"
	`;

	database.query(query, function(error, data){

		if(error)
		{
			throw error;
		}
		else
		{
			request.flash('success', 'Employee updated successfully!');
			response.redirect('/sample_data');
		}

	});
});


app.get('/delete/:id', function(request, response, next){

	var id = request.params.id; 

	var query = `DELETE FROM employees WHERE id = "${id}"`;

	database.query(query, function(error, data){

		if(error)
		{
			throw error;
		}
		else
		{
			request.flash('success', 'Employee deleted successfully!');
			response.redirect("/sample_data");
		}
	});
});

// app.all('/express-flash', function( req, res ) {
//     req.flash('success', 'This is a flash message using the express-flash module.');
//     res.redirect(301, '/');
// });



app.listen(3000,() => {
	   console.log("backend running");
});


// var express = require('express');
// var bodyParser = require('body-parser');

// var router = express.Router();
// const app = express();

// var database = require('./database');

// app.set('view engine', 'ejs');


// app.use(bodyParser.json());

// app.get("/sample_data", function(request, response, next){

// 	var query = "SELECT * FROM employees ORDER BY id DESC";

// 	database.query(query, function(error, data){

// 		if(error)
// 		{
// 			throw error; 
// 		}
// 		else
// 		{
// 			response.render('pages/sample_data', {title:'Node.js MySQL CRUD Application', action:'list', sampleData:data});
// 		}

// 	});

// });


// app.get("/sample_data/add", function(request, response, next){

// 	response.render("pages/sample_data", {title:'Insert Data into MySQL', action:'add'});

// });

// app.post("/add_sample_data", function(request, response, next){

// 	var full_names = request.body.full_names;

// 	var address = request.body.address;

// 	var phone_number = request.body.phone_number;

// 	var department = request.body.department;

// 	var position = request.body.position;

// 	var salary = request.body.salary;

// 	var query = `
// 	INSERT INTO employees 
// 	(full_names, address, phone_number, department, position, salary) 
// 	VALUES ("${full_names}", "${address}", "${phone_number}", "${department}", "${position}", "${salary}")
// 	`;

// 	database.query(query, function(error, data){

// 		if(error)
// 		{
// 			throw error;
// 		}	
// 		else
// 		{
// 			response.redirect("/sample_data");
// 		}

// 	});

// });

// //module.exports = router;

// app.listen(3000,() => {
// 	   console.log("backend running");
// });


