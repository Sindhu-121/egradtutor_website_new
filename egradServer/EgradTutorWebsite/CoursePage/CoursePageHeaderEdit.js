const express = require('express');
const router = express.Router();
const db = require('../../DataBase/db2');


router.post('/saveHeaderItem', async (req, res) => {
    const { title, link, order } = req.body;
    const sql = 'INSERT INTO coursepageheader (HeaderItemName, HeaderItemLink, HeaderItemOrder) VALUES (?, ?, ?)';
  
    try {
      const [result] = await db.query(sql, [title, link, order]);
      res.status(200).send('Header item saved successfully');
    } catch (err) {
      console.error('Error inserting header item:', err);
      res.status(500).send('Failed to save header item');
    }
  });
  
  router.put('/updateHeaderItem/:id', async (req, res) => {
    const { id } = req.params;
    const { title, link, order } = req.body;
    const sql = 'UPDATE coursepageheader SET HeaderItemName = ?, HeaderItemLink = ?, HeaderItemOrder = ? WHERE HeaderItem_Id = ?';
  
    try {
      const [result] = await db.query(sql, [title, link, order, id]);
      if (result.affectedRows === 0) {
        res.status(404).send('Header item not found');
      } else {
        res.status(200).send('Header item updated successfully');
      }
    } catch (err) {
      console.error('Error updating header item:', err);
      res.status(500).send('Failed to update header item');
    }
  });
  
  router.delete('/deleteHeaderItem/:id', async (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM coursepageheader WHERE HeaderItem_Id = ?';
  
    try {
      const [result] = await db.query(sql, [id]);
      if (result.affectedRows === 0) {
        res.status(404).send('Header item not found');
      } else {
        res.status(200).send('Header item deleted successfully');
      }
    } catch (err) {
      console.error('Error deleting header item:', err);
      res.status(500).send('Failed to delete header item');
    }
  });
  router.get('/getHeaderItems', async (req, res) => {
    const sql = 'SELECT HeaderItemName,HeaderItemLink,HeaderItem_Id FROM coursepageheader ORDER BY HeaderItemOrder';
    try {
      const [results] = await db.query(sql);
      res.json(results);
    } catch (err) {
      console.error('Error fetching header items:', err);
      res.status(500).send('Failed to fetch header items');
    }
  });
  
  

module.exports = router;