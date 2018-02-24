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
	displayAllProduct();
});
function displayAllProduct() {
	connection.query("SELECT * FROM products", function(err, res) {
		if(err) throw err;
		var table = new Table ({
			head:['ID', 'Item', 'Size', 'Dept', '$', 'QTY',], colWidths: [4, 23, 8, 10, 4, 6]
		});
		for (var i = 0; i < res.length; i++) {
     		table.push([res[i].id, res[i].product_name,res[i].size, res[i].department_name, res[i].price, res[i].stock_quantity]);
   		}
   		console.log(table.toString());
   		promptOrder();
		// console.log(res);
	});
}
function promptOrder() {
	inquirer.prompt([
		{
			type:"input", 
			message: "Please enter the ID of the product you'd like to purchase.",
			name:"purchaseId",
			validate: function(value) {
				var num = /[0-9]+/;
				if (value.length < 1) {
					return "Please enter a number.";
				} else if (value.match(num)) {
					return true;
				} else {
					return "Invalid number.";
				}
			}
		},
		{
			type:"input", 
			message: "How many of this item would you like to purchase?",
			name:"quantity",
			validate: function(value) {
				var num = /[0-9]+/;
				if (value.length < 1) {
					return "Please enter a number.";
				} else if (value.match(num)) {
					return true;
				} else {
					return "Invalid number.";
				}
			}
		}
	]).then(function(answer) {
		checkQuantity();
		function checkQuantity() {
			console.log("Checking stock of product " + answer.purchaseId);
			//check if quanitity is available
			var sql = "SELECT * FROM products WHERE id=" + connection.escape(answer.purchaseId);
			connection.query(sql, function(err, res) {
				if (err) throw err;
				for (var i in res) {
					var newQuantity = (res[i].stock_quantity - answer.quantity);
					if(newQuantity >= 0) {
						//Update SQL database to reflect remaining quantity
						updateProduct();
						//Show customer total cost of purchase: answer.quantity * DB price
						var total = res[i].price * answer.quantity;
						//Update total sales of product
						var totalSales = res[i].product_sales + total;
						updateTotalSales();

						var table = new Table ({
							head:['Item', 'Size', 'QTY', 'Total'], colWidths: [23, 8, 6, 8]
						});
						for (var i = 0; i < res.length; i++) {
				     		table.push([res[i].product_name,res[i].size, answer.quantity, "$" + total]);
				   		}
				   		
				   		console.log(table.toString());
						endShopping();
					} else {
						console.log("Quantity not available. Unable to place order.\n");
						inquirer.prompt([
							{
								type: 'list',
								message: 'Try again?',
								choices: ['yes', 'no'],
								name: 'again'
							}
							]).then(function(choice){
								if (choice.again == 'yes') {
									promptOrder();
								} else if (choice.again == 'no') {
									endShopping();
								}
							}
						);
					}
				}
				function updateProduct() {
					var query = connection.query(
						"UPDATE products SET ? WHERE ?",
						[{
							stock_quantity:res[i].stock_quantity - answer.quantity
						},
						{
							id: answer.purchaseId
						}],
						function (err, res) {
							if (err) throw err;
						}
					)
				}
				function updateTotalSales() {
					var query = connection.query(
						"UPDATE products SET ? WHERE ?",
						[{
							product_sales:totalSales
						},
						{
							id: answer.purchaseId
						}],
						function (err, res) {
							if (err) throw err;
						}
					)
				}	
			});
		}
	})
}
function endShopping() {
	inquirer.prompt([
		{
			type: 'list',
			message: 'Done Shopping?',
			choices: ['yes', 'no'],
			name: 'done'
		}
	]).then(function(choice){
		if (choice.done == 'yes') {
			console.log("Thank you for shopping with us. Goodbye!\n");	
			connection.end();		
		} else if (choice.done == 'no') {
			promptOrder();
		}
	});
}
