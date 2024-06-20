const express = require('express');
const router = express.Router();
const db = require('../../DataBase/db2');

router.get('/branches', async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT b.Branch_Id, b.Branch_Name, ee.EntranceExams_Id, ee.EntranceExams_name 
        FROM branches AS b 
        JOIN entrance_exams AS ee ON ee.Branch_Id = b.Branch_Id
      `);
  
      // Organize the data
      const branches = rows.reduce((acc, row) => {
        const { Branch_Id, Branch_Name, EntranceExams_Id, EntranceExams_name } = row;
        
        if (!acc[Branch_Id]) {
          acc[Branch_Id] = {
            Branch_Id,
            Branch_Name,
            EntranceExams: []
          };
        }
  
        acc[Branch_Id].EntranceExams.push({
          EntranceExams_Id,
          EntranceExams_name
        });
  
        return acc;
      }, {});
  
      res.json(Object.values(branches));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


module.exports = router;