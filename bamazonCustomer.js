var inquirer = require("inquirer");
var mysql = require("mysql");
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
		console.log(res);
		connection.end();
	});
}
function promptOrder() {
	inquirer.prompt([
		{
			type:"input", 
			message: "Please enter the ID of the product you'd like to purchase.",
			name:"purcahseId",
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
		if(answer.purchaseId ) {

			//Update SQL database to reflect remaining quantity
			updateProduct();
			//Show customer total cost of purchse


		} else {
			console.log("Quantity not available. Unable to place order.");
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
						connection.end();
					}
				}
			);
		}
	});
};

function updateProduct() {
	console.log("Updating quantity of product ID: " + answer.purchaseId);
	var query = connection.query(
		"UPDATE products SET ? WHERE ?",
		[
		{
			quantity://current quantity - customer order
		},
		{
			id: answer.purchaseId
		}],
		function (err, res) {
			console.log(res.affectedRows + "products updated!\n");
		}
	)
}

