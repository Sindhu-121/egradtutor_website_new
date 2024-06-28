const express = require('express');
const router = express.Router();
const db = require('../../DataBase/db2');
router.get("/getCourseTabNames",async(req,res)=>{
    try {
        const[rows]=await db.query('select * from course_tab_titles')
        console.log(rows);
        // res.json(rows)
    } catch (error) {
        console.log(error,"error happened while fetching course tab names");
    }
})
module.exports = router;
