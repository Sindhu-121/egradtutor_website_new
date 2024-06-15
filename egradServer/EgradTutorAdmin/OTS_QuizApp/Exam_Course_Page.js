const express = require("express");
const router = express.Router();
const moment_ = require("moment-timezone");
const moment = require("moment");
const db = require("../DataBase/db2");
const { Route } = require("react-router-dom");
const nodemailer = require("nodemailer");

router.get("/ExamCourses", async (req, res) => {
  try {
    const [results, fields] = await db.execute(
      `SELECT e.examId, e.examName, cc.courseCreationId, cc.courseName, cc.courseStartDate, cc.courseEndDate, cc.totalPrice FROM exams e JOIN course_creation_table cc ON e.examId = cc.examId `
    );

    // Map the results to the desired format
    const formattedResults = results.map((result) => {
      return {
        examId: result.examId,
        examName: result.examName,
        courseCreationId: result.courseCreationId,
        courseName: result.courseName,
        courseStartDate: result.courseStartDate,
        courseEndDate: result.courseEndDate,
        totalPrice: result.totalPrice,
        // cardImage: base64 ? `data:image/png;base64,${base64}` : null,
      };
    });

    // Send the formatted results as a JSON response
    res.json(formattedResults);
  } catch (error) {
    console.error("Error fetching Exam Courses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/test_attempt_start_time", (req, res) => {
  const { user_Id, courseCreationId, testCreationTableId } = req.body;

  // Execute the SQL query with the provided parameters and current timestamp
  const sql =
    "INSERT INTO test_attempt_start_time (user_Id, courseCreationId, testCreationTableId, studentTestStartTime) VALUES (?, ?, ?, NOW())";
  db.query(
    sql,
    [user_Id, courseCreationId, testCreationTableId],
    (err, result) => {
      if (err) {
        console.error("Error executing SQL query: " + err.stack);
        res.status(500).json({ error: "Error executing SQL query" });
        return;
      }
      console.log("Inserted successfully:", result);
      res.status(200).json({ message: "Inserted successfully" });
    }
  );
});

router.post("/buy_course", async (req, res) => {
  const { userId, courseCreationId } = req.body;

  // Validate input data
  if (!userId || !courseCreationId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Check if the entry already exists
    const count = await checkExistence(userId, courseCreationId);
    if (count > 0) {
      return res.status(400).json({ error: "Data already exists" });
    }

    // Get current time in India and format it
    const currentDate = new Date();
    const user_Bought_day_name = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(currentDate);
    const user_Bought_month_name = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(currentDate);
    const formattedDate = moment(currentDate).format("YYYY-MM-DD HH:mm:ss");

    // Insert data into the table with India time, dayName, and monthName
    const insertSql =
      "INSERT INTO student_buy_courses (user_id, courseCreationId, user_purchased_Time, user_purchased_day, user_purchased_month) VALUES (?, ?, ?, ?, ?)";
    await db.query(insertSql, [
      userId,
      courseCreationId,
      formattedDate,
      user_Bought_day_name,
      user_Bought_month_name,
    ]);

    // Log the inserted values
    console.log(
      "Inserted data into table with userId:",
      userId,
      "and courseCreationId:",
      courseCreationId,
      "at India time:",
      formattedDate,
      "dayName:",
      user_Bought_day_name,
      "monthName:",
      user_Bought_month_name
    );

    res.status(201).json({ message: "Data inserted successfully" });
  } catch (error) {
    console.error("Error processing check result:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

async function checkExistence(userId, courseCreationId) {
  const query = `
        SELECT COUNT(*) AS count 
        FROM student_buy_courses 
        WHERE user_id = ? AND courseCreationId = ?
    `;
  const [rows] = await db.query(query, [userId, courseCreationId]);
  return rows[0].count;
}

// router.get("/purchasedCourses/:userId", async (req, res) => {
//   const { userId } = req.params;
//   console.log("userId:", userId); // Log the userId for debugging purposes

//   if (!userId) {
//     return res.status(400).json({ error: "userId is required" });
//   }

//   try {
//     const query = `
//     SELECT
//     cd.*,
//     cct.courseName,
//     cct.courseStartDate,
//     cct.courseEndDate,
//     cct.totalPrice,
//     cct.cardImage,
//     e.examId,
//     e.examName,
//     oc.OVL_Course_Name,
//     oc.OVL_Course_Startdate,
//     oc.OVL_Course_Enddate,
//     oc.OVL_Course_Totalprice,
//     oc.OVL_cardImage,
//     oe.OVL_Exam_Id,
//     oe.OVL_Exam_Name,
//     sbc.user_Id,sbc.payment_status
// FROM
//     course_data AS cd
// LEFT JOIN course_creation_table AS cct
// ON
//     cct.courseCreationId = cc.courseCreationId
// LEFT JOIN ovl_course AS oc
// ON
//     oc.OVL_Course_Id = cd.OVL_Course_Id
// LEFT JOIN ovl_exams AS oe
// ON
//     oe.OVL_Exam_Id = oc.OVL_Exam_Id
// LEFT JOIN exams AS e
// ON
//     e.examId = cct.examId
// LEFT JOIN student_buy_courses AS sbc
// ON
//     cc.courseCreationId = sbc.courseCreationId
// WHERE
//     sbc.user_Id = ? AND sbc.payment_status = 1;

//     `;

//     const [results, fields] = await db.execute(query, [userId]);

//     // Organize results into a dictionary-like structure
//     const organizedData = {};

//     // Use 'forEach' to iterate over 'results' and populate 'organizedData'
//     results.forEach((result) => {
//       const cardImage = result.cardImage ? `data:image/png;base64,${result.cardImage.toString("base64")}` : null;
//       const OVL_cardImage = result.OVL_cardImage ? `data:image/png;base64,${result.OVL_cardImage.toString("base64")}` : null;

//       const courseId = result.courseCreationId || result.OVL_Course_Id;
//       const portalDescription =
//       result.Portal === "OTS" ? "Test Series" : "Video Lectures";
//       if (!organizedData[courseId]) {
//         organizedData[courseId] = {
//           courseCreationId:result.courseCreationId,
//           // portal_name:result.Test_pattern_name||result.Portal,
//           // specific_portal: result.Test_pattern_name || (result.Test_pattern_name ? "OTS" : "OVL"),
//           //  portal: result.Test_pattern_name ? "OTS" : "OVL",
//           portal_name:portalDescription,
//           specific_portal:result.Portal,
//            portal:result.Portal,
//           examId: result.examId || result.OVL_Exam_Id,
//           examName: result.examName || result.OVL_Exam_Name,
//           courseCreationId: result.courseCreationId || result.OVL_Course_Id,
//           courseName: result.courseName || result.OVL_Course_Name,
//           courseStartDate: result.courseStartDate || result.OVL_Course_Startdate,
//           courseEndDate: result.courseEndDate || result.OVL_Course_Enddate,
//           totalPrice: result.totalPrice || result.OVL_Course_Totalprice,
//           courseCardImage: cardImage || OVL_cardImage,
//         };
//       }
//     });

//     res.json(Object.values(organizedData)); // Convert 'organizedData' to array before sending it to the client
//   } catch (error) {
//     console.error("Error fetching unpurchased courses:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.get("/purchasedCourses/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const query = `
    SELECT
    cct.courseCreationId,
    cct.courseName,
    cct.courseStartDate,
    cct.courseEndDate,
    cct.totalPrice,
    cct.cardImage,
    cct.Portale_Id,
    e.examId,
    e.examName,
    p.Portale_Name,
    sbc.user_Id,
    sbc.payment_status,
    COUNT(tct.testCreationTableId) AS totalTests,
    COUNT(ovl.OVL_Linke_Id) AS totalLectures
FROM
    course_creation_table AS cct
LEFT JOIN exams AS e ON e.examId = cct.examId
LEFT JOIN portales AS p ON p.Portale_Id = cct.Portale_Id
LEFT JOIN student_buy_courses AS sbc ON sbc.courseCreationId = cct.courseCreationId
LEFT JOIN test_creation_table AS tct ON cct.courseCreationId = tct.courseCreationId
LEFT JOIN ovl_links AS ovl ON cct.courseCreationId = ovl.courseCreationId
WHERE 
    sbc.user_Id = ?
    AND sbc.payment_status = 1 
GROUP BY
    cct.courseCreationId,
    cct.courseName,
    cct.courseStartDate,
    cct.courseEndDate,
    cct.totalPrice,
    cct.cardImage,
    cct.Portale_Id,
    e.examId,
    e.examName,
    p.Portale_Name,
    sbc.user_Id,
    sbc.payment_status;
    `;

    const [results, fields] = await db.execute(query, [userId]);

    // Ensure you're using a unique identifier for each course
    const organizedData = {};

    results.forEach((result) => {
      const cardImage = result.cardImage
        ? `data:image/png;base64,${result.cardImage.toString("base64")}`
        : null;

      const courseId = result.courseCreationId;

      // Check if this courseId has already been added to organizedData
      if (!organizedData[courseId]) {
        organizedData[courseId] = {
          courseCreationId: courseId,
          courseName: result.courseName,
          courseStartDate: result.courseStartDate,
          courseEndDate: result.courseEndDate,
          totalPrice: result.totalPrice,
          courseCardImage: cardImage,
          examId: result.examId,
          examName: result.examName,
          portalName: result.Portale_Name,
          specificPortal: result.Portale_Id,
          portal: result.Portale_Id,
          totalTests: result.totalTests,
          totalLectures: result.totalLectures,
        };
      }
    });

    res.json(Object.values(organizedData)); // Return unique course data
  } catch (error) {
    console.error("Error fetching purchased courses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// SELECT
// cct.courseCreationId,
// cct.courseName,
// cct.courseStartDate,
// cct.courseEndDate,
// cct.totalPrice,
// cct.cardImage,
// cct.Portale_Id,
// e.examId,
// e.examName,
// p.Portale_Name,
// sbc.user_Id,sbc.payment_status
// FROM
// course_creation_table AS cct
// LEFT JOIN exams AS e
// ON
// e.examId = cct.examId
// LEFT JOIN portales AS p
// ON
// p.Portale_Id = cct.Portale_Id
// LEFT JOIN student_buy_courses AS sbc
// ON
// sbc.courseCreationId = cct.courseCreationId
// WHERE
// sbc.user_Id = ?
// AND sbc.payment_status = 1

//main
// router.get("/unPurchasedCourses/:userId", async (req, res) => {
//   const { userId } = req.params;
//   console.log("userId:", userId); // Log the userId for debugging purposes

//   if (!userId) {
//     return res.status(400).json({ error: "userId is required" });
//   }

//   try {
//     const query = `
//     SELECT
//     cct.courseCreationId,
//     cct.Portale_Id,
//     cct.courseName,
//     cct.courseStartDate,
//     cct.courseEndDate,
//     cct.totalPrice,
//     e.examId,
//     e.examName,
//     cct.cardImage,
//     p.Portale_Id,
//     p.Portale_Name
// FROM
//     course_creation_table cct
// LEFT JOIN exams e ON
//     e.examId = cct.examId
// LEFT JOIN portales p ON
//     p.Portale_Id = cct.Portale_Id
// WHERE
//     cct.courseCreationId NOT IN(
//     SELECT
//         sbc.courseCreationId
//     FROM
//         student_buy_courses sbc
//     WHERE
//         sbc.user_Id = ? AND sbc.payment_status = 1
// )
//     `;

//     const [results, fields] = await db.execute(query, [userId]);

//     // Organize results into a dictionary-like structure
//     const organizedData = {};

//     // Use 'forEach' to iterate over 'results' and populate 'organizedData'
//     results.forEach((result) => {
//       const cardImage = result.cardImage ? `data:image/png;base64,${result.cardImage.toString("base64")}` : null;

//       const courseId = result.courseCreationId ;
//       if (!organizedData[courseId]) {
//         organizedData[courseId] = {
//           portal: result.Portale_Name,
//           examId: result.examId ,
//           examName: result.examName ,
//           courseCreationId: result.courseCreationId ,
//           courseName: result.courseName,
//           courseStartDate: result.courseStartDate ,
//           courseEndDate: result.courseEndDate,
//           totalPrice: result.totalPrice,
//           courseCardImage: cardImage,
//         };
//       }
//     });

//     res.json(Object.values(organizedData)); // Convert 'organizedData' to array before sending it to the client
//   } catch (error) {
//     console.error("Error fetching unpurchased courses:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.get("/unPurchasedCourses/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log("userId:", userId); // Log the userId for debugging purposes

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const query = `
   SELECT
    cct.courseCreationId,
    cct.Portale_Id,
    cct.courseName,
    cct.courseStartDate,
    cct.courseEndDate,
    cct.totalPrice,
    cct.cost,
    cct.Discount,    
    e.examId,
    e.examName,
    cct.cardImage,
    p.Portale_Id,
    p.Portale_Name
FROM
    course_creation_table cct
LEFT JOIN exams e ON
    e.examId = cct.examId
LEFT JOIN portales p ON
    p.Portale_Id = cct.Portale_Id
WHERE
    cct.courseCreationId NOT IN(
    SELECT
        sbc.courseCreationId
    FROM
        student_buy_courses sbc
    WHERE
        sbc.user_Id = ? AND sbc.payment_status = 1
)
    `;

    const [results, fields] = await db.execute(query, [userId]);

    // Organize results into a dictionary-like structure
    const organizedData = {};

    // Use 'forEach' to iterate over 'results' and populate 'organizedData'
    results.forEach((result) => {
      const cardImage = result.cardImage
        ? `data:image/png;base64,${result.cardImage.toString("base64")}`
        : null;

      const courseId = result.courseCreationId;
      if (!organizedData[courseId]) {
        organizedData[courseId] = {
          portal: result.Portale_Name,
          examId: result.examId,
          examName: result.examName,
          courseCreationId: result.courseCreationId,
          courseName: result.courseName,
          courseStartDate: result.courseStartDate,
          courseEndDate: result.courseEndDate,
          totalPrice: result.totalPrice,
          discount: result.Discount,
          ActualtotalPrice: result.cost,

          courseCardImage: cardImage,
        };
      }
    });

    res.json(Object.values(organizedData)); // Convert 'organizedData' to array before sending it to the client
  } catch (error) {
    console.error("Error fetching unpurchased courses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/BuyCourses_OTS", async (req, res) => {
  try {
    // Execute the query to fetch results
    const [results, fields] = await db.execute(
      `SELECT 
          e.examId, 
          e.examName, 
          cc.courseCreationId, 
          cc.courseName, 
          cc.courseStartDate, 
          cc.courseEndDate, 
          cc.totalPrice, 
          cc.cardImage
        FROM exams e 
       LEFT JOIN course_creation_table cc ON cc.examId = e.examId`
    );

    // Map the results to the desired format
    const formattedResults = results.map((result) => {
      const base64 = result.cardImage
        ? result.cardImage.toString("base64")
        : null;

      return {
        examId: result.examId,
        examName: result.examName,
        courseCreationId: result.courseCreationId,
        courseName: result.courseName,
        courseStartDate: result.courseStartDate,
        courseEndDate: result.courseEndDate,
        totalPrice: result.totalPrice,
        cardImage: base64 ? `data:image/png;base64,${base64}` : null,
      };
    });

    // Send the formatted results as a JSON response
    res.json(formattedResults);
  } catch (error) {
    // Handle errors and send an appropriate response
    console.error("Error fetching unPurchased courses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//

router.get("/getregisterid/:userId", async (req, res) => {
  const { userId } = req.params;

  console.log("userId:", userId); // Log the userId to the console

  try {
    if (!userId) {
      throw new Error("userId is required");
    }

    const [rows] = await db.execute(
      `SELECT l.*, sbc.*,cc.*,p.*
      FROM log l
      JOIN student_buy_courses sbc ON l.studentregistationId = sbc.studentregistationId
      LEFT JOIN course_creation_table AS cc
        ON
          sbc.courseCreationId = cc.courseCreationId
          LEFT JOIN portales p ON
          p.Portale_Id = cc.Portale_Id
      WHERE l.user_id = ?`,
      [userId]
    );

    const organizedData = {};

    rows.forEach((row) => {
      const id = row.courseCreationId;
      if (!organizedData[id]) {
        organizedData[id] = {
          user_id: row.user_Id,
          payu_status: row.payu_status,
          payu_status: row.payu_status,
          payment_status: row.payment_status,
          userEmail: row.email,

          studentregistationId: row.studentregistationId,
          courseName: row.courseName,
          courseCreationId: row.courseCreationId,
          Portal: row.Portale_Name,
        };
      }
    });

    res.json(Object.values(organizedData));
  } catch (error) {
    console.error("Error fetching unPurchased courses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put(
  "/updatePaymentStatusactive/:userId/:studentRegistationId/:courseCreationId",
  async (req, res) => {
    const { userId, studentRegistationId, courseCreationId } = req.params;
    try {
      // Update the payment status in the database
      const [result, fields] = await db.execute(
        "UPDATE student_buy_courses SET payment_status = 1 WHERE user_id = ? AND studentregistationId = ? AND courseCreationId = ?",
        [userId, studentRegistationId, courseCreationId]
      );

      if (result.affectedRows === 1) {
        // Fetch student data and course data for the email
        const [userData] = await db.execute(
          "SELECT os.candidateName,os.emailId FROM otsstudentregistation os JOIN log AS l ON l.studentregistationId = os.studentregistationId WHERE os.studentregistationId = ?",
          [studentRegistationId]
        );

        const [courseData] = await db.execute(
          `SELECT cc.*,p.* FROM course_creation_table AS cc LEFT JOIN portales p ON
          p.Portale_Id = cc.Portale_Id  WHERE cc.courseCreationId = ?`,
          [courseCreationId]
        );

        const organizedData = {};
        courseData.forEach((row) => {
          const id = row.courseCreationId;
          if (!organizedData[id]) {
            organizedData[id] = {
              courseName: row.courseName,
            };
          }
        });

        if (userData.length > 0) {
          const userEmail = userData[0].emailId;

          // Send email to the user
          const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            auth: {
              user: "egradtutorweb@gmail.com",
              pass: "zzwj ffce jrbn tlhs",
            },
          });

          const mailOptions = {
            from: "egradtutorweb@gmail.com",
            to: userEmail, // Use the provided email
            subject: "Course Activated",
            text: `Dear ${userData[0].candidateName},\n\nYour test for the course  ${courseData.courseName} has been successfully activated. You may now proceed to take the test.\n\nBest regards,\nThe Egrad Tutor`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error("Error sending email:", error);
              res.status(500).json({ error: "Internal Server Error" });
            } else {
              console.log("Email sent:", info.response);
              res
                .status(200)
                .json({ message: "Payment status updated active" });
            }
          });
        } else {
          console.log(
            `No email found for student registration ID ${studentRegistationId}`
          );
          res.status(404).json({ error: "No email found for student" });
        }
      } else {
        console.log(
          `No matching record found for user ${userId} and student registration ${studentRegistationId}`
        );
        res.status(404).json({ error: "No matching record found" });
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.put(
  "/updatePaymentStatusinactive/:userId/:studentRegistationId/:courseCreationId",
  async (req, res) => {
    const { userId, studentRegistationId, courseCreationId } = req.params;
    console.log(userId);
    console.log(studentRegistationId);
    console.log(courseCreationId);
    try {
      // Update the payment status in the database
      const [result, fields] = await db.execute(
        "UPDATE student_buy_courses SET payment_status = 0 WHERE user_id = ? AND studentregistationId = ? AND courseCreationId = ?",
        [userId, studentRegistationId, courseCreationId]
      );

      if (result.affectedRows === 1) {
        console.log(
          `Payment status updated for user ${userId} and student registration ${studentRegistationId}`
        );
        res.status(200).json({ message: "Payment status updated inactive" });
      } else {
        console.log(
          `No matching record found for user ${userId} and student registration ${studentRegistationId}`
        );
        res.status(404).json({ error: "No matching record found" });
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
