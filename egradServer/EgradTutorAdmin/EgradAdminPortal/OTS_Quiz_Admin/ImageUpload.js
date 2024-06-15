const express = require('express');
const router = express.Router();
const db = require('../DataBase/db2');
const multer = require('multer');
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

router.get('/examforimeageupload', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT examId,examName FROM exams');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching exam data:', error);
        res.status(500).send('Internal Server Error');
    }
  });



  router.get('/courseforimeageupload', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT courseCreationId ,courseName FROM course_creation_table');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching course data:', error);
        res.status(500).send('Internal Server Error');
    }
  });

  router.get('/testsforimeageupload', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT testCreationTableId, TestName FROM test_creation_table');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching test data:', error);
        res.status(500).send('Internal Server Error');
    }
  });

  router.post('/uploadImage', upload.single('cardImage'), async (req, res) => {

    try {
      // Access examId, courseCreationId, testCreationTableId from req.body
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const { examId, courseCreationId, testCreationTableId } = req.body;
  
      // Access the image buffer from req.file
      const imageBuffer = req.file.buffer;
      const examIdValue = examId || 0;
      const courseIdValue = courseCreationId || 0;
      const exatestIdValue = testCreationTableId || 0;

      // Insert data into the database using the pool
      const query = 'INSERT INTO cardimeageuploadtable (examId, courseCreationId, testCreationTableId, cardimeage) VALUES (?, ?, ?, ?)';
      await db.query(query, [examIdValue, courseIdValue, exatestIdValue, imageBuffer]);
  
      // Respond with success message
      res.status(200).json({ message: 'Image uploaded successfully' });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


  module.exports = router;