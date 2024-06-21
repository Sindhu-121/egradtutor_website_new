const express = require("express");
const router = express.Router();
const db = require("../../DataBase/db2");
const nodemailer = require("nodemailer");
const mammoth = require("mammoth");
const multer = require("multer");
const fs = require("fs");



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "footerUploads/"); 
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); 
    },
  });
  
  const upload = multer({ storage: storage });


router.delete("/landingfooterContentDataOne/:content_id", async (req, res) => {
    const { content_id } = req.params;
  
    console.log("Received request to delete item with ID:", content_id);
  
    const sql = "DELETE FROM landing_page_one WHERE content_id = ?";
  
    try {
      const [results] = await db.query(sql, [content_id]);
  
      if (results.affectedRows === 0) {
        console.log(`No data found with ID ${content_id}`);
        return res.status(404).send("No data found with the provided ID");
      }
  
      console.log(`Deleted data with ID ${content_id} from landing_page_one`);
      res.send("Data deleted successfully");
    } catch (error) {
      console.error("Error executing query: " + error.stack);
      res.status(500).send("Error deleting data from the database");
    }
  });
  
  router.put(
    "/landingfooterContentDataTwoUpdate/:content_id",
    async (req, res) => {
      const { content_id } = req.params;
      const { content_name } = req.body;
  
      console.log("Received request to update item with ID:", content_id);
  
      const sql = "UPDATE landing_page_one SET content = ? WHERE content_id = ?";
  
      try {
        const [results] = await db.query(sql, [content_name, content_id]);
        console.log(`Updated data with ID ${content_id} in landing_page_two`);
        res.send("Data updated successfully");
      } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Error updating data in the database");
      }
    }
  );

  router.put(
    "/landingfooterContentDataOneUpdate/:content_id",
    async (req, res) => {
      const { content_id } = req.params;
      const { content_name } = req.body;
  
      try {
        console.log("Received request to update item with ID:", content_id);
  
        const sql =
          "UPDATE landing_page_two SET content_name = ? WHERE Content_id = ?";
        await db.query(sql, [content_name, content_id]);
  
        console.log(`Updated data with ID ${content_id} in landing_page_two`);
        res.send("Data updated successfully");
      } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Error updating data in the database");
      }
    }
  );
  
  router.delete("/landingfooterContentDataTwo/:content_id", async (req, res) => {
    const { content_id } = req.params;
  
    try {
      console.log("Received request to delete item with ID:", content_id);
  
      const sql = "DELETE FROM landing_page_two WHERE content_id = ?";
      const [results] = await db.query(sql, [content_id]);
  
      if (results.affectedRows === 0) {
        console.log(`No data found with ID ${content_id} in landing_page_two`);
        res.status(404).send("No data found with the provided ID");
        return;
      }
  
      console.log(`Deleted data with ID ${content_id} from landing_page_two`);
      res.send("Data deleted successfully");
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).send("Error deleting data from the database");
    }
  });


  router.delete(
    "/landingfooterContentDataThree/:content_id",
    async (req, res) => {
      const { content_id } = req.params;
  
      console.log("Received request to delete item with ID:", content_id);
  
      const sql = "DELETE FROM landing_copyright WHERE content_id = ?";
  
      try {
        const [results] = await db.query(sql, [content_id]);
        console.log(`Deleted data with ID ${content_id} from landing_page_one`);
        res.send("Data deleted successfully");
      } catch (error) {
        console.error("Error executing query:", error.stack);
        res.status(500).send("Error deleting data from the database");
      }
    }
  );
  
  router.put(
    "/landingfooterContentDataThreeUpdate/:content_id",
    async (req, res) => {
      const { content_id } = req.params;
      const { content_name } = req.body;
  
      console.log("Received request to update item with ID:", content_id);
  
      const sql =
        "UPDATE landing_copyright SET content_name = ? WHERE content_id = ?";
  
      try {
        await db.query(sql, [content_name, content_id]);
        console.log(`Updated data with ID ${content_id} in landing_copyright`);
        res.send("Data updated successfully");
      } catch (error) {
        console.error("Error executing query:", error.stack);
        res.status(500).send("Error updating data in the database");
      }
    }
  );


  router.post("/footerLinks", upload.single("file"), async (req, res) => {
    const { Link_Item, Link_Routing_Data } = req.body;
    let fileContent = null;
    let documentName = null;
  
    if (req.file) {
      const filePath = req.file.path;
      try {
        // Read file content using fs
        const fileData = fs.readFileSync(filePath);
  
        // Convert file content (assuming it's a document) to HTML using Mammoth
        const result = await mammoth.convertToHtml({ buffer: fileData });
        fileContent = result.value;
  
        // Get the original name of the uploaded file
        documentName = req.file.originalname;
      } catch (error) {
        console.error("Error reading or converting document:", error);
        return res.status(500).json({ message: "Error processing document" });
      }
    }
  
    try {
      // Insert data into the database
      const insertQuery =
        "INSERT INTO footer_links_table (Link_Item, Link_Routing_Data, footer_document_data, document_name) VALUES (?, ?, ?, ?)";
  
      // Insert NULL if fileContent is null (no file uploaded)
      const dbResult = await db.query(insertQuery, [
        Link_Item,
        Link_Routing_Data,
        fileContent,
        documentName,
      ]);
  
      console.log("Data inserted successfully");
      res.json({ status: "Success", message: "Data inserted successfully" });
    } catch (error) {
      console.error("Error inserting data into database:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });


  router.put("/footerLinks/:Link_Id", upload.single("file"), async (req, res) => {
    const { Link_Id } = req.params;
    const { Link_Item, Link_Routing_Data, footer_document_data, document_name } = req.body;
    let fileContent = null;
  
    // Log the received values for debugging
    console.log('Received data:', req.body);
  
    if (req.file) {
      const filePath = req.file.path;
      try {
        // Read file content using fs
        const fileData = fs.readFileSync(filePath);
  
        // Convert file content (assuming it's a document) to HTML using Mammoth
        const result = await mammoth.convertToHtml({ buffer: fileData });
        fileContent = result.value;
      } catch (error) {
        console.error("Error reading or converting document:", error);
        return res.status(500).json({ message: "Error processing document" });
      }
    }
  
    try {
      // Prepare the update query and values
      let updateQuery =
        "UPDATE footer_links_table SET Link_Item = ?, Link_Routing_Data = ?, document_name = ?";
      let updateValues = [Link_Item, Link_Routing_Data, document_name];
  
      // Add fileContent to query if file was uploaded
      if (fileContent !== null) {
        updateQuery += ", footer_document_data = ?";
        updateValues.push(fileContent);
      }
  
      updateQuery += " WHERE Link_Id = ?";
      updateValues.push(Link_Id);
  
      // Log the update query and values for debugging
      console.log('Update Query:', updateQuery);
      console.log('Update Values:', updateValues);
  
      // Update data in the database
      const dbResult = await db.query(updateQuery, updateValues);
  
      if (dbResult.affectedRows === 0) {
        return res.status(404).json({ message: "Record not found" });
      }
  
      console.log("Data updated successfully");
      res.json({ status: "Success", message: "Data updated successfully" });
    } catch (error) {
      console.error("Error updating data in database:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.delete("/footerLinksDeleteData/:Link_Id", async (req, res) => {
    const Link_Id = req.params.Link_Id;
  
    const deleteQuery = "DELETE FROM footer_links_table WHERE Link_Id = ?";
  
    try {
      await db.query(deleteQuery, [Link_Id]);
      console.log("Data deleted successfully");
      res.json({ status: "Success", message: "Data deleted successfully" });
      // res.json({ message: `Deleted Link with ID ${Link_Id}` });
    } catch (error) {
      console.error("Error deleting data from the database:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });


  router.post("/footerLinks", upload.single("file"), async (req, res) => {
    const { Link_Item, Link_Routing_Data } = req.body;
    let fileContent = null;
    let documentName = null;
   
    if (req.file) {
      const filePath = req.file.path;
      try {
        // Read file content using fs
        const fileData = fs.readFileSync(filePath);
   
        // Convert file content (assuming it's a document) to HTML using Mammoth
        const result = await mammoth.convertToHtml({ buffer: fileData });
        fileContent = result.value;
   
        // Get the original name of the uploaded file
        documentName = req.file.originalname;
      } catch (error) {
        console.error("Error reading or converting document:", error);
        return res.status(500).json({ message: "Error processing document" });
      }
    }
   
    try {
      // Insert data into the database
      const insertQuery =
        "INSERT INTO footer_links_table (Link_Item, Link_Routing_Data, footer_document_data, document_name) VALUES (?, ?, ?, ?)";
   
      // Insert NULL if fileContent is null (no file uploaded)
      const dbResult = await db.query(insertQuery, [
        Link_Item,
        Link_Routing_Data,
        fileContent,
        documentName,
      ]);
   
      console.log("Data inserted successfully");
      res.json({ status: "Success", message: "Data inserted successfully" });
    } catch (error) {
      console.error("Error inserting data into database:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

module.exports = router;