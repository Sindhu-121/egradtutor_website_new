const express = require("express");
const router = express.Router();
const db= require("../DataBase/db2");

router.get("/feachingcourse/:examId", async (req, res) => {
    const { examId } = req.params;
    try {
      const [rows] = await db.query(
        "SELECT c.courseName, c.courseYear, c.courseStartDate, c.courseEndDate, c.courseCreationId, c.cost, c.Discount, c.totalPrice, ci.cardimeage, c.examId, e.examName FROM course_creation_table AS c JOIN cardimeageuploadtable AS ci ON c.courseCreationId = ci.courseCreationId JOIN exams AS e ON e.examId = c.examId WHERE c.examId = ?",
        [examId]
      );
    
      if (rows.length === 0) {
        // If no data is found
        return res.status(404).json({ error: "No data found" });
      }
  
      // Loop through each row and convert cardimeage to base64
      rows.forEach((row) => {
        const base64CardImage = row.cardimeage.toString("base64");
        row.cardimeage = `data:image/png;base64,${base64CardImage}`;
      });
  
      // Return the response
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  router.get('/Test/count', async (req, res) => {
    try {
      const [results, fields] = await db.execute(
        'SELECT courseCreationId, COUNT(*) AS numberOfTests FROM test_creation_table GROUP BY courseCreationId;'
      );
      res.json(results);
    } catch (error) {
      console.error('Error fetching course count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;