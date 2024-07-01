const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const db = require("../../DataBase/db2");
router.get("/getCourseTabNames", async (req, res) => {
  try {
    const [rows] = await db.query("select * from course_tab_titles");
    // console.log(rows);
    res.json(rows);
  } catch (error) {
    console.log(error, "error happened while fetching course tab names");
  }
});
router.post("/courseTabFormData",upload.single("courseTabImage"),async (req, res) => {
    const { coursePortaleId, courseTabId, courseTabDescription } = req.body;
    console.log(coursePortaleId, courseTabId, courseTabDescription,"from the course tab form data which is first api ");
    try {
      const tabImage = req.file.buffer;
      const [existingEntries] = await db.query(
        `select * from course_tab_details where course_portale_id=? and course_tab_title_id=?`,
        [coursePortaleId, courseTabId]
      );
      if (existingEntries.length > 0) {
        res.status(200).json({ msg: "data exists", exists: true });
      } else {
        const response = await db.query(
          "INSERT INTO course_tab_details (course_portale_id, course_tab_title_id, course_tab_text,course_tab_image) VALUES (?, ?, ?,?)",
          [coursePortaleId, courseTabId, courseTabDescription, tabImage]
        );
        console.log(response);
        res.status(200).json({ msg: "sent successfully" });
      }
    } catch (error) {
      console.log(
        error,
        "error happened while inserting the data into course_tab_details content"
      );
    }
  }
);
router.post(
  "/overwriteCourseTabData",
  upload.single("courseTabImage"),
  async (req, res) => {
    const { coursePortaleId, courseTabId, courseTabDescription } = req.body;
    console.log(coursePortaleId, courseTabId, courseTabDescription,"from over write api ");

    try {
      const tabImage = req.file.buffer;

      // Delete existing entry with the same coursePortaleId and courseTabId
      await db.query(
        "DELETE FROM course_tab_details WHERE course_portale_id = ? AND course_tab_title_id = ?",
        [coursePortaleId, courseTabId]
      );

      // Insert the new entry
      await db.query(
        "INSERT INTO course_tab_details (course_portale_id, course_tab_title_id, course_tab_text, course_tab_image) VALUES (?, ?, ?, ?)",
        [coursePortaleId, courseTabId, courseTabDescription, tabImage]
      );

      res.status(200).json({ msg: "overwritten successfully" });
    } catch (error) {
      console.log(
        error,
        "error happened while overwriting the data in course_tab_details content"
      );
      res.status(500).json({ msg: "Internal Server Error" });
    }
  }
);
router.get("/getCourseTabButtonDetails", async (req, res) => {
  try {
    const [rows] = await db.query(
      "select * from course_tab_details c LEFT JOIN course_tab_titles ctt on c.course_portale_id=ctt.course_tab_id left JOIN portales p on p.Portale_Id=c.course_portale_id"
    );
    console.log(rows);
    const result = rows.map((row) => {
      if (row.course_tab_image) {
        const base64Image = row.course_tab_image.toString("base64");
        return {
          ...row,
          course_tab_image: base64Image,
        };
      }
      return row;
    });
    res.json(result);
  } catch (error) {
    console.log(error, "error happened while getting course tab names");
  }
});

// fetching the course internal tab details
router.get('/fetchTabDetailsForEdit',async(req,res)=>{
    try {
        const [rows]= await db.query('select * from  course_tab_details');
        console.log(rows)
        res.json(rows)
    } catch (error) {   
        console.log(error,"error while fetching the details of course_tab_details table ");
    }
})
module.exports = router;
