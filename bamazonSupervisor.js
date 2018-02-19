var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");
var connection = mysql.createConnection({
	host:"localhost",
	port:3306, 
	user: "root",
	password: "",
	database:"bamazonDB"
});
connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
	supervisorSelect();

});
function supervisorSelect() {
	inquirer.prompt([
		{
			type: 'list',
			message: 'Bamazon Supervisor View',
			choices: ['View Product Sales by Department', 'Create New Department', 'Exit'],
			name: 'supervisorSelect'
		}
	]).then(function(choice){
		if (choice.supervisorSelect == 'View Product Sales by Department') {
			displayProductsByDepartment();
		} else if (choice.supervisorSelect == 'Create New Department') {
			createDepartment();
		} else if (choice.supervisorSelect == 'Exit') {
			exit();
		}
	});
}
function displayProductsByDepartment() {
	console.log("Pulling up current department options.");
	var query = "SELECT * FROM products";
	connection.query(query, function(error, response) {
		if(error) throw error;
		var deptOptions = [];
		for (var i in response) {
			var dept = {
				"name": response[i].department_name,
				"value": response[i].id
			}
			deptOptions.push(dept);
		}
		inquirer.prompt([
			{
				type: 'list',
				message: 'Select department to view.',
				choices: deptOptions,
				name: 'supervisorSelect'
			}
		]).then(function(answer){
			var sql = "SELECT * FROM products WHERE department_name=?" + connection.escape(answer.supervisorSelect);
			connection.query(sql, function(err, res) {
				if(err) throw err;
				var table = new Table ({
					head:['ID', 'Item', 'Size', 'Dept', '$', 'QTY'], colWidths: [4, 23, 8, 10, 4, 6]
				});
				for (var i = 0; i < res.length; i++) {
		     		table.push([res[i].id, res[i].product_name,res[i].size, res[i].department_name, res[i].price, res[i].stock_quantity]);
		   		}
		   		console.log(table.toString());
		   		exit();
			});
		})
	})
}
function createDepartment() {
	inquirer.prompt([
		{
			type: 'input',
			message: 'Please enter new department name.',
			name: 'department_name'
		}
	]).then(function(userInput){
		console.log("Adding new department option.\n");
		var sql = connection.query(
			"INSERT INTO products SET ?",
			{
			product_name: userInput.product_name,
			size: userInput.size,
			department_name: userInput.department_name,
			price: userInput.price,
			stock_quantity: userInput.quantity,	
			}, 
			function(err, res) {
				if(err) throw err;
				console.log("New product: " + userInput.product_name + " added!")
				exit();
			}
		)
	});
}
function exit() {
	inquirer.prompt([
		{
			type: 'list',
			message: 'Done?',
			choices: ['yes', 'no'],
			name: 'done'
		}
	]).then(function(choice){
		if (choice.done == 'yes') {
			console.log("Now exiting Bamazon Manager View.\n");	
			connection.end();		
		} else if (choice.done == 'no') {
			managerSelect();
		}
	});
}	