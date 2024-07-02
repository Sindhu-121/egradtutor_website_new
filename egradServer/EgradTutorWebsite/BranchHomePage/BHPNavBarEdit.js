const express = require('express');
const router = express.Router();
const db = require('../../DataBase/db2');


router.post('/homepageNavItem', async (req, res) => {
    const { Nav_Item, Item_Order,navItemlink } = req.body;

    try {
        if (!Nav_Item || !Item_Order) {
            return res.status(400).json({ message: 'Nav_Item and Item_Order are required' });
        }

        const insertQuery = "INSERT INTO homepagenavtable (Nav_Item, Item_Order,navItemlink) VALUES (?, ?, ?)";
        const result = await db.query(insertQuery, [Nav_Item, Item_Order,navItemlink]);

        const insertedData = {
            id: result.insertId,
            Nav_Item: Nav_Item,
            Item_Order: Item_Order,
            navItemlink:navItemlink
        };
        console.log('Inserted record:', insertedData);

        return res.json({ status: 'Success', action: 'Inserted', insertedData });
    } catch (error) {
        console.error('Error inserting into database:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


router.delete('/homepageNavItems/:id', async (req, res) => {
    const navItemId = req.params.id;
    try {
        const deleteQuery = "DELETE FROM homepagenavtable WHERE Nav_id = ?";
        const result = await db.query(deleteQuery, [navItemId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        return res.json({ status: 'Success', message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting data from database:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/homepageNavItem/:id', async (req, res) => {
    const { Nav_Item, Item_Order, navItemlink } = req.body;
    const { id } = req.params;

    try {
        if (!Nav_Item || !Item_Order || !navItemlink) {
            return res.status(400).json({ message: 'Nav_Item, Item_Order, and navItemlink are required' });
        }

        const updateQuery = "UPDATE homepagenavtable SET Nav_Item = ?, Item_Order = ?, navItemlink = ? WHERE Nav_id = ?";
        const result = await db.query(updateQuery, [Nav_Item, Item_Order, navItemlink, id]);

        // Check if any rows were affected by the update operation
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        return res.json({ status: 'Success', action: 'Updated', updatedData: { id, Nav_Item, Item_Order, navItemlink } });
    } catch (error) {
        console.error('Error updating database:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/homepage_marquee', async (req, res) => {
    const { Marquee_data, Branch_Id } = req.body;
    try {
      // Check if the record already exists
      const [existingRows] = await db.query(`SELECT * FROM homepage_marquee WHERE Branch_Id = ?`, [Branch_Id]);
  
      if (existingRows.length > 0) {
        // Update the existing record
        const updateQuery = `UPDATE homepage_marquee SET Marquee_data = ? WHERE Branch_Id = ?`;
        const [rows] = await db.query(updateQuery, [Marquee_data, Branch_Id]);
        res.json(rows);
      } else {
        // Insert a new record
        const insertQuery = `INSERT INTO homepage_marquee (Marquee_data, Branch_Id) VALUES (?, ?)`;
        const [rows] = await db.query(insertQuery, [Marquee_data, Branch_Id]);
        res.json(rows);
      }
    } catch (err) {
      console.error('Error saving marquee data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  


module.exports = router;