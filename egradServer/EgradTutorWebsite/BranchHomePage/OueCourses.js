const express = require('express');
const router = express.Router();
const db = require('../../DataBase/db2');

router.get('/course_features_with_images/:Branch_Id', async (req, res) => {
    const { Branch_Id } = req.params;
  
    try {
      // Step 1: Fetch course features
      const query = `
        SELECT p.Portale_Id, p.Portale_Name, oc.EntranceExams_Id, ee.EntranceExams_name, cf.Features 
        FROM courses_features AS cf 
        JOIN portales AS p ON p.Portale_Id = cf.Portale_Id 
        JOIN our_courses AS oc ON oc.Portale_Id = p.Portale_Id 
        JOIN entrance_exams AS ee ON ee.EntranceExams_Id = oc.EntranceExams_Id 
        WHERE ee.Branch_Id = ?`;
      
      const [rows] = await db.query(query, [Branch_Id]);
      
      const organizedData = {};
      for (const row of rows) {
        const key = `${row.Portale_Name}`;
        if (!organizedData[key]) {
          organizedData[key] = {
            Portale_Id: row.Portale_Id,
            Portale_Name: row.Portale_Name,
            EntranceExams_Id:row.EntranceExams_Id,
            EntranceExams_name: [],
            Features: [],
          };
        }
  
        // Splitting Features string into individual items
        const features = row.Features.split(',').map(feature => feature.trim());
        features.forEach(feature => {
          if (!organizedData[key].Features.includes(feature)) {
            organizedData[key].Features.push(feature);
          }
        });
  
        if (!organizedData[key].EntranceExams_name.includes(row.EntranceExams_name)) {
          organizedData[key].EntranceExams_name.push(row.EntranceExams_name);
        }
      }
  
      // Step 2: Fetch images for each Portale_Id
      const result = await Promise.all(Object.values(organizedData).map(async feature => {
        const portaleId = feature.Portale_Id;
  
        // Determine the image_id based on the Portale_Id
        let imeage_id;
        switch (portaleId) {
          case 1:
            imeage_id = 2;
            break;
          case 2:
            imeage_id = 3;
            break;
          case 3:
            imeage_id = 4;
            break;
          case 4:
            imeage_id = 5;
            break;
          case 5:
            imeage_id = 6;
            break;
          case 6:
            imeage_id = 7;
            break;
          default:
            imeage_id = null;
        }
  
        if (imeage_id !== null) {
          const imageQuery = 'SELECT image FROM images WHERE imeage_id = ?';
          const [imageRows] = await db.query(imageQuery, [imeage_id]);
  
          if (imageRows.length > 0 && imageRows[0].image) {
            const imageBuffer = imageRows[0].image;
            const base64Image = imageBuffer.toString('base64');
            feature.image = `data:image/jpeg;base64,${base64Image}`;
          }
        }
  
        return feature;
      }));
  
      res.json(result);
    } catch (err) {
      console.error('Error fetching course features with images:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;