const express = require('express');
const router = express.Router();
const db = require('../../DataBase/db2');




router.get("/landingfooterContentDataOne", async (req, res) => {
    const sql = "SELECT * FROM landing_page_one";
  
    try {
      const [results] = await db.query(sql); // Ensure the query function is correctly set up
      console.log("Retrieved data from landing_page_one table:", results);
      res.json(results);
    } catch (error) {
      console.error("Error executing query: " + error.stack);
      res.status(500).send("Error retrieving data from the database");
    }
  });



  router.get("/landingfooterContentDataTwo", async (req, res) => {
    try {
      const sql = "SELECT * FROM landing_page_two";
      const [results] = await db.query(sql);
      console.log("Retrieved data from landing_page_two table:", results);
      res.json(results);
    } catch (error) {
      console.error("Error executing query:", error.stack);
      res.status(500).send("Error retrieving data from the database");
    }
  });


  router.get("/landingfooterContentDataThree", async (req, res) => {
    const sql = "SELECT * FROM landing_copyright";
  
    try {
      const [results] = await db.query(sql);
      console.log("Retrieved data from landing_copyright table:", results);
      res.json(results);
    } catch (error) {
      console.error("Error executing query:", error.stack);
      res.status(500).send("Error retrieving data from the database");
    }
  });


  router.get("/footerLinks", async (req, res) => {
    const sql = "SELECT * FROM footer_links_table";
   
    try {
      const [results] = await db.query(sql);
      console.log("Retrieved data from footer_links_table:", results);
      res.json(results);
    } catch (error) {
      console.error("Error executing query:", error.stack);
      res.status(500).send("Error retrieving data from the database");
    }
  });

module.exports = router;