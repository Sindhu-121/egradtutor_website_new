const express = require('express');
const router = express.Router();
const db = require('../../DataBase/db2');

router.get("/ContentData", async (req, res) => {
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

module.exports = router;