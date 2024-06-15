const express = require("express");
const router = express.Router();
const db= require("../DataBase/db2");

router.get("/Portal_feaching", async (req, res) => {
    try {
      const [rows] = await db.query("SELECT  Portale_Id,Portale_Name FROM portales");
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.post("/course_subjects", async (req, res) => {
    try {
      // Extract data from the request body
      const { courseCreationId, subjectIds } =
        req.body;
      console.log("Received data:", req.body);
      for (const subjectId of subjectIds) {
        const query =
          "INSERT INTO course_subjects (courseCreationId, subjectId) VALUES (?, ?)";
        const values = [courseCreationId, subjectId];
        console.log("Executing query:", db.format(query, values));
        await db.query(query, values);
      }
      // Respond with success message
      res.json({
        success: true,
        message: "Subjects and question types added successfully",
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  });

  
module.exports = router;