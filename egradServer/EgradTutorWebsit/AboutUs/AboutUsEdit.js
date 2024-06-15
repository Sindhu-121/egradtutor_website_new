const express = require('express');
const router = express.Router();
const db = require('../../DataBase/db2');

router.post('/about_egt', async (req, res) => {
    console.log("Request body:", req.body);
    const { aboutegrad } = req.body;
    try {
      const result = await db.query('INSERT INTO about_egt (about_egt) VALUES (?)', [aboutegrad]);
      console.log("Inserted data:", result);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error adding data to about_egt table:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/about_us', async (req, res) => {
    const {  Title, Description } = req.body;
    try {
      await db.query('INSERT INTO about_us ( Title, Description) VALUES (?, ?)', [Title, Description]);
      res.status(201).json({ message: 'About Us data saved successfully' });
    } catch (error) {
      console.error('Error saving About Us data:', error);
      res.status(500).json({ error: 'Failed to save About Us data' });
    }
  });

  router.put('/about_us/:about_us_id', async (req, res) => {
    const { about_us_id } = req.params;
    const { Title, Description } = req.body;
    try {
      await db.query(
        'UPDATE about_us SET Title = ?, Description = ? WHERE about_us_id = ?',
        [Title, Description, about_us_id]
      );
      res.json({ message: 'About Us data updated successfully' });
    } catch (error) {
      console.error('Error updating About Us data:', error);
      res.status(500).json({ error: 'Failed to update About Us data' });
    }
  });
  router.put('/about_egt/:about_egt_id', async (req, res) => {
    const { about_egt_id } = req.params;
    const { aboutegrad } = req.body;
    try {
      await db.query('UPDATE about_egt SET about_egt = ? WHERE about_egt_id = ?', [aboutegrad, about_egt_id]);
      res.status(200).json({ message: 'Record updated successfully' });
    } catch (error) {
      console.error('Error updating record in about_egt table:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  router.delete('/about_us/:about_us_id', async (req, res) => {
    const { about_us_id } = req.params;
    try {
      await db.query('DELETE  FROM about_us WHERE about_us_id  = ?', [about_us_id]);
      res.json({ message: 'About Us data deleted successfully' });
    } catch (error) {
      console.error('Error deleting About Us data:', error);
      res.status(500).json({ error: 'Failed to delete About Us data' });
    }
  });
  router.delete('/about_egt', async (req, res) => {
    // const { about_egt_id } = req.params;
    // console.log("Inserted data:", about_egt_id);
    try {
      await db.query('DELETE FROM about_egt');
      res.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
      console.error('Error deleting record from about_egt table:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
module.exports = router;
