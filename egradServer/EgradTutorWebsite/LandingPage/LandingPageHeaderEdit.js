const express = require('express');
const router = express.Router();
const db = require('../../DataBase/db2');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/welcomeimgupload', upload.single('image'), async (req, res) => {
    try {
        const image = req.file.buffer;
        const [rows] = await db.query('SELECT welcomeimg_id FROM welcomeimage LIMIT 1');
        if (rows.length > 0) {
            const welcomeimg_id = rows[0].welcomeimg_id;
            await db.query('UPDATE welcomeimage SET welcome_image = ? WHERE welcomeimg_id = ?', [image, welcomeimg_id]);
            res.json({ message: 'Image updated successfully', id: welcomeimg_id });
        } else {
            const [result] = await db.query('INSERT INTO welcomeimage (welcome_image) VALUES (?)', [image]);
            res.json({ id: result.insertId });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/welcome/:id', async (req, res) => {
    const { welcome_text, welcome_longtext } = req.body;
    try {
        await db.query('UPDATE welcome_data SET welcome_text = ?, welcome_longtext = ? WHERE welcome_id = ?', [welcome_text, welcome_longtext, req.params.id]);
        res.json({ message: 'Data updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/welcome/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM welcome_data WHERE welcome_id = ?', [req.params.id]);
        res.json({ message: 'Data deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/welcome', async (req, res) => {
    const { welcome_text, welcome_longtext } = req.body;
    try {
        const [result] = await db.query('INSERT INTO welcome_data (welcome_text, welcome_longtext) VALUES (?, ?)', [welcome_text, welcome_longtext]);
        res.json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const image = req.file.buffer;

        // Check if an image already exists
        const [rows] = await db.query('SELECT logo_id FROM website_logo LIMIT 1');

        if (rows.length > 0) {
            // If exists, update the existing image
            const logoId = rows[0].logo_id;
            await db.query('UPDATE website_logo SET logo_data = ? WHERE logo_id = ?', [image, logoId]);
            res.json({ message: 'Image updated successfully', id: logoId });
        } else {
            // Otherwise, insert a new image
            const [result] = await db.query('INSERT INTO website_logo (logo_data) VALUES (?)', [image]);
            res.json({ id: result.insertId });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;