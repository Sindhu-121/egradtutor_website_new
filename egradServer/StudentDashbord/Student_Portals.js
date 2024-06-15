const express = require("express");
const router = express.Router();
const db = require("../DataBase/db2");


router.get('/student_portal_data/:studentregistationId', async (req, res) => {
    const { studentregistationId } = req.params; 

    try {
        const [portalData] = await db.query(
            `SELECT apd.*, cd.*,l.*,sb.* FROM
            student_portal_data AS apd
        JOIN course_data AS cd
        ON
            cd.courseCreationId = apd.courseCreationId AND cd.OVL_Course_Id = apd.OVL_Course_Id
        JOIN log AS l
        ON
            l.studentregistationId = apd.studentregistationId
             JOIN student_buy_courses AS sb
        ON
            sb.studentregistationId = apd.studentregistationId
        WHERE
            apd.studentregistationId = ?`,[studentregistationId]
        );

        res.json(portalData);
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




module.exports = router;