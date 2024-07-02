const express = require('express');
const router = express.Router();
const db = require('../../DataBase/db2');


// router.get('/about_us', async (req, res) => {
//     try {
//       const [rows] = await db.query('SELECT * FROM about_us');
//       res.json(rows);
//     } catch (error) {
//       console.error('Error fetching About Us data:', error);
//       res.status(500).json({ error: 'Failed to fetch About Us data' });
//     }
//   });


// router.get('/about_us', async (req, res) => {
//   try {
//     console.log('Fetching About Us data...');
//     const result = await db.query('SELECT * FROM about_us');
//     console.log('Data retrieved:', result.rows);
    
//     // Convert image buffer to base64
//     const dataWithBase64Images = result.rows.map(row => {
//       return {
//         ...row,
//         About_Us_Image: row.About_Us_Image ? `data:image/jpeg;base64,${row.About_Us_Image.toString('base64')}` : null
//       };
//     });
    
//     res.status(200).json(dataWithBase64Images);
//   } catch (error) {
//     console.error('Error retrieving About Us data:', error.message);
//     res.status(500).json({ error: 'Failed to retrieve About Us data' });
//   }
// });

router.get('/about_us', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM about_us');

    // Convert image buffer to base64
    const dataWithBase64Images = rows.map(row => ({
      ...row,
      About_Us_Image: row.About_Us_Image
        ? `data:image/jpeg;base64,${row.About_Us_Image.toString('base64')}`
        : null,
    }));

    res.json(dataWithBase64Images);
  } catch (error) {
    console.error('Error fetching About Us data:', error);
    res.status(500).json({ error: 'Failed to fetch About Us data' });
  }
});

  router.get('/about_egt', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT about_egt FROM about_egt');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;