const mysql = require("mysql");
const inquirer = require("inquirer");
// const consoleTable = require('console.table');

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "fasteddie",
  database: "employee_DB",
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
  initialPrompt();
});

function initialPrompt() {
  inquirer
    .prompt({
      name: "prompt",
      type: "list",
      message: "What you would like to do?",
      choices: [
        "Add a role",
        "Add a department",
        "Add a employee",
        "View all employees",
        "View all departments",
        "View all roles",
        "Update an employees role",
        "Update an employees manager",
      ],
    })
    .then(function (data) {
      switch (data.prompt) {
        case "Add a role":
          addRole();
          break;

        case "Add a department":
          addDepartment();
          break;

        case "Add a employee":
          addEmployee();
          break;

        case "View all employees":
          viewEmployees();
          break;

        case "View all departments":
          viewDepartments();
          break;

        case "View all roles":
          viewRoles();
          break;

        case "Update an employees role":
          updateRole();
          break;

        case "Update an employees manager":
          updateManager();
          break;
      }
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        message: "What is the name of the department?",
        type: "input",
        name: "department",
      },
    ])
    .then(function (data) {
      let newDepartment = data.department;

      connection.query(
        "INSERT INTO department (name) VALUES (?)",
        [newDepartment],
        function (err, res) {
          if (err) throw err;

          console.log(`${newDepartment} successfully added!`);
          initialPrompt();
        }
      );
    });
}

function addRole() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    inquirer
      .prompt([
        {
          message: "What is the new role?",
          type: "input",
          name: "title",
        },
        {
          message: "What is the roles salary?",
          type: "input",
          name: "salary",
        },
        {
          message: "What is the roles department ID (as listed above)?",
          type: "input",
          name: "department",
        },
      ])
      .then(function (data) {
        let title = data.title;
        let salary = data.salary;
        let department = data.department;

        connection.query(
          "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
          [title, salary, department],
          function (err, res) {
            if (err) throw err;

            console.log(`New role for ${title} successfully added!`);
            initialPrompt();
          }
        );
      });
  });
}

function addEmployee() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);

    connection.query("SELECT * FROM role", function (err, res) {
      if (err) throw err;
      console.table(res);

      connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);

        inquirer
          .prompt([
            {
              message: "Enter first name?",
              type: "input",
              name: "firstname",
            },
            {
              message: "Enter last name?",
              type: "input",
              name: "lastname",
            },
            {
              message: "What is the employees I.D ?",
              type: "input",
              name: "role",
            },
            {
              message: "Input managers I.D (or skip)?",
              type: "input",
              name: "manager",
            },
          ])
          .then(function (data) {
            let firstname = data.firstname;
            let lastname = data.lastname;
            let role = data.role;
            let manager;
            if (data.manager === "") {
              manager = null;
            } else {
              manager = data.manager;
            }

            connection.query(
              "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
              [firstname, lastname, role, manager],
              function (err, res) {
                if (err) throw err;

                console.log(`${firstname} ${lastname} successfully added!`);
                initialPrompt();
              }
            );
          });
      });
    });
  });
}

function viewEmployees() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    console.table(res);
    initialPrompt();
  });
}

function viewDepartments() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    initialPrompt();
  });
}

function viewRoles() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    console.table(res);
    initialPrompt();
  });
}

function updateRole() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    console.table(res);

    connection.query("SELECT * FROM role", function (err, res) {
      if (err) throw err;
      console.table(res);

      inquirer
        .prompt([
          {
            message: "What is the employees I.D to update?",
            type: "input",
            name: "id",
          },
          {
            message: "What is the I.D of the new role?",
            type: "input",
            name: "role",
          },
        ])
        .then(function (data) {
          let id = data.id;
          let role = data.role;

          connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
              {
                role_id: role,
              },
              {
                id: id,
              },
            ],
            function (err, res) {
              if (err) throw err;

              console.log("Employee has been updated!");
              promptUser();
            }
          );
        });
    });
  });
}

function updateManager() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    console.table(res);

    inquirer
      .prompt([
        {
          message: "What is the employees I.D to update?",
          type: "input",
          name: "id",
        },
        {
          message: "What is the I.D of the new manager?",
          type: "input",
          name: "manager",
        },
      ])
      .then(function (data) {
        let id = data.id;
        let manager = data.manager;

        connection.query(
          "UPDATE employee SET ? WHERE ?",
          [
            {
              manager_id: manager,
            },
            {
              id: id,
            },
          ],
          function (err, res) {
            if (err) throw err;

            console.log("Employee has been updated!");
            initialPrompt();
          }
        );
      });
  });
}
