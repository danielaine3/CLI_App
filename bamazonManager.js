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
	managerSelect();

});
function managerSelect() {
	inquirer.prompt([
		{
			type: 'list',
			message: 'Bamazon Manager View',
			choices: ['View Products', 'View low inventory', 'Add inventory', 'Add new product', 'Exit'],
			name: 'managerSelect'
		}
	]).then(function(choice){
		if (choice.managerSelect == 'View Products') {
			displayAllProduct();
		} else if (choice.managerSelect == 'View low inventory') {
			lowInventory();
		}else if (choice.managerSelect == 'Add inventory') {
			addInventory();
		} else if (choice.managerSelect == 'Add new product') {
			addProduct();
		} else if (choice.managerSelect == 'Exit') {
			exit();
		}
	});
}
function displayAllProduct() {
	connection.query("SELECT * FROM products", function(err, res) {
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
}
function lowInventory() {
	console.log("Checking stock for inventory count < 5");
	var sql = "SELECT * FROM products";
	connection.query(sql, function(err, res) {
		if (err) throw err;
		var lowInventoryTable = new Table({
			head:['ID', 'Item', 'Size', 'Dept', '$', 'QTY'], colWidths: [4, 23, 8, 10, 4, 6]
		});
		for (var i in res) {
			if (res[i].stock_quantity < 5){
		     	lowInventoryTable.push([res[i].id, res[i].product_name,res[i].size, res[i].department_name, res[i].price, res[i].stock_quantity]);
		   	}  	
		}
		console.log(lowInventoryTable.toString());
		exit();
	});
}
function addInventory() {
	console.log("Pulling up current product options");
	var query = "SELECT * FROM products";
	connection.query(query, function(error, response) {
		if (error) throw error;
		var choices = [];

		for (var i in response) {
			var product = {
				"name": response[i].product_name +' '+response[i].size,
				"value": response[i].id
			}
			choices.push(product);
		}
		console.log(choices);
		inquirer.prompt([
			{
				type: 'list',
				message: 'Please select product.',
				choices: choices,
				name: 'product_id'
			},
			{
				type: 'input',
				message: 'Please enter quantity adding.',
				name: 'quantity'
			}
		]).then(function(userInput){
			console.log(userInput.product_id);
			// console.log("Updating inventory for " + userInput.product_name + ".\n");
			var sql = connection.query(
				"UPDATE products SET ? WHERE ?",
				[{
				id: userInput.product_id
				},
				{	
				stock_quantity: userInput.quantity	
				}], 
				function(err, res) {
					if(err) throw err;
					console.log("Inventory for: " + userInput.product_id + "added!")
					exit();
				}
			)
		});	
	})
}
function addProduct() {
	inquirer.prompt([
		{
			type: 'input',
			message: 'Please enter product name.',
			name: 'product_name'
		},
		{
			type: 'input',
			message: 'Please enter size.',
			name: 'size'
		},
		{
			type: 'input',
			message: 'Please enter department name.',
			name: 'department_name'
		},
		{
			type: 'input',
			message: 'Please enter retail price.',
			name: 'price'
		},
		{
			type: 'input',
			message: 'Please enter quantity adding.',
			name: 'quantity'
		}
	]).then(function(userInput){
		console.log("Adding new product to catalogue.\n");
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
