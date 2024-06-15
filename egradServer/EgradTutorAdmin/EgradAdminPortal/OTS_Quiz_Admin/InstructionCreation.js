const express = require('express');
const router = express.Router();
const db = require('../DataBase/db2');
const multer = require('multer');
const mammoth = require('mammoth');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs').promises;

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = 'uploads/';
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    cb(null, Date.now() + path.extname(file.originalname));
    // cb(null, file.originalname);
  },
});

const upload = multer({ storage });



  
  router.get("/exams", async (req, res) => {
    try {
      const query = "SELECT examId,examName FROM exams";
      const [rows] = await db.query(query);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  router.use((req, res, next) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    next();
  });
  // kevin ---------
  // router.post("/instructionupload", upload.single("file"), async (req, res) => {
  //   try {
  //     const { file } = req;
  //     const fileName = file.originalname;
  
  //     // Read the content of the Word document
  //     const { value: fileContent } = await mammoth.extractRawText({
  //       path: file.path,
  //     });
  
  //     // Split the text into points based on a specific delimiter (e.g., dot)
  //     const pointsArray = fileContent.split("/").map((point) => point.trim());
  
  //     // Filter out empty points
  //     const filteredPointsArray = pointsArray.filter((point) => point !== "");
  
  //     // Join the array of points with a separator (e.g., comma)
  //     const pointsText = filteredPointsArray.join(", ");
  
  //     // Insert data into the instruction table
  //     const queryInstruction =
  //       "INSERT INTO instruction (examId, instructionHeading, documentName) VALUES (?, ?,  ?)";
  //     const valuesInstruction = [
  //       req.body.examId,
  //       req.body.instructionHeading,
  //       fileName,
  //     ];
  
  //     const resultInstruction = await db.query(
  //       queryInstruction,
  //       valuesInstruction
  //     );
  
  //     if (!resultInstruction || resultInstruction[0].affectedRows !== 1) {
  //       // Handle the case where the query did not succeed
  //       console.error(
  //         "Error uploading file: Failed to insert into instruction table.",
  //         resultInstruction
  //       );
  //       res.status(500).send("Failed to upload file.");
  //       return;
  //     }
  
  //     const instructionId = resultInstruction[0].insertId;
  
  //     // Log the obtained instructionId
  //     console.log("Obtained instructionId:", instructionId);
  
  //     // Insert each point into the instructions_points table with the correct instructionId
  //     const queryPoints =
  //       "INSERT INTO instructions_points (examId, points, instructionId) VALUES (?, ?, ?)";
  //     for (const point of filteredPointsArray) {
  //       // Log each point and instructionId before the insertion
  //       console.log(
  //         "Inserting point:",
  //         point,
  //         "with instructionId:",
  //         instructionId
  //       );
  //       await db.query(queryPoints, [req.body.examId, point, instructionId]);
  //     }
  
  //     // Log data to the console
  //     console.log("File uploaded successfully:", {
  //       success: true,
  //       instructionId,
  //       message: "File uploaded successfully.",
  //     });
  
  //     // Respond with a simple success message
  //     res.send("File uploaded successfully");
  //   } catch (error) {
  //     // Log error to the console
  //     console.error("Error uploading file:", error);
  
  //     // Respond with a simple error message
  //     res.status(500).send("Failed to upload file.");
  //   }
  // }); //______________________INSTRUCTION page __________________________
  
  router.get("/exams", async (req, res) => {
    try {
      const query = "SELECT examId,examName FROM exams";
      const [rows] = await db.query(query);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.use((req, res, next) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    next();
  });

  // kevin ---------
  // router.post("/upload", upload.single("file"), async (req, res) => {
  //   try {
  //     const { file } = req;
  //     const fileName = file.originalname;
  
  //     // Read the content of the Word document
  //     const { value: fileContent } = await mammoth.extractRawText({
  //       path: file.path,
  //     });
  
  //     // Split the text into points based on a specific delimiter (e.g., dot)
  //     const pointsArray = fileContent.split("/").map((point) => point.trim());
  
  //     // Filter out empty points
  //     const filteredPointsArray = pointsArray.filter((point) => point !== "");
  
  //     // Join the array of points with a separator (e.g., comma)
  //     const pointsText = filteredPointsArray.join(", ");
  
  //     // Insert data into the instruction table
  //     const queryInstruction =
  //       "INSERT INTO instruction (examId, instructionHeading, examName, documentName) VALUES (?, ?, ?, ?)";
  //     const valuesInstruction = [
  //       req.body.examId,
  //       req.body.instructionHeading,
  //       req.body.examName,
  //       fileName,
  //     ];
  
  //     const resultInstruction = await db.query(
  //       queryInstruction,
  //       valuesInstruction
  //     );
  
  //     if (!resultInstruction || resultInstruction[0].affectedRows !== 1) {
  //       // Handle the case where the query did not succeed
  //       console.error(
  //         "Error uploading file: Failed to insert into instruction table.",
  //         resultInstruction
  //       );
  //       res.status(500).send("Failed to upload file.");
  //       return;
  //     }
  
  //     const instructionId = resultInstruction[0].insertId;
  
  //     // Log the obtained instructionId
  //     console.log("Obtained instructionId:", instructionId);
  
  //     // Insert each point into the instructions_points table with the correct instructionId
  //     const queryPoints =
  //       "INSERT INTO instructions_points (examId, points, instructionId) VALUES (?, ?, ?)";
  //     for (const point of filteredPointsArray) {
  //       // Log each point and instructionId before the insertion
  //       console.log(
  //         "Inserting point:",
  //         point,
  //         "with instructionId:",
  //         instructionId
  //       );
  //       await db.query(queryPoints, [req.body.examId, point, instructionId]);
  //     }
  
  //     // Log data to the console
  //     console.log("File uploaded successfully:", {
  //       success: true,
  //       instructionId,
  //       message: "File uploaded successfully.",
  //     });
  
  //     // Respond with a simple success message
  //     res.send("File uploaded successfully");
  //   } catch (error) {
  //     // Log error to the console
  //     console.error("Error uploading file:", error);
  
  //     // Respond with a simple error message
  //     res.status(500).send("Failed to upload file.");
  //   }
  // });
  
  // router.post("/InstructionsUpdate", upload.single("file"), async (req, res) => {
  //   try {
  //     const { file } = req;
  //     const fileName = file.originalname;
  
  //     // Read the content of the Word document
  //     const { value: fileContent } = await mammoth.extractRawText({
  //       path: file.path,
  //     });
  
  //     // Split the text into points based on a specific delimiter (e.g., dot)
  //     const pointsArray = fileContent.split("/").map((point) => point.trim());
  
  //     // Filter out empty points
  //     const filteredPointsArray = pointsArray.filter((point) => point !== "");
  
  //     // Join the array of points with a separator (e.g., comma)
  //     const pointsText = filteredPointsArray.join(", ");
  
  //     // Insert data into the instruction table
  //     const queryInstruction =
  //       "INSERT INTO instruction (examId, instructionHeading, documentName) VALUES (?, ?, ?)";
  //     const valuesInstruction = [
  //       req.body.examId,
  //       req.body.instructionHeading,
  //      fileName || 'defaultFileName',
  //     ];
  
  //     const resultInstruction = await db.query(
  //       queryInstruction,
  //       valuesInstruction
  //     );
  
  //     if (!resultInstruction || resultInstruction[0].affectedRows !== 1) {
  //       // Handle the case where the query did not succeed
  //       console.error(
  //         "Error uploading file: Failed to insert into instruction table.",
  //         resultInstruction
  //       );
  //       res.status(500).json({
  //         success: false,
  //         message:
  //           "Failed to upload file. Couldn't insert into instruction table.",
  //         error: resultInstruction,
  //       });
  //       return;
  //     }
  
  //     const instructionId = resultInstruction[0].insertId;
  
  //     // Log the obtained instructionId
  //     console.log("Obtained instructionId:", instructionId);
  
  //     // Insert each point into the instructions_points table with the correct instructionId
  //     const queryPoints =
  //       "INSERT INTO instructions_points (examId, points, instructionId) VALUES (?, ?, ?)";
  //     for (const point of filteredPointsArray) {
  //       // Log each point and instructionHeading before the insertion
  //       console.log(
  //         "Inserting point:",
  //         point,
  //         "with instructionId:",
  //         instructionId
  //         // "and instructionHeading:",
  //         // req.body.instructionHeading
  //       );
  //       await db.query(queryPoints, [
  //         req.body.examId,
  //         point,
  //         instructionId,
  //         req.body.instructionHeading,
  //       ]);
  //     }
  
  //     // Log data to the console
  //     console.log("File uploaded successfully:", {
  //       success: true,
  //       instructionId,
  //       message: "File uploaded successfully.",
  //     });
  
  //     // Respond with a simple success message
  //     res.json({
  //       success: true,
  //       instructionId,
  //       message: "File uploaded successfully.",
  //     });
  //   } catch (error) {
  //     // Log error to the console
  //     console.error("Error uploading file:", error);
  
  //     // Respond with a detailed error message
  //     res.status(500).json({
  //       success: false,
  //       message: "Failed to upload file.",
  //       error: error.message,
  //     });
  //   }
  // });
  
  // router.post("/upload", upload.single("file"), async (req, res) => {
  //   try {
  //     const { file } = req;
  //     const fileName = file.originalname;
  
  //     // Read the content of the Word document
  //     const { value: fileContent } = await mammoth.extractRawText({
  //       path: file.path,
  //     });
  
  //     // Split the text into points based on a specific delimiter (e.g., dot)
  //     const pointsArray = fileContent.split("/").map((point) => point.trim());
  
  //     // Filter out empty points
  //     const filteredPointsArray = pointsArray.filter((point) => point !== "");
  
  //     // Join the array of points with a separator (e.g., comma)
  //     const pointsText = filteredPointsArray.join(", ");
  
  //     // Insert data into the instruction table
  //     const queryInstruction =
  //       "INSERT INTO instruction (examId, instructionHeading, examName, documentName) VALUES (?, ?, ?, ?)";
  //     const valuesInstruction = [
  //       req.body.examId,
  //       req.body.instructionHeading,
  //       req.body.examName,
  //       fileName,
  //     ];
  
  //     // Assuming db is properly initialized and connected
  //     const resultInstruction = await db.query(
  //       queryInstruction,
  //       valuesInstruction
  //     );
  
  //     if (!resultInstruction || resultInstruction[0].affectedRows !== 1) {
  //       // Handle the case where the query did not succeed
  //       console.error(
  //         "Error uploading file: Failed to insert into instruction table.",
  //         resultInstruction
  //       );
  //       res.status(500).send("Failed to upload file.");
  //       return;
  //     }
  
  //     const instructionId = resultInstruction[0].insertId;
  
  //     // Log the obtained instructionId
  //     console.log("Obtained instructionId:", instructionId,valuesInstruction );
  
  //     // Insert each point into the instructions_points table with the correct instructionId
  //     const queryPoints =
  //       "INSERT INTO instructions_points (examId, points, instructionId) VALUES (?, ?, ?)";
  //     for (const point of filteredPointsArray) {
  //       // Log each point and instructionId before the insertion
  //       console.log(
  //         "Inserting point:",
  //         point,
  //         "with instructionId:",
  //         instructionId
  //       );
  //       await db.query(queryPoints, [req.body.examId, point, instructionId]);
  //     }
  
  //     // Log data to the console
  //     console.log("File uploaded successfully:", {
  //       success: true,
  //       instructionId,
  //       message: "File uploaded successfully.",
  //     });
  
  //     // Respond with a simple success message
  //     res.send("File uploaded successfully");
  //   } catch (error) {
  //     // Log error to the console
  //     console.error("Error uploading file:", error);
  
  //     // Respond with a simple error message
  //     res.status(500).send("Failed to upload file.");
  //   }
  // });
  router.post("/InstructionsUpdate", upload.single("file"), async (req, res) => {
    const docxFilePath = `uploads/${req.file.filename}`;
    const { file } = req;
    const fileName = file.originalname;
  
    try {
      // Read the content of the Word document
      const fileContent = await mammoth.extractRawText({ path: file.path });
      const result = await mammoth.convertToHtml({ path: docxFilePath });
      const htmlContent = result.value;
      const $ = cheerio.load(htmlContent);
  
      // Read the image content using the correct function
      const imageContent = await readImageContent(file.path);
  
      // Check if there are images
      const images = [];
      $("img").each(function (i, element) {
        const base64Data = $(this).attr("src").replace(/^data:image\/\w+;base64,/, "");
        const imageBuffer = Buffer.from(base64Data, "base64");
        images.push(imageBuffer);
      });
  
      // Insert data into the instruction table
      const queryInstruction =
        "INSERT INTO instruction (examId, instructionHeading, documentName, instructionTable_Img) VALUES (?, ?, ?, ?)";
      const valuesInstruction = [
        req.body.examId,
        req.body.instructionHeading,
        fileName,
        images.length > 0 ? images[0] : imageContent,
      ];
  
      const resultInstruction = await db.query(queryInstruction, valuesInstruction);
  
      if (!resultInstruction || resultInstruction[0].affectedRows !== 1) {
        console.error(
          "Error uploading file: Failed to insert into instruction table.",
          resultInstruction
        );
        return res.status(500).json({
          success: false,
          message: "Failed to upload file. Couldn't insert into instruction table.",
          error: resultInstruction,
        });
      }
  
      const instructionId = resultInstruction[0].insertId;
  
      // Assuming you have filtered points as before
      const pointsArray = fileContent.value.split("/").map((point) => point.trim());
      const filteredPointsArray = pointsArray.filter((point) => point !== "");
  
      // Insert each point into the instructions_points table with the correct instructionId
      const queryPoints =
        "INSERT INTO instructions_points (examId, points, instructionId) VALUES (?, ?, ?)";
      for (const point of filteredPointsArray) {
        console.log(
          "Inserting point:",
          point,
          "with instructionId:",
          instructionId,
          "and instructionHeading:",
        );
        await db.query(queryPoints, [
          req.body.examId,
          point,
          instructionId,
        ]);
      }
  
      console.log("File and image uploaded successfully:", {
        success: true,
        instructionId,
        message: "File and image uploaded successfully.",
      });
  
      // Respond with a simple success message
      res.json({
        success: true,
        instructionId,
        message: "File and image uploaded successfully.",
      });
    } catch (error) {
      console.error("Error uploading file and image:", error);
  
      res.status(500).json({
        success: false,
        message: "Failed to upload file and image.",
        error: error.message,
      });
    }
  });
  
  
  async function readImageContent(imagePath) {
    try {
      return await fs.readFile(imagePath);
    } catch (error) {
      console.error("Error reading image content:", error);
      return null;
    }
  }

  
  router.get("/getInstructionData/:instructionId", async (req, res) => {
    try {
      const { instructionId, id } = req.params;
  
      // Fetch instruction image
      const imageBase64 = await getInstructionImage(instructionId);
  
      if (!imageBase64) {
        return res.status(404).json({
          success: false,
          message: "Image not found.",
        });
      }
  
      // Fetch points for the specified instructionId and id from the instructions_points table
      const queryPoints = "SELECT * FROM instructions_points WHERE instructionId = ?";
      const [pointsRows] = await db.query(queryPoints, [instructionId]);
  
      // Send the fetched image and points data in the response
      res.json({
        success: true,
        image: imageBase64,
        points: pointsRows,
      });
    } catch (error) {
      console.error("Error fetching instruction data:", error);
  
      // Send a consistent error response
      res.status(500).json({
        success: false,
        message: "Failed to fetch instruction data.",
        error: error.message,
      });
    }
  });
  // Function to fetch instruction image
  async function getInstructionImage(instructionId) {
    try {
      const queryImage = "SELECT instructionTable_Img FROM instruction WHERE instructionId = ?";
      const [resultImage] = await db.query(queryImage, [instructionId]);
  
      if (!resultImage || resultImage.length === 0) {
        return null; // Image not found
      }
  
      // Convert BLOB data to base64 for sending in the response
      const imageBase64 = resultImage[0].instructionTable_Img.toString("base64");
  
      return imageBase64;
    } catch (error) {
      console.error(`Error fetching instruction image: ${error.message}`);
      throw error;
    }
  }
  
  router.get("/instructionData", async (req, res) => {
    try {
      // Extract examId from request parameters
  
      // Select all points for the specified examId from the instructions_points table
      const query = "SELECT i.*,e.* FROM instruction AS i LEFT JOIN exams AS e ON i.examId=e.examId";
      const [rows] = await db.query(query);
  
      // Send the fetched data in the response
      res.json({ success: true, points: rows });
    } catch (error) {
      console.error("Error fetching instruction points:", error);
  
      // Send a consistent error response
      res.status(500).json({
        success: false,
        message: "Failed to fetch instruction points.",
        error: error.message,
      });
    }
  });
  
  router.get("/instructionpointsGet", async (req, res) => {
    try {
      // Extract examId from request parameters
      const { instructionId } = req.params;
  
      // Select all points for the specified examId from the instructions_points table
      const query = "SELECT * FROM instructions_points";
      const [rows] = await db.query(query, [instructionId]);
  
      // Send the fetched data in the response
      res.json({ success: true, points: rows });
    } catch (error) {
      console.error("Error fetching instruction points:", error);
  
      // Send a consistent error response
      res.status(500).json({
        success: false,
        message: "Failed to fetch instruction points.",
        error: error.message,
      });
    }
  });
  
  router.get("/instructionpoints/:instructionId/:id", async (req, res) => {
    try {
      const { instructionId, id } = req.params;
  
      // Select points for the specified instructionId and examId from the instructions_points table
      const query =
        "SELECT * FROM instructions_points WHERE instructionId = ? AND id = ?";
      const [rows] = await db.query(query, [instructionId, id]);
  
      // Send the fetched data in the response
      res.json({ success: true, points: rows });
    } catch (error) {
      console.error("Error fetching instruction points:", error);
  
      // Send a consistent error response
      res.status(500).json({
        success: false,
        message: "Failed to fetch instruction points.",
        error: error.message,
      });
    }
  });
  
  router.get("/instructionpoints/:instructionId/", async (req, res) => {
    try {
      const { instructionId } = req.params;
  
      // Select points for the specified instructionId and examId from the instructions_points table
      const query = "SELECT * FROM instructions_points WHERE instructionId = ?";
      const [rows] = await db.query(query, [instructionId]);
  
      // Send the fetched data in the response
      res.json({ success: true, points: rows });
    } catch (error) {
      console.error("Error fetching instruction points:", error);
  
      // Send a consistent error response
      res.status(500).json({
        success: false,
        message: "Failed to fetch instruction points.",
        error: error.message,
      });
    }
  });
  // Assuming you have an Express router and a MySQL connection pool (`db`)
  
  router.put("/updatepoints/:instructionId/:id", async (req, res) => {
    try {
      const { instructionId, id } = req.params;
      const { points } = req.body;
  
      // Update the instruction point in the database
      const updateQuery =
        "UPDATE instructions_points SET points = ? WHERE instructionId = ? AND id = ?";
      await db.query(updateQuery, [points, instructionId, id]);
  
      res.json({
        success: true,
        message: "Instruction points updated successfully.",
      });
    } catch (error) {
      console.error("Error updating instruction points:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update instruction points.",
      });
    }
  });
  
  // its delets evrey this
  router.delete("/deleteinstruction/:instructionId", async (req, res) => {
    try {
      const { instructionId } = req.params;
  
      // Delete data from the instructions_points table
      const deletePointsQuery =
        "DELETE FROM instructions_points WHERE instructionId = ?";
      const [deletePointsResult] = await db.query(deletePointsQuery, [
        instructionId,
      ]);
  
      // Delete data from the instruction table
      const deleteInstructionQuery =
        "DELETE FROM instruction WHERE instructionId = ?";
      const [deleteInstructionResult] = await db.query(deleteInstructionQuery, [
        instructionId,
      ]);
  
      if (
        deletePointsResult.affectedRows > 0 ||
        deleteInstructionResult.affectedRows > 0
      ) {
        res.json({ success: true, message: "Data deleted successfully." });
      } else {
        res.status(404).json({
          success: false,
          message: "No data found for the given instructionId.",
        });
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete data.",
        error: error.message,
      });
    }
  });
  
  // Add a new route to handle the deletion of a specific point
  router.delete("/deletepoint/:instructionId/:id", async (req, res) => {
    try {
      const { instructionId, id } = req.params;
  
      // Delete the point from the instructions_points table
      const deletePointQuery =
        "DELETE FROM instructions_points WHERE instructionId = ? AND id = ?";
      const [deleteResult] = await db.query(deletePointQuery, [
        instructionId,
        id,
      ]);
  
      if (deleteResult.affectedRows > 0) {
        res.json({ success: true, message: "Point deleted successfully." });
      } else {
        res.status(404).json({
          success: false,
          message: "No point found for the given instructionId and id.",
        });
      }
    } catch (error) {
      console.error("Error deleting point:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete point.",
        error: error.message,
      });
    }
  });
  
  router.get("/instructionpointEdit/:instructionId", async (req, res) => {
    const instructionId = req.params.instructionId;
  
    try {
      // Select all points for a specific instructionId from the instructions_points table
      const query = "SELECT * FROM instructions_points WHERE instructionId = ?";
      const [rows] = await db.query(query, [instructionId]);
  
      // Send the fetched data in the response
      res.json({ success: true, points: rows });
    } catch (error) {
      console.error("Error fetching instruction points:", error);
  
      // Send a consistent error response
      res.status(500).json({
        success: false,
        message: "Failed to fetch instruction points.",
        error: error.message,
      });
    }
  });
  
  // Ex
  // const fileUpload = require("express-fileupload");
  // router.use(fileUpload());
  // const xlsx = require("xlsx");
  // router.post('/uploadExcel', (req, res) => {
  //   try {
  //     if (!req.files || Object.keys(req.files).length === 0) {
  //       return res.status(400).json({ error: 'No files were uploaded.' });
  //     }
  
  //     const excelFile = req.files.file;
  //     const workbook = xlsx.read(excelFile.data, { type: 'buffer' });
  //     const sheetName = workbook.SheetNames[0];
  //     const sheet = workbook.Sheets[sheetName];
  //     const data = xlsx.utils.sheet_to_json(sheet);
  
  //     console.log('Received file:', excelFile);
  //     console.log('Data from file:', data);
  
  //     const columns = Object.keys(data[0]);
  //     const insertStatement = `INSERT INTO your_table (${columns.join(', ')}) VALUES ?`;
  
  //     db.query(insertStatement, [data.map(item => columns.map(col => item[col]))], (err, result) => {
  //       if (err) {
  //         console.error('Database query error:', err);
  //         res.status(500).json({ error: 'Internal Server Error' });
  //       } else {
  //         console.log('Result:', result);
  //         res.status(200).json({ message: 'Data inserted successfully.' });
  //       }
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // });
  
  // router.post("/uploadexcel", async (req, res) => {
  //   try {
  //     if (!req.files || Object.keys(req.files).length === 0) {
  //       return res.status(400).json({ error: "No files were uploaded." });
  //     }
  
  //     const { file, examId, instructionHeading } = req.files;
  //     console.log(
  //       `examId : ${examId}, instructionHeading : ${instructionHeading}`
  //     );
  
  //     const workbook = xlsx.read(file.data, { type: "buffer" });
  //     const sheetName = workbook.SheetNames[0];
  //     const sheet = workbook.Sheets[sheetName];
  //     const data = xlsx.utils.sheet_to_json(sheet);
  
  //     console.log("Received file:", file);
  //     console.log("Data from file:", data);
  
  //     // Assuming you have a column named 'examId' and 'instructionHeading' in your excel file
  //     // Modify the columns array accordingly based on your file structure
  //     const columns = Object.keys(data[0]);
  
  //     // Add 'examId' and 'instructionHeading' to the insert statement
  //     const insertStatement = `INSERT INTO your_table (examId, instructionHeading, ${columns.join(
  //       ", "
  //     )}) VALUES ?`;
  
  //     console.log("examId:", examId);
  //     console.log("instructionHeading:", instructionHeading);
  //     console.log("columns:", columns);
  
  //     // Use async/await to wait for the query result
  //     const result = await new Promise((resolve, reject) => {
  //       db.query(
  //         insertStatement,
  //         [
  //           data.map((item) => [
  //             examId,
  //             instructionHeading,
  //             ...columns.map((col) => item[col]),
  //           ]),
  //         ],
  //         (err, result) => {
  //           if (err) {
  //             console.error("Database query error:", err);
  //             reject(err);
  //           } else {
  //             console.log("Result:", result, examId);
  //             resolve(result);
  //           }
  //         }
  //       );
  //     });
  
  //     res.status(200).json({ message: "Data inserted successfully.", result });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // });
  
  //______________________end __________________________
  module.exports = router;