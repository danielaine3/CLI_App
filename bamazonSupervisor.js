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
			displaySalesByDepartment();
		} else if (choice.supervisorSelect == 'Create New Department') {
			createDepartment();
		} else if (choice.supervisorSelect == 'Exit') {
			exit();
		}
	});
}
function displaySalesByDepartment() {
	// console.log("Pulling up current department options.");
	// var query = "SELECT * FROM departments";
	// connection.query(query, function(error, response) {
	// 	if(error) throw error;
	// 	var deptOptions = [];
	// 	for (var i in response) {
	// 		var dept = {
	// 			"name": response[i].department_name,
	// 			"value": response[i].id
	// 		}
	// 		deptOptions.push(dept);
	// 	}
	// 	inquirer.prompt([
	// 		{
	// 			type: 'list',
	// 			message: 'Select department to view.',
	// 			choices: deptOptions,
	// 			name: 'supervisorSelect'
	// 		}
	// 	]).then(function(answer){
			var sql = "SELECT departments.department_id, products.department_name, departments.department_name, " + 
				"departments.over_head_costs, products.product_sales FROM products " + 
				"RIGHT JOIN departments ON products.department_name = departments.department_name";
			connection.query(sql, function(err, res) {
				if(err) throw err;
				console.log(res);

				var table = new Table ({
					head:['ID', 'Dept', 'Overhead', 'Sales', 'Profit'], colWidths: [4, 10, 6, 6, 6]
				});
				for (var i = 0; i < res.length; i++) {
					var totalSales = (res[i].product_sales - res[i].over_head_costs);
		     		table.push([res[i].department_id, res[i].department_name,res[i].over_head_costs, res[i].product_sales, totalSales]);
		   		}
		   		console.log(table);
		   		exit();
			});
	
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
			department_name: userInput.department_name,
			}, 
			function(err, res) {
				if(err) throw err;
				console.log("New department: " + userInput.department_name + " added!")
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
			console.log("Now exiting Bamazon Supervisor View.\n");	
			connection.end();		
		} else if (choice.done == 'no') {
			managerSelect();
		}
	});
}	