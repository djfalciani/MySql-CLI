var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();
const cTable = require('console.table');

// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.
// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.

// However, if your store does have enough of the product, you should fulfill the customer's order.

// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.

const connection = mysql.createConnection({
    host        : process.env.DB_HOST,
    port        : process.env.DB_PORT, 
    user        : process.env.DB_USER,
    password    : process.env.DB_PASS,
    database    : 'bamazonDB'
})

connection.connect(function(err) {
    if (err) throw err;
    // console.log('connected as id ' + connection.threadId);
    //start();
    // test();
    main();
});

async function start() {
   await listItems();
   let id = await promptItemSelect();
   console.log(id);
 }

 async function listItems() {
     connection.query("select d.department_name Department, p.id Item, p.product_name Description, p.price Price, p.stock_quantity Qty from departments d, products p where d.id = p.department_id order by d.department_name, p.product_name", 
     function(err, results) {
        if (err) throw err;
        console.table(results);
 });
 }



 // Prompt for Item selection, that will return a Promise...
//  const promptItemSelect = () => {
//      return inquirer.prompt([
//          {
//              name: "itemId",
//              message: "What item would you like to order?"
//          }
//      ]);
//  };

 async function promptItemSelect() {
     return inquirer.prompt([
         {
             name: "itemId",
             message: "What item would you like to order?"
         }
     ]);
 };

async function test () {
    let id = await promptItemSelect();
    console.log(id);
    return null;
}

function main() {
  // query the database for all items being auctioned
  connection.query("select d.department_name Department, p.id Item, p.product_name Description, p.price Price, p.stock_quantity Qty from departments d, products p where d.id = p.department_id order by d.department_name, p.product_name", 
  function(err, results) {
      if (err) throw err;
      console.table(results);
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer.prompt([
        {
            name: "itemId",
            message: "What item would you like to order?"
         }
    ])
    .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        // console.log(results);
        for (var i = 0; i < results.length; i++) {
        if (results[i].item === answer.choice) {
            chosenItem = results[i];
        }
        }
    });
  });
}