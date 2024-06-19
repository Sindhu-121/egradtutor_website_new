const express = require('express');
const router = express.Router();
const db = require('../../DataBase/db2');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/our_courses', upload.single('image'), async (req, res) => {
    const { Portale_Id, EntranceExams_Id, UncheckedPortaleIds } = req.body;
    const image = req.file ? req.file.buffer : null;
  
    try {
      // Check if the provided Portale_Id already exists for the given EntranceExams_Id
      for (const id of Portale_Id) {
        const [existingResult] = await db.query(
          "SELECT COUNT(*) AS count FROM our_courses WHERE EntranceExams_Id = ? AND Portale_Id = ?",
          [EntranceExams_Id, id]
        );
  
        if (existingResult[0].count === 0) {
          // If Portale_Id doesn't exist, insert it into the our_courses table
          const [result] = await db.query(
            "INSERT INTO our_courses (Portale_Id, EntranceExams_Id) VALUES (?, ?)",
            [id, EntranceExams_Id]
          );
  
          console.log(
            "Portale_Id",
            id,
            "added successfully. OurCourses_Id:",
            result.insertId
          );
        } else {
          console.log(
            "Portale_Id",
            id,
            "already exists for EntranceExams_Id",
            EntranceExams_Id
          );
        }
      }
  
      // Delete entries with respect to EntranceExams_Id and Portale_Id
      if (UncheckedPortaleIds && UncheckedPortaleIds.length > 0) {
        for (const uncheckedId of UncheckedPortaleIds) {
          await db.query(
            "DELETE FROM our_courses WHERE EntranceExams_Id = ? AND Portale_Id = ?",
            [EntranceExams_Id, uncheckedId]
          );
  
          console.log(
            "Deleted Portale_Id",
            uncheckedId,
            "for EntranceExams_Id",
            EntranceExams_Id
          );
        }
      }
  
      // Insert or update image into images table
      if (image) {
        const [existingImage] = await db.query(
          "SELECT COUNT(*) AS count FROM images WHERE imeage_id = 1"
        );
  
        if (existingImage[0].count === 0) {
          const [imageResult] = await db.query(
            "INSERT INTO images (imeage_id, image) VALUES (1, ?)",
            [image]
          );
          console.log("Image uploaded successfully. Image ID:", imageResult.insertId);
        } else {
          await db.query(
            "UPDATE images SET image = ? WHERE imeage_id = 1",
            [image]
          );
          console.log("Image updated successfully for image_id = 1");
        }
      }
  
      res.status(201).json({ message: "Courses and image updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;