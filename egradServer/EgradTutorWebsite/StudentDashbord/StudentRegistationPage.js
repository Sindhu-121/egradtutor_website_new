const express = require("express");
const router = express.Router();
const db = require("../../DataBase/db2");

router.get("/coursedataSRP/:courseCreationId", async (req, res) => {
    const { courseCreationId } = req.params;
    try {
      // Fetch data from the database
      const [rows] = await db.query(
        `SELECT
          cc.courseName,
          cc.courseYear,
          e.examName,
          s.subjectName AS courseSubjectName,
          cc.courseCreationId,
          p.Portale_Id,
          p.Portale_Name
        FROM
          course_creation_table AS cc
        LEFT JOIN exams AS e
        ON
          e.examId = cc.examId
        LEFT JOIN course_subjects AS cs
        ON
          cs.courseCreationId = cc.courseCreationId
        LEFT JOIN subjects AS s
        ON
          s.subjectId = cs.subjectId
        LEFT JOIN portales p
        ON
          p.Portale_Id = cc.Portale_Id
        WHERE
          cc.courseCreationId = ?`,
        [courseCreationId]
      );
  
      // Organize the data into a JSON structure
      const organizedData = {};
  
      // Populate organizedData with information from the database results
      rows.forEach((row) => {
        const courseId = row.courseCreationId;
  
        if (!organizedData[courseId]) {
          // Initialize the course with basic information
          organizedData[courseId] = {
            courseCreationId: row.courseCreationId,
            examName: row.examName,
            courseName: row.courseName,
            courseYear: row.courseYear,
            subjects: new Set(), // Use a Set to avoid duplicate subjects
          };
        }
  
        // Add the subject name to the set
        if (row.courseSubjectName) {
          organizedData[courseId].subjects.add(row.courseSubjectName);
        }
      });
  
      // Convert subjects from Set to array and return the response
      Object.values(organizedData).forEach((course) => {
        course.subjects = Array.from(course.subjects);
      });
  
      res.json(Object.values(organizedData)); // Convert the object values to an array for the response
    } catch (error) {
      console.error("Error fetching course data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  
router.get("/gender", async (req, res) => {
    // FetchData
    try {
      const [rows] = await db.query("SELECT * FROM gender");
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  router.get("/Category", async (req, res) => {
    // FetchData
    try {
      const [rows] = await db.query("SELECT * FROM category");
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  router.get("/states", async (req, res) => {
    // FetchData
    try {
      const [rows] = await db.query("SELECT * FROM states");
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  router.get("/districts/:state_id", async (req, res) => {
    const { state_id } = req.params;
    // FetchData
    try {
      const [rows] = await db.query(
        "SELECT * FROM districts WHERE state_id = ?",
        [state_id]
      );
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  router.get("/Qualifications", async (req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM educationstatus");
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.get("/data/:courseCreationId/:emailId", async (req, res) => {
    const { courseCreationId , emailId } = req.params;
    try {
      // Fetch exams from the database
      const [rows] = await db.query(
        `SELECT s.*, l.*, sb.payu_status,sb.courseCreationId
        FROM otsstudentregistation s 
        JOIN log l ON s.emailId = l.email 
        JOIN student_buy_courses sb ON l.user_Id = sb.user_id 
        WHERE sb.courseCreationId  = ? AND l.email = ?`,
        [courseCreationId , emailId]
      );
  
      console.log(courseCreationId , emailId);
      if (rows.length > 0) {
        const payuStatus = rows[0].payu_status;
        if (payuStatus === "paid") {
          // Try another email
          res.status(400).json({ error: "Try another email" });
        } else {
          // Proceed with the payment
          res.status(400).json({ error: "Proceed with the payment" });
        }
      } else {
        res.status(200).json({ message: "continue" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  
module.exports = router;