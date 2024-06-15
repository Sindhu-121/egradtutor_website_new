const express = require("express");
const router = express.Router();
const db = require("../DataBase/db2");
const multer = require("multer");
const fs = require('fs').promises;
const path = require('path');
const nodemailer = require('nodemailer');
const logoPath = path.resolve(__dirname, "../logo/egate logo.png");


const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = 'uploads/DoubtSectionImeages/';
        await fs.mkdir(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
// Custom function to filter only image files
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    if (ext && mime) {
        return cb(null, true);
    } else {
        return cb('Error: Only image files are allowed!');
    }
};

const upload = multer({ storage, fileFilter });

// router.post("/submitChallenge", upload.single("image"), async (req, res) => {
//     try {
//       // Check if req.file is defined
//       if (!req.file) {
//         return res.status(400).json({ error: "No file provided" });
//       }
   
//       const { Doubt_text, user_Id, testCreationTableId, question_id } = req.body;
   
//       // Check if data already exists for the given user_Id, testCreationTableId, and question_id
//       const checkQuery = `
//           SELECT * FROM stutedntdoubtsectiondata
//           WHERE user_Id = ? AND testCreationTableId = ? AND question_id = ?
//         `;
   
//       const checkValues = [user_Id, testCreationTableId, question_id];
//       const [checkResult] = await db.query(checkQuery, checkValues);
   
//       if (checkResult.length > 0) {
//         // Data already exists, return an error message
//         console.log("Challenge already submitted for this question");
//         return res
//           .status(400)
//           .json({ error: "Challenge already submitted for this question" });
//       }
   
//       // Save only the image name in the database
//       const imageFileName = req.file.filename;
   
//       // Insert new record into the database
//       const insertQuery = `
//           INSERT INTO stutedntdoubtsectiondata (Doubt_text, Doubt_Img, user_Id, testCreationTableId, question_id)
//           VALUES (?, ?, ?, ?, ?)
//         `;
   
//       const insertValues = [
//         Doubt_text,
//         imageFileName,
//         user_Id,
//         testCreationTableId,
//         question_id,
//       ];
//       const [insertResult] = await db.query(insertQuery, insertValues);
   
//       // Respond with success message and inserted ID
//       console.log("Challenge submitted successfully");
//       res.status(201).json({
//         message: "Challenge submitted successfully",
//         insertedId: insertResult.insertId,
//       });
//     } catch (error) {
//       console.error("Error submitting challenge:", error.message);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   });

// router.post("/submitChallenge", async (req, res) => {
//   const { Doubt_text, user_Id, testCreationTableId, question_id, image } =
//     req.body;
//   console.log(Doubt_text, user_Id, testCreationTableId, question_id, image);

//   try {
//     // Get a connection from the pool
//     const connection = await db.getConnection();

//     // Insert the data into the database
//     const [result] = await connection.execute(
//       "INSERT INTO stutedntdoubtsectiondata (Doubt_text, Doubt_Img, user_Id, testCreationTableId, question_id) VALUES (?, ?, ?, ?, ?)",
//       [Doubt_text, image, user_Id, testCreationTableId, question_id]
//     );

//     // Release the connection back to the pool
//     connection.release();

//     // Send a success response
//     res.status(200).json({ message: "Message submitted successfully" });
//   } catch (error) {
//     // Handle errors
//     console.error("Error inserting message:", error);
//     res
//       .status(500)
//       .json({ message: "An error occurred while submitting the message" });
//   }
// });

router.post("/submitChallenge", async (req, res) => {
  const {
    messageBody,
    testCreationTableId,
    user_Id,
    questionId,
    selectedFile,
  } = req.body;
    console.log(req.body);

  try {
    const result = await db.execute(
      "INSERT INTO stutedntdoubtsectiondata (Doubt_text, Doubt_Img, user_Id, testCreationTableId, question_id) VALUES (?, ?, ?, ?, ?)",
      [messageBody, selectedFile, user_Id, testCreationTableId, questionId]
    );

    res.status(200).json({ message: "Message submitted successfully" });
  } catch (error) {
    console.error("Error inserting message:", error);
    res
      .status(500)
      .json({ message: "An error occurred while submitting the message" });
  }
});



router.get("/getChallenge", async (req, res) => {
    try {
      const { user_Id, testCreationTableId, question_id } = req.query;
      // console.log("user_Id",user_Id,"testCreationTableId", testCreationTableId,"question_id", question_id);
   
      // Check if user_Id, testCreationTableId, and question_id are provided
      if (!user_Id || !testCreationTableId || !question_id) {
        return res.status(400).json({ error: "Missing parameters" });
      }
   
      // Get challenge data based on user_Id, testCreationTableId, and question_id
      const query = `
        SELECT * FROM stutedntdoubtsectiondata
        WHERE user_Id = ? AND testCreationTableId = ? AND question_id = ?
      `;
   
      const values = [user_Id, testCreationTableId, question_id];
      const [result] = await db.query(query, values);
   
      if (result.length === 0) {
        // No challenge found for the given parameters
        console.log("user_Id",user_Id,"testCreationTableId", testCreationTableId,"question_id", question_id,"Challenge not found");
        return res.status(404).json({ error: "Challenge not found" });
      }
   
      // Challenge found, return the data
      // Challenge found, return the data
  console.log("Challenge found for user_Id", user_Id, "testCreationTableId", testCreationTableId, "question_id", question_id);
  res.status(200).json({ data: result });
   
      res.status(200).json({ data: result });
    } catch (error) {
      // console.error("Error getting challenge:", error.message);
      // res.status(500).json({ error: "Internal server error" });
    }
  });

router.get("/getChallengehello", async (req, res) => {
  try {
    const query = `
      SELECT * FROM stutedntdoubtsectiondata
    `;
    const [result] = await db.query(query);

    if (result.length === 0) {
      // No challenges found
      console.log("No challenges found");
      return res.status(404).json({ error: "No challenges found" });
    }

    // Challenges found, return the data
    console.log("Challenges found");
    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Error getting challenges:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get('/fetchData', async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT DISTINCT
      dd.Doubt_Id,
      dd.Doubt_text,
      dd.Doubt_Img,
      dd.user_Id,
      dd.testCreationTableId,
      tc.TestName,
      l.user_id,
      l.username,
      l.email,
      q.question_id,
      q.questionImgName,
      o.option_id,
      o.optionImgName,
      o.option_index,
      s.solution_id,
      s.solutionImgName,
      ans.answer_id,
      ans.answer_text,
      si.sort_id,
      si.sortid_text,
      doc.documen_name,
      doc.sectionId,
      doc.subjectId,
      doc.testCreationTableId,
      P.paragraphImg,
      p.paragraph_Id,
      pq.paragraphQNo_Id,
      pq.paragraphQNo
  FROM
      stutedntdoubtsectiondata dd
  JOIN test_creation_table tc ON
      dd.testCreationTableId = tc.testCreationTableId
  JOIN LOG l ON
      dd.user_Id = l.user_Id
  JOIN questions q ON
      dd.question_id = q.question_id
  LEFT OUTER JOIN OPTIONS o ON
      q.question_id = o.question_id
  LEFT OUTER JOIN answer ans ON
      q.question_id = ans.question_id
  LEFT OUTER JOIN sortid si ON
      q.question_id = si.question_id
  LEFT OUTER JOIN solution s ON
      q.question_id = s.solution_id
  LEFT OUTER JOIN paragraph p ON
      q.document_Id = p.document_Id
  LEFT OUTER JOIN paragraphqno pq ON
      p.paragraph_Id = pq.paragraph_Id AND q.question_id = pq.question_id
  LEFT OUTER JOIN ots_document doc ON
      q.document_Id = doc.document_Id
  ORDER BY
      q.question_id ASC;
      `);

        // Check if rows is not empty
        if (rows.length > 0) {
            const questionData = {
                questions: [],
            };

            // Organize data into an array of questions
            rows.forEach(row => {
                const existingQuestion = questionData.questions.find(q => q.question_id === row.question_id);
                const { username, TestName, Doubt_text, Doubt_Img,Doubt_Id } = row;
                const option = {
                    option_id: row.option_id,
                    option_index: row.option_index,
                    optionImgName: row.optionImgName,
                };

                if (existingQuestion) {
                    const existingOption = existingQuestion.options.find(opt => opt.option_id === option.option_id);

                    if (!existingOption) {
                        existingQuestion.options.push(option);
                    }
                } else {
                    const newQuestion = {
                      username: username,
                      TestName: TestName,
                      Doubt_text: Doubt_text,
                      Doubt_Img: Doubt_Img,
                      Doubt_Id: Doubt_Id,
                      question_id: row.question_id,
                      questionImgName: row.questionImgName,
                      documen_name: row.documen_name,
                      options: [option],
                      solution: {
                        solution_id: row.solution_id,
                        solutionImgName: row.solutionImgName,
                      },
                      answer: {
                        answer_id: row.answer_id,
                        answer_text: row.answer_text,
                      },
                      marks: {
                        markesId: row.markesId,
                        marks_text: row.marks_text,
                      },
                      sortid: {
                        sort_id: row.sort_id,
                        sortid_text: row.sortid_text,
                      },
                      paragraph: {},
                      paragraphqno: {},
                    };

                    // Check if paragraphqno data exists for the question
                    if (row.paragraph_Id && row.paragraphQNo) {
                        newQuestion.paragraph = {
                            paragraph_Id: row.paragraph_Id,
                            paragraphImg: row.paragraphImg,
                        };

                        newQuestion.paragraphqno = {
                            paragraphQNo_Id: row.paragraphQNo_Id,
                            paragraphQNo: row.paragraphQNo,
                        };
                    }

                    questionData.questions.push(newQuestion);
                }

            });

            res.json(questionData);
        } else {
            // Handle the case where no rows are returned (empty result set)
            res.status(404).json({ error: 'No data found' });
        }
    } catch (error) {
        console.error('Error fetching question data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get("/fetchData", async (req, res) => {
  try {
    const connection = await db.getConnection();
    const [rows] = await connection.execute(`
      SELECT DISTINCT
        dd.Doubt_Id,
        dd.Doubt_text,
        dd.Doubt_Img,
        dd.user_Id,
        dd.testCreationTableId,
        tc.TestName,
        l.user_id,
        l.username,
        l.email,
        q.question_id,
        q.questionImgName,
        o.option_id,
        o.optionImgName,
        o.option_index,
        s.solution_id,
        s.solutionImgName,
        ans.answer_id,
        ans.answer_text,
        si.sort_id,
        si.sortid_text,
        doc.documen_name,
        doc.sectionId,
        doc.subjectId,
        doc.testCreationTableId,
        P.paragraphImg,
        p.paragraph_Id,
        pq.paragraphQNo_Id,
        pq.paragraphQNo
      FROM
        stutedntdoubtsectiondata dd
      JOIN test_creation_table tc ON
        dd.testCreationTableId = tc.testCreationTableId
      JOIN LOG l ON
        dd.user_Id = l.user_Id
      JOIN questions q ON
        dd.question_id = q.question_id
      LEFT OUTER JOIN OPTIONS o ON
        q.question_id = o.question_id
      LEFT OUTER JOIN answer ans ON
        q.question_id = ans.question_id
      LEFT OUTER JOIN sortid si ON
        q.question_id = si.question_id
      LEFT OUTER JOIN solution s ON
        q.question_id = s.solution_id
      LEFT OUTER JOIN paragraph p ON
        q.document_Id = p.document_Id
      LEFT OUTER JOIN paragraphqno pq ON
        p.paragraph_Id = pq.paragraph_Id AND q.question_id = pq.question_id
      LEFT OUTER JOIN ots_document doc ON
        q.document_Id = doc.document_Id
      ORDER BY
        q.question_id ASC
    `);
    connection.release();

    res.status(200).json({ messages: rows });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching messages" });
  }
});




// router.post('/sendSolution', async (req, res) => {
//     try {
//         const { doubtId, solutionText, solutionImage } = req.body;
//       console.log('Received request with doubtId:', doubtId);
//       // Fetch user email based on doubtId (you might need to modify your query to include user email)
//       const [user] = await db.query(`
//         SELECT l.email
//         FROM stutedntdoubtsectiondata dd
//         JOIN LOG l ON dd.user_Id = l.user_Id
//         WHERE dd.Doubt_Id = ?;
//       `, [doubtId]);
      
//       const userEmail = user && user.length > 0 ? user[0].email : null;
//       console.log('User Email:', userEmail);
//       if (userEmail) {
//         // Configure Nodemailer transporter (use your email service credentials)
//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             host: "smtp.gmail.com",
//             auth: {
//               user: "egradtutorweb@gmail.com", // Your email address
//               pass: "zzwj ffce jrbn tlhs", // Your email password
//             },
//           });
  
//         // Define email options
//         // const mailOptions = {
//         //   from: "egradtutorweb@gmail.com",
//         //   to: userEmail,
//         //   subject: "Doubt Solution",
//         //   text: `Doubt ID: ${doubtId}\nSolution: ${solutionText}`,

//         //   html: `   <img src="cid:defaultLogo" alt="egradtutor" style="width: 150px;margin: 20px auto; margin-left:0; height: auto; display: block;">`,
//         //   attachments: [
//         //     {
//         //       filename: "solutionImage.png", // You can customize the filename
//         //       content: solutionImage.split(";base64,").pop(), // Extract base64 cid
//         //       cid:solutionImage.split(";base64,").pop(),
//         //       encoding: "base64",
//         //     },
//         //   ],
//         // };
// const mailOptions = {
//   from: "egradtutorweb@gmail.com",
//   to: userEmail,
//   subject: "Doubt Solution",
//   text: `Doubt ID: ${doubtId}\nSolution: ${solutionText}`,
//   html: `
//     <html>
//       <head>
//         <style>
//           img {
//             width: 150px;
//             margin: 20px auto;
//             margin-left: 0;
//             height: auto;
//             display: block;
//           }
//         </style>
//       </head>
//       <body>
//         <img src="cid:${solutionImage.split(";base64,")[1]}" alt="egradtutor">
//       </body>
//     </html>
//   `,
//   attachments: [
//     {
//       filename: "solutionImage.png",
//       content: solutionImage.split(";base64,")[1],
//       encoding: "base64",
//       cid: solutionImage.split(";base64,")[1],
//     },
//   ],
// };


//         // Send email
//         await transporter.sendMail(mailOptions);
  
//         console.log('Solution email sent successfully');
//         res.json({ success: true });
//       } else {
//         console.error('User email not found');
//         res.status(404).json({ error: 'User email not found' });
//       }
//     } catch (error) {
//       console.error('Error sending email:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });

router.post("/sendSolution", async (req, res) => {
  try {
    const { doubtId, solutionText, solutionImage } = req.body;
    console.log("doubtId:", doubtId, "solutionText:", solutionText);

    // Fetch user email based on doubtId
    const [user] = await db.query(
      `
      SELECT l.email
      FROM stutedntdoubtsectiondata dd
      JOIN LOG l ON dd.user_Id = l.user_Id
      WHERE dd.Doubt_Id = ?;
    `,
      [doubtId]
    );

    const userEmail = user && user.length > 0 ? user[0].email : null;
    console.log("User Email:", userEmail);

    if (userEmail) {
      // Configure Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "egradtutorweb@gmail.com",
          pass: "zzwj ffce jrbn tlhs",
        },
      });

      // Generate a unique CID for the image attachment
      const cid = `image-${Date.now()}`;

      // Define email options
      const mailOptions = {
        from: "egradtutorweb@gmail.com",
        to: userEmail,
        text: `Doubt ID: ${doubtId}\nSolution: ${solutionText}`,
        subject: "Doubt Solution",
        html: `
         <html>

<head>
  <style>
    img {
      width: 150px;
      margin: 20px auto;
      margin-left: 0;
      height: auto;
      display: block;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      border-collapse: collapse;
      padding: 20px;
    }

    h5 {
      font-size: 20px;
      color: #333;
      text-align: left;
      margin-top: 20px;
    }

    p {
      font-size: 16px;
      color: #333;
      text-align: left;
      margin-top: 20px;
    }
  </style>
</head>

<body>
  <div class="container">
    <div>
      <img src="cid:defaultLogo" alt="egradtutor">
    </div>
    <h5>Dear student,</h5>
    <p>We are pleased to inform you that your doubt has been successfully solved by our teacher,If you have any more doubts or need further assistance, please feel free to reach out to us.</p>

    <p>Solution: ${solutionText}</p>

    <img src="cid:${cid}" alt="egradtutor">
    <p>Thank you for using Egradtutor!</p>
  </div>
</body>

</html>
        `,
        attachments: [
          {
            filename: "solutionImage.png",
            content: solutionImage.split(";base64,")[1],
            encoding: "base64",
            cid: cid, // Use the unique CID here
          },
          {
            filename: "logo.png",
            path: logoPath,
            cid: "defaultLogo",
          },
        ],
      };

      // Send email
      await transporter.sendMail(mailOptions);

      console.log("Solution email sent successfully");
      res.json({ success: true });
    } else {
      console.error("User email not found");
      res.status(404).json({ error: "User email not found" });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




  router.get('/challenges/:questionId/user/:userId', async (req, res) => {
    try {
        const questionId = req.params.questionId;
        const userId = req.params.userId;

        // Query the database to check if the user has submitted a challenge for the question
        const [rows, fields] = await db.execute('SELECT * FROM stutedntdoubtsectiondata WHERE question_id = ? AND user_Id = ?', [questionId, userId]);

        // If there are rows returned, it means the user has submitted a challenge for this question
        const isChallengeSubmitted = rows.length > 0;

        // Send the challenge status as JSON response
        res.json({ isChallengeSubmitted });
    } catch (error) {
        console.error('Error fetching challenge status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/status/:question_id/:user_id', async (req, res) => {
    try {
        // Extract question_id and user_id from route parameters
        const { question_id, user_id } = req.params;

        // Query the database to check if the user has submitted a challenge for the specified question
        const [rows, fields] = await db.execute('SELECT COUNT(*) FROM stutedntdoubtsectiondata WHERE question_id = ? AND user_Id = ?', [question_id, user_id]);
        const hasChallenges = rows[0]['COUNT(*)'] > 0;

        // Determine the challenge status based on whether challenges have been submitted
        const isChallengeSubmitted = hasChallenges;

        // Send the challenge status as JSON response
        res.json({ isChallengeSubmitted });
    } catch (error) {
        console.error('Error fetching challenge status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});






module.exports = router;