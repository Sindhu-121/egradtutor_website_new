const express = require("express");
const router = express.Router();
const db = require("../DataBase/db2");
const multer = require("multer");
const db1 = require("../DataBase/db1");
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

router.get("/type_of_tests", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT typeOfTestId, typeOfTestName FROM type_of_test"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// --------------- fetch type of Questions -----------------------------
router.get("/type_of_questions", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT quesionTypeId, typeofQuestion FROM quesion_type"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// --------------- fetch exams -----------------------------
router.get("/courese-exams", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT  examId,examName FROM exams");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// --------------- fetch subjects -----------------------------
router.get("/courese-exam-subjects/:examId/subjects", async (req, res) => {
  const examId = req.params.examId;

  try {
    const query = `
        SELECT s.subjectId, s.subjectName
        FROM subjects AS s
        JOIN exam_creation_table AS ec ON s.subjectId = ec.subjectId
        WHERE ec.examId = ?
      `;
    const [rows] = await db.query(query, [examId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --------------- inserting data into course_creation_table -----------------------------
// router.post("/course-creation", async (req, res) => {
//   const {
//     courseName,
//     courseYear,
//     examId,
//     courseStartDate,
//     courseEndDate,
//     cost,
//     discount,
//     totalPrice,
//   } = req.body;

//   try {
//     // Insert the course data into the course_creation_table
//     const [result] = await db.query(
//       "INSERT INTO course_creation_table (courseName,courseYear,  examId,  courseStartDate, courseEndDate , cost, Discount, totalPrice) VALUES (?, ?, ?, ?, ?, ?, ?,?)",
//       [
//         courseName,
//         courseYear,
//         examId,
//         courseStartDate,
//         courseEndDate,
//         cost,
//         discount,
//         totalPrice,
//       ]
//     );

//     // Check if the course creation was successful
//     if (result && result.insertId) {
//       const courseCreationId = result.insertId;

//       // Return the courseCreationId in the response
//       res.json({ message: "Course created successfully", courseCreationId });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.post(
  "/course-creation",
  upload.single("cardImage"),
  async (req, res) => {
    const {
      courseName,
      courseYear,
      examId,
      courseStartDate,
      courseEndDate,
      cost,
      discount,
      totalPrice,
      paymentlink,
      Portale_Id,
    } = req.body;

    // Ensure a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    try {
      // Insert into course creation table
      const [courseCreationResult] = await db.query(
        "INSERT INTO course_creation_table (courseName, courseYear, examId, courseStartDate, courseEndDate, cost, Discount, totalPrice, paymentlink, cardImage,Portale_Id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          courseName,
          courseYear,
          examId,
          courseStartDate,
          courseEndDate,
          cost,
          discount,
          totalPrice,
          paymentlink,
          req.file.buffer,
          Portale_Id,
        ]
      );

      const courseCreationId = courseCreationResult.insertId;

      // Insert into course_data with Portal as 'OTS'
      await db.query(
        "INSERT INTO course_data (courseCreationId, Portal) VALUES (?, 'OTS')",
        [courseCreationId]
      );
      res.json({
        success: true,
        courseCreationId,
        message: "Course created successfully",
      });
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post(
  "/courseCreation_Complete_package",
  upload.single("cardImage"),
  async (req, res) => {
    const {
      courseName,
      courseYear,
      examId,
      courseStartDate,
      courseEndDate,
      cost,
      discount,
      totalPrice,
      paymentlink,
      Portale_Id,
      subjects,
      topicName,
    } = req.body;

    // Validate and parse subject IDs
    let subjectIds = [];
    try {
      subjectIds = JSON.parse(subjects); // Attempt to parse the JSON string
      if (
        !Array.isArray(subjectIds) ||
        subjectIds.some((id) => isNaN(parseInt(id)))
      ) {
        throw new Error("Invalid subject IDs.");
      }
    } catch (error) {
      return res.status(400).json({ error: "Invalid subject IDs." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    try {
      // Insert into course creation table
      const [courseCreationResult] = await db.query(
        "INSERT INTO course_creation_table (courseName, courseYear, examId, courseStartDate, courseEndDate, cost, Discount, totalPrice, paymentlink, cardImage, Portale_Id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          courseName,
          courseYear,
          examId,
          courseStartDate,
          courseEndDate,
          cost,
          discount,
          totalPrice,
          paymentlink,
          req.file.buffer,
          Portale_Id,
        ]
      );

      const courseCreationId = courseCreationResult.insertId;

      // Insert into `course_subjects` for each subject ID
      for (const subjectId of subjectIds) {
        await db.query(
          "INSERT INTO course_subjects (courseCreationId, subjectId) VALUES (?, ?)",
          [courseCreationId, subjectId]
        );
      }

      if (topicName) {
        await db.query(
          "INSERT INTO topics (courseCreationId, subjectId, topicName) VALUES (?, ?, ?)",
          [courseCreationId, subjectIds[0], topicName]
        );
      }
      res.json({
        success: true,
        courseCreationId,
        message: "Course created successfully.",
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error." });
    }
  }
);

// ======updating API for complete package course in course creation==========
router.put(
  "/complete_course_updation/:courseCreationId/:portalId",
  upload.single("cardImage"),
  async (req, res) => {
    const {
      courseName,
      courseYear,
      examId,
      courseStartDate,
      courseEndDate,
      cost,
      discount,
      totalPrice,
      paymentlink,
      subjects,
      topicName,
    } = req.body;
    const cardImg = req.file ? req.file.buffer : null;
    const courseCreationIdToPost = req.params.courseCreationId;
    const portalId = req.params.portalId;
    console.log(portalId, "portal id from params at backend ");
    const cSQuery = "DELETE FROM course_subjects WHERE courseCreationId=?";
    await db.query(cSQuery, [courseCreationIdToPost]);
    console.log(
      "Deleted rows from course_subjects table for courseCreationId:",
      courseCreationIdToPost
    );
    // from topics table
    const topicDelQuery = "DELETE FROM topics WHERE courseCreationId=? ";
    await db.query(topicDelQuery, [courseCreationIdToPost]);
    console.log(
      "Deleted rows from topics table for courseCreationId:",
      courseCreationIdToPost
    );
    // NOW INSERTING QUERY SO THAT NO DUPLICATES WILL BE INSERTED INTO THE TABLE

    // insert into the course_subjects table
    let subIds = [];
    try {
      subIds = JSON.parse(subjects);
      if (!Array.isArray(subIds) || subIds.some((id) => isNaN(parseInt(id)))) {
        throw new Error(
          "Invalid subject IDs.......from the destructuring of the subject ids "
        );
      }
    } catch (error) {
      console.log(
        courseName,
        courseYear,
        examId,
        courseStartDate,
        courseEndDate,
        cost,
        discount,
        totalPrice,
        paymentlink,
        portalId,
        subjects,
        topicName,
        courseCreationIdToPost
      );
      return res
        .status(400)
        .json({ error: "Invalid subject IDs from catch ...." });
    }
    console.log(
      courseName,
      courseYear,
      examId,
      courseStartDate,
      courseEndDate,
      cost,
      discount,
      totalPrice,
      paymentlink,
      portalId,
      subjects,
      topicName,
      courseCreationIdToPost
    );
    if (cardImg) {
      console.log("try block with the image ");
      try {
        await db.query(
          `UPDATE course_creation_table 
      SET courseName = ?, 
          courseYear = ?, 
          examId = ?, 
          courseStartDate = ?, 
          courseEndDate = ?, 
          cost = ?, 
          Discount = ?, 
          totalPrice = ?, 
          paymentlink = ?, 
          cardImage = ? 
      WHERE courseCreationId = ? AND Portale_Id = ?
      `,
          [
            courseName,
            courseYear,
            examId,
            courseStartDate,
            courseEndDate,
            cost,
            discount,
            totalPrice,
            paymentlink,
            req.file.buffer,
            courseCreationIdToPost,
            portalId,
          ]
        );
        for (const sub of subIds) {
          await db.query(
            `
        INSERT INTO course_subjects (courseCreationId, subjectId) VALUES (?, ?)`,
            [courseCreationIdToPost, sub]
          );
        }
        if (topicName) {
          await db.query(
            "INSERT INTO topics (courseCreationId, subjectId, topicName) VALUES (?, ?, ?)",
            [courseCreationIdToPost, subIds[0], topicName]
          );
        } else {
          console.log("error in topicName");
        }
        res.json({
          success: true,
          courseCreationIdToPost,
          message: "Course updated successfully ",
        });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
      }
    } else {
      console.log("else block withoutt the image ");
      try {
        await db.query(
          `UPDATE course_creation_table 
      SET courseName = ?, 
          courseYear = ?, 
          examId = ?, 
          courseStartDate = ?, 
          courseEndDate = ?, 
          cost = ?, 
          Discount = ?, 
          totalPrice = ?, 
          paymentlink = ?
      WHERE courseCreationId = ? AND Portale_Id = ?
      `,
          [
            courseName,
            courseYear,
            examId,
            courseStartDate,
            courseEndDate,
            cost,
            discount,
            totalPrice,
            paymentlink,
            courseCreationIdToPost,
            portalId,
          ]
        );
        for (const sub of subIds) {
          await db.query(
            `
        INSERT INTO course_subjects (courseCreationId, subjectId) VALUES (?, ?)`,
            [courseCreationIdToPost, sub]
          );
        }
        if (topicName) {
          await db.query(
            "INSERT INTO topics (courseCreationId, subjectId, topicName) VALUES (?, ?, ?)",
            [courseCreationIdToPost, subIds[0], topicName]
          );
        } else {
          console.log("error in topicName");
        }
        res.json({
          success: true,
          courseCreationIdToPost,
          message: "Course updated successfully ",
        });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
      }
    }

    // insert into topics table
  }
);

// ==================================================================

// --------------- inserting data into course_typeOftests,course_subjects,course_type_of_question  -----------------------------
router.post("/course_type_of_question", async (req, res) => {
  try {
    // Extract data from the request body
    const { courseCreationId, typeOfTestIds, subjectIds, typeofQuestion } =
      req.body;
    // console.log('Received request to add subjects and question types for courseCreationId:', courseCreationId);

    console.log("Received data:", req.body);
    const deleteQueryForcourse_subjects =
      "delete from course_subjects where 	courseCreationId =?";
    await db.query(deleteQueryForcourse_subjects, courseCreationId);
    console.log("deleeeeeeeeeeeeeettttttttttttttttttttttteeeeeeeeeeeeee");
    // Insert subjects into the course_subjects table
    for (const typeOfTestId of typeOfTestIds) {
      const query =
        "INSERT INTO course_typeOftests (courseCreationId, typeOfTestId) VALUES (?, ?)";
      const values = [courseCreationId, typeOfTestId];

      // Log the query before execution
      console.log("Executing query:", db.format(query, values));

      // Execute the query
      await db.query(query, values);
    }
    console.log("Received data:", req.body);
    const deleteQueryctq =
      "delete from course_type_of_question where 	courseCreationId =?";
    await db.query(deleteQueryctq, courseCreationId);
    console.log(
      "deleeeeeeeeeeeeeettttttttttttttttttttttteeeeeeeeeeeeee in course_type_of_question"
    );
    console.log("Received data:", req.body);
    for (const subjectId of subjectIds) {
      const query =
        "INSERT INTO course_subjects (courseCreationId, subjectId) VALUES (?, ?)";
      const values = [courseCreationId, subjectId];
      console.log("Executing query:", db.format(query, values));
      await db.query(query, values);
    }

    // Insert question types into the course_type_of_question table
    for (const quesionTypeId of typeofQuestion) {
      const query =
        "INSERT INTO course_type_of_question (courseCreationId, quesionTypeId) VALUES (?, ?)";
      const values = [courseCreationId, quesionTypeId];
      console.log("Executing query:", db.format(query, values));
      await db.query(query, values);
    }
    // Respond with success message
    res.json({
      success: true,
      message: "Subjects and question types added successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});
// --------------- geting data  course_creation_table,course_typeOftests,course_subjects,course_type_of_question  -----------------------------

// router.get("/course_creation_table", async (req, res) => {
//   try {
//     const query = `
//       SELECT
//         cc.courseCreationId,
//         cc.courseName,
//         cc.courseYear,
//         cc.courseStartDate,
//         cc.courseEndDate,
//         cc.cost,
//         cc.Discount,
//         cc.totalPrice,
//         cc.paymentlink,
//         cc.Portale_Id,
//         p.Portale_Name,
//         e.examName,
//         subjects.subjects AS subjects,
//         questions.quesion_types AS question_types,
//         typeOfTests.type_of_test AS type_of_test,
//       FROM
//         course_creation_table cc
//        LEFT JOIN exams e ON
//         cc.examId = e.examId
//         LEFT JOIN portales p ON
//         cc.Portale_Id = p.Portale_Id
//       LEFT JOIN (
//         SELECT cs.courseCreationId,
//           GROUP_CONCAT(s.subjectName) AS subjects
//         FROM
//           course_subjects cs
//         LEFT JOIN subjects s ON
//           cs.subjectId = s.subjectId
//         GROUP BY
//           cs.courseCreationId
//       ) AS subjects
//       ON
//         cc.courseCreationId = subjects.courseCreationId
//       LEFT JOIN (
//         SELECT ct.courseCreationId,
//           GROUP_CONCAT(q.typeofQuestion) AS quesion_types
//         FROM
//           course_type_of_question ct
//         LEFT JOIN quesion_type q ON
//           ct.quesionTypeId = q.quesionTypeId
//         GROUP BY
//           ct.courseCreationId
//       ) AS questions
//       ON
//         cc.courseCreationId = questions.courseCreationId
//       LEFT JOIN (
//         SELECT ctt.courseCreationId,
//           GROUP_CONCAT(t.typeOfTestName) AS type_of_test
//         FROM
//           course_typeoftests ctt
//         LEFT JOIN type_of_test t ON
//           ctt.typeOfTestId = t.typeOfTestId
//         GROUP BY
//           ctt.courseCreationId
//       ) AS typeOfTests
//       ON
//         cc.courseCreationId = typeOfTests.courseCreationId
//       GROUP BY
//         cc.courseCreationId
//     `;

//     const [rows] = await db.query(query);
//     res.json(rows);

//   } catch (error) {
//     console.error("Error fetching course data:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.get("/course_creation_table", async (req, res) => {
  try {
    const query = `
    SELECT
    cc.courseCreationId,
    cc.courseName,
    cc.courseYear,
    cc.courseStartDate,
    cc.courseEndDate,
    cc.cost,
    cc.Discount,
    cc.totalPrice,
    cc.paymentlink,
    cc.Portale_Id,
    p.Portale_Name,
    e.examName,
    subjects.subjects AS subjects,
    questions.quesion_types AS question_types,
    typeOfTests.type_of_test AS type_of_test,
    tp.topicName 
  FROM
    course_creation_table cc
   LEFT JOIN exams e ON
    cc.examId = e.examId
    LEFT JOIN portales p ON
    cc.Portale_Id = p.Portale_Id
  LEFT JOIN (
    SELECT cs.courseCreationId,
      GROUP_CONCAT(s.subjectName) AS subjects
    FROM
      course_subjects cs
    LEFT JOIN subjects s ON
      cs.subjectId = s.subjectId
    GROUP BY
      cs.courseCreationId
  ) AS subjects
  ON
    cc.courseCreationId = subjects.courseCreationId
  LEFT JOIN (
    SELECT ct.courseCreationId,
      GROUP_CONCAT(q.typeofQuestion) AS quesion_types
    FROM
      course_type_of_question ct
    LEFT JOIN quesion_type q ON
      ct.quesionTypeId = q.quesionTypeId
    GROUP BY
      ct.courseCreationId
  ) AS questions
  ON
    cc.courseCreationId = questions.courseCreationId
  LEFT JOIN (
    SELECT ctt.courseCreationId,
      GROUP_CONCAT(t.typeOfTestName) AS type_of_test
    FROM
      course_typeoftests ctt
    LEFT JOIN type_of_test t ON
      ctt.typeOfTestId = t.typeOfTestId
    GROUP BY
      ctt.courseCreationId
  ) AS typeOfTests
  ON
    cc.courseCreationId = typeOfTests.courseCreationId
  LEFT JOIN
    selected_test_pattern stp ON stp.courseCreationId = cc.courseCreationId
    LEFT JOIN topics tp ON
    cc.courseCreationId= tp.courseCreationId
  GROUP BY
    cc.courseCreationId;
    `;

    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching course data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --------------- deleting data into course_creation_table,course_typeOftests,course_subjects,course_type_of_question  -----------------------------
router.delete(
  "/course_creation_table_Delete/:courseCreationId",
  async (req, res) => {
    const courseCreationId = req.params.courseCreationId;

    try {
      await db.query(
        `DELETE
        course_creation_table,
        course_subjects,
        course_type_of_question,
        course_typeoftests,course_data
    FROM
        course_creation_table
    LEFT JOIN course_typeoftests ON course_creation_table.courseCreationId = course_typeoftests.courseCreationId
    LEFT JOIN course_subjects ON course_creation_table.courseCreationId = course_subjects.courseCreationId
    LEFT JOIN course_data ON course_creation_table.courseCreationId = course_data.courseCreationId
    LEFT JOIN course_type_of_question ON course_creation_table.courseCreationId = course_type_of_question.courseCreationId
    WHERE
        course_creation_table.courseCreationId = ?`,
        [courseCreationId]
      );

      res.json({
        message: `course with ID ${courseCreationId} deleted from the database`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// --------------- updating data into course_creation_table,course_typeOftests,course_subjects,course_type_of_question  -----------------------------
// router.get("/courseupdate/:portalId/:courseCreationId", async (req, res) => {
//   const courseCreationId = req.params.courseCreationId;

//   try {
//     const query = `
//         SELECT
//         cc.*,
//         subjects.subjects AS subjects,
//         questions.quesion_types AS question_types,
//         e.examName,
//         typeOfTests.type_of_test AS type_of_test,
//         tp.topicName
//     FROM
//         course_creation_table cc

//      LEFT JOIN(
//         SELECT ctt.courseCreationId,
//             GROUP_CONCAT(t.typeOfTestName) AS type_of_test
//         FROM
//             course_typeoftests ctt
//         LEFT JOIN type_of_test t ON
//             ctt.typeOfTestId = t.typeOfTestId
//         GROUP BY
//             ctt.courseCreationId
//     ) AS typeOfTests
//     ON
//         cc.courseCreationId = typeOfTests.courseCreationId

//     LEFT JOIN(
//         SELECT cs.courseCreationId,
//             GROUP_CONCAT(s.subjectName) AS subjects
//         FROM
//             course_subjects cs
//         LEFT JOIN subjects s ON
//             cs.subjectId = s.subjectId
//         GROUP BY
//             cs.courseCreationId
//     ) AS subjects
//     ON
//         cc.courseCreationId = subjects.courseCreationId
//     LEFT JOIN(
//         SELECT ct.courseCreationId,
//             GROUP_CONCAT(q.typeofQuestion) AS quesion_types
//         FROM
//             course_type_of_question ct
//         LEFT JOIN quesion_type q ON
//             ct.quesionTypeId = q.quesionTypeId
//         GROUP BY
//             ct.courseCreationId
//     ) AS questions
//     ON
//         cc.courseCreationId = questions.courseCreationId
//     JOIN exams AS e
//     ON
//         cc.examId = e.examId
//     LEFT JOIN
//     topics tp ON cc.courseCreationId=tp.courseCreationId
//     WHERE
//         cc.courseCreationId = ?;
//         `;

//     const [course] = await db.query(query, [courseCreationId,],(error,result)=>{
//       if(error ||result.length===0){
//         console.log("error fetching courses");
//         return res.status(500).send("Internal Server Error");

//       }
//     // const dataFromBackend=result[0]
//     // const base64Image=Buffer.from(dataFromBackend.cardImage,"binary").toString("base64");
//     // const data={
//     //   courseCreationId:result.dataFromBackend,
//     //   courseName:dataFromBackend.courseName,
//     //   courseYear:dataFromBackend.courseYear,
//     //   examId:dataFromBackend.examId,
//     //   courseStartDate:dataFromBackend.courseStartDate,
//     //   courseEndDate:dataFromBackend.courseEndDate,
//     //   cost:dataFromBackend.cost,
//     //   Discount:dataFromBackend.Discount,
//     //   totalPrice:dataFromBackend.totalPrice,
//     //   cardImage:`data:image/png;base64,${base64Image}`,
//     //   paymentlink:dataFromBackend.paymentlink,
//     //   Portale_Id:dataFromBackend.Portale_Id,
//     //   subjects:dataFromBackend.subjects,
//     //   question_types:dataFromBackend.question_types,
//     //   examName:dataFromBackend.examName,
//     //   type_of_test:dataFromBackend.type_of_test,
//     //   topicName:dataFromBackend.topicName
//     // }

//     });
//     if (!course) {
//       res.status(404).json({ error: "Course not found" });
//       return;
//     }
//     console.log(course,"this is the fetched daattaaaaa..........")
//     // res.json(data);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.get("/courseupdate/:portalId/:courseCreationId", async (req, res) => {
  const courseCreationId = req.params.courseCreationId;
  const portalId = req.params.portalId;
  console.log(portalId, courseCreationId);
  const sql = `SELECT
    cc.*,
    subjects.subjects AS subjects,
    questions.quesion_types AS question_types,
    e.examName,
    typeOfTests.type_of_test AS type_of_test,
    tp.topicName
FROM
    course_creation_table cc
    
 LEFT JOIN(
    SELECT ctt.courseCreationId,
        GROUP_CONCAT(t.typeOfTestName) AS type_of_test
    FROM
        course_typeoftests ctt
    LEFT JOIN type_of_test t ON
        ctt.typeOfTestId = t.typeOfTestId
    GROUP BY
        ctt.courseCreationId
) AS typeOfTests
ON
    cc.courseCreationId = typeOfTests.courseCreationId   
    
LEFT JOIN(
    SELECT cs.courseCreationId,
        GROUP_CONCAT(s.subjectName) AS subjects
    FROM
        course_subjects cs
    LEFT JOIN subjects s ON
        cs.subjectId = s.subjectId
    GROUP BY
        cs.courseCreationId
) AS subjects
ON
    cc.courseCreationId = subjects.courseCreationId
LEFT JOIN(
    SELECT ct.courseCreationId,
        GROUP_CONCAT(q.typeofQuestion) AS quesion_types
    FROM
        course_type_of_question ct
    LEFT JOIN quesion_type q ON
        ct.quesionTypeId = q.quesionTypeId
    GROUP BY
        ct.courseCreationId
) AS questions
ON
    cc.courseCreationId = questions.courseCreationId
JOIN exams AS e
ON
    cc.examId = e.examId
LEFT JOIN 
topics tp
 ON cc.courseCreationId=tp.courseCreationId
WHERE
    cc.courseCreationId = ?;
    `;
  db1.query(sql, [courseCreationId], (error, results) => {
    if (error || results.length === 0) {
      console.error("Error fetching images:", error);
      return res.status(500).send("Internal Server Error");
    }

    // Convert BLOB data to base64
    const dataFromBackend = results[0];
    const base64Image = Buffer.from(
      dataFromBackend.cardImage,
      "binary"
    ).toString("base64");

    const imageData = {
      courseCreationId: dataFromBackend.courseCreationId,
      courseName: dataFromBackend.courseName,
      courseYear: dataFromBackend.courseYear,
      examId: dataFromBackend.examId,
      courseStartDate: dataFromBackend.courseStartDate,
      courseEndDate: dataFromBackend.courseEndDate,
      cost: dataFromBackend.cost,
      Discount: dataFromBackend.Discount,
      totalPrice: dataFromBackend.totalPrice,
      cardImage: `data:image/png;base64,${base64Image}`,
      // cardImage:`${base64Image}`,
      paymentlink: dataFromBackend.paymentlink,
      Portale_Id: dataFromBackend.Portale_Id,
      subjects: dataFromBackend.subjects,
      question_types: dataFromBackend.question_types,
      examName: dataFromBackend.examName,
      type_of_test: dataFromBackend.type_of_test,
      topicName: dataFromBackend.topicName,
    };

    res.status(200).json(imageData); // Send user data with image data as JSON response
  });
});
// router.get("/courseupdate/:portalId/:courseCreationId", async (req, res) => {
//   const courseCreationId = req.params.courseCreationId;

//   try {
//     const query = `
//         SELECT
//         cc.*,
//         subjects.subjects AS subjects,
//         questions.quesion_types AS question_types,
//         e.examName,
//         typeOfTests.type_of_test AS type_of_test
//     FROM
//         course_creation_table cc

//      LEFT JOIN(
//         SELECT ctt.courseCreationId,
//             GROUP_CONCAT(t.typeOfTestName) AS type_of_test
//         FROM
//             course_typeoftests ctt
//         LEFT JOIN type_of_test t ON
//             ctt.typeOfTestId = t.typeOfTestId
//         GROUP BY
//             ctt.courseCreationId
//     ) AS typeOfTests
//     ON
//         cc.courseCreationId = typeOfTests.courseCreationId

//     LEFT JOIN(
//         SELECT cs.courseCreationId,
//             GROUP_CONCAT(s.subjectName) AS subjects
//         FROM
//             course_subjects cs
//         LEFT JOIN subjects s ON
//             cs.subjectId = s.subjectId
//         GROUP BY
//             cs.courseCreationId
//     ) AS subjects
//     ON
//         cc.courseCreationId = subjects.courseCreationId
//     LEFT JOIN(
//         SELECT ct.courseCreationId,
//             GROUP_CONCAT(q.typeofQuestion) AS quesion_types
//         FROM
//             course_type_of_question ct
//         LEFT JOIN quesion_type q ON
//             ct.quesionTypeId = q.quesionTypeId
//         GROUP BY
//             ct.courseCreationId
//     ) AS questions
//     ON
//         cc.courseCreationId = questions.courseCreationId
//     JOIN exams AS e
//     ON
//         cc.examId = e.examId
//     WHERE
//         cc.courseCreationId = ?;
//         `;

//     const [course] = await db.query(query, [courseCreationId]);

//     if (!course) {
//       res.status(404).json({ error: "Course not found" });
//       return;
//     }
//     console.log(course,"this is the fetched daattaaaaa..........")

//     res.json(course);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// --------------- feaching selected data from course_typeOftests,course_subjects,course_type_of_question  -----------------------------

router.get("/course_subjects/:courseCreationId", async (req, res) => {
  const courseCreationId = req.params.courseCreationId;

  try {
    // Query the database to get selected subjects for the specified courseCreationId
    const query = `
          SELECT cs.subjectId
          FROM course_subjects AS cs
          WHERE cs.courseCreationId = ?
        `;
    const [rows] = await db.query(query, [courseCreationId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/course-type-of-questions/:courseCreationId", async (req, res) => {
  const courseCreationId = req.params.courseCreationId;

  try {
    const query = `
          SELECT ctoq.quesionTypeId, qt.typeofQuestion
          FROM course_type_of_question AS ctoq
          JOIN quesion_type AS qt ON ctoq.quesionTypeId = qt.quesionTypeId
          WHERE ctoq.courseCreationId = ?
        `;
    const [rows] = await db.query(query, [courseCreationId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/selected_test_pattern/:courseCreationId", async (req, res) => {
  const courseCreationId = req.params.courseCreationId;

  try {
    const query = `
          SELECT tp.Test_Pattern_Id, tp.Test_pattern_name
          FROM selected_test_pattern AS stp
          JOIN test_pattern AS tp ON tp.Test_Pattern_Id = stp.Test_Pattern_Id
          WHERE stp.courseCreationId = ?
        `;
    const [rows] = await db.query(query, [courseCreationId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/course-type-of-test/:courseCreationId", async (req, res) => {
  const courseCreationId = req.params.courseCreationId;

  try {
    const query = `
          SELECT ctot.typeOfTestId , tt.typeOfTestName
          FROM course_typeoftests AS ctot
          JOIN type_of_test AS tt ON ctot.typeOfTestId  = tt.typeOfTestId 
          WHERE ctot.courseCreationId = ?
        `;
    const [rows] = await db.query(query, [courseCreationId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.put(
//   "/update-course/:courseCreationId",
//   upload.single("cardImage"),
//   async (req, res) => {
//     const courseCreationId = req.params.courseCreationId;

//     // Handle type of tests update
//     const deleteTypeOfTestQuery =
//       "DELETE FROM course_typeoftests WHERE courseCreationId = ?";
//     await db.query(deleteTypeOfTestQuery, [courseCreationId]);
//     // Handle subjects update (assuming course_subjects table has columns courseCreationId and subjectId)
//     const deleteSubjectsQuery =
//       "DELETE FROM course_subjects WHERE courseCreationId = ?";
//     await db.query(deleteSubjectsQuery, [courseCreationId]);
//     // Handle question types update (assuming course_type_of_question table has columns courseCreationId and quesionTypeId)
//     const deleteQuestionTypesQuery =
//       "DELETE FROM course_type_of_question WHERE courseCreationId = ?";
//     await db.query(deleteQuestionTypesQuery, [courseCreationId]);

//     const {
//       courseName,
//       courseYear,
//       selectedExam,
//       courseStartDate,
//       courseEndDate,
//       cost,
//       discount,
//       totalPrice,
//       selectedTypeOfTests,
//       selectedSubjects,
//       selectedQuestionTypes,
//       paymentlink,
//     } = req.body;
//     console.log("dataupdate", req.body);
//     const cardImg = req.file ? req.buffer : null;
//     if (cardImg) {
//       console.log("success with the image");
//       const updateQuery = `
//       UPDATE course_creation_table
//    SET
//      courseName = ?,
//      courseYear = ?,
//      examId = ?,
//      courseStartDate = ?,
//      courseEndDate = ?,
//      cost = ?,
//      Discount = ?,
//      totalPrice = ?,
//      paymentlink = ?,
//      cardImage = ?
//    WHERE courseCreationId = ?;

//      `;
//        try {
//          await db.query(updateQuery, [
//            courseName,
//            courseYear,
//            selectedExam,
//            courseStartDate,
//            courseEndDate,
//            cost,
//            discount,
//            totalPrice,
//            paymentlink,
//            cardImg,
//            courseCreationId,
//          ]);

//          const insertTestOfTestQuery =
//            "INSERT INTO course_typeoftests (courseCreationId, typeOfTestId) VALUES (?, ?)";
//          for (const typeOfTestId of selectedTypeOfTests) {
//            await db.query(insertTestOfTestQuery, [courseCreationId, typeOfTestId]);
//          }

//          const insertSubjectsQuery =
//            "INSERT INTO course_subjects (courseCreationId, subjectId) VALUES (?, ?)";
//          for (const subjectId of selectedSubjects) {
//            await db.query(insertSubjectsQuery, [courseCreationId, subjectId]);
//          }

//          const insertQuestionTypesQuery =
//            "INSERT INTO course_type_of_question (courseCreationId, quesionTypeId) VALUES (?, ?)";
//          for (const quesionTypeId of selectedQuestionTypes) {
//            await db.query(insertQuestionTypesQuery, [
//              courseCreationId,
//              quesionTypeId,
//            ]);
//          }

//          res.json({ message: "Course updated successfully" });
//        } catch (error) {
//          console.error(error);
//          res.status(500).json({ error: "Internal Server Error" });
//        }
//     }
//     else{
//       console.log("without image")
//       const updateQuery2=`UPDATE course_creation_table
//       SET
//         courseName = ?,
//         courseYear = ?,
//         examId = ?,
//         courseStartDate = ?,
//         courseEndDate = ?,
//         cost = ?,
//         Discount = ?,
//         totalPrice = ?,
//         paymentlink = ?,
//       WHERE courseCreationId = ?`;
//       try {
//         await db.query(updateQuery2,[courseName,courseYear,selectedExam,courseStartDate,courseEndDate,cost,discount,totalPrice,paymentlink,courseCreationId]);
//         const insertTestOfTestQuery =
//            "INSERT INTO course_typeoftests (courseCreationId, typeOfTestId) VALUES (?, ?)";
//          for (const typeOfTestId of selectedTypeOfTests) {
//            await db.query(insertTestOfTestQuery, [courseCreationId, typeOfTestId]);
//          }

//          const insertSubjectsQuery =
//            "INSERT INTO course_subjects (courseCreationId, subjectId) VALUES (?, ?)";
//          for (const subjectId of selectedSubjects) {
//            await db.query(insertSubjectsQuery, [courseCreationId, subjectId]);
//          }

//          const insertQuestionTypesQuery =
//            "INSERT INTO course_type_of_question (courseCreationId, quesionTypeId) VALUES (?, ?)";
//          for (const quesionTypeId of selectedQuestionTypes) {
//            await db.query(insertQuestionTypesQuery, [
//              courseCreationId,
//              quesionTypeId,
//            ]);
//          }

//          res.json({ message: "Course updated successfully" });

//       } catch (error) {

//       }

//     }

//   }
// );

// ===========updating form1===============
router.put(
  "/update-course/:courseCreationId",
  upload.single("cardImage"),
  async (req, res) => {
    const courseCreationId = req.params.courseCreationId;

    // Handle type of tests update
    const deleteTypeOfTestQuery =
      "DELETE FROM course_typeoftests WHERE courseCreationId = ?";
    await db.query(deleteTypeOfTestQuery, [courseCreationId]);
    // Handle subjects update (assuming course_subjects table has columns courseCreationId and subjectId)
    const deleteSubjectsQuery =
      "DELETE FROM course_subjects WHERE courseCreationId = ?";
    await db.query(deleteSubjectsQuery, [courseCreationId]);
    // Handle question types update (assuming course_type_of_question table has columns courseCreationId and quesionTypeId)
    const deleteQuestionTypesQuery =
      "DELETE FROM course_type_of_question WHERE courseCreationId = ?";
    await db.query(deleteQuestionTypesQuery, [courseCreationId]);

    const {
      courseName,
      courseYear,
      selectedExam,
      courseStartDate,
      courseEndDate,
      cost,
      discount,
      totalPrice,
      selectedTypeOfTests,
      selectedSubjects,
      selectedQuestionTypes,
      paymentlink,
    } = req.body;
    console.log("dataupdate", req.body);
    const cardImg = req.file ? req.buffer : null;

    if (cardImg) {
      console.log("success with the image");
      const updateQuery = `
      UPDATE course_creation_table
      SET
        courseName = ?,
        courseYear = ?,
        examId = ?,
        courseStartDate = ?,
        courseEndDate = ?,
        cost = ?,
        Discount = ?,       
        totalPrice = ?,
        paymentlink = ?,
        cardImage = ?
      WHERE courseCreationId = ?;
      `;

      try {
        await db.query(updateQuery, [
          courseName,
          courseYear,
          selectedExam,
          courseStartDate,
          courseEndDate,
          cost,
          discount,
          totalPrice,
          paymentlink,
          cardImg,
          courseCreationId,
        ]);

        const insertTestOfTestQuery =
          "INSERT INTO course_typeoftests (courseCreationId, typeOfTestId) VALUES (?, ?)";
        for (const typeOfTestId of selectedTypeOfTests) {
          await db.query(insertTestOfTestQuery, [
            courseCreationId,
            typeOfTestId,
          ]);
        }

        const insertSubjectsQuery =
          "INSERT INTO course_subjects (courseCreationId, subjectId) VALUES (?, ?)";
        for (const subjectId of selectedSubjects) {
          await db.query(insertSubjectsQuery, [courseCreationId, subjectId]);
        }

        const insertQuestionTypesQuery =
          "INSERT INTO course_type_of_question (courseCreationId, quesionTypeId) VALUES (?, ?)";
        for (const quesionTypeId of selectedQuestionTypes) {
          await db.query(insertQuestionTypesQuery, [
            courseCreationId,
            quesionTypeId,
          ]);
        }

        res.json({ message: "Course updated successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      console.log("without image");
      const updateQuery2 = `
        UPDATE course_creation_table
        SET
          courseName = ?,
          courseYear = ?,
          examId = ?,
          courseStartDate = ?,
          courseEndDate = ?,
          cost = ?,
          Discount = ?,       
          totalPrice = ?,
          paymentlink = ?
        WHERE courseCreationId = ?;
      `;

      try {
        await db.query(updateQuery2, [
          courseName,
          courseYear,
          selectedExam,
          courseStartDate,
          courseEndDate,
          cost,
          discount,
          totalPrice,
          paymentlink,
          courseCreationId,
        ]);

        const insertTestOfTestQuery =
          "INSERT INTO course_typeoftests (courseCreationId, typeOfTestId) VALUES (?, ?)";
        for (const typeOfTestId of selectedTypeOfTests) {
          await db.query(insertTestOfTestQuery, [
            courseCreationId,
            typeOfTestId,
          ]);
        }

        const insertSubjectsQuery =
          "INSERT INTO course_subjects (courseCreationId, subjectId) VALUES (?, ?)";
        for (const subjectId of selectedSubjects) {
          await db.query(insertSubjectsQuery, [courseCreationId, subjectId]);
        }

        const insertQuestionTypesQuery =
          "INSERT INTO course_type_of_question (courseCreationId, quesionTypeId) VALUES (?, ?)";
        for (const quesionTypeId of selectedQuestionTypes) {
          await db.query(insertQuestionTypesQuery, [
            courseCreationId,
            quesionTypeId,
          ]);
        }

        res.json({ message: "Course updated successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
);

router.put(
  "/update-course-form1/:courseCreationId/:portalId",
  upload.single("cardImage"),
  async (req, res) => {
    const courseUpdationId = req.params.courseCreationId;
    const portalId = req.params.portalId;
    console.log(portalId, "portal id from the front enddddd");
    // const cardimg= req.file.buffer;
    const cardimg = req.file ? req.file.buffer : null;
    console.log(courseUpdationId, "ccId from frontendddddd........");
    const {
      courseName,
      courseYear,
      examId,
      courseStartDate,
      courseEndDate,
      cost,
      discount,
      totalPrice,
      paymentlink,
    } = req.body;
    console.log(
      courseName,
      courseYear,
      examId,
      courseStartDate,
      courseEndDate,
      cost,
      discount,
      totalPrice,
      paymentlink
    );
    // const deleteQueryF

    if (cardimg) {
      console.log("succeess with img");
      const updateQuery = `
UPDATE course_creation_table
SET
  courseName = ?,
  courseYear = ?,
  examId = ?,
  courseStartDate = ?,
  courseEndDate = ?,
  cost = ?,
  Discount = ?,       
  totalPrice = ?,
  paymentlink = ?,
  cardImage = ?
WHERE courseCreationId = ? and Portale_Id=?`;
      try {
        const result = await db.query(updateQuery, [
          courseName,
          courseYear,
          examId,
          courseStartDate,
          courseEndDate,
          cost,
          discount,
          totalPrice,
          paymentlink,
          cardimg,
          // req.file.buffer,
          courseUpdationId,
          portalId,
        ]);
        res.json({
          success: true,
          message: "Updated successfully",
        });
      } catch (e) {
        console.log(e, "error iss........");
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      console.log("succeess without img");
      const updateQuery = `
  UPDATE course_creation_table
  SET
    courseName = ?,
    courseYear = ?,
    examId = ?,
    courseStartDate = ?,
    courseEndDate = ?,
    cost = ?,
    Discount = ?,       
    totalPrice = ?,
    paymentlink = ?
  WHERE courseCreationId = ? and Portale_Id=?`;
      try {
        const result = await db.query(updateQuery, [
          courseName,
          courseYear,
          examId,
          courseStartDate,
          courseEndDate,
          cost,
          discount,
          totalPrice,
          paymentlink,
          // cardimg,
          // req.file.buffer,
          courseUpdationId,
          portalId,
        ]);
        res.json({
          success: true,
          message: "Updated successfully",
        });
      } catch (e) {
        console.log(e, "error iss........");
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
);

// ========================================

// router.put('/course_type_of_questionUpdation/:courseCreationId',async(req,res)=>{
//   try {
//     // Extract data from the request body
//     const {typeOfTestIds, subjectIds, typeofQuestion } =
//       req.body;
//     const courseCreationId=req.params.courseCreationId;
//     console.log("Received data:", req.body);
//     console.log(typeOfTestIds,subjectIds,typeofQuestion,"..............")
//     console.log(courseCreationId,"courseCreationId==========")

//     for (const typeOfTestId of typeOfTestIds) {
//       const query =
//         "update  course_typeOftests set typeOfTestId = ? where courseCreationId= ?";
//       const values = [ typeOfTestId,courseCreationId];

//       // Log the query before execution
//       console.log("Executing query:", db.format(query, values));

//       // Execute the query
//       await db.query(query, values);
//     }

//     // Insert subjects into the course_subjects table
//     console.log("Received data:", req.body);
//     for (const subjectId of subjectIds) {
//       const query =
//         "update  course_subjects set subjectId = ? where courseCreationId =? ";
//       const values = [ subjectId,courseCreationId];
//       console.log("Executing query:", db.format(query, values));
//       await db.query(query, values);
//     }

//     // Insert question types into the course_type_of_question table
//     for (const quesionTypeId of typeofQuestion) {
//       const query =
//         "update  course_type_of_question set quesionTypeId= ? where courseCreationId =?";
//       const values = [quesionTypeId,courseCreationId];
//       console.log("Executing query:", db.format(query, values));
//       await db.query(query, values);
//     }
//     // Respond with success message
//     res.json({
//       success: true,
//       message: "Subjects and question types added successfully",
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }

// })

router.put(
  "/course_type_of_questionUpdation/:courseCreationId",
  async (req, res) => {
    try {
      const { typeOfTestIds, subjectIds, typeofQuestion } = req.body;
      const courseCreationId = req.params.courseCreationId;

      // Delete existing rows for the specified courseCreationId
      // await db.query("DELETE FROM course_typeOftests WHERE courseCreationId = ?", [courseCreationId]);
      // await db.query("DELETE FROM course_subjects WHERE courseCreationId = ?", [courseCreationId]);
      // await db.query("DELETE FROM course_type_of_question WHERE courseCreationId = ?", [courseCreationId]);
      await db.query(
        "DELETE FROM course_typeOftests WHERE courseCreationId = ?",
        [courseCreationId]
      );
      console.log(
        "Deleted rows from course_typeOftests table for courseCreationId:",
        courseCreationId
      );

      await db.query("DELETE FROM course_subjects WHERE courseCreationId = ?", [
        courseCreationId,
      ]);
      console.log(
        "Deleted rows from course_subjects table for courseCreationId:",
        courseCreationId
      );

      await db.query(
        "DELETE FROM course_type_of_question WHERE courseCreationId = ?",
        [courseCreationId]
      );
      console.log(
        "Deleted rows from course_type_of_question table for courseCreationId:",
        courseCreationId
      );

      // Insert new rows with the updated data
      for (const typeOfTestId of typeOfTestIds) {
        await db.query(
          "INSERT INTO course_typeOftests (courseCreationId, typeOfTestId) VALUES (?, ?)",
          [courseCreationId, typeOfTestId]
        );
        console.log("executing insert query in typeOfTestIds ");
      }

      for (const subjectId of subjectIds) {
        await db.query(
          "INSERT INTO course_subjects (courseCreationId, subjectId) VALUES (?, ?)",
          [courseCreationId, subjectId]
        );
        console.log("insert query in course_subjects");
      }

      for (const questionTypeId of typeofQuestion) {
        await db.query(
          "INSERT INTO course_type_of_question (courseCreationId, quesionTypeId) VALUES (?, ?)",
          [courseCreationId, questionTypeId]
        );
        console.log("insert query in course_type_of_question ");
      }

      // Respond with success message
      res.json({
        success: true,
        message: "Subjects and question types added successfully",
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);

module.exports = router;
