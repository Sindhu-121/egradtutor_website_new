const express = require("express");
const router = express.Router();
const db= require("../DataBase/db2");

router.get("/examData", async (req, res) => {
    try {
      const [rows] = await db.query("SELECT e.examName, e.startDate, e.endDate, e.examId, ci.cardImage FROM exams AS e JOIN course_creation_table AS ci ON e.examId=ci.examId");
  
      if (rows.length === 0) {
        // If no data is found
        return res.status(404).json({ error: "No data found" });
      }
  
      // Loop through each row and convert cardimeage to base64
      rows.forEach((row) => {
        const base64CardImage = row.cardImage.toString("base64");
        row.cardImage = `data:image/png;base64,${base64CardImage}`;
      });
  
      // Return the response
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.get('/courses/count', async (req, res) => {
    try {
      const [results, fields] = await db.execute(
        'SELECT examId, COUNT(*) AS numberOfCourses FROM course_creation_table GROUP BY examId;'
      );
      res.json(results);
    } catch (error) {
      console.error('Error fetching course count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


module.exports = router;
