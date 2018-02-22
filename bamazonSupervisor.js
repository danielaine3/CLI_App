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
		// switch(choice) {
		// 	case 'View Product Sales by Department':
		// 		displaySalesByDepartment();
		// 		break;
		// 	case 'Create New Department':
		// 		createDepartment();
		// 		break;
		// 	case 'Exit':
		// 		exit();
		// 	default:
		// 		console.log("error");
		// }
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
	var sql = "SELECT departments.department_id, products.department_name, departments.department_name, " + 
		"departments.over_head_costs, products.product_sales FROM products " + 
		"RIGHT JOIN departments ON products.department_name = departments.department_name";
	connection.query(sql, function(err, res) {
		if(err) throw err;
		var table = new Table ({
			head:['ID', 'Dept', 'Overhead', 'Sales', 'Profit'], colWidths: [4, 15, 10, 10, 10]
		});
		for (var i = 0; i < res.length; i++) {
			var totalSales = (res[i].product_sales - res[i].over_head_costs);
     		table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, 
     			res[i].product_sales, totalSales]);
   		}
   		console.log(table.toString());
   		exit();
	});	
}
function createDepartment() {
	inquirer.prompt([
		{
			type: 'input',
			message: 'Please enter new department name.',
			name: 'department_name'
		},
		{
			type: 'input',
			message: 'Please enter new department overhead costs',
			name: 'overhead'
		}
	]).then(function(userInput){
		console.log("Adding new department option.\n");
		var sql = connection.query(
			"INSERT INTO departments SET ?",
			{
				department_name: userInput.department_name,
				over_head_costs: userInput.overhead,
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
			supervisorSelect();
		}
	});
}	