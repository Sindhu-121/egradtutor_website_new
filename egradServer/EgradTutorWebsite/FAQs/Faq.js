const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("../../DataBase/db2");

const router = express.Router();

router.use(cors());
router.use(bodyParser.json());

router.get("/faqs", async (req, res) => {
  const sql = "SELECT * FROM frequentlyaskedquestions";

  try {
    const [results] = await db.query(sql); // Ensure the query function is correctly set up
    console.log("Retrieved data from landing_page_one table:", results);
    res.json(results);
  } catch (error) {
    console.error("Error executing query: " + error.stack);
    res.status(500).send("Error retrieving data from the database");
  }
});

module.exports = router;
