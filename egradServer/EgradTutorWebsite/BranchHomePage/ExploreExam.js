const express = require('express');
const router = express.Router();
const db = require('../../DataBase/db2');



router.get("/examdata/:Branch_Id", async (req, res) => {
    const { Branch_Id } = req.params;
    try {
      const [rows] = await db.query(
        `
                SELECT 
      b.Branch_Id, 
      b.Branch_Name, 
      ee.EntranceExams_Id, 
      ee.EntranceExams_name,
      oc.Portale_Id,
      (
          SELECT Portale_Name 
          FROM portales AS p 
          WHERE p.Portale_Id = oc.Portale_Id
      ) AS Portale_Name
  FROM 
      branches AS b 
  JOIN 
      entrance_exams AS ee ON ee.Branch_Id = b.Branch_Id 
  LEFT JOIN 
      our_courses AS oc ON ee.EntranceExams_Id = oc.EntranceExams_Id 
  WHERE 
      b.Branch_Id = ?
        `,
        [Branch_Id]
      ); // Pass Branch_Id as a parameter
  
      // Organize the data
  const branches = rows.reduce((acc, row) => {
    const {
      Branch_Id,
      EntranceExams_Id,
      EntranceExams_name,
      Portale_Id,
      Portale_Name,
    } = row;
  
    // Check if the branch is already in the accumulator, if not, initialize it
    if (!acc[Branch_Id]) {
      acc[Branch_Id] = {
        Branch_Id,
        EntranceExams: [], // Initialize the array for entrance exams
      };
    }
  
    // Check if the entrance exam already exists in the EntranceExams array for the branch
    const existingExam = acc[Branch_Id].EntranceExams.find(
      (exam) =>
        exam.EntranceExams_Id === EntranceExams_Id &&
        exam.EntranceExams_name === EntranceExams_name
    );

    if (!existingExam) {
      acc[Branch_Id].EntranceExams.push({
        EntranceExams_Id,
        EntranceExams_name,
        Portale_Names: [Portale_Name], 
      });
    } else {
      // If the entrance exam already exists, check if the Portale_Name is not already included
      if (!existingExam.Portale_Names.includes(Portale_Name)) {
        existingExam.Portale_Names.push(Portale_Name);
      }
    }
  
    return acc;
  }, {});
      res.json(Object.values(branches));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });



  router.get("/portales", async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT Portale_Id, Portale_Name
        FROM portales
      `);
  
      const organizedData = rows.map((row) => {
        const { Portale_Id, Portale_Name } = row;
        return { Portale_Id, Portale_Name };
      });
  
      res.json(organizedData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  router.get('/image/1', async (req, res) => {
    const sql = "SELECT image FROM images WHERE imeage_id = 1";
  
    try {
      const [result] = await db.query(sql, [1]);
  
      if (result.length > 0) {
        res.writeHead(200, {
          'Content-Type': 'image/jpeg',
          'Content-Length': result[0].image.length
        });
        res.end(result[0].image);
      } else {
        res.status(404).send('No image found with that ID');
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  module.exports = router;