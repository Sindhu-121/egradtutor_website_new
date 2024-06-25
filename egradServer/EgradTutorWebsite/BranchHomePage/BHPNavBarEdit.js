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
    const { Nav_Item, Item_Order,navItemlink } = req.body;
    const { id } = req.params;

    try {
        if (!Nav_Item || !Item_Order) {
            return res.status(400).json({ message: 'Nav_Item and Item_Order are required' });
        }

        const updateQuery = "UPDATE homepagenavtable SET Nav_Item = ?, Item_Order = ?,navItemlink=? WHERE Nav_id = ?";
        const result = await db.query(updateQuery, [Nav_Item, Item_Order, id,navItemlink]);

        // Check if any rows were affected by the update operation
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        return res.json({ status: 'Success', action: 'Updated', updatedData: { id, Nav_Item, Item_Order } });
    } catch (error) {
        console.error('Error updating database:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;