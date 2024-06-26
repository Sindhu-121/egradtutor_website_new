const express = require('express');
const router = express.Router();
const db = require('../../DataBase/db2');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/saveWhyChooseUsItem', upload.single('image'), async (req, res) => {
    const { title, description, order } = req.body;
    const image = req.file.buffer;
    const sql = 'INSERT INTO CoursePageWhychooseUs (WhyChooseUsTitle, WhyChooseUsDiscreption, WhyChooseUsOrder, WhyChooseUsImeage) VALUES (?, ?, ?, ?)';
  
    try {
      const [result] = await db.query(sql, [title, description, order, image]);
      res.status(200).send('Item saved successfully');
    } catch (err) {
      console.error('Error inserting item:', err);
      res.status(500).send('Failed to save item');
    }
  });


  router.get('/getWhyChooseUsItems', async (req, res) => {
    const sql = 'SELECT * FROM CoursePageWhychooseUs ORDER BY WhyChooseUsOrder';
    try {
      const [results] = await db.query(sql);
      const formattedResults = results.map(item => ({
        ...item,
        WhyChooseUsImeage: item.WhyChooseUsImeage.toString('base64')
      }));
      res.json(formattedResults);
    } catch (err) {
      console.error('Error fetching items:', err);
      res.status(500).send('Failed to fetch items');
    }
  });
  
  router.put('/updateWhyChooseUsItem/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, description, order } = req.body;
    const image = req.file ? req.file.buffer : null;
    let sql, params;
  
    if (image) {
      sql = 'UPDATE CoursePageWhychooseUs SET WhyChooseUsTitle = ?, WhyChooseUsDiscreption = ?, WhyChooseUsOrder = ?, WhyChooseUsImeage = ? WHERE WhyChooseUsId = ?';
      params = [title, description, order, image, id];
    } else {
      sql = 'UPDATE CoursePageWhychooseUs SET WhyChooseUsTitle = ?, WhyChooseUsDiscreption = ?, WhyChooseUsOrder = ? WHERE WhyChooseUsId = ?';
      params = [title, description, order, id];
    }
  
    try {
      const [result] = await db.query(sql, params);
      if (result.affectedRows === 0) {
        res.status(404).send('Item not found');
      } else {
        res.status(200).send('Item updated successfully');
      }
    } catch (err) {
      console.error('Error updating item:', err);
      res.status(500).send('Failed to update item');
    }
  });
  

  router.delete('/deleteWhyChooseUs/:id', async (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM CoursePageWhychooseUs WHERE WhyChooseUsId = ?';
  
    try {
      const [result] = await db.query(sql, [id]);
      if (result.affectedRows === 0) {
        res.status(404).send('Entry not found');
      } else {
        res.status(200).send('Entry deleted successfully');
      }
    } catch (err) {
      console.error('Error deleting entry:', err);
      res.status(500).send('Failed to delete entry');
    }
  });

module.exports = router;
