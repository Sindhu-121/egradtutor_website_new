const express = require("express");
const router = express.Router();
const db = require("../../DataBase/db2"); // Make sure db2 is your MySQL connection pool
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Set up storage for multer
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Ensure the upload directory exists
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'webdriveegate@gmail.com',
    pass: 'qftimcrkpkbjugav' 
  }
});

// Helper function to generate random password
const generatePassword = () => {
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '!@#$%&*';
  let password = '';

  for (let i = 0; i < 2; i++) {
    password += upperCase.charAt(Math.floor(Math.random() * upperCase.length));
  }
  for (let i = 0; i < 4; i++) {
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  for (let i = 0; i < 2; i++) {
    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  }
  return password;
};

// Middleware to check if user exists
const checkUserExistence = async (req, res, next) => {
  const { emailId, contactNo } = req.body;
  const checkSql = 'SELECT * FROM otsstudentregistation WHERE emailId = ? OR contactNo = ?';
  const [existingUsers] = await db.query(checkSql, [emailId, contactNo]);

  if (existingUsers.length > 0) {
    return res.status(409).json({ exists: true });
  }
  next();
};

// Register route
router.post('/register', upload.fields([{ name: 'photo' }, { name: 'signature' }, { name: 'Proof' }]), checkUserExistence, async (req, res) => {
  try {
    const data = req.body;
    const files = req.files;
    const photo = files.photo ? files.photo[0].filename : null;
    const signature = files.signature ? files.signature[0].filename : null;
    const proof = files.Proof ? files.Proof[0].filename : null;

    const sql = `INSERT INTO otsstudentregistation (candidateName, dateOfBirth, Gender, Category, emailId, confirmEmailId, contactNo, fatherName, occupation, mobileNo, line1, state, districts, pincode, edStatusId, NameOfCollege, passingYear, marks, UplodadPhto, Signature, Proof) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      data.candidateName, data.dateOfBirth, data.Gender, data.Category, data.emailId, data.confirmEmailId, data.contactNo,
      data.fatherName, data.occupation, data.mobileNo, data.line1, data.state, data.districts, data.pincode,
      data.qualification, data.NameOfCollege, data.passingYear, data.marks, photo, signature, proof
    ];

    const [result] = await db.query(sql, values);
    const studentRegistrationId = result.insertId;

    // Send email with form data
    const mailOptions = {
      from: 'webdriveegate@gmail.com',
      to: data.emailId,
      subject: 'Registration Confirmation',
      text: `Thank you for registering. Here are your details:\n\n${JSON.stringify(data, null, 2)}`
    };

    await transporter.sendMail(mailOptions);

    // Generate credentials and send email
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);
    const credentialsMailOptions = {
      from: 'webdriveegate@gmail.com',
      to: data.emailId,
      subject: 'Your Credentials',
      text: `Your login credentials:\n\nEmail: ${data.emailId}\nPassword: ${password}`
    };

    await transporter.sendMail(credentialsMailOptions);

    // Save credentials in log table
    const logSql = `INSERT INTO log (username, email, password, role, studentregistationId) VALUES (?, ?, ?, ?, ?)`;
    const logValues = [data.candidateName, data.emailId, hashedPassword, 'User', studentRegistrationId];
    const [logResult] = await db.query(logSql, logValues);
    const userId = logResult.insertId;

    res.status(200).json({ message: 'Student registration data saved and emails sent', userId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving student registration data');
  }
});

// Check user route
router.post('/check-user', async (req, res) => {
  try {
    const { emailId, contactNo } = req.body;

    const checkSql = 'SELECT * FROM otsstudentregistation WHERE emailId = ? OR contactNo = ?';
    const [existingUsers] = await db.query(checkSql, [emailId, contactNo]);

    if (existingUsers.length > 0) {
      return res.status(200).json({ exists: true });
    }
    res.status(200).json({ exists: false });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error checking user data');
  }
});

// Change password route
router.post('/change-password', async (req, res) => {
  const { userId, oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).send('New password and confirm password do not match');
  }

  try {
    // Fetch the user from the database
    const user = await getUserById(userId);

    if (!user) {
      console.log(`User not found: ${userId}`);
      return res.status(404).send('User not found');
    }

    console.log(`User found: ${JSON.stringify(user)}`);

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      console.log(`Old password incorrect for user: ${userId}`);
      return res.status(400).send('Old password is incorrect');
    }

    // Encrypt the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await updateUserPassword(userId, hashedPassword);

    res.send('Password updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});
// Function to get user by ID
async function getUserById(userId) {
  const sql = 'SELECT * FROM log WHERE user_Id = ?';
  const [rows] = await db.query(sql, [userId]);
  console.log(`Query result for user ID ${userId}: ${JSON.stringify(rows)}`);
  return rows[0];
}

// Function to update user password
async function updateUserPassword(userId, hashedPassword) {
  const sql = 'UPDATE log SET password = ? WHERE user_Id = ?';
  await db.query(sql, [hashedPassword, userId]);
}

module.exports = router;
