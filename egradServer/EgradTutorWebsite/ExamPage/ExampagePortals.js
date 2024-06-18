
const express = require('express');
const router = express.Router();
const db = require('../../DataBase/db2');

router.get('/examPortal/:EntranceExams_Id', async (req, res) => {

    const { EntranceExams_Id } = req.params;
    try {
        const [rows] = await db.query(`SELECT
        oc.Portale_Id,
        oc.EntranceExams_Id,
        p.Portale_Name
    FROM
        our_courses AS oc
    JOIN portales AS p
    ON
        p.Portale_Id = oc.Portale_Id
    WHERE
        oc.EntranceExams_Id = ?`,[EntranceExams_Id]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;