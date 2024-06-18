const express = require('express');
const router = express.Router();
const db = require('../../DataBase/db2');

router.get('/exam_info/:EntranceExams_Id', async (req, res) => {
    const { EntranceExams_Id } = req.params;
    try {
        const query = `
        SELECT ei.Info_id, ei.Information_Name,
            ib.Info_broucher_links AS Info_broucher,
            ow.Webpage_link AS Official_Webpage,
            ca.Authority_Data AS Conducting_Authority,
            ep.Pattern_Data AS Exam_Pattern,
            el.Eligibility_Data AS Eligibility,
            sy.Syllabus_Link AS Syllabus,
            id.ImportantDates_data AS Important_Dates
        FROM exam_information ei
        LEFT JOIN information_broucher ib ON ei.Info_id = ib.Info_id AND ib.EntranceExams_Id = ?
        LEFT JOIN official_webpage ow ON ei.Info_id = ow.Info_id AND ow.EntranceExams_Id = ?
        LEFT JOIN conducting_authority ca ON ei.Info_id = ca.Info_id AND ca.EntranceExams_Id = ?
        LEFT JOIN exam_pattern ep ON ei.Info_id = ep.Info_id AND ep.EntranceExams_Id = ?
        LEFT JOIN eligibility el ON ei.Info_id = el.Info_id AND el.EntranceExams_Id = ?
        LEFT JOIN syllabus sy ON ei.Info_id = sy.Info_id AND sy.EntranceExams_Id = ?
        LEFT JOIN important_dates id ON ei.Info_id = id.Info_id AND id.EntranceExams_Id = ?
        ORDER BY ei.Info_id;
        `;
        const [rows] = await db.query(query, Array(7).fill(EntranceExams_Id));
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;