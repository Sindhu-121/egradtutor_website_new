const express = require('express');
const router = express.Router();
const db = require('../../DataBase/db2');
const nodemailer = require("nodemailer");

router.get("/ContactUs", async (req, res) => {
    try {
      const sql = "SELECT * FROM landing_page_two";
      const [results] = await db.query(sql);
      console.log("Retrieved data from landing_page_two table:", results);
      res.json(results);
    } catch (error) {
      console.error('Error executing query:', error.stack);
      res.status(500).send('Error retrieving data from the database');
    }
  });



  
router.post('/addEnquiry', async (req, res) => {
    try {
      const { Category_Id, Category_Name, First_Name, Last_Name, Email_Address, Message } = req.body;
  
      // Validate request data (if necessary)
  
      // Insert the data into the database
      const result = await db.query(
        'INSERT INTO enquery_table (Category_Id, Category_Name, First_Name, Last_Name, Email_Address, Message) VALUES (?, ?, ?, ?, ?, ?)',
        [Category_Id, Category_Name, First_Name, Last_Name, Email_Address, Message]
      );
  
      // If insertion is successful, send a success response
      res.status(201).json({ status: 'success', message: 'Enquiry added successfully', enquiryId: result.insertId });
  
      // Now, you can send an email notification to the provided email address
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
          user: "egradtutorweb@gmail.com", // Your email address
          pass: "zzwj ffce jrbn tlhs", // Your email password
        },
      });
  
      const mailOptions = {
        from: "egradtutorweb@gmail.com", // Sender email address
        to: "egradtutorweb@gmail.com", // Receiver email address (user's email)
        subject: "Enquiry Confirmation", // Subject of the email
        html: `
          <h1>${Category_Name}</h1>
          <p>Thank you for your enquiry. We have received your message and will get back to you as soon as possible.</p>
          <h2>User Details:</h2>
          <ul>
            <li><strong>Category ID:</strong> ${Category_Id}</li>
            <li><strong>Category Name:</strong> ${Category_Name}</li>
            <li><strong>First Name:</strong> ${First_Name}</li>
            <li><strong>Last Name:</strong> ${Last_Name}</li>
            <li><strong>Email Address:</strong> ${Email_Address}</li>
            <li><strong>Message:</strong> ${Message}</li>
          </ul>
        `,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    } catch (error) {
      console.error('Error adding enquiry:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  router.get('/contact-categories', async (req, res) => {
    try {
      const categories = await db.query('SELECT * FROM contact_category_table');
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


module.exports = router;