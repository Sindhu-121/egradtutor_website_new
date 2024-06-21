const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("../../DataBase/db2");

const router = express.Router();

router.use(cors());
router.use(bodyParser.json());

// Routes
router.post("/faq", (req, res) => {
  const { faq_question, faq_answer } = req.body;
  let sql =
    "INSERT INTO frequentlyaskedquestions (faq_questions, faq_answer) VALUES (?, ?)";
  db.query(sql, [faq_question, faq_answer], (err, result) => {
    if (err) {
      console.error("Error adding question:", err);
      res.status(500).send("Error adding question");
      return;
    }
    res.send({ insertId: result.insertId });
    // Your logic to handle adding a question to the database
    res.send("Question added successfully");
  });
});

// Update an FAQ item
router.put("/faq/:faq_id", (req, res) => {
  const { faq_question, faq_answer } = req.body;
  const faq_id = req.params.faq_id;
  console.log(req.body, faq_id);
  // Validate request
  if (!faq_question || !faq_answer || !faq_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Update the FAQ item in the database
  db.query(
    "UPDATE frequentlyaskedquestions SET faq_questions = ?, faq_answer = ? WHERE faq_id = ?",
    [faq_question, faq_answer, faq_id],
    (err, result) => {
      if (err) {
        console.error("Error updating FAQ item:", err);
        return res.status(500).json({ message: "Error updating FAQ item" });
      }
      res.status(200).json({ message: "FAQ item updated successfully" });
    }
  );
});

router.delete("/faq/:faq_id", async (req, res) => {
  const faqId = req.params.faq_id;
  const sql = "DELETE FROM frequentlyaskedquestions WHERE faq_id = ?";

  try {
    const [results] = await db.query(sql, [faqId]); // Ensure the query function is correctly set up
    if (results.affectedRows > 0) {
      res.status(200).json({ message: "FAQ deleted successfully" });
    } else {
      res.status(404).json({ message: "FAQ not found" });
    }
  } catch (error) {
    console.error("Error executing query: " + error.stack);
    res.status(500).send("Error deleting FAQ from the database");
  }
});

module.exports = router;
