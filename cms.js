const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "ed",

    password: "edsloane123",
    database: "employee_DB"
});

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    };

    console.log('connected as id ' + connection.threadId);
});


