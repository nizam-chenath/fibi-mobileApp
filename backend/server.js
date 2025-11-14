const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ MySQL Connection (You’ll update this later with cloud credentials)
const db = mysql.createConnection({
  host: "localhost",
  user: "appuser",              // your MySQL username
  password: "AppUser@123!",   // the password you set during installation
  database: "toy_marketplace"      // name of the database you just created
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Connected!");
});

// ✅ Routes

// Create table
app.get("/create-tables", (req, res) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS departments (
      dept_id INT AUTO_INCREMENT PRIMARY KEY,
      dept_name VARCHAR(100),
      location VARCHAR(100)
    );
    CREATE TABLE IF NOT EXISTS employees (
      emp_id INT AUTO_INCREMENT PRIMARY KEY,
      emp_name VARCHAR(100),
      email VARCHAR(100),
      salary DECIMAL(10,2),
      dept_id INT,
      FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
    );
  `;
  db.query(sql, err => {
    if (err) throw err;
    res.send("✅ Tables created");
  });
});

// Add employee
app.post("/employee", (req, res) => {
  const { emp_name, email, salary, dept_id } = req.body;
  const sql = "INSERT INTO employees (emp_name, email, salary, dept_id) VALUES (?, ?, ?, ?)";
  db.query(sql, [emp_name, email, salary, dept_id], (err, result) => {
    if (err) throw err;
    res.json({ message: "Employee added", id: result.insertId });
  });
});

// Get all employees with department
app.get("/employees", (req, res) => {
  const sql = `
    SELECT e.emp_id, e.emp_name, e.email, e.salary, d.dept_name, d.location
    FROM employees e
    JOIN departments d ON e.dept_id = d.dept_id;
  `;
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update employee
app.put("/employee/:id", (req, res) => {
  const { id } = req.params;
  const { emp_name, email, salary, dept_id } = req.body;
  const sql = "UPDATE employees SET emp_name=?, email=?, salary=?, dept_id=? WHERE emp_id=?";
  db.query(sql, [emp_name, email, salary, dept_id, id], (err, result) => {
    if (err) throw err;
    res.json({ message: "Employee updated" });
  });
});

// Delete employee
app.delete("/employee/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM employees WHERE emp_id=?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json({ message: "Employee deleted" });
  });
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
