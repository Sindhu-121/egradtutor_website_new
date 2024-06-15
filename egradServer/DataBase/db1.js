const mysql = require("mysql");


  const db1 = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "admin_project",
  }); 
  
db1.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL db1");
  }
});   
module.exports = db1;