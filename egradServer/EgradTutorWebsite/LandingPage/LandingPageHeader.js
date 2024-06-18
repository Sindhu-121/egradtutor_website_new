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

router.get('/welcome', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM welcome_data ', [req.params.id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'No data found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/welcomeimage', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT welcome_image FROM welcomeimage LIMIT 1');
        if (rows.length > 0 && rows[0].welcome_image) {
            const welcomeimage = rows[0].welcome_image;
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': welcomeimage.length
            });
            res.end(welcomeimage);
        } else {
            res.status(404).json({ message: 'No image found' });
        }
    } catch (error) {
        console.error("Error fetching welcome image:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;