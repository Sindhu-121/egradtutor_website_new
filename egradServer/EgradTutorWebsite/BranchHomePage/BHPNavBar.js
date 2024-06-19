const express = require('express');
const router = express.Router();
const db = require('../../DataBase/db2');

router.get('/homepageNavItems', async (req, res) => {
    try {
        const selectQuery = "SELECT * FROM homepagenavtable ORDER BY Item_Order ASC";
        const [result] = await db.query(selectQuery); // Destructure the result to get the data array
        return res.json({ status: 'Success', navItems: result });
    } catch (error) {
        console.error('Error fetching data from database:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/homepage_marqueedisply/:Branch_Id', async (req, res) => {
    const { Branch_Id } = req.params;
    try {
        const query = `SELECT Marquee_Id, Marquee_data, Branch_Id FROM homepage_marquee WHERE Branch_Id = ?`;
        const [rows] = await db.query(query, [Branch_Id]);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching marquee items:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;