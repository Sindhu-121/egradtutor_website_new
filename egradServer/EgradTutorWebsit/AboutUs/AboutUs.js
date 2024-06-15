const express = require('express');
const router = express.Router();
const db = require('../../DataBase/db2');


router.get('/about_egt', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT about_egt FROM about_egt');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/about_us', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM about_us ');
      res.json(rows);
    } catch (error) {
      console.error('Error fetching About Us data:', error);
      res.status(500).json({ error: 'Failed to fetch About Us data' });
    }
  });

  module.exports = router;