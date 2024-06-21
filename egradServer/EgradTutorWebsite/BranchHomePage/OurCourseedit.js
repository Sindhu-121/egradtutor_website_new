const express = require('express');
const router = express.Router();
const db = require('../../DataBase/db2');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/course_features', upload.single('image'), async (req, res) => {
    const { Features, Portale_Id, Branch_Id } = req.body;
    const image = req.file ? req.file.buffer : null;
    const portaleIdToImageIdMap = {
      1: 2,
      2: 3,
      3: 4,
      4: 5,
      5: 6,
      6: 7
    };
  
    try {
      // Insert features
      const insertQueries = JSON.parse(Features).map(feature => {
        return db.query(`INSERT INTO courses_features (Features, Portale_Id, Branch_Id) VALUES (?, ?, ?)`, [feature, Portale_Id, Branch_Id]);
      });
      await Promise.all(insertQueries);
  
      // Insert or update image
      if (image) {
        const imageId = portaleIdToImageIdMap[Portale_Id];
        const [existingImage] = await db.query('SELECT imeage_id FROM images WHERE imeage_id = ?', [imageId]);
        if (existingImage.length > 0) {
          await db.query('UPDATE images SET image = ? WHERE imeage_id = ?', [image, imageId]);
          console.log(`Image updated successfully. Image ID: ${imageId}`);
        } else {
          await db.query('INSERT INTO images (imeage_id, image) VALUES (?, ?)', [imageId, image]);
          console.log(`Image uploaded successfully. Image ID: ${imageId}`);
        }
      }
  
      res.json({ message: 'Features and image saved successfully' });
    } catch (err) {
      console.error('Error saving features and image:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.put('/course_features/:id', async (req, res) => {
    const { id } = req.params;
    const { Features, Portale_Id, Branch_Id } = req.body;
    try {
        const updateQuery = `UPDATE courses_features SET Features = ?, Portale_Id = ?, Branch_Id = ? WHERE Features_Id = ?`;
        await db.query(updateQuery, [Features, Portale_Id, Branch_Id, id]);
        res.json({ message: 'Feature updated successfully' });
    } catch (err) {
        console.error('Error updating feature:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.put('/course_features', async (req, res) => {
    const { Features, Features_Id } = req.body;
    try {
        const query = `UPDATE courses_features SET Features = ? WHERE Features_Id = ?`;
        await db.query(query, [Features, Features_Id]);
        res.json({ message: 'Features updated successfully' });
    } catch (err) {
        console.error('Error updating features:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;