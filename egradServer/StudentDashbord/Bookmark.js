const express = require("express");
const router = express.Router();
const db = require("../DataBase/db2");

router.post('/saveBookmark', async (req, res) => {
    const {
      question_id,
      testCreationTableId,
      user_Id,
      isBookmarked,
    } = req.body;
  
    const query = isBookmarked
      ? 'INSERT INTO bookmark_questions (question_id,testCreationTableId, user_Id) VALUES (?, ?, ?)'
      : 'DELETE FROM bookmark_questions WHERE question_id = ? AND testCreationTableId=? AND user_Id = ?';
  
    const values = [question_id,testCreationTableId, user_Id];
  
    try {
      await executeQuery(query, values);
      res.json({ success: true, message: 'Bookmark updated successfully' });
    } catch (error) {
      console.error('Error executing SQL query:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
  
  const executeQuery = (query, values) => {
    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };

  router.get('/getBookmarks/:user_Id', async (req, res) => {
    const { user_Id } = req.params; // Use req.params to get route parameters
  
    try {
      const [bookmarks] = await db.query(
        'SELECT BookMarkId,question_id,testCreationTableId FROM bookmark_questions WHERE user_Id = ?',
        [user_Id]
      );
  
      res.json(bookmarks);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });





  module.exports = router;