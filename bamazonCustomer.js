var mysql = require("mysql");
var inquirer = require("inquirer");
var userChoicePrice; 
var userChoiceQuantity;
var userChoice;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazonDB"
});
connection.connect(function(err){
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    readproducts();
});

function readproducts() {
    connection.query("SELECT * FROM products",
function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
        console.log(
          "Item Id: " +
            res[i].item_id +
            " || Product Name: " +
            res[i].product_name +
            " || Department Name: " +
            res[i].department_name +
            " || Price: " +
            res[i].price +
            " || Stock Quantity" +
            res[i].stock_quantity
        );
    }
});
userPromptOne();
}


function userPromptOne() {
    inquirer
      .prompt({
        name: "ID",
        type: "input",
        message: "Type item ID of product you would like to buy",
      })
      .then(function(answer) {
        var query = "SELECT price, stock_quantity FROM products WHERE ?";
        connection.query(query, { item_id: answer.ID }, function(err, res) {
            if (err) throw err;

            if (res.length > 1) {
                console.log("ERROR THERE ARE MULTIPLE CASES OF THIS ID")
                connection.end();
            }
            else {
                    userChoice = answer.ID;
                    userChoicePrice = res[0].price;
                    userChoiceQuantity = res[0].stock_quantity;
        }
        });
        userPromptTwo(); 
      });
     
  }

  function userPromptTwo() {
    inquirer
      .prompt({
        name: "units",
        type: "input",
        message: "How many units would you like to buy",
      })
      .then(function(answer) {

        if (answer.units>userChoiceQuantity){
            console.log("Insufficient Quantity!")
            connection.end()
        }
        else{
        var query = "UPDATE products SET stock_quantity = stock_quantity - "+answer.units+" WHERE ? ";
        connection.query(query, { item_id: userChoice }, function(err, res) {
            if (err) throw err;
                console.log("your order costs $"+userChoiceQuantity*userChoicePrice)
        });
        connection.end();
     }
    
      });      
  }
