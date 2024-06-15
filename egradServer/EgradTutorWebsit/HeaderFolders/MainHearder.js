const express = require('express');
const router = express.Router();
const db = require('../../DataBase/db2');

router.get('/image', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT logo_data FROM website_logo LIMIT 1');
        if (rows.length > 0) {
            const image = rows[0].logo_data;
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': image.length
            });
            res.end(image);
        } else {
            res.status(404).json({ message: 'No image found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;