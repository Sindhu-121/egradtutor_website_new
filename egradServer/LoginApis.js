const express = require('express');
const router = express.Router();
const db = require('./DataBase/db1');
const fs = require("fs");
const app = express();
const jwt = require("jsonwebtoken");
const sizeOf = require("image-size");
const bodyParser = require("body-parser");
const multer = require("multer");
const nodemailer = require("nodemailer");
const path = require("path");
const xlsx = require("xlsx");
const logoPath = path.resolve(__dirname, "../logo/egate logo.png");
const userimgPath = path.resolve(__dirname, "../logo/user.png");
const cors = require("cors");
app.use(cors());

app.use(bodyParser.json());

const storage_PROimg = multer.diskStorage({
    destination: function (req, file, cb) {
      // Set up the destination folder for storing uploaded profile images
      cb(null, "profilesimages/");
    },
    filename: function (req, file, cb) {
      // Define how uploaded files should be named
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  const profilesimages = multer({ storage: storage_PROimg });

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const sql = "SELECT * FROM log WHERE email = ?";
      db1.query(sql, [email], (error, results) => {
        if (error || results.length === 0) {
          res.status(401).json({ error: "Invalid email" });
          return;
        }
  
        const user = results[0];
  
        // Simulate password checking without bcrypt (not recommended for production)
        if (password !== user.password) {
          res.status(401).json({ error: "Invalid password" });
          return;
        }
  
        const token = jwt.sign({ id: user.user_Id }, "your_secret_key", {
          expiresIn: "24h", // 24 hours
        });
        const { user_Id, email, role } = user;
        res.status(200).json({ token, user: { user_Id, email, role } });
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get("/user", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      const token = authHeader.split(" ")[1]; // Extract token from Authorization header
      const decodedToken = jwt.verify(token, "your_secret_key"); // Verify and decode the token
  
      const userId = decodedToken.id; // Get user ID from decoded token
      const sql = "SELECT * FROM log WHERE user_Id = ?";
      db1.query(sql, [userId], (error, results) => {
        if (error || results.length === 0) {
          console.error("Error fetching images:", error);
          return res.status(500).send("Internal Server Error");
        }
  
        // Convert BLOB data to base64
        const userData = results[0];
        const base64Image = Buffer.from(
          userData.profile_image,
          "binary"
        ).toString("base64");
  
        const imageData = {
          id: userData.user_Id,
          username: userData.username,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          imageData: `data:image/png;base64,${base64Image}`,
  
          candidateName: userData.username,
          emailId: userData.email,
          confirmEmailId: userData.email,
        };
  
        res.status(200).json(imageData); // Send user data with image data as JSON response
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.post(
    "/register",
    profilesimages.single("profileImage"),
    async (req, res) => {
      try {
        const { username, email, phoneNumber, address } = req.body;
        const generatedPassword = generateRandomPassword();
        const defaultRole = "viewer";
        let fileContent = null;
  
        // Check if an image was uploaded
        if (req.file) {
          fileContent = fs.readFileSync(req.file.path);
        } else {
          // Use the default image from the logoPath
          fileContent = fs.readFileSync(userimgPath);
        }
  
        // Check if email already exists
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
          return res.status(400).json({ error: "Email already exists" });
        }
  
        const query = `
          INSERT INTO log (username, email, password, role, profile_image) VALUES (?, ?, ?, ?, ?)
        `;
  
        const values = [
          username,
          email,
          generatedPassword,
          defaultRole,
          fileContent,
        ];
  
        await db.query(query, values);
  
        // Sending email
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          host: "smtp.gmail.com", // Corrected host
          auth: {
            user: "webdriveegate@gmail.com",
            pass: "qftimcrkpkbjugav",
          },
        });
        const loginMailOptions = {
          from: "webdriveegate@gmail.com",
          to: email,
          subject: "Login Details",
          html: `
            <div align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
              style="max-width: 600px; margin: 20px auto; border-collapse: collapse; padding: 20px;">
  
              <div>
                <img src="cid:defaultLogo" alt="egradtutor" style="width: 150px;margin: 20px auto; margin-left:0; height: auto; display: block;">
              </div>
              <p style="font-size: 16px; color: #333; text-align: center; margin-top: 20px;">Thank you for registering on
                Egradtutor. We hope you enjoy our service!</p>
              </div>
  
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                style="max-width: 600px; margin: 20px auto; border-collapse: collapse; border: 1px solid rgba(0, 0, 0, 0.5); background-color: #ffffff; padding: 20px;">
                <tr>
                  <td>
                    <tr>
                      <th style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">Username</th>
                      <th style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">Email</th>
                      <th style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">Password</th>
                    </tr>
                    <tr>
                      <td style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">${username}</td>
                      <td style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">${email}</td>
                      <td style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">${generatedPassword}</td>
                    </tr>
                </table>
              </td>
            </tr>
          </table>
        `,
          attachments: [
            {
              filename: "logo.png",
              path: logoPath,
              cid: "defaultLogo",
            },
            {
              filename: "profileImage.jpg",
              content: Buffer.from(fileContent, "base64"),
              encoding: "base64",
              cid: "profileImage",
            },
          ],
        };
  
        transporter.sendMail(loginMailOptions, (error, info) => {
          if (error) {
            console.error("Error sending login email:", error);
          } else {
            console.log("email sent");
          }
        });
  
        // Respond with success message
        res.status(201).json({
          message: "User registered successfully. Login details sent to email.",
        });
      } catch (error) {
        console.error("Error saving form data:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );
module.exports = router;