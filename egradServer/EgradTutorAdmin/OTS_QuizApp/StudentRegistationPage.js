
const express = require("express");
const router = express.Router();
const db = require("../DataBase/db2");
const multer = require("multer");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    //callback(null, "public/images");
    callback(null, "uploads/OtsStudentimeages");
  },
  filename: (req, file, callback) => {
    callback(null, `image-${Date.now()}.${file.originalname}`);
  },
});
const fs = require("fs");
const path = require("path");
const db1 = require("../DataBase/db1");
const logoPath = path.resolve(__dirname, "../logo/egate logo.png");
const userimgPath = path.resolve(__dirname, "../logo/user.png");
// const logoPath = path.resolve(__dirname, "../logo/egate logo.png");
const uploads = multer({ storage: imgconfig });


router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(express.static("public"));

router.use(bodyParser.json());
//COMPLETED
router.get("/coursedataSRP/:courseCreationId", async (req, res) => {
  const { courseCreationId } = req.params;
  try {
    // Fetch data from the database
    const [rows] = await db.query(
      `SELECT
        cc.courseName,
        cc.courseYear,
        e.examName,
        s.subjectName AS courseSubjectName,
        cc.courseCreationId,
        p.Portale_Id,
        p.Portale_Name
      FROM
        course_creation_table AS cc
      LEFT JOIN exams AS e
      ON
        e.examId = cc.examId
      LEFT JOIN course_subjects AS cs
      ON
        cs.courseCreationId = cc.courseCreationId
      LEFT JOIN subjects AS s
      ON
        s.subjectId = cs.subjectId
      LEFT JOIN portales p
      ON
        p.Portale_Id = cc.Portale_Id
      WHERE
        cc.courseCreationId = ?`,
      [courseCreationId]
    );

    // Organize the data into a JSON structure
    const organizedData = {};

    // Populate organizedData with information from the database results
    rows.forEach((row) => {
      const courseId = row.courseCreationId;

      if (!organizedData[courseId]) {
        // Initialize the course with basic information
        organizedData[courseId] = {
          courseCreationId: row.courseCreationId,
          examName: row.examName,
          courseName: row.courseName,
          courseYear: row.courseYear,
          subjects: new Set(), // Use a Set to avoid duplicate subjects
        };
      }

      // Add the subject name to the set
      if (row.courseSubjectName) {
        organizedData[courseId].subjects.add(row.courseSubjectName);
      }
    });

    // Convert subjects from Set to array and return the response
    Object.values(organizedData).forEach((course) => {
      course.subjects = Array.from(course.subjects);
    });

    res.json(Object.values(organizedData)); // Convert the object values to an array for the response
  } catch (error) {
    console.error("Error fetching course data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




router.get("/gender", async (req, res) => {
  // FetchData
  try {
    const [rows] = await db.query("SELECT * FROM gender");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/Category", async (req, res) => {
  // FetchData
  try {
    const [rows] = await db.query("SELECT * FROM category");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/states", async (req, res) => {
  // FetchData
  try {
    const [rows] = await db.query("SELECT * FROM states");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/districts/:state_id", async (req, res) => {
  const { state_id } = req.params;
  // FetchData
  try {
    const [rows] = await db.query(
      "SELECT * FROM districts WHERE state_id = ?",
      [state_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/Qualifications", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM educationstatus");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/data/:courseCreationId/:emailId", async (req, res) => {
  const { courseCreationId , emailId } = req.params;
  try {
    // Fetch exams from the database
    const [rows] = await db.query(
      `SELECT s.*, l.*, sb.payu_status,sb.courseCreationId
      FROM otsstudentregistation s 
      JOIN log l ON s.emailId = l.email 
      JOIN student_buy_courses sb ON l.user_Id = sb.user_id 
      WHERE sb.courseCreationId  = ? AND l.email = ?`,
      [courseCreationId , emailId]
    );

    console.log(courseCreationId , emailId);
    if (rows.length > 0) {
      const payuStatus = rows[0].payu_status;
      if (payuStatus === "paid") {
        // Try another email
        res.status(400).json({ error: "Try another email" });
      } else {
        // Proceed with the payment
        res.status(400).json({ error: "Proceed with the payment" });
      }
    } else {
      res.status(200).json({ message: "continue" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


function generateRandomPassword() {
  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";

  // Generate random characters
  const randomUppercase1 =
    uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];
  const randomUppercase2 =
    uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];
  const randomLowercase1 =
    lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)];
  const randomLowercase2 =
    lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)];
  const randomNumber1 = numbers[Math.floor(Math.random() * numbers.length)];
  const randomNumber2 = numbers[Math.floor(Math.random() * numbers.length)];

  // Concatenate characters to form the password
  const password =
    randomUppercase1 +
    randomUppercase2 +
    randomNumber2 +
    randomLowercase2 +
    randomNumber1 +
    randomLowercase1;

  return password;
}

router.get("/read/:id", (req, res) => {
  const sql = "SELECT * FROM studentdat WHERE id = ?";
  const Id = req.params.id;

  db.query(sql, [Id], (err, result) => {
    if (err) return res.json({ Message: "EROR in server" });
    return res.json(result);
  });
});

router.get("/", (req, res) => {
  const sql = "select * from studentdat ORDER BY id DESC LIMIT 1";
  //const sql = "SELECT *FROM  studentdata WHERE ID=(SELECT LAST_INSERT_ID())";
  // const Id = req.params.id;

  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "EROR in server getting data" });
    return res.json(result);
  });
});

const imgconfi = multer.diskStorage({
  destination: (req, file, callback) => {
    //callback(null, "public/images");
    callback(null, "../public");
  },
  filename: (req, file, callback) => {
    callback(null, `rea-${Date.now()}.${file.originalname}`);
  },
});
const upload = multer({ storage: imgconfi });

router.put(
  "/update/:id",
  upload.fields([
    { name: "UplodadPhto" },
    { name: "Signature" },
    { name: "Proof" },
  ]),
  async (req, res) => {
    try {
      const sql =
        "UPDATE studentdat SET `CandidateName`=?, `DataOfBirth`=?, `Category`=?, `EmailId`=?, `ConfirmEmailId`=?, `ContactNo`=?,  `FathersName`=?, `Occupation`=?, `MobileNo`=?, `Addres`=?, `CityTown`=?, `State`=?, `Distric`=?, `PinCode`=?, `Session`=?, `Course`=?, `Exam`=?, `Stream1`=?, `Qualification`=?, `NameOfCollage`=?, `Passingyear`=?, `MarksIn`=?, `UplodadPhto`=?, `Signature`=?, `Proof`=? WHERE ID=?";

      const Id = req.params.id;
      const {
        CandidateName,
        DataOfBirth,
        Category,
        EmailId,
        ConfirmEmailId,
        ContactNo,
        FathersName,
        Occupation,
        MobileNo,
        Addres,
        CityTown,
        State,
        Distric,
        PinCode,
        Qualification,
        NameOfCollage,
        Passingyear,
        MarksIn,
      } = req.body;

      const files = req.files;
      const UplodadPhtoPath = files.UplodadPhto[0].filename;
      const SignaturePath = files.Signature[0].filename;
      const ProofPath = files.Proof[0].filename;

      await db.queryAsync(sql, [
        CandidateName,
        DataOfBirth,
        Category,
        EmailId,
        ConfirmEmailId,
        ContactNo,
        FathersName,
        Occupation,
        MobileNo,
        Addres,
        CityTown,
        State,
        Distric,
        PinCode,
        Qualification,
        NameOfCollage,
        Passingyear,
        MarksIn,
        UplodadPhtoPath,
        SignaturePath,
        ProofPath,
        Id,
      ]);

      // Nodemailer setup
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        auth: {
          user: "webdriveegate@gmail.com",
          pass: "qftimcrkpkbjugav",
        },
      });

      const mailOptions = {
        from: "webdriveegate@gmail.com",
        to: [
          req.body.EmailId,
          "sravankumarkurumelli@gmail.com",
          "sravan.k@egradtutor.in",
        ],
        subject: req.body.EmailId,
        text: req.body.CandidateName,
        text: req.body.DataOfBirth,
        text: req.body.Gender,
        text: req.body.Category,
        text: req.body.ConfirmEmailId,
        text: req.body.ContactNo,
        text: req.body.FathersName,
        text: req.body.Occupation,
        text: req.body.MobileNo,
        text: req.body.Addres,
        text: req.body.CityTown,
        text: req.body.State,
        text: req.body.Distric,
        text: req.body.PinCode,
        text: req.body.Qualification,
        text: req.body.NameOfCollage,
        text: req.body.PassingYear,
        text: req.body.MarksIn,

        html: `
          <div style="padding:10px;">
            <h3>Your submitted data</h3>
            <ul style='color:red,list-style:none'>
            <li>Email: ${req.body.EmailId}</li>
            <li>CONFIRM EMAIL ID: ${req.body.ConfirmEmailId}</li>
            <li>CANDIDATE NAME: ${req.body.CandidateName}</li>
            <li>DATE OF BIRTH: ${req.body.DataOfBirth}</li>
            <li>CONTACT NO: ${req.body.ContactNo}</li>
            <li>FATHER'S NAME: ${req.body.FathersName}</li>
            <li>OCCUPATION: ${req.body.Occupation}</li>
            <li>MOBILE NO: ${req.body.MobileNo}</li>
            <li>LINE 1: ${req.body.Addres}</li>
            <li>CITY/TOWN: ${req.body.CityTown}</li>
            <li>PINCODE: ${req.body.PinCode}</li>
            <li>SESSION: ${req.body.Session}</li>
            <li>COURSE: ${req.body.Course}</li>
            <li>EXAM: ${req.body.Exam}</li>
            <li>SUBJECTS: ${req.body.Stream1}</li>
            <li>NAME OF COLLEGE (WITH CITY): ${req.body.NameOfCollage}</li>
            <li>PASSING YEAR: ${req.body.PassingYear}</li>
            <li>MARKS IN %: ${req.body.MarksIn}</li>
            </ul>
            <p>Any query about our courses visit our website </p>
            <h1>www.egradtutor.in</h1>
            <img src='cid:myImg' alt='dd' />
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);

      res.json({
        status: true,
        respMesg: "Update and Email Sent Successfully",
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ Message: "Error in server updating or sending email" });
    }
  }
);



router.post(
  "/StudentRegistrationPagebeforelogin/:courseCreationId",
  uploads.fields([
    { name: "files1", maxCount: 1 },
    { name: "filess", maxCount: 1 },
    { name: "filess3", maxCount: 1 },
  ]),
  async (req, res) => {
    let mailOptions;
    try {
      const formData = req.body;
      const files = req.files;

      if (!files || !files.files1 || !files.filess || !files.filess3) {
        return res
          .status(400)
          .json({ message: "File uploads are missing or invalid." });
      }
      const filename1 = files.files1[0].filename;
      const filename2 = files.filess[0].filename;
      const filename3 = files.filess3[0].filename;
      const courseCreationId = req.params.courseCreationId;
      const generatedPassword = generateRandomPassword();

      const checkExistingRecordQuery = `
        SELECT * FROM otsstudentregistation WHERE emailId = ?
      `;
      const [existingRecord] = await db.query(checkExistingRecordQuery, [
        formData.emailId
      ]);

      let studentregistationId;

      if (existingRecord.length > 0) {
        // Email already exists in otsstudentregistation table
        console.log("User with this email already exists in otsstudentregistation table.");
        studentregistationId = existingRecord[0].studentregistationId;
      } else {
        // Email does not exist in otsstudentregistation table, proceed with insertion
        // Insert the new record into otsstudentregistation table
        const insertStudentQuery = `
          INSERT INTO otsstudentregistation
            ( candidateName, dateOfBirth, GenderId, CategoryId, emailId, confirmEmailId, contactNo, fatherName, occupation, mobileNo, line1, state_id, districts_id, pincode, edStatusId, NameOfCollege, passingYear, marks, UplodadPhto, Signature, Proof, password)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
          formData.candidateName,
          formData.dateOfBirth,
          formData.GenderId,
          formData.CategoryId,
          formData.emailId,
          formData.confirmEmailId,
          formData.contactNo,
          formData.fatherName,
          formData.occupation,
          formData.mobileNo,
          formData.line1,
          formData.state_id,
          formData.districts_id,
          formData.pincode,
          formData.edStatusId,
          formData.NameOfCollege,
          formData.passingYear,
          formData.marks,
          filename1,
          filename2,
          filename3,
          generatedPassword,
        ];
        const [insertStudentResult] = await db.query(insertStudentQuery, values);
        studentregistationId = insertStudentResult.insertId;
      }

      const insertStudentPortalQuery = `
        INSERT INTO student_portal_data
          (studentregistationId, courseCreationId)
        VALUES (?, ?)
      `;
      const studentPortalValues = [
        studentregistationId,
        courseCreationId, // Assuming courseCreationId is defined somewhere
      ];
      
      await db.query(insertStudentPortalQuery, studentPortalValues);

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        auth: {
          user: "egradtutorweb@gmail.com",
          pass: "zzwj ffce jrbn tlhs",
        },
      });

      // Define async functions to fetch additional data
      async function getGenderName(id) {
        /* Function body */
      }
      async function getCategoryName(id) {
        /* Function body */
      }
      async function getStateName(id) {
        /* Function body */
      }
      async function getDistrictName(id) {
        /* Function body */
      }
     
      async function getQualificationName(id) {
        /* Function body */
      }

      // Fetch additional data
      const [
        genderName,
        categoryName,
        stateName,
        districtName,
        qualificationName,
      ] = await Promise.all([
        getGenderName(formData.GenderId),
        getCategoryName(formData.CategoryId),
        getStateName(formData.state_id),
        getDistrictName(formData.districts_id),
        getQualificationName(formData.edStatusId),
      ]);

      // Prepare mailOptions
      mailOptions = {
        from: "egradtutorweb@gmail.com",
        to: formData.emailId,
        subject: "Form Submission Confirmation",
        html: `
          <div>
            <img src="cid:defaultLogo" alt="egradtutor" style="width: 150px;margin: 20px auto; margin-left:0; height: auto; display: block;">
          </div>
          <p>Thank you for submitting the form. Your details have been received:</p>
          <div>
            <p>Candidate Name: ${formData.candidateName}</p>
            <p>Date of Birth: ${formData.dateOfBirth}</p>
  
            <p>Contact No: ${formData.contactNo}</p>
            <p>Father's Name: ${formData.fatherName}</p>
            <p>Occupation: ${formData.occupation}</p>
            <p>Mobile No: ${formData.mobileNo}</p>
            <p>Address: ${formData.line1}</p>
            
            <p>Pincode: ${formData.pincode}</p>           
           
            <p>College Name: ${formData.NameOfCollege}</p>
            <p>Passing Year: ${formData.passingYear}</p>
            <p>Marks: ${formData.marks}</p>
          </div>
        `,
        attachments: [
          {
            filename: "logo.png",
            path: logoPath, // Assuming logoPath is defined somewhere
            cid: "defaultLogo",
          },
        ],
      };

      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });

      const defaultRole = "viewer";

      const checkEmailQuery = `
        SELECT * FROM log WHERE email = ?
      `;
      const [existingEmail] = await db.query(checkEmailQuery, [
        formData.emailId,
      ]);
      if (existingEmail.length === 0) {
        // Email does not exist, insert the new record
        const loginQuery = `
          INSERT INTO log (username, email, password, role, profile_image, studentregistationId)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        let fileContent = null;
        fileContent = fs.readFileSync(userimgPath); // Assuming userimgPath is defined somewhere
        const loginValues = [
          formData.candidateName,
          formData.emailId,
          generatedPassword,
          defaultRole,
          fileContent,
          studentregistationId, // Assuming studentRegistrationId is defined somewhere
        ];
        await db.query(loginQuery, loginValues);
        console.log("Inserted into log table:", loginValues);
        console.log("You have registered successfully.");

        const transporter = nodemailer.createTransport({
          service: "Gmail",
          host: "smtp.gmail.com",
          auth: {
            user: "webdriveegate@gmail.com",
            pass: "qftimcrkpkbjugav",
          },
        });
        const loginMailOptions = {
          from: "webdriveegate@gmail.com",
          to: formData.emailId,
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
                    <td style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">${formData.candidateName}</td>
                    <td style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">${formData.emailId}</td>
                    <td style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">${generatedPassword}</td>
                  </tr>
              </table>
            </td>
          </tr>
        </table>
      `,
        };

        transporter.sendMail(loginMailOptions, (error, info) => {
          if (error) {
            console.error("Error sending login email:", error);
          } else {
            console.log("Login email sent");
          }
        });
      } else {
        // Fetch student registration ID from otsstudentregistation
        const fetchStudentRegistrationIdQuery = `
        SELECT studentregistationId FROM otsstudentregistation
        WHERE emailId = ?
    `;
        const [studentRegistrationResult] = await db.query(
          fetchStudentRegistrationIdQuery,
          [formData.emailId]
        );
        const studentRegistrationId =
          studentRegistrationResult.length > 0
            ? studentRegistrationResult[0].studentregistationId
            : null;
        console.log("Student Registration ID:", studentRegistrationId);

        if (studentRegistrationId !== null) {
          // Check if the existing user has studentregistationId = 0 or null
          const checkEmailQuery = `
            SELECT studentregistationId FROM log WHERE email = ?
        `;
          const [existingEmail] = await db.query(checkEmailQuery, [
            formData.emailId,
          ]);

          if (
            existingEmail.length > 0 &&
            (existingEmail[0].studentregistationId === 0 ||
              existingEmail[0].studentregistationId === null)
          ) {
            console.log(studentRegistrationId);

            // Update studentregistationId in log table
            const updateQuery =
              "UPDATE log SET studentregistationId = ? WHERE email = ?";
            await db.query(updateQuery, [
              studentRegistrationId,
              formData.emailId,
            ]);
            console.log(
              "Updated studentregistationId in log table for email:",
              formData.emailId
            );
          }
        } else {
          console.log("Student registration ID not found.");
        }
      }

      const checkExistingEmailQuery = `
        SELECT user_id, studentregistationId FROM log WHERE email = ?
      `;
      const [userData] = await db.query(checkExistingEmailQuery, [formData.emailId]);
      if (userData.length === 0) {
        // User with the given email does not exist
        console.log("User not found.");
      } else {
        const { user_id, studentregistationId } = userData[0];
        const checkExistingCourseQuery = `
          SELECT * FROM student_buy_courses
          WHERE courseCreationId  = ? AND user_id = ? AND studentregistationId = ?
        `;
        const [existingCourseData] = await db.query(checkExistingCourseQuery, [
          courseCreationId,
          user_id,
          studentregistationId,
        ]);
        if (existingCourseData.length > 0) {
          // Course already registered for this user
          console.log("Course already registered.");
          return res
            .status(400)
            .json({ message: "Course already registered with this EmailID" });
        } else {
          const insertCourseQuery = `
            INSERT INTO student_buy_courses (user_id, courseCreationId , studentregistationId)
            VALUES (?, ?, ?)
          `;
          const insertCourseValues = [
            user_id,
            courseCreationId,
            studentregistationId,
          ];
          await db.query(insertCourseQuery, insertCourseValues);
        }
      }

      res.status(201).json({ message: "Form submitted successfully" });
    } catch (error) {
      console.error("Error saving form data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);


router.get("/getotsregistrationdata/:courseCreationId/:userId", (req, res) => {
  const { courseCreationId, userId } = req.params;
  console.log(
    `Received courseCreationId: ${courseCreationId}, userId: ${userId}`
  );

  // Execute the SQL query to fetch data from the otsstudentregistation table
  db1.query(
    `SELECT o.*
     FROM log l
     JOIN otsstudentregistation o ON l.email = o.emailId
     WHERE l.user_Id = ?`,
    [userId],
    (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        res.status(500).json({ message: "Internal server error" });
      } else {
        if (results.length > 0) {
          console.log("Data found:", results);
          res.status(200).json({ message: "Data found", data: results });
        } else {
          console.log("Data not found");
          res.status(404).json({ message: "Data not found" });
        }
      }
    }
  );
});

router.post(
  "/insertthedatainstbtable/:courseCreationId/:userId",
  async (req, res) => {
    const { userId, courseCreationId } = req.params;
    console.log(
      `Received user_Id: ${userId}, courseCreationId: ${courseCreationId}`
    );

    try {
      // Get studentregistationId from log table
      const [logData] = await db.query(
        `SELECT studentregistationId FROM log WHERE user_Id = ?`,
        [userId]
      );

      if (logData.length === 0) {
        console.log("StudentregistationId not found for user_Id:", userId);
        res.status(404).json({ message: "StudentregistationId not found" });
        return;
      }

      const studentregistationId = logData[0].studentregistationId;

      // Check if data already exists in student_buy_courses table for the given courseCreationId
      const [existingData] = await db.query(
        `SELECT * FROM student_buy_courses WHERE courseCreationId = ?`,
        [courseCreationId]
      );

      if (existingData.length === 0) {
        // No data found, insert the data
        await db.query(
          `INSERT INTO student_buy_courses (user_Id, studentregistationId, courseCreationId) VALUES (?, ?, ?)`,
          [userId, studentregistationId, courseCreationId]
        );

        console.log("Data inserted successfully");
        res.status(200).json({ message: "Data inserted successfully" });
      } else {
        // Data already exists, do not insert
        console.log(
          "Data already exists for courseCreationId:",
          courseCreationId
        );
        res
          .status(409)
          .json({ message: "Data already exists for courseCreationId" });
      }
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get("/check-registration/:user_Id", (req, res) => {
  const { user_Id } = req.params;

  db.query(
    `SELECT o.*,l.*
     FROM log l
     LEFT JOIN otsstudentregistation o ON l.email = o.emailId
     WHERE l.user_Id = ?`,
    [user_Id],
    (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (results.length === 0) {
        console.log("Registration not found");
        return res.status(404).json({ message: "Registration not found" });
      }

      console.log("Registration found:", results);
      return res.status(200).json({ message: "Registration found" });
    }
  );
});

// router.post(
//   "/StudentRegistrationPagebeforelogin/:courseCreationId",
//   uploads.fields([
//     { name: "files1", maxCount: 1 },
//     { name: "filess", maxCount: 1 },
//     { name: "filess3", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     let mailOptions;
//     try {
//       const formData = req.body;
//       const files = req.files;

//       if (!files || !files.files1 || !files.filess || !files.filess3) {
//         return res
//           .status(400)
//           .json({ message: "File uploads are missing or invalid." });
//       }

//       const filename1 = files.files1[0].filename;
//       const filename2 = files.filess[0].filename;
//       const filename3 = files.filess3[0].filename;
//       const courseCreationId = req.params.courseCreationId;
//       const generatedPassword = generateRandomPassword();

//       console.log("Form Data:", formData);
//       console.log("Files:", files);
//       console.log("Filename 1:", filename1);
//       console.log("Filename 2:", filename2);
//       console.log("Filename 3:", filename3);
//       console.log("Course Creation ID:", courseCreationId);
//       console.log("Generated Password:", generatedPassword);

//       const checkExistingRecordQuery = `
//           SELECT * FROM otsstudentregistation
//           WHERE emailId = ? AND courseCreationId = ?
//       `;

//       const [existingRecord] = await db.query(checkExistingRecordQuery, [
//         formData.emailId,
//         courseCreationId,
//       ]);

//       if (existingRecord.length === 0) {
//         // Record with the same emailId and courseCreationId does not exist, insert the new record
//         const query = `
//               INSERT INTO otsstudentregistation
//                   (courseCreationId, candidateName, dateOfBirth, GenderId, CategoryId, emailId, confirmEmailId, contactNo, fatherName, occupation, mobileNo, line1, state_id, districts_id, pincode, edStatusId, NameOfCollege, passingYear, marks, UplodadPhto, Signature, Proof, password)
//               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//           `;
//         const values = [
//           courseCreationId,
//           formData.candidateName,
//           formData.dateOfBirth,
//           formData.GenderId,
//           formData.CategoryId,
//           formData.emailId,
//           formData.confirmEmailId,
//           formData.contactNo,
//           formData.fatherName,
//           formData.occupation,
//           formData.mobileNo,
//           formData.line1,
//           formData.state_id,
//           formData.districts_id,
//           formData.pincode,
//           formData.edStatusId,
//           formData.NameOfCollege,
//           formData.passingYear,
//           formData.marks,
//           filename1,
//           filename2,
//           filename3,
//           generatedPassword,
//         ];

//         await db.query(query, values);
//         console.log("Inserted into otsstudentregistation table:", values);
//       } else {
//         // Record with the same emailId and courseCreationId already exists
//         console.log("This email is already registered for this course.");
//         // return res.status(400).json({ message: "This email is already registered for this course." });
//       }

//       // Sending email
//       const transporter = nodemailer.createTransport({
//         service: "Gmail",
//         host: "smtp.gmail.com", // Corrected host
//         auth: {
//           user: "egradtutorweb@gmail.com",
//           pass: "zzwj ffce jrbn tlhs",
//         },
//       });

//       // Define async functions to fetch additional data
//       async function getGenderName(id) {
//         /* Function body */
//       }
//       async function getCategoryName(id) {
//         /* Function body */
//       }
//       async function getStateName(id) {
//         /* Function body */
//       }
//       async function getDistrictName(id) {
//         /* Function body */
//       }
//       async function getQualificationName(id) {
//         /* Function body */
//       }

//       // Fetch additional data
//       const [
//         genderName,
//         categoryName,
//         stateName,
//         districtName,
//         qualificationName,
//       ] = await Promise.all([
//         getGenderName(formData.GenderId),
//         getCategoryName(formData.CategoryId),
//         getStateName(formData.state_id),
//         getDistrictName(formData.districts_id),
//         getQualificationName(formData.edStatusId),
//       ]);

//       // Prepare mailOptions
//       mailOptions = {
//         from: "egradtutorweb@gmail.com",
//         to: formData.emailId,
//         subject: "Form Submission Confirmation",
//         html: `
//                  <img src="cid:defaultLogo" alt="egradtutor" style="width: 150px;margin: 20px auto; margin-left:0; height: auto; display: block;">
//               <p>Thank you for submitting the form. Your details have been received:</p>
//               <div>
//                   <p>Candidate Name: ${formData.candidateName}</p>
//                   <p>Date of Birth: ${formData.dateOfBirth}</p>
//                   <p>Contact No: ${formData.contactNo}</p>
//                   <p>Father's Name: ${formData.fatherName}</p>
//                   <p>Occupation: ${formData.occupation}</p>
//                   <p>Mobile No: ${formData.mobileNo}</p>
//                   <p>Address: ${formData.line1}</p>
//                   <p>Pincode: ${formData.pincode}</p>
//                   <p>College Name: ${formData.NameOfCollege}</p>
//                   <p>Passing Year: ${formData.passingYear}</p>
//                   <p>Marks: ${formData.marks}</p>
//               </div>
//           `,
//         attachments: [
//           {
//             filename: "logo.png",
//             path: logoPath,
//             cid: "defaultLogo",
//           },
//           // {
//           //   filename: "profileImage.jpg",
//           //   content: Buffer.from(fileContent, "base64"),
//           //   encoding: "base64",
//           //   cid: "profileImage",
//           // },
//           // <p>Gender: ${genderName}</p>
//           //         <p>Category: ${categoryName}</p>
//           //         <p>State: ${stateName}</p>
//           //         <p>District: ${districtName}</p>
//           //         <p>Qualification: ${qualificationName}</p>
//         ],
//       };

//       // Send email
//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.error("Error sending email:", error);
//         } else {
//           console.log("Email sent:", info.response);
//         }
//       });

//       const defaultRole = "viewer";
//       // const result = await db.query(query, values);
//       // const insertId = result[0].insertId;
//       // Fetch studentregistationId based on emailId
//       const fetchStudentRegistrationIdQuery = `
//        SELECT studentregistationId FROM otsstudentregistation
//        WHERE emailId = ?
//    `;
//       const [studentRegistrationResult] = await db.query(
//         fetchStudentRegistrationIdQuery,
//         [formData.emailId]
//       );
//       const studentRegistrationId =
//         studentRegistrationResult[0].studentregistationId;
//       console.log("Student Registration ID:", studentRegistrationId);
//       // ------------------- login details start-------------------------------
//       try {
//         const checkEmailQuery = `
//               SELECT * FROM log WHERE email = ?
//           `;
//         const [existingEmail] = await db.query(checkEmailQuery, [
//           formData.emailId,
//         ]);
//         if (existingEmail.length === 0) {
//           // Email does not exist, insert the new record
//           const loginQuery = `
//                   INSERT INTO log (username, email, password, role, profile_image, studentregistationId)
//                   VALUES (?, ?, ?, ?, ?, ?)
//               `;
//           let fileContent = null;
//           fileContent = fs.readFileSync(userimgPath);
//           const loginValues = [
//             formData.candidateName,
//             formData.emailId,
//             generatedPassword,
//             defaultRole,
//             fileContent,
//             studentRegistrationId,
//           ];
//           await db.query(loginQuery, loginValues);
//           console.log("Inserted into log table:", loginValues);
//           console.log("You have registered successfully.");

//           const transporter = nodemailer.createTransport({
//             service: "Gmail",
//             host: "smtp.gmail.com",
//             auth: {
//               user: "webdriveegate@gmail.com",
//               pass: "qftimcrkpkbjugav",
//             },
//           });
//           const loginMailOptions = {
//             from: "webdriveegate@gmail.com",
//             to: formData.emailId,
//             subject: "Login Details",
//             html: `
//             <div align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
//               style="max-width: 600px; margin: 20px auto; border-collapse: collapse; padding: 20px;">

//               <div>
//                 <img src="cid:defaultLogo" alt="egradtutor" style="width: 150px;margin: 20px auto; margin-left:0; height: auto; display: block;">
//               </div>
//               <p style="font-size: 16px; color: #333; text-align: center; margin-top: 20px;">Thank you for registering on
//                 Egradtutor. We hope you enjoy our service!</p>
//               </div>

//               <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
//                 style="max-width: 600px; margin: 20px auto; border-collapse: collapse; border: 1px solid rgba(0, 0, 0, 0.5); background-color: #ffffff; padding: 20px;">
//                 <tr>
//                   <td>
//                     <tr>
//                       <th style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">Username</th>
//                       <th style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">Email</th>
//                       <th style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">Password</th>
//                     </tr>
//                     <tr>
//                       <td style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">${formData.candidateName}</td>
//                       <td style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">${formData.emailId}</td>
//                       <td style="font-size: 14px; color: #666; padding: 10px; border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid rgba(0, 0, 0, 0.5);">${generatedPassword}</td>
//                     </tr>
//                 </table>
//               </td>
//             </tr>
//           </table>
//         `,
//             attachments: [
//               {
//                 filename: "logo.png",
//                 path: logoPath,
//                 cid: "defaultLogo",
//               },
//               // {
//               //   filename: "profileImage.jpg",
//               //   content: Buffer.from(fileContent, "base64"),
//               //   encoding: "base64",
//               //   cid: "profileImage",
//               // },
//             ],
//           };

//           transporter.sendMail(loginMailOptions, (error, info) => {
//             if (error) {
//               console.error("Error sending login email:", error);
//             } else {
//               console.log("Login email sent");
//             }
//           });
//         } else {
//           // Fetch student registration ID from otsstudentregistation
//           const fetchStudentRegistrationIdQuery = `
//         SELECT studentregistationId FROM otsstudentregistation
//         WHERE emailId = ?
//     `;
//           const [studentRegistrationResult] = await db.query(
//             fetchStudentRegistrationIdQuery,
//             [formData.emailId]
//           );
//           const studentRegistrationId =
//             studentRegistrationResult.length > 0
//               ? studentRegistrationResult[0].studentregistationId
//               : null;
//           console.log("Student Registration ID:", studentRegistrationId);

//           if (studentRegistrationId !== null) {
//             // Check if the existing user has studentregistationId = 0 or null
//             const checkEmailQuery = `
//             SELECT studentregistationId FROM log WHERE email = ?
//         `;
//             const [existingEmail] = await db.query(checkEmailQuery, [
//               formData.emailId,
//             ]);

//             if (
//               existingEmail.length > 0 &&
//               (existingEmail[0].studentregistationId === 0 ||
//                 existingEmail[0].studentregistationId === null)
//             ) {
//               console.log(studentRegistrationId);

//               // Update studentregistationId in log table
//               const updateQuery =
//                 "UPDATE log SET studentregistationId = ? WHERE email = ?";
//               await db.query(updateQuery, [
//                 studentRegistrationId,
//                 formData.emailId,
//               ]);
//               console.log(
//                 "Updated studentregistationId in log table for email:",
//                 formData.emailId
//               );
//             }
//           } else {
//             console.log("Student registration ID not found.");
//           }
//         }
//       } catch (error) {
//         console.error("Error saving form data:", error);
//         res.status(500).json({ message: "Internal server error" });
//       }
//       // ------------------- login details end-------------------------------

//       try {
//         const checkEmailQuery = `
//               SELECT user_id, studentregistationId FROM log WHERE email = ?
//           `;
//         const [userData] = await db.query(checkEmailQuery, [formData.emailId]);
//         if (userData.length === 0) {
//           // User with the given email does not exist
//           // return res.status(400).json({ message: "User not found." });
//           console.log("User not found.");
//         }
//         const { user_id, studentregistationId } = userData[0];
//         const checkExistingCourseQuery = `
//               SELECT * FROM student_buy_courses
//               WHERE courseCreationId = ? AND user_id = ? AND studentregistationId = ?
//           `;
//         const [existingCourseData] = await db.query(checkExistingCourseQuery, [
//           courseCreationId,
//           user_id,
//           studentregistationId,
//         ]);
//         if (existingCourseData.length > 0) {
//           // Course already registered for this user
//           console.log("Course already registered.");
//           // Redirect to a specific link
//           return res
//             .status(400)
//             .json({ message: "Course already registered with is EmailID" });
//           return res.redirect("http://localhost:3000/uglogin");
//         } else {
//           const insertCourseQuery = `
//                   INSERT INTO student_buy_courses (user_id, courseCreationId, studentregistationId)
//                   VALUES (?, ?, ?)
//               `;
//           const insertCourseValues = [
//             user_id,
//             courseCreationId,
//             studentregistationId,
//           ];
//           await db.query(insertCourseQuery, insertCourseValues);
//         }
//         // Return success message or any other necessary response
//       } catch (error) {
//         console.error("Error inserting course:", error);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }
//       res.status(201).json({ message: "Form submitted successfully" });
//     } catch (error) {
//       console.error("Error saving form data:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   }
// );
module.exports = router;
