const express = require('express');
const router = express.Router();
const db = require('./DataBase/db1');

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

module.exports = router;