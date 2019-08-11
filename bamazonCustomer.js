var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();
const cTable = require('console.table');

const connection = mysql.createConnection({
    host        : process.env.DB_HOST,
    port        : process.env.DB_PORT, 
    user        : process.env.DB_USER,
    password    : process.env.DB_PASS,
    database    : 'bamazonDB'
})

connection.connect(function(err) {
    if (err) throw err;
    mainMenu();
});

function mainMenu() {
    inquirer
  .prompt([
    {
      type: 'list',
      name: 'menu',
      message: 'What do you want to do?',
      choices: [
        'Order an item',
        'Exit application',
      ]
    }
  ])
  .then(answers => {
    let menuId = answers.menu;
    if (menuId === "Order an item") {
        main();
    } else {
        connection.end();
    }
  });
}

function main() {
  // query the database for all items being auctioned
  connection.query("select d.department_name Department, p.id Item, p.product_name Description, p.price Price, p.stock_quantity Qty from departments d, products p where d.id = p.department_id order by d.department_name, p.product_name", 
  function(err, results) {
      if (err) throw err;
      console.table(results);
    
      inquirer.prompt([
          {
              name: "itemId",
              type: "input",
              message: "What item would you like to order?"
          },
          {
              name: "itemQty",
              type: "input",
              message: "How many would you like to buy?"
          }
    ])
    .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
            if (results[i].Item == answer.itemId) {
                chosenItem = results[i];
            }
        }
        // See if bAmazon has enough Inventory to fulfill order...
        let qtyOrdered = parseInt(answer.itemQty);
        if (chosenItem.Qty >= qtyOrdered) {
            let newQty = chosenItem.Qty - qtyOrdered;
            orderItem(chosenItem.Item,newQty);

        } else {
            console.log("Insufficient quantity!");
            main();
        }

    });
  });
}


function orderItem(itemId, newQty) {
    connection.query('UPDATE products SET stock_quantity = ? WHERE id = ?', [newQty,itemId], function (error, results, fields) {
        if (error) throw error;
        console.log("Order placed successfully!");
        // main();
        mainMenu()
    });
}