const express = require("express");
const router = express.Router();
const db = require("../DataBase/db2");

// ...
router.get("/user-tests/:userId/:courseCreationId", async (req, res) => {
  try {
    const { userId, courseCreationId } = req.params;

    // Fetch tests data based on userId and courseCreationId
    const testsQuery = `
        SELECT tc.TestName, tc.testStartDate, tc.testEndDate, tc.testStartTime, tc.testEndTime, 
               tc.Duration, tc.TotalQuestions, tc.totalMarks
        FROM test_creation_table tc
        INNER JOIN userbuycourses ubc ON tc.courseCreationId = ubc.courseCreationId
        WHERE ubc.user_Id = ? AND ubc.courseCreationId = 4
      `;

    const testsResult = await db.query(testsQuery, [userId, courseCreationId]);

    // Check if tests data is not empty
    if (testsResult.length > 0) {
      const testsData = testsResult;

      res.status(200).json({
        success: true,
        message: "Tests data fetched successfully",
        tests: testsData,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No tests data found for the provided user and course",
      });
    }
  } catch (error) {
    console.error("Error fetching tests data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// SELECT
//       ses.Total_answered,
//       ses.Total_unAttemted,
//       ses.Not_visited_count,
//       ses.Total_unAttemted,
//       SUM(ses.Not_visited_count + ses.Total_unAttemted) AS total_unattempted,
//       ses.Total_wrong,
//       tc.TestName,
//       tc.testStartDate,
//       tc.testEndDate,
//       tc.totalMarks,

//       DATE_FORMAT(tc.testStartTime, '%h:%i:%s') AS formattedStartTime,
//       DATE_FORMAT(tc.testEndTime, '%h:%i:%s') AS formattedEndTime,

//       tc.Duration,
//       tlst.time_left,
//       CONCAT(HOUR(tlst.time_left), ' hours ', MINUTE(tlst.time_left), ' minutes ', SECOND(tlst.time_left), ' seconds') AS time_left_formatted,
//       ((TIME_TO_SEC(tlst.time_left) / 60) / tc.Duration) * 100 AS progress_percentage,
//       (SELECT COUNT(DISTINCT sectionName) FROM sections WHERE sections.testCreationTableId = ses.testCreationTableId) AS section_count
//   FROM
//       student_exam_summery ses
//   INNER JOIN test_creation_table tc ON
//       ses.testCreationTableId = tc.testCreationTableId
//       INNER JOIN time_left_submission_of_test tlst ON
//       ses.testCreationTableId = tlst.testCreationTableId
//   WHERE
//       ses.user_Id = 3 AND ses.testCreationTableId = 18

router.get(
  "/YourPerformance_testResults/:userId/:testCreationTableId",
  async (req, res) => {
    try {
      const { userId, testCreationTableId } = req.params;

      // Fetch tests data based on userId and testCreationTableId
      const [rows] = await db.query(
        `SELECT 
      ses.Total_answered,
      ses.Total_unAttemted,
      ses.Not_visited_count,
      ses.Total_correct,
      ses.Not_visited_count + ses.Total_unAttemted AS total_unattempted,
      ses.Total_wrong,
      tc.TestName,
      tc.testStartDate,
      tc.testEndDate,
      tc.totalMarks,
      DATE_FORMAT(tc.testStartTime, '%h:%i:%s') AS formattedStartTime,
      DATE_FORMAT(tc.testEndTime, '%h:%i:%s') AS formattedEndTime,
      tc.Duration,
      tlst.time_left,
      CONCAT(HOUR(tlst.time_left), ' hours ', MINUTE(tlst.time_left), ' minutes ', SECOND(tlst.time_left), ' seconds') AS time_left_formatted,
      ((TIME_TO_SEC(tlst.time_left) / 60) / tc.Duration) * 100 AS progress_percentage,
      COUNT(s.sectionName) AS section_count
  FROM
      student_exam_summery ses
  INNER JOIN 
      test_creation_table tc ON ses.testCreationTableId = tc.testCreationTableId
  INNER JOIN 
      time_left_submission_of_test tlst ON ses.testCreationTableId = tlst.testCreationTableId
      LEFT JOIN 
      sections s ON s.testCreationTableId = tc.testCreationTableId
  
  
  WHERE
      ses.user_Id = ? AND ses.testCreationTableId = ?
  `,
        [userId, testCreationTableId]
      );

      res.json(rows);
    } catch (error) {
      console.error("Error executing MySQL query:", error);
      res.status(500).json({ error: error.message }); // Send error message as response
    }
  }
);

//sindhu
// router.get(
//   "/YourPerformance_testResults/:userId/:testCreationTableId",
//   async (req, res) => {
//     try {
//       const { userId, testCreationTableId } = req.params;

//       // Fetch tests data based on userId and testCreationTableId
//       const [rows] = await db.query(
//         `SELECT
//       ses.Total_answered,
//       ses.Total_unAttemted,
//       ses.Not_visited_count,
//       ses.Total_correct,
//       ses.Not_visited_count + ses.Total_unAttemted AS total_unattempted,
//       ses.Total_wrong,
//       tc.TestName,
//       tc.testStartDate,
//       tc.testEndDate,
//       tc.totalMarks,
//       DATE_FORMAT(tc.testStartTime, '%h:%i:%s') AS formattedStartTime,
//       DATE_FORMAT(tc.testEndTime, '%h:%i:%s') AS formattedEndTime,
//       tc.Duration,
//       tlst.time_left,
//       CONCAT(HOUR(tlst.time_left), ' hours ', MINUTE(tlst.time_left), ' minutes ', SECOND(tlst.time_left), ' seconds') AS time_left_formatted,
//       ((TIME_TO_SEC(tlst.time_left) / 60) / tc.Duration) * 100 AS progress_percentage,
//       COUNT(s.sectionId) AS section_count
//   FROM
//       student_exam_summery ses
//   INNER JOIN
//       test_creation_table tc ON ses.testCreationTableId = tc.testCreationTableId
//   INNER JOIN
//       time_left_submission_of_test tlst ON ses.testCreationTableId = tlst.testCreationTableId
//   LEFT JOIN
//       sections s ON s.testCreationTableId = tc.testCreationTableId
//   WHERE
//       ses.user_Id = ? AND ses.testCreationTableId = ?
//   `,
//         [userId, testCreationTableId]
//       );

//       res.json(rows);
//     } catch (error) {
//       console.error("Error executing MySQL query:", error);
//       res.status(500).json({ error: error.message }); // Send error message as response
//     }
//   }
// );

//   SELECT
//   ses.Total_answered,
//   ses.Total_unAttemted,
//   ses.Not_visited_count,
//   SUM(ses.Not_visited_count + ses.Total_unAttemted) AS total_unattempted,
//   ses.Total_wrong,
//   tc.TestName,
//   tc.testStartDate,
//   tc.testEndDate,
//   tc.totalMarks,
//   DATE_FORMAT(tc.testStartTime, '%h:%i:%s') AS formattedStartTime,
//   DATE_FORMAT(tc.testEndTime, '%h:%i:%s') AS formattedEndTime,
//   tc.Duration,
//   tlst.time_left,
//   CONCAT(HOUR(tlst.time_left), ' hours ', MINUTE(tlst.time_left), ' minutes ', SECOND(tlst.time_left), ' seconds') AS time_left_formatted,
//   ((TIME_TO_SEC(tlst.time_left) / 60) / tc.Duration) * 100 AS progress_percentage,
//   COUNT(s.sectionId) AS section_count
// FROM
//   student_exam_summery ses
// INNER JOIN test_creation_table tc ON
//   ses.testCreationTableId = tc.testCreationTableId
// INNER JOIN time_left_submission_of_test tlst ON
//   ses.testCreationTableId = tlst.testCreationTableId
// LEFT JOIN sections s ON
//   s.testCreationTableId = tc.testCreationTableId
// WHERE
//   ses.user_Id = 3 AND ses.testCreationTableId = 18
// GROUP BY
//   ses.Total_answered,
//   ses.Total_unAttemted,
//   ses.Not_visited_count,
//   ses.Total_wrong,
//   tc.TestName,
//   tc.testStartDate,
//   tc.testEndDate,
//   tc.totalMarks,
//   formattedStartTime,
//   formattedEndTime,
//   tc.Duration,
//   tlst.time_left,
//   time_left_formatted,
//   progress_percentage;
router.get(
  "/Answer_Evaluation/:userId/:testCreationTableId",
  async (req, res) => {
    try {
      const { userId, testCreationTableId } = req.params;

      // Fetch tests data based on userId and testCreationTableId
      const [rows] = await db.query(
        `SELECT
      ses.Total_answered,
      ses.Total_unAttemted,
      ses.Total_wrong,
      tc.TestName,
      tc.testStartDate,
      tc.testEndDate,
      tc.testStartTime,
      tc.testEndTime,
      tc.Duration
  FROM
      student_exam_summery ses
  INNER JOIN test_creation_table tc ON
      ses.testCreationTableId = tc.testCreationTableId
  WHERE
      ses.user_Id = 3 AND ses.testCreationTableId = 18`,
        [userId, testCreationTableId]
      );

      res.json(rows);
    } catch (error) {
      console.error("Error executing MySQL query:", error);
      res.status(500).json({ error: error.message }); // Send error message as response
    }
  }
);
//old
// router.get("/questionOptions_result/:testCreationTableId/:user_Id", async (req, res) => {
//   const { testCreationTableId,user_Id } = req.params;
//   try {
//     const [rows] = await db.query(
//       `SELECT
//       q.question_id, q.questionImgName,
//       o.option_id, o.optionImgName, o.option_index,
//       s.solution_id AS solution_id, s.solutionImgName AS solutionImgName,
//       qt.qtypeId, qt.qtype_text,
//       ur.user_Sno,ur.user_Id,
//       ur.user_answer AS Uruser_answer,
//      qts.typeofQuestion,
//       ans.answer_id, ans.answer_text,
//       m.markesId, m.marks_text,
//       si.sort_id, si.sortid_text,
//       doc.documen_name, doc.sectionId,
//       doc.subjectId, doc.testCreationTableId,
//       P.paragraphImg, p.paragraph_Id,
//       pq.paragraphQNo_Id, pq.paragraphQNo, qts.quesionTypeId,
//       tct.TestName  -- New column from testcreationtable
//   FROM
//       questions q
//   LEFT OUTER JOIN
//       options o ON q.question_id = o.question_id
//   LEFT OUTER JOIN
//       qtype qt ON q.question_id = qt.question_id
//   LEFT OUTER JOIN
//       quesion_type qts ON qt.quesionTypeId = qts.quesionTypeId
//   LEFT OUTER JOIN
//       answer ans ON q.question_id = ans.question_id
//   LEFT OUTER JOIN
//       marks m ON q.question_id = m.question_id
//   LEFT OUTER JOIN
//       sortid si ON q.question_id = si.question_id
//   LEFT OUTER JOIN
//       solution s ON q.question_id = s.solution_id
//   LEFT OUTER JOIN
//       paragraph p ON q.document_Id = p.document_Id
//   LEFT OUTER JOIN
//       paragraphqno pq ON p.paragraph_Id = pq.paragraph_Id AND q.question_id = pq.question_id
//   LEFT OUTER JOIN
//       ots_document doc ON q.document_Id = doc.document_Id
//   LEFT OUTER JOIN
//       user_responses ur ON q.question_id = ur.question_id
//   LEFT OUTER JOIN
//       test_creation_table tct ON doc.testCreationTableId = tct.testCreationTableId  -- Joining with testcreationtable
//   WHERE
//       doc.testCreationTableId = ? AND ur.user_Id =?
//   ORDER BY
//       q.question_id ASC, o.option_index ASC;

//   `,
//       [testCreationTableId,user_Id]
//     );

//     // Check if rows is not empty
//     if (rows.length > 0) {
//       const questionData = {
//         questions: [],
//       };

//       // Organize data into an array of questions
//       rows.forEach((row) => {
//         const existingQuestion = questionData.questions.find(
//           (q) => q.question_id === row.question_id
//         );
//         const option = {
//           option_id: row.option_id,
//           option_index: row.option_index,
//           optionImgName: row.optionImgName,
//           answer_text: row.answer_text,
//         };
//         if (existingQuestion) {
//           const existingOption = existingQuestion.options.find(
//             (opt) => opt.option_id === option.option_id
//           );

//           if (!existingOption) {
//             existingQuestion.options.push(option);
//           }
//         } else {
//           // Question doesn't exist, create a new question
//           const newQuestion = {
//             TestName: row.TestName,
//             question_id: row.question_id,
//             questionImgName: row.questionImgName,
//             documen_name: row.documen_name,
//             options: [option],
//             subjectId: row.subjectId,
//             sectionId: row.sectionId,
//             qtype: {
//               qtypeId: row.qtypeId,
//               qtype_text: row.qtype_text,
//             },
//             quesion_type: {
//               quesionTypeId: row.quesionTypeId,
//               quesion_type: row.quesion_type,
//               typeofQuestion: row.typeofQuestion,
//             },
//             answer: {
//               answer_id: row.answer_id,
//               answer_text: row.answer_text,
//               solutionImgName: row.solutionImgName,
//               Uruser_answer: row.Uruser_answer,
//             },
//             useranswer: {
//               urid: row.question_id,
//               // ans: row.user_answer,
//               urid: row.question_id,
//             },
//             marks: {
//               markesId: row.markesId,
//               marks_text: row.marks_text,
//             },
//             sortid: {
//               sort_id: row.sort_id,
//               sortid_text: row.sortid_text,
//             },
//             sortid: {
//               sort_id: row.sort_id,
//               sortid_text: row.sortid_text,
//             },

//             solutionImgName: {
//               solutionImgName: row.solutionImgName,
//             },
//             paragraph: {},
//             paragraphqno: {},
//           };

//           if (row.paragraph_Id && row.paragraphQNo) {
//             newQuestion.paragraph = {
//               paragraph_Id: row.paragraph_Id,
//               paragraphImg: row.paragraphImg,
//             };

//             newQuestion.paragraphqno = {
//               paragraphQNo_Id: row.paragraphQNo_Id,
//               paragraphQNo: row.paragraphQNo,
//             };
//           }

//           questionData.questions.push(newQuestion);
//         }
//       });

//       res.json(questionData);
//     } else {
//       res.status(404).json({ error: "No data found" });
//     }
//   } catch (error) {
//     console.error("Error fetching question data:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// router.get(
//   "/questionOptions_result/:testCreationTableId/:user_Id",
//   async (req, res) => {
//     const { testCreationTableId, user_Id } = req.params;
//     try {
//       const [rows] = await db.query(
//         `SELECT
//         q.question_id, q.questionImgName,
//         o.option_id, o.optionImgName, o.option_index,
//         s.solution_id AS solution_id, s.solutionImgName AS solutionImgName,
//         qt.qtypeId, qt.qtype_text,
//         ur.user_Sno, ur.user_Id,
//         COALESCE(ur.user_answer, 'N/A') AS Uruser_answer,
//         qts.typeofQuestion,
//         ans.answer_id, ans.answer_text,
//         m.markesId, m.marks_text,
//         si.sort_id, si.sortid_text,
//         doc.documen_name, doc.sectionId,
//         doc.subjectId, doc.testCreationTableId,
//         P.paragraphImg, p.paragraph_Id,
//         pq.paragraphQNo_Id, pq.paragraphQNo, qts.quesionTypeId,
//         tct.TestName
//       FROM
//         questions q
//       LEFT OUTER JOIN
//         options o ON q.question_id = o.question_id
//       LEFT OUTER JOIN
//         qtype qt ON q.question_id = qt.question_id
//       LEFT OUTER JOIN
//         quesion_type qts ON qt.quesionTypeId = qts.quesionTypeId
//       LEFT OUTER JOIN
//         answer ans ON q.question_id = ans.question_id
//       LEFT OUTER JOIN
//         marks m ON q.question_id = m.question_id
//       LEFT OUTER JOIN
//         sortid si ON q.question_id = si.question_id
//       LEFT OUTER JOIN
//         solution s ON q.question_id = s.solution_id
//       LEFT OUTER JOIN
//         paragraph p ON q.document_Id = p.document_Id
//       LEFT OUTER JOIN
//         paragraphqno pq ON p.paragraph_Id = pq.paragraph_Id AND q.question_id = pq.question_id
//       LEFT OUTER JOIN
//         ots_document doc ON q.document_Id = doc.document_Id
//       LEFT OUTER JOIN
//         user_responses ur ON q.question_id = ur.question_id AND ur.user_Id = ?
//       LEFT OUTER JOIN
//         test_creation_table tct ON doc.testCreationTableId = tct.testCreationTableId
//       WHERE
//         doc.testCreationTableId = ?
//       ORDER BY
//         q.question_id ASC, o.option_index ASC;
//       `,
//         [user_Id, testCreationTableId]
//       );

//       // Check if rows is not empty
//       if (rows.length > 0) {
//         const questionData = {
//           questions: [],
//         };

//         // Organize data into an array of questions
//         rows.forEach((row) => {
//           const existingQuestion = questionData.questions.find(
//             (q) => q.question_id === row.question_id
//           );
//           const option = {
//             option_id: row.option_id,
//             option_index: row.option_index,
//             optionImgName: row.optionImgName,
//             answer_text: row.answer_text,
//           };
//           if (existingQuestion) {
//             const existingOption = existingQuestion.options.find(
//               (opt) => opt.option_id === option.option_id
//             );

//             if (!existingOption) {
//               existingQuestion.options.push(option);
//             }
//           } else {
//             // Question doesn't exist, create a new question
//             const newQuestion = {
//               TestName: row.TestName,
//               question_id: row.question_id,
//               questionImgName: row.questionImgName,
//               documen_name: row.documen_name,
//               options: [option],
//               subjectId: row.subjectId,
//               sectionId: row.sectionId,
//               qtype: {
//                 qtypeId: row.qtypeId,
//                 qtype_text: row.qtype_text,
//               },
//               quesion_type: {
//                 quesionTypeId: row.quesionTypeId,
//                 quesion_type: row.quesion_type,
//                 typeofQuestion: row.typeofQuestion,
//               },
//               answer: {
//                 answer_id: row.answer_id,
//                 answer_text: row.answer_text,
//                 solutionImgName: row.solutionImgName,
//                 Uruser_answer:
//                   row.Uruser_answer !== null && row.Uruser_answer !== undefined
//                     ? row.Uruser_answer
//                     : "N/A",
//               },
//               useranswer: {
//                 urid: row.question_id,
//                 Uruser_answer:
//                   row.Uruser_answer !== null && row.Uruser_answer !== undefined
//                     ? row.Uruser_answer
//                     : "N/A",
//               },
//               marks: {
//                 markesId: row.markesId,
//                 marks_text: row.marks_text,
//               },
//               sortid: {
//                 sort_id: row.sort_id,
//                 sortid_text: row.sortid_text,
//               },
//               solutionImgName: {
//                 solutionImgName: row.solutionImgName,
//               },
//               paragraph: {},
//               paragraphqno: {},
//             };

//             if (row.paragraph_Id && row.paragraphQNo) {
//               newQuestion.paragraph = {
//                 paragraph_Id: row.paragraph_Id,
//                 paragraphImg: row.paragraphImg,
//               };

//               newQuestion.paragraphqno = {
//                 paragraphQNo_Id: row.paragraphQNo_Id,
//                 paragraphQNo: row.paragraphQNo,
//               };
//             }

//             questionData.questions.push(newQuestion);
//           }
//         });

//         res.json(questionData);
//       } else {
//         res.status(404).json({ error: "No data found" });
//       }
//     } catch (error) {
//       console.error("Error fetching question data:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   }
// );

// router.get("/questionOptions_result/:testCreationTableId/:user_Id",async (req, res) => {
//     const { testCreationTableId, user_Id } = req.params;
//     try {
//       const [rows] = await db.query(
//         `SELECT
//         q.question_id,
//         q.questionImgName,
//         o.option_id,
//         o.optionImgName,
//         o.option_index,
//         s.solution_id AS solution_id,
//         s.solutionImgName AS solutionImgName,
//         qt.qtypeId,
//         qt.qtype_text,
//         ur.user_Sno,
//         ur.user_Id,
//         COALESCE(ur.user_answer, 'N/A') AS Uruser_answer,
//         COALESCE(ur.user_answer, '--') AS UruserAnswer,
//         qts.typeofQuestion,
//         ans.answer_id,
//         ans.answer_text,
//         m.markesId,
//         m.marks_text,
//         m.nmarks_text,
//         si.sort_id,
//         si.sortid_text,
//         doc.documen_name,
//         doc.sectionId,
//         doc.subjectId,
//         doc.testCreationTableId,
//         P.paragraphImg,
//         p.paragraph_Id,
//         pq.paragraphQNo_Id,
//         pq.paragraphQNo,
//         qts.quesionTypeId,
//         tct.TestName,
//         sm.std_marks,
//         sm.status
//     FROM
//         questions q
//     LEFT OUTER JOIN OPTIONS o ON
//         q.question_id = o.question_id
//     LEFT OUTER JOIN qtype qt ON
//         q.question_id = qt.question_id
//     LEFT OUTER JOIN quesion_type qts ON
//         qt.quesionTypeId = qts.quesionTypeId
//     LEFT OUTER JOIN answer ans ON
//         q.question_id = ans.question_id
//     LEFT OUTER JOIN marks m ON
//         q.question_id = m.question_id
//     LEFT OUTER JOIN sortid si ON
//         q.question_id = si.question_id
//     LEFT OUTER JOIN solution s ON
//         q.question_id = s.solution_id
//     LEFT OUTER JOIN paragraph p ON
//         q.document_Id = p.document_Id
//     LEFT OUTER JOIN paragraphqno pq ON
//         p.paragraph_Id = pq.paragraph_Id AND q.question_id = pq.question_id
//     LEFT OUTER JOIN ots_document doc ON
//         q.document_Id = doc.document_Id
//     LEFT OUTER JOIN user_responses ur ON
//         q.question_id = ur.question_id AND ur.user_Id = ?
//     LEFT OUTER JOIN student_marks sm ON
//         ur.user_Id = sm.user_Id -- Join condition for student_marks
//     LEFT OUTER JOIN test_creation_table tct ON
//         doc.testCreationTableId = tct.testCreationTableId
//     WHERE
//         doc.testCreationTableId = ?
//     ORDER BY
//         q.question_id ASC,
//         o.option_index ASC;
//       `,
//         [user_Id, testCreationTableId]
//       );

//       // Check if rows is not empty
//       if (rows.length > 0) {
//         const questionData = {
//           questions: [],
//         };
//         rows.forEach((row) => {
//           const existingQuestion = questionData.questions.find(
//             (q) => q.question_id === row.question_id
//           );
//           const option = {
//             option_id: row.option_id,
//             option_index: row.option_index,
//             optionImgName: row.optionImgName,
//             answer_text: row.answer_text,
//           };
//           if (existingQuestion) {
//             const existingOption = existingQuestion.options.find(
//               (opt) => opt.option_id === option.option_id
//             );
//             if (!existingOption) {
//               existingQuestion.options.push(option);
//             }
//           } else {
//             const trimmedAnswerText = row.answer_text.trim().toLowerCase();
//             const trimmedUserAnswer = row.Uruser_answer.trim().toLowerCase();
//             const trimmedUserAnswer1 = row.UruserAnswer.trim().toLowerCase();
//             const userAnswerStatus = row.UruserAnswer === '--' ? '--' : trimmedAnswerText === trimmedUserAnswer1 ? "Correct" : "Wrong";
//             const userAnswerMarks = row.UruserAnswer === undefined || row.UruserAnswer === '--'
//             ? "--"
//             : trimmedAnswerText === trimmedUserAnswer
//               ? row.marks_text
//               : `-${row.nmarks_text}`;
//                       const newQuestion = {
//               TestName: row.TestName,
//               question_id: row.question_id,
//               questionImgName: row.questionImgName,
//               documen_name: row.documen_name,
//               options: [option],
//               subjectId: row.subjectId,
//               sectionId: row.sectionId,
//               qtype: {
//                 qtypeId: row.qtypeId,
//                 qtype_text: row.qtype_text,
//               },
//               quesion_type: {
//                 quesionTypeId: row.quesionTypeId,
//                 quesion_type: row.quesion_type,
//                 typeofQuestion: row.typeofQuestion,
//               },
//               userAnswerStatus: userAnswerStatus,
//               userAnswerMarks:userAnswerMarks,

//               answer: {
//                 answer_id: row.answer_id,
//                 answer_text: row.answer_text,
//                 solutionImgName: row.solutionImgName,
//                 Uruser_answer:
//                   row.Uruser_answer !== null && row.Uruser_answer !== undefined
//                     ? row.Uruser_answer
//                     : "N/A",
//               },
//               useranswer: {
//                 urid: row.question_id,
//                 Uruser_answer:
//                   row.Uruser_answer !== null && row.Uruser_answer !== undefined
//                     ? row.Uruser_answer
//                     : "N/A",
//               },
//               marks: {
//                 markesId: row.markesId,
//                 marks_text: row.marks_text,
//                 nmarks_text: row.nmarks_text,
//                 UruserAnswer:row.UruserAnswer,
//               },
//               sortid: {
//                 sort_id: row.sort_id,
//                 sortid_text: row.sortid_text,
//               },
//               solutionImgName: {
//                 solutionImgName: row.solutionImgName,
//               },
//               paragraph: {},
//               paragraphqno: {},
//             };

//             if (row.paragraph_Id && row.paragraphQNo) {
//               newQuestion.paragraph = {
//                 paragraph_Id: row.paragraph_Id,
//                 paragraphImg: row.paragraphImg,
//               };

//               newQuestion.paragraphqno = {
//                 paragraphQNo_Id: row.paragraphQNo_Id,
//                 paragraphQNo: row.paragraphQNo,
//               };
//             }

//             questionData.questions.push(newQuestion);
//           }
//         });

//         res.json(questionData);
//       } else {
//         res.status(404).json({ error: "No data found" });
//       }
//     } catch (error) {
//       console.error("Error fetching question data:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   }
// );




    
// router.get("/questionOptions_result/:testCreationTableId/:user_Id",
//   async (req, res) => {
//     const { testCreationTableId, user_Id } = req.params;
//     try {
//       const [rows] = await db.query(
//         `SELECT
//         q.question_id,
//         q.questionImgName,
//         o.option_id,
//         o.optionImgName,
//         o.option_index,
//         s.solution_id AS solution_id,
//         s.solutionImgName AS solutionImgName,
//         qt.qtypeId,
//         qt.qtype_text,
//         ur.user_Sno,
//         ur.user_Id,
//         COALESCE(ur.user_answer, 'N/A') AS Uruser_answer,
//         COALESCE(ur.user_answer, '--') AS UruserAnswer,
//         qts.typeofQuestion,
//         ans.answer_id,
//         ans.answer_text,
//         m.markesId,
//         m.marks_text,
//         m.nmarks_text,
//         si.sort_id,
//         si.sortid_text,
//         doc.documen_name,
//         doc.sectionId,
//         doc.subjectId,
//         doc.testCreationTableId,
//         P.paragraphImg,
//         p.paragraph_Id,
//         pq.paragraphQNo_Id,
//         pq.paragraphQNo,
//         qts.quesionTypeId,
//         tct.TestName,
//         sm.std_marks,
//         sec.sectionName,
//         sub.subjectName,
//         sm.status
//     FROM
//         questions q
//     LEFT OUTER JOIN OPTIONS o ON
//         q.question_id = o.question_id
//     LEFT OUTER JOIN qtype qt ON
//         q.question_id = qt.question_id
//     LEFT OUTER JOIN quesion_type qts ON
//         qt.quesionTypeId = qts.quesionTypeId
//     LEFT OUTER JOIN answer ans ON
//         q.question_id = ans.question_id
//     LEFT OUTER JOIN marks m ON
//         q.question_id = m.question_id
//     LEFT OUTER JOIN sortid si ON
//         q.question_id = si.question_id
//     LEFT OUTER JOIN solution s ON
//         q.question_id = s.solution_id
//     LEFT OUTER JOIN paragraph p ON
//         q.document_Id = p.document_Id
//     LEFT OUTER JOIN paragraphqno pq ON
//         p.paragraph_Id = pq.paragraph_Id AND q.question_id = pq.question_id
//     LEFT OUTER JOIN ots_document doc ON
//         q.document_Id = doc.document_Id
//     LEFT OUTER JOIN user_responses ur ON
//         q.question_id = ur.question_id AND ur.user_Id = ?
//     LEFT OUTER JOIN student_marks sm ON
//         ur.user_Id = sm.user_Id AND q.question_id = sm.question_id
//     LEFT OUTER JOIN test_creation_table tct ON
//         doc.testCreationTableId = tct.testCreationTableId
//     LEFT OUTER JOIN sections sec ON
//         doc.sectionId = sec.sectionId
//     LEFT OUTER JOIN subjects sub ON
//         sub.subjectId = sec.subjectId
//     WHERE
//         doc.testCreationTableId = ?
//     ORDER BY
//         q.question_id ASC,
//         o.option_index ASC;
    
//           `,
//         [user_Id, testCreationTableId]
//       );

//       // Check if rows is not empty
//       if (rows.length > 0) {
//         const questionData = {
//           questions: [],
//         };
//         rows.forEach((row) => {
//           const existingQuestion = questionData.questions.find(
//             (q) => q.question_id === row.question_id
//           );
//           const option = {
//             option_id: row.option_id,
//             option_index: row.option_index,
//             optionImgName: row.optionImgName,
//             answer_text: row.answer_text,
//           };
//           if (existingQuestion) {
//             const existingOption = existingQuestion.options.find(
//               (opt) => opt.option_id === option.option_id
//             );
//             if (!existingOption) {
//               existingQuestion.options.push(option);
//             }
//           } else {
//             let userAnswerStatus, userAnswerMarks;
//             if (row.status !== null) {
//               userAnswerStatus = row.status === 1 ? "Correct" : "Wrong";
//               userAnswerMarks =
//                 row.status === 1 ? row.std_marks : `-${row.nmarks_text}`;
//             } else {
//               userAnswerStatus = "N/A";
//               userAnswerMarks = "N/A";
//             }
//             const newQuestion = {
//               TestName: row.TestName,
//               question_id: row.question_id,
//               questionImgName: row.questionImgName,
//               documen_name: row.documen_name,
//               options: [option],
//               subjectId: row.subjectId,
//               sectionId: row.sectionId,
//               qtype: {
//                 qtypeId: row.qtypeId,
//                 qtype_text: row.qtype_text,
//               },
//               sectionName: {
//                 sectionName: row.sectionName,
//                 subjectName: row.subjectName,
//               },
//               quesion_type: {
//                 quesionTypeId: row.quesionTypeId,
//                 quesion_type: row.quesion_type,
//                 typeofQuestion: row.typeofQuestion,
//               },
//               userAnswerStatus: userAnswerStatus,
//               userAnswerMarks: userAnswerMarks,
//               marks: {
//                 markesId: row.markesId,
//                 marks_text: row.marks_text,
//                 nmarks_text: row.nmarks_text,
//               },
//               sortid: {
//                 sort_id: row.sort_id,
//                 sortid_text: row.sortid_text,
//               },
//               solutionImgName: {
//                 solutionImgName: row.solutionImgName,
//               },
//               paragraph: {},
//               paragraphqno: {},
//               Uruser_answer: row.Uruser_answer,
//             };

//             if (row.paragraph_Id && row.paragraphQNo) {
//               newQuestion.paragraph = {
//                 paragraph_Id: row.paragraph_Id,
//                 paragraphImg: row.paragraphImg,
//               };

//               newQuestion.paragraphqno = {
//                 paragraphQNo_Id: row.paragraphQNo_Id,
//                 paragraphQNo: row.paragraphQNo,
//               };
//             }

//             questionData.questions.push(newQuestion);
//           }
//         });

//         res.json(questionData);
//       } else {
//         res.status(404).json({ error: "No data found" });
//       }
//     } catch (error) {
//       console.error("Error fetching question data:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   }
// );

router.get("/questionOptions_result/:testCreationTableId/:user_Id",
  async (req, res) => {
    const { testCreationTableId, user_Id } = req.params;
    try {
      const [rows] = await db.query(
        `SELECT
        q.question_id,
        q.questionImgName,
        o.option_id,
        o.optionImgName,
        o.option_index,
        s.solution_id AS solution_id,
        s.solutionImgName AS solutionImgName,
        qt.qtypeId,
        qt.qtype_text,
        ur.user_Sno,
        ur.user_Id,
        COALESCE(urs.user_answer, '--') AS StatusUruserAnswer,
        COALESCE(ur.user_answer, 'N/A') AS Uruser_answer,
        COALESCE(ur.user_answer, '--') AS UruserAnswer,
        qts.typeofQuestion,
        ans.answer_id,
        ans.answer_text,
        m.markesId,
        m.marks_text,
        m.nmarks_text,
        si.sort_id,
        si.sortid_text,
        doc.documen_name,
        doc.sectionId,
        doc.subjectId,
        doc.testCreationTableId,
        P.paragraphImg,
        p.paragraph_Id,
        pq.paragraphQNo_Id,
        pq.paragraphQNo,
        qts.quesionTypeId,
        tct.TestName,
        sm.std_marks,
        sec.sectionName,
        sub.subjectName,
        sm.status,
        COALESCE(sds.Doubt_Id, 'N/A') AS Doubt_Id
    FROM
        questions q
    LEFT OUTER JOIN OPTIONS o ON
        q.question_id = o.question_id
    LEFT OUTER JOIN qtype qt ON
        q.question_id = qt.question_id
    LEFT OUTER JOIN quesion_type qts ON
        qt.quesionTypeId = qts.quesionTypeId
    LEFT OUTER JOIN answer ans ON
        q.question_id = ans.question_id
    LEFT OUTER JOIN marks m ON
        q.question_id = m.question_id
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
    LEFT OUTER JOIN user_responses ur ON
        q.question_id = ur.question_id AND ur.user_Id = ?


        LEFT OUTER JOIN user_responses urs ON
        urs.option_id = o.option_id 



    LEFT OUTER JOIN student_marks sm ON
        ur.user_Id = sm.user_Id AND q.question_id = sm.question_id
    LEFT OUTER JOIN test_creation_table tct ON
        doc.testCreationTableId = tct.testCreationTableId
    LEFT OUTER JOIN sections sec ON
        doc.sectionId = sec.sectionId
    LEFT OUTER JOIN subjects sub ON
        sub.subjectId = sec.subjectId
        LEFT OUTER JOIN stutedntdoubtsectiondata sds ON
    ur.user_Id = sds.user_Id AND doc.testCreationTableId = sds.testCreationTableId AND q.question_id = sds.question_id
    WHERE
        doc.testCreationTableId = ?
    ORDER BY
        q.question_id ASC,
        o.option_index ASC;
    
    
          `,
        [user_Id, testCreationTableId]
      );

      // Check if rows is not empty
      if (rows.length > 0) {
        const questionData = {
          questions: [],
        };
        rows.forEach((row) => {
          const existingQuestion = questionData.questions.find(
            (q) => q.question_id === row.question_id
          );
          const option = {
            option_id: row.option_id,
            option_index: row.option_index,
            optionImgName: row.optionImgName,
            answer_text: row.answer_text,
            StatusUruserAnswer: row.StatusUruserAnswer,
            Uruser_answer: row.Uruser_answer
          };
          if (existingQuestion) {
            const existingOption = existingQuestion.options.find(
              (opt) => opt.option_id === option.option_id
            );
            if (!existingOption) {
              existingQuestion.options.push(option);
            }
          } else {
            let userAnswerStatus, userAnswerMarks;
            if (row.status !== null) {
              userAnswerStatus = row.status === 1 ? "Correct" : "Wrong";
              userAnswerMarks =
                row.status === 1 ? row.std_marks : `-${row.nmarks_text}`;
            } else {
              userAnswerStatus = "N/A";
              userAnswerMarks = "N/A";
            }
            const newQuestion = {
              TestName: row.TestName,
              question_id: row.question_id,
              questionImgName: row.questionImgName,
              documen_name: row.documen_name,
              options: [option],
              subjectId: row.subjectId,
              sectionId: row.sectionId,
              qtype: {
                qtypeId: row.qtypeId,
                qtype_text: row.qtype_text,
              },
              sectionName: {
                sectionName: row.sectionName,
                subjectName: row.subjectName,
              },
              quesion_type: {
                quesionTypeId: row.quesionTypeId,
                quesion_type: row.quesion_type,
                typeofQuestion: row.typeofQuestion,
              },
              userAnswerStatus: userAnswerStatus,
              userAnswerMarks: userAnswerMarks,
              marks: {
                markesId: row.markesId,
                marks_text: row.marks_text,
                nmarks_text: row.nmarks_text,
              },
              sortid: {
                sort_id: row.sort_id,
                sortid_text: row.sortid_text,
              },
              solutionImgName: {
                solutionImgName: row.solutionImgName,
              },
              paragraph: {},
              paragraphqno: {},
              Uruser_answer: row.Uruser_answer,
            };

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
        res.status(404).json({ error: "No data found" });
      }
    } catch (error) {
      console.error("Error fetching question data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);





// router.get('/userResponses/:userId/:testCreationTableId', (req, res) => {
//   const userId = req.params.userId;
//   const testCreationTableId = req.params.testCreationTableId;

//   const query = `
//     SELECT ur.user_Id, ur.testCreationTableId, ur.subjectId, ur.sectionId, ur.question_id, ur.user_answer, a.answer_text
//     FROM user_responses ur
//     INNER JOIN answer a ON ur.question_id = a.question_id
//     WHERE ur.user_Id = ? AND ur.testCreationTableId = ?
//   `;

//   db.query(query, [userId, testCreationTableId], (error, results) => {
//     if (error) {
//       console.error('Error executing MySQL query:', error);
//       res.status(500).send('Internal Server Error');
//       return;
//     }

//     res.json(results);
//   });
// });

router.get("/userResponses/:userId/:testCreationTableId", async (req, res) => {
  const userId = req.params.userId;
  const testCreationTableId = req.params.testCreationTableId;

  try {
    const [rows] = await db.query(
      `SELECT ur.user_Id, ur.testCreationTableId, ur.subjectId, ur.sectionId, a.question_id, 
      COALESCE(ur.user_answer, 'N/A') AS user_answer, a.answer_text
      FROM answer a
      LEFT JOIN user_responses ur ON ur.question_id = a.question_id AND ur.user_Id = ? AND ur.testCreationTableId = ?
      ORDER BY a.question_id ASC`,

      [userId, testCreationTableId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/kevin/score/:testCreationTableId/:user_Id", async (req, res) => {
  const { testCreationTableId, user_Id } = req.params;

  try {
    if (!testCreationTableId || !user_Id) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const [results, fields] = await db.execute(
      `(
        SELECT
            ur.user_Sno,
            ur.user_Id,
            ur.testCreationTableId,
            s.subjectId,
            sub.subjectName,
            s.sectionId,
            s.sectionName,  
            ur.question_id,
            ur.user_answer,
            a.answer_text,
            m.marks_text,
            0 AS nmarks_text,
            s.QuestionLimit
        FROM
            user_responses ur
        JOIN answer a ON
            ur.question_id = a.question_id
        JOIN marks m ON
            ur.question_id = m.question_id
        JOIN sections s ON
            ur.sectionId = s.sectionId
        JOIN subjects sub ON
            sub.subjectId = s.subjectId
        WHERE
            TRIM(ur.user_answer) = TRIM(a.answer_text) AND ur.user_Id = 3 AND ur.testCreationTableId = 18 AND (
                s.QuestionLimit IS NULL OR s.QuestionLimit = 0
            )
    )
    UNION
    (
        SELECT
            ur.user_Sno,
            ur.user_Id,
            ur.testCreationTableId,
            s.subjectId,
            sub.subjectName,
            s.sectionId, -- Corrected sectionId selection here
            s.sectionName,  
            ur.question_id,
            ur.user_answer,
            a.answer_text,
            0 AS marks_text,
            m.nmarks_text,
            s.QuestionLimit
        FROM
            user_responses ur
        JOIN answer a ON
            ur.question_id = a.question_id
        JOIN marks m ON
            ur.question_id = m.question_id
        JOIN sections s ON
            ur.sectionId = s.sectionId
        JOIN subjects sub ON
            sub.subjectId = s.subjectId
        WHERE
            TRIM(ur.user_answer) != TRIM(a.answer_text) AND ur.user_Id = 3 AND ur.testCreationTableId = 18 AND (
                s.QuestionLimit IS NULL OR s.QuestionLimit = 0
            )
    )
    UNION
    (
        SELECT
            ur.user_Sno,
            ur.user_Id,
            ur.testCreationTableId,
            s.subjectId,
            sub.subjectName,
            s.sectionId,
            s.sectionName,  
            ur.question_id,
            ur.user_answer,
            a.answer_text,
            m.marks_text,
            0 AS nmarks_text,
            s.QuestionLimit
        FROM
            user_responses ur
        JOIN answer a ON
            ur.question_id = a.question_id
        JOIN marks m ON
            ur.question_id = m.question_id
        JOIN sections s ON
            ur.sectionId = s.sectionId
        JOIN subjects sub ON
            sub.subjectId = s.subjectId
        WHERE
            TRIM(ur.user_answer) = TRIM(a.answer_text) AND ur.user_Id = 3 AND ur.testCreationTableId = 18 AND s.QuestionLimit IS NOT NULL AND s.QuestionLimit > 0
        LIMIT 25
    )
    UNION
    (
        SELECT
            ur.user_Sno,
            ur.user_Id,
            ur.testCreationTableId,
            s.subjectId,
            sub.subjectName,
            s.sectionId, -- Corrected sectionId selection here
            s.sectionName,
            ur.question_id,
            ur.user_answer,
            a.answer_text,
            0 AS marks_text,
            m.nmarks_text,
            s.QuestionLimit
        FROM
            user_responses ur
        JOIN answer a ON
            ur.question_id = a.question_id
        JOIN marks m ON
            ur.question_id = m.question_id
        JOIN sections s ON
            ur.sectionId = s.sectionId
        JOIN subjects sub ON
            sub.subjectId = s.subjectId
        WHERE
            TRIM(ur.user_answer) != TRIM(a.answer_text) AND ur.user_Id =3 AND ur.testCreationTableId =18 AND s.QuestionLimit IS NOT NULL AND s.QuestionLimit > 0
        LIMIT 25
    );
    `,
      [
        user_Id,
        testCreationTableId,
        user_Id,
        testCreationTableId,
        user_Id,
        testCreationTableId,
        user_Id,
        testCreationTableId,
      ]
    );

    // Initialize an object to hold subject-wise scores for sections with question limits
    let subjectScoresWithLimit = {};

    // Initialize an object to hold subject-wise scores for sections without question limits
    let subjectScoresWithoutLimit = {};

    // Iterate over the results and calculate subject-wise scores
    results.forEach((row) => {
      const {
        subjectId,
        subjectName,
        sectionId,
        sectionName,
        marks_text,
        nmarks_text,
        QuestionLimit,
      } = row;

      // Check if the section has a question limit
      if (QuestionLimit !== null && QuestionLimit > 0) {
        // If subjectId doesn't exist in subjectScoresWithLimit, initialize it
        if (!subjectScoresWithLimit[subjectId]) {
          subjectScoresWithLimit[subjectId] = {
            subjectId,
            subjectName,
            sectionName,
            sectionId,
            totalMarks: 0,
            netMarks: 0,
            correctAnswersCount: 0,
            questionLimit: 0,
          };
        }

        // Update subject-wise scores for sections with question limits
        if (
          subjectScoresWithLimit[subjectId].correctAnswersCount < QuestionLimit
        ) {
          subjectScoresWithLimit[subjectId].totalMarks += marks_text;
          subjectScoresWithLimit[subjectId].netMarks +=
            marks_text - nmarks_text;
          subjectScoresWithLimit[subjectId].correctAnswersCount++;
        }

        // Set the question limit (assuming it's the same for all rows)
        subjectScoresWithLimit[subjectId].questionLimit = QuestionLimit;
      } else {
        // If the section does not have a question limit
        // If subjectId doesn't exist in subjectScoresWithoutLimit, initialize it
        if (!subjectScoresWithoutLimit[subjectId]) {
          subjectScoresWithoutLimit[subjectId] = {
            subjectId,
            subjectName,
            sectionName,
            // sectionId,
            totalMarks: 0,
            netMarks: 0,
            correctAnswersCount: 0,
          };
        }

        // Update subject-wise scores for sections without question limits
        subjectScoresWithoutLimit[subjectId].totalMarks += marks_text;
        subjectScoresWithoutLimit[subjectId].netMarks +=
          marks_text - nmarks_text;
        subjectScoresWithoutLimit[subjectId].correctAnswersCount++;
      }
    });

    // Calculate overall total and net marks
    let overallTotalMarks = 0;
    let overallNetMarks = 0;

    // Calculate total and net marks for sections with question limits
    Object.values(subjectScoresWithLimit).forEach((subjectScore) => {
      overallTotalMarks += subjectScore.totalMarks;
      overallNetMarks += subjectScore.netMarks;
    });

    // Calculate total and net marks for sections without question limits
    Object.values(subjectScoresWithoutLimit).forEach((subjectScore) => {
      overallTotalMarks += subjectScore.totalMarks;
      overallNetMarks += subjectScore.netMarks;
    });

    // Ensure object properties are defined before iterating
    const subjectsArray = [];

    // Iterate over subjectScoresWithoutLimit
    Object.entries(subjectScoresWithoutLimit).forEach(([subjectId, scores]) => {
      const { sectionId, sectionName, subjectName } = scores; // Destructuring sectionId and sectionName from scores
      subjectsArray.push({
        subjectId,
        subjectName,
        sections: [{ sectionId, sectionName, Section: "A", scores }], // Include both sectionId and sectionName here
      });
    });

    // Iterate over subjectScoresWithLimit
    Object.entries(subjectScoresWithLimit).forEach(([subjectId, scores]) => {
      const { sectionId, sectionName, subjectName } = scores; // Destructuring sectionId and sectionName from scores
      subjectsArray.push({
        subjectId,
        subjectName,
        sections: [{ sectionId, sectionName, Section: "B", scores }], // Include both sectionId and sectionName here
      });
    });

    //  // Output the result
    res.json({
      overallTotalMarks,
      overallNetMarks,
      subjects: subjectsArray,
    });
  } catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.get("/sectionR/:userId/:testCreationTableId", async (req, res) => {
//   const userId = req.params.userId;
//   const testCreationTableId = req.params.testCreationTableId;

//   try {
//     const [rows] = await db.query(
//       `SELECT
//       ur.user_Sno,
//       ur.user_Id,
//       ur.testCreationTableId,
//       s.subjectId,
//       sub.subjectName,
//       s.sectionId,
//       s.sectionName,
//       ur.question_id,
//       ur.user_answer,
//       a.answer_text,
//       m.marks_text,
//       CASE
//           WHEN TRIM(ur.user_answer) = TRIM(a.answer_text) THEN
//               CASE
//                   WHEN qt.qtype_text IN ('NATI', 'NATD') THEN
//                       ROUND(4.0, 2) -- Full Marks: +4 for NATI and NATD
//                   ELSE
//                       m.marks_text -- Allocate allotted marks if user's answer matches the correct answer
//               END
//           ELSE
//               -1 -- Assign -1 mark if user's answer doesn't match the correct answer
//       END AS score,
//       s.QuestionLimit,
//       qt.qtype_text
//   FROM
//       user_responses ur
//   JOIN answer a ON
//       ur.question_id = a.question_id
//   JOIN marks m ON
//       ur.question_id = m.question_id
//   JOIN sections s ON
//       ur.sectionId = s.sectionId
//   JOIN subjects sub ON
//       sub.subjectId = s.subjectId
//   JOIN qtype qt ON
//       qt.question_id = ur.question_id
//   WHERE
//       ur.user_Id = 3 AND ur.testCreationTableId = 18;
//   `,
//       [userId, testCreationTableId]
//     );

//     res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });

// router.get("/sectionR/:userId/:testCreationTableId", async (req, res) => {
//   const userId = req.params.userId;
//   const testCreationTableId = req.params.testCreationTableId;

//   try {
//     // Fetch all relevant data from the database
//     const query = `
//       SELECT
//           s.sectionId,
//           s.sectionName,
//           ur.user_Sno,
//           ur.user_Id,
//           ur.testCreationTableId,
//           s.subjectId,
//           sub.subjectName,
//           ur.question_id,
//           ur.user_answer,
//           a.answer_text,
//           m.marks_text,
//           CASE
//               WHEN TRIM(ur.user_answer) = TRIM(a.answer_text) THEN
//                   CASE
//                       WHEN qt.qtype_text IN ('NATI', 'NATD') THEN
//                           ROUND(4.0, 2) -- Full Marks: +4 for NATI and NATD
//                       ELSE
//                           m.marks_text -- Allocate allotted marks if user's answer matches the correct answer
//                   END
//               ELSE
//                   -1 -- Assign -1 mark if user's answer doesn't match the correct answer
//           END AS score,
//           s.QuestionLimit,
//           qt.qtype_text
//       FROM
//           user_responses ur
//       JOIN answer a ON ur.question_id = a.question_id
//       JOIN marks m ON ur.question_id = m.question_id
//       JOIN sections s ON ur.sectionId = s.sectionId
//       JOIN subjects sub ON sub.subjectId = s.subjectId
//       JOIN qtype qt ON qt.question_id = ur.question_id
//       WHERE
//           ur.user_Id = 3 AND ur.testCreationTableId = 18
//     `;
//     const [rows] = await db.query(query, [userId, testCreationTableId]);

//     // Organize the data into a structured format
//     const sectionData = {};
//     rows.forEach(row => {
//       const { sectionId, sectionName, ...data } = row;
//       if (!sectionData[sectionId]) {
//         sectionData[sectionId] = {
//           sectionId: sectionId,
//           sectionName: sectionName,
//           data: []
//         };
//       }
//       sectionData[sectionId].data.push(data);
//     });

//     // Convert sectionData object to array
//     const result = Object.values(sectionData);

//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });

// router.get("/sectionR/:userId/:testCreationTableId", async (req, res) => {
//   const userId = req.params.userId;
//   const testCreationTableId = req.params.testCreationTableId;

//   try {
//     // Fetch all relevant data from the database
//     const query = `
//       SELECT
//           s.sectionId,
//           s.sectionName,
//           ur.user_Sno,
//           ur.user_Id,
//           ur.testCreationTableId,
//           s.subjectId,
//           sub.subjectName,
//           ur.question_id,
//           ur.user_answer,
//           a.answer_text,
//           m.marks_text,
//           CASE
//               WHEN TRIM(ur.user_answer) = TRIM(a.answer_text) THEN
//                   CASE
//                       WHEN qt.qtype_text IN ('NATI', 'NATD') THEN
//                           ROUND(4.0, 2) -- Full Marks: +4 for NATI and NATD
//                       ELSE
//                           m.marks_text -- Allocate allotted marks if user's answer matches the correct answer
//                   END
//               ELSE
//                   -1 -- Assign -1 mark if user's answer doesn't match the correct answer
//           END AS score,
//           s.QuestionLimit,
//           qt.qtype_text
//       FROM
//           user_responses ur
//       JOIN answer a ON ur.question_id = a.question_id
//       JOIN marks m ON ur.question_id = m.question_id
//       JOIN sections s ON ur.sectionId = s.sectionId
//       JOIN subjects sub ON sub.subjectId = s.subjectId
//       JOIN qtype qt ON qt.question_id = ur.question_id
//       WHERE
//           ur.user_Id = 3 AND ur.testCreationTableId = 18
//     `;
//     const [rows] = await db.query(query, [userId, testCreationTableId]);

//     // Organize the data into a structured format and calculate section total marks and total negative marks
//     const sectionData = {};
//     rows.forEach(row => {
//       const { sectionId, sectionName, marks_text, score } = row;
//       const totalMarks = parseFloat(marks_text);
//       const negativeMarks = score === -1 ? totalMarks : 0;

//       if (!sectionData[sectionId]) {
//         sectionData[sectionId] = {
//           sectionId: sectionId,
//           sectionName: sectionName,
//           totalMarks: totalMarks,
//           totalNegativeMarks: negativeMarks,
//           data: []
//         };
//       }

//       sectionData[sectionId].totalMarks += totalMarks;
//       sectionData[sectionId].totalNegativeMarks += negativeMarks;
//       sectionData[sectionId].data.push(row);
//     });

//     // Convert sectionData object to array
//     const result = Object.values(sectionData);

//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });

router.get("/sectionR/:userId/:testCreationTableId", async (req, res) => {
  const userId = req.params.userId;
  const testCreationTableId = req.params.testCreationTableId;

  try {
    // Fetch all relevant data from the database
    const query = `
          SELECT
              s.sectionId,
              s.sectionName,
              ur.user_Sno,
              ur.user_Id,
              ur.testCreationTableId,
              s.subjectId,
              sub.subjectName,
              ur.question_id,
              ur.user_answer,
              a.answer_text,
              m.marks_text,
              CASE 
                  WHEN TRIM(ur.user_answer) = TRIM(a.answer_text) THEN
                      CASE 
                          WHEN qt.qtype_text IN ('NATI', 'NATD') THEN
                              ROUND(4.0, 2) -- Full Marks: +4 for NATI and NATD
                          WHEN qt.qtype_text IN ('MCQ4', 'MCQ5', 'CTQ', 'TF') THEN
                              CASE 
                                  WHEN ur.user_answer = a.answer_text THEN 4 -- Full Marks: +4
                                  ELSE -2 -- Negative Marks: -2
                              END
                          WHEN qt.qtype_text IN ('MSQN', 'MSQ') THEN
                              CASE 
                                  WHEN ur.user_answer = a.answer_text THEN 3 -- Partial Marks: +3
                                  ELSE -1 -- Negative Marks: -1
                              END
                          ELSE
                              0 -- Zero Marks: 0
                      END
                  ELSE
                      -1 -- Assign -1 mark if user's answer doesn't match the correct answer
              END AS score,
              s.QuestionLimit,
              qt.qtype_text
          FROM
              user_responses ur
          JOIN answer a ON ur.question_id = a.question_id
          JOIN marks m ON ur.question_id = m.question_id
          JOIN sections s ON ur.sectionId = s.sectionId
          JOIN subjects sub ON sub.subjectId = s.subjectId
          JOIN qtype qt ON qt.question_id = ur.question_id
          WHERE  
              ur.user_Id = 3 AND ur.testCreationTableId = 18
      `;
    const [rows] = await db.query(query, [userId, testCreationTableId]);

    // Organize the data into a structured format and calculate section total marks and total negative marks
    const sectionData = {};
    let totalNegativeMarks = 0;
    rows.forEach((row) => {
      const { sectionId, sectionName, marks_text, score, qtype_text } = row;
      const totalMarks = parseFloat(marks_text);

      if (!sectionData[sectionId]) {
        sectionData[sectionId] = {
          sectionId: sectionId,
          sectionName: sectionName,
          totalMarks: 0,
          totalScore: 0,
          totalNegativeMarks: 0,
          data: [],
          qtypeCounts: {},
        };
      }

      // Increment the count for each question type
      if (!sectionData[sectionId].qtypeCounts[qtype_text]) {
        sectionData[sectionId].qtypeCounts[qtype_text] = 0;
      }
      sectionData[sectionId].qtypeCounts[qtype_text]++;

      if (score >= 0) {
        sectionData[sectionId].totalScore += score;
      } else {
        sectionData[sectionId].totalNegativeMarks += totalMarks;
        totalNegativeMarks += totalMarks;
      }

      sectionData[sectionId].totalMarks += totalMarks;
      sectionData[sectionId].data.push(row);
    });

    // Convert sectionData object to array and calculate the overall total score
    const sections = Object.values(sectionData).map((section) => ({
      ...section,
      totalNegativeMarks: section.totalNegativeMarks,
    }));
    const overallTotalScore = sections.reduce(
      (acc, section) => acc + section.totalScore,
      0
    );

    res.json({
      sections: sections,
      overallTotalScore: overallTotalScore,
      overallTotalNegativeMarks: totalNegativeMarks,
      overallDifference: overallTotalScore - totalNegativeMarks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get(
  "/sectionwiseScoreAndTotalMarks/:userId/:testCreationTableId",
  async (req, res) => {
    const userId = req.params.userId;
    const testCreationTableId = req.params.testCreationTableId;

    try {
      // Section Wise Scores
      const [sectionWiseScores] = await db.query(
        `SELECT
        student_marks.user_Id,
        student_marks.sectionId,
        sections.sectionName,
        COUNT(CASE WHEN student_marks.status = 0 THEN 1 ELSE NULL END) AS wrong_answers,
        COUNT(CASE WHEN student_marks.status = 1 THEN 1 ELSE NULL END) AS correct_answers,
        GROUP_CONCAT(
          DISTINCT subjects.subjectName ORDER BY subjects.subjectName
        ) AS subjectNames,
        SUM(student_marks.std_marks) AS total_marks
      FROM
        student_marks
      JOIN sections ON sections.sectionId = student_marks.sectionId
      JOIN subjects ON subjects.subjectId = student_marks.subjectId
      WHERE
        student_marks.user_Id = ? AND student_marks.testCreationTableId = ?
      GROUP BY
        student_marks.user_Id,
        student_marks.sectionId
      LIMIT 0, 25;
    `,
        [userId, testCreationTableId]
      );

      // Section Wise Total Marks
      const [sectionWiseTotalMarks] = await db.query(
        `SELECT s.sectionId, SUM(m.marks_text) AS totalMarksForEachSection
      FROM marks m
      JOIN questions q ON m.question_id = q.question_id
      JOIN sections s ON s.sectionId = q.sectionId
      WHERE q.testCreationTableId = ?
      GROUP BY s.sectionId;
    `,
        [testCreationTableId]
      );

      // Calculate and add percentage for each section
      const sectionWiseScoresWithPercentage = sectionWiseScores.map((score) => {
        const totalMarksForSection = sectionWiseTotalMarks.find(
          (totalMarks) => totalMarks.sectionId === score.sectionId
        );
        const percentage = (
          (score.total_marks / totalMarksForSection.totalMarksForEachSection) *
          100
        ).toFixed(2);

        return {
          ...score,
          percentage,
        };
      });

      res.json({
        sectionWiseScores: sectionWiseScoresWithPercentage,
        sectionWiseTotalMarks,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// router.get("/totalmarksandpercentage/:userId/:testCreationTableId", async (req, res) => {
//   const userId = req.params.userId;
//   const testCreationTableId = req.params.testCreationTableId;

//   try {
//     // Total Marks for each student
//     const [totalmarks] = await db.query(
//       `
//       SELECT
//         user_Id,
//         testCreationTableId,
//         SUM(CASE WHEN status = 1 THEN std_marks ELSE -std_marks END) AS totalMarks
//       FROM
//         student_marks
//       WHERE
//         user_Id = ? AND testCreationTableId = ?
//       GROUP BY
//         user_Id, testCreationTableId;
//     `,
//       [userId, testCreationTableId]
//     );

//     console.log('Total Marks:', totalmarks);

//     // Total Marks for each section from marks table
//     const [TotalMarksfrommarkstable] = await db.query(
//       `
//       SELECT
//         q.sectionId,
//         SUM(m.marks_text) AS totalMarksForEachSection
//       FROM
//         marks m
//       JOIN questions q ON m.question_id = q.question_id
//       WHERE
//         q.testCreationTableId = ?
//       GROUP BY
//         q.sectionId;
//     `,
//       [testCreationTableId]
//     );

//     console.log('Total Marks from Marks Table:', TotalMarksfrommarkstable);

//     // Calculate and add percentage for each section
//     const totalmarksWithPercentage = totalmarks.map((score) => {
//       const totalMarksForSection = TotalMarksfrommarkstable.find((totalMarks) => totalMarks.sectionId === score.sectionId);

//       console.log('Score:', score);
//       console.log('Total Marks for Section:', totalMarksForSection);

//       const percentage = totalMarksForSection ? (score.totalMarks / totalMarksForSection.totalMarksForEachSection) * 100 : 0;

//       console.log('Percentage:', percentage);

//       return {
//         ...score,
//         percentage,
//       };
//     });

//     res.json({ totalmarks: totalmarksWithPercentage, TotalMarksfrommarkstable });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.get("/toprank/:testCreationTableId", async (req, res) => {
  const testCreationTableId = req.params.testCreationTableId;

  try {
    // Total Marks for each student with rank
    const [totalmarks] = await db.query(
      `SELECT
      user_Id,
      testCreationTableId,
      testTotalMarks,
      totalMarks,
      RANK() OVER (PARTITION BY testCreationTableId ORDER BY totalMarks DESC) AS rank
    FROM (
      SELECT
        sm.user_Id,
        sm.testCreationTableId,
        tc.totalMarks AS testTotalMarks,
        SUM(CASE WHEN sm.status = 1 THEN sm.std_marks ELSE -sm.std_marks END) AS totalMarks
      FROM
        student_marks sm
      JOIN
        test_creation_table tc ON sm.testCreationTableId = tc.testCreationTableId
      WHERE
        sm.testCreationTableId = ? -- replace ? with the actual testCreationTableId
      GROUP BY
        sm.user_Id, sm.testCreationTableId, tc.totalMarks
    ) AS ranks
    ORDER BY
      testCreationTableId, totalMarks DESC;
    
      `,
      [testCreationTableId]
    );

    if (totalmarks.length > 0) {
      const topRank = totalmarks[0];
      res.json({ topRank, totalmarks });
      console.log("topRank:", topRank);
    } else {
      res.json({ message: "No data available." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get(
  "/rankforeachuser/:userId/:testCreationTableId",
  async (req, res) => {
    const userId = req.params.userId;
    const testCreationTableId = req.params.testCreationTableId;

    try {
      const [totalmarks] = await db.query(
        `
      SELECT
        user_Id,
        testCreationTableId,
        testTotalMarks,
        totalMarks,
        rank
      FROM (
        SELECT
          user_Id,
          testCreationTableId,
          testTotalMarks,
          totalMarks,
          RANK() OVER (PARTITION BY testCreationTableId ORDER BY totalMarks DESC) AS rank
        FROM (
          SELECT
            sm.user_Id,
            sm.testCreationTableId,
            tc.totalMarks AS testTotalMarks,
            SUM(CASE WHEN sm.status = 1 THEN sm.std_marks ELSE -sm.std_marks END) AS totalMarks
          FROM
            student_marks sm
          JOIN
            test_creation_table tc ON sm.testCreationTableId = tc.testCreationTableId
          WHERE
            sm.testCreationTableId = '${testCreationTableId}' 
          GROUP BY
            sm.user_Id, sm.testCreationTableId, tc.totalMarks
        ) AS ranks
      ) AS userRanks
      WHERE
        user_Id = '${userId}';
      `
      );

      if (totalmarks.length > 0) {
        const topRank = totalmarks[0];
        res.json({ topRank, totalmarks });
        console.log("topRank:", topRank);
      } else {
        res.json({ message: "No data available." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/topthreeranks/:testCreationTableId", async (req, res) => {
  const testCreationTableId = req.params.testCreationTableId;

  try {
    const [topThreeRanks] = await db.query(
      `
      SELECT
        user_Id,
        testCreationTableId,
        testTotalMarks,
        totalMarks,
        rank
      FROM (
        SELECT
          user_Id,
          testCreationTableId,
          testTotalMarks,
          totalMarks,
          RANK() OVER (PARTITION BY testCreationTableId ORDER BY totalMarks DESC) AS rank
        FROM (
          SELECT
            sm.user_Id,
            sm.testCreationTableId,
            tc.totalMarks AS testTotalMarks,
            SUM(CASE WHEN sm.status = 1 THEN sm.std_marks ELSE -sm.std_marks END) AS totalMarks
          FROM
            student_marks sm
          JOIN
            test_creation_table tc ON sm.testCreationTableId = tc.testCreationTableId
          WHERE
            sm.testCreationTableId = '${testCreationTableId}' 
          GROUP BY
            sm.user_Id, sm.testCreationTableId, tc.totalMarks
        ) AS ranks
      ) AS userRanks
      WHERE
        rank <= 1;
      `
    );

    if (topThreeRanks.length > 0) {
      res.json({ topThreeRanks });
      console.log("Top three ranks:", topThreeRanks);
    } else {
      res.json({ message: "No data available." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/usermarks/:userId/:testCreationTableId", async (req, res) => {
  const testCreationTableId = req.params.testCreationTableId;
  const userId = req.params.userId;
  console.log("ids:", userId, testCreationTableId);
  try {
    const [usermarks] = await db.query(
      `
      SELECT
        sm.user_Id,
        sm.testCreationTableId,
        tc.totalMarks,
        SUM(CASE WHEN sm.status = 1 THEN sm.std_marks ELSE 0 END) AS sumStatus1,
        SUM(CASE WHEN sm.status = 0 THEN sm.std_marks ELSE 0 END) AS sumStatus0
      FROM
        student_marks sm
      JOIN
        test_creation_table tc ON sm.testCreationTableId = tc.testCreationTableId
      WHERE
        sm.testCreationTableId = ? AND sm.user_Id = ?
      GROUP BY
        sm.user_Id, sm.testCreationTableId, tc.totalMarks;
      `,
      [testCreationTableId, userId]
    );

    if (usermarks.length > 0) {
      const totalDifference = usermarks[0].sumStatus1 - usermarks[0].sumStatus0;
      let percentage = (
        (totalDifference / usermarks[0].totalMarks) *
        100
      ).toFixed(2);
      if (percentage < 0) {
        percentage = 0;
      }

      res.json({ usermarks, totalDifference, percentage });
    } else {
      res.json({ message: "No data available." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/usercountforeachtest/:testCreationTableId", async (req, res) => {
  const testCreationTableId = req.params.testCreationTableId;

  try {
    const [usercount] = await db.query(
      `
      SELECT
  testCreationTableId,
  COUNT(DISTINCT user_Id) AS usercount
FROM
  student_marks
WHERE
  testCreationTableId =${testCreationTableId}
GROUP BY
  testCreationTableId;
      `
    );
    console.log("usercount:", usercount);

    if (usercount.length > 0) {
      res.json({ usercount });
    } else {
      res.json({ message: "No data available." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get(
  "/testdataformyresultpage/:courseCreationId/:testCreationTableId",
  async (req, res) => {
    const courseCreationId = req.params.courseCreationId;
    const testCreationTableId = req.params.testCreationTableId;
    try {
      const [testdataformyresultpage] = await db.query(
        `SELECT
        tct.*,
        COUNT(s.sectionId) AS sectionCount
      FROM
        test_creation_table tct
      LEFT JOIN
        sections s ON tct.testCreationTableId = s.testCreationTableId
      WHERE
        tct.courseCreationId =?
        AND tct.testCreationTableId = ?
      GROUP BY
        tct.testCreationTableId `,
        [courseCreationId, testCreationTableId]
      );
      console.log("test and course ids", courseCreationId, testCreationTableId);
      if (testdataformyresultpage.length > 0) {
        res.json({ testdataformyresultpage });
      } else {
        res.json({ message: "No data available." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get(
  "/AnswerEvaluation/:user_Id/:testCreationTableId",
  async (req, res) => {
    const testCreationTableId = req.params.testCreationTableId;
    const user_Id = req.params.user_Id;
    try {
      const [AnswerEvaluation] = await db.query(
        `SELECT
          sm.user_Id,
          sm.testCreationTableId,
          COUNT(CASE WHEN sm.status = 1 THEN 1 ELSE NULL END) AS totalCorrect,
          COUNT(CASE WHEN sm.status = 0 THEN 1 ELSE NULL END) AS totalWrong,
          tc.totalQuestions
        FROM
          student_marks sm
        JOIN
          test_creation_table tc ON sm.testCreationTableId = tc.testCreationTableId
        WHERE
          sm.user_Id = ? AND sm.testCreationTableId = ?
        GROUP BY
          sm.user_Id, sm.testCreationTableId; `,
        [user_Id, testCreationTableId] // Pass parameters as an array
      );

      if (AnswerEvaluation.length > 0) {
        const totalUnattempted =
          AnswerEvaluation[0].totalCorrect +
          AnswerEvaluation[0].totalWrong -
          AnswerEvaluation[0].totalQuestions;

        res.json({
          totalCorrect: AnswerEvaluation[0].totalCorrect,
          totalWrong: AnswerEvaluation[0].totalWrong,
          totalUnattempted: totalUnattempted,
          totalQuestions: AnswerEvaluation[0].totalQuestions,
        });
      } else {
        res.json({ message: "No data available." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
//main
// router.get("/sectionwiseScore/:userId/:testCreationTableId",
//   async (req, res) => {
//     const userId = req.params.userId;
//     const testCreationTableId = req.params.testCreationTableId;

//     try {
//       // Section Wise Scores
//       const [sectionWiseScores] = await db.query(
//         `SELECT
//           student_marks.user_Id,
//           student_marks.sectionId,
//           sections.sectionName,
//           subjects.subjectName,
//           COUNT(CASE WHEN student_marks.status = 0 THEN 1 ELSE NULL END) AS wrong_answers,
//           COUNT(CASE WHEN student_marks.status = 1 THEN 1 ELSE NULL END) AS correct_answers,
//           SUM(student_marks.std_marks) AS total_marks
//         FROM
//           student_marks
//         JOIN sections ON sections.sectionId = student_marks.sectionId
//         JOIN subjects ON subjects.subjectId = student_marks.subjectId
//         WHERE
//           student_marks.user_Id = ? AND student_marks.testCreationTableId = ?
//         GROUP BY
//           student_marks.user_Id,
//           student_marks.sectionId,
//           subjects.subjectName
//         LIMIT 0, 25;
//       `,
//         [userId, testCreationTableId]
//       );

//       // Section Wise Total Marks
//       const [sectionWiseTotalMarks] = await db.query(
//         `SELECT s.sectionId,
//         SUM(m.marks_text) AS totalMarksForEachSection
//         FROM marks m
//         JOIN questions q ON m.question_id = q.question_id
//         JOIN sections s ON s.sectionId = q.sectionId
//         WHERE q.testCreationTableId = ?
//         GROUP BY s.sectionId;
//       `,
//         [testCreationTableId]
//       );

//       // Calculate and add percentage for each section
//       const sectionWiseScoresWithPercentage = sectionWiseScores.map((score) => {
//         const totalMarksForSection = sectionWiseTotalMarks.find(
//           (totalMarks) => totalMarks.sectionId === score.sectionId
//         );
//         const percentage = (
//           (score.total_marks / totalMarksForSection.totalMarksForEachSection) *
//           100
//         ).toFixed(2);

//         return {
//           ...score,
//           percentage,
//         };
//       });

//       res.json({
//         sectionWiseScores: sectionWiseScoresWithPercentage,
//         sectionWiseTotalMarks,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   }
// );

router.get(
  "/sectionwiseScore/:userId/:testCreationTableId",
  async (req, res) => {
    const userId = req.params.userId;
    const testCreationTableId = req.params.testCreationTableId;

    try {
      // Section Wise Scores
      const [sectionWiseScores] = await db.query(
        `SELECT
          student_marks.user_Id,
          student_marks.sectionId,
          sections.sectionName,
          subjects.subjectName,
          COUNT(CASE WHEN student_marks.status = 0 THEN 1 ELSE NULL END) AS wrong_answers,
          COUNT(CASE WHEN student_marks.status = 1 THEN 1 ELSE NULL END) AS correct_answers,
          SUM(CASE WHEN student_marks.status = 0 THEN -student_marks.std_marks ELSE student_marks.std_marks END) AS total_marks
        FROM
          student_marks
        JOIN sections ON sections.sectionId = student_marks.sectionId
        JOIN subjects ON subjects.subjectId = student_marks.subjectId
        WHERE
          student_marks.user_Id = ? AND student_marks.testCreationTableId = ?
        GROUP BY
          student_marks.user_Id,
          student_marks.sectionId,
          subjects.subjectName
        LIMIT 0, 25;
      `,
        [userId, testCreationTableId]
      );

      // Section Wise Total Marks
      const [sectionWiseTotalMarks] = await db.query(
        `SELECT s.sectionId,
        SUM(m.marks_text) AS totalMarksForEachSection
        FROM marks m
        JOIN questions q ON m.question_id = q.question_id
        JOIN sections s ON s.sectionId = q.sectionId
        WHERE q.testCreationTableId = ?
        GROUP BY s.sectionId;
      `,
        [testCreationTableId]
      );

      // Calculate and add percentage for each section
      const sectionWiseScoresWithPercentage = sectionWiseScores.map((score) => {
        const totalMarksForSection = sectionWiseTotalMarks.find(
          (totalMarks) => totalMarks.sectionId === score.sectionId
        );
        let percentage = 0;

        if (
          totalMarksForSection &&
          totalMarksForSection.totalMarksForEachSection !== 0
        ) {
          percentage = (
            (score.total_marks /
              totalMarksForSection.totalMarksForEachSection) *
            100
          ).toFixed(2);

          // If the calculated percentage is less than 0, set it to 0
          percentage = Math.max(percentage, 0);
        }

        return {
          ...score,
          percentage: `${percentage}%`,
        };
      });

      res.json({
        sectionWiseScores: sectionWiseScoresWithPercentage,
        sectionWiseTotalMarks,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/StudentDashbordbookmark_section/:user_Id", async (req, res) => {
  const { user_Id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT
      q.question_id,
      q.questionImgName,
      o.option_id,
      o.optionImgName,
      o.option_index,
      s.solution_id AS solution_id,
      s.solutionImgName AS solutionImgName,
      qt.qtypeId,
      qt.qtype_text,
      doc.documen_name,
      doc.sectionId,
      doc.subjectId,
      doc.testCreationTableId,
      P.paragraphImg,
      p.paragraph_Id,
      pq.paragraphQNo_Id,
      pq.paragraphQNo,
      tct.TestName,
      bq.question_id,
      bq.testCreationTableId,
      bq.user_Id
  FROM
      bookmark_questions bq
  LEFT OUTER JOIN
      questions q ON bq.question_id = q.question_id
  LEFT OUTER JOIN
      options o ON bq.question_id = o.question_id
  LEFT OUTER JOIN
      qtype qt ON q.question_id = qt.question_id
  LEFT OUTER JOIN
      solution s ON bq.question_id = s.solution_id
  LEFT OUTER JOIN
      paragraph p ON q.document_Id = p.document_Id
  LEFT OUTER JOIN
      paragraphqno pq ON p.paragraph_Id = pq.paragraph_Id AND bq.question_id = pq.question_id
  LEFT OUTER JOIN
      ots_document doc ON q.document_Id = doc.document_Id
  LEFT OUTER JOIN
      test_creation_table tct ON doc.testCreationTableId = tct.testCreationTableId  
  WHERE
      bq.user_Id = ?
  ORDER BY
      q.question_id ASC, o.option_index ASC;`,
      [user_Id]
    );

    // Check if rows is not empty
    if (rows.length > 0) {
      const questionData = {
        questions: [],
      };

      // Organize data into an array of questions
      rows.forEach((row) => {
        const existingQuestion = questionData.questions.find(
          (q) => q.question_id === row.question_id
        );
        const option = {
          option_id: row.option_id,

          option_index: row.option_index,
          optionImgName: row.optionImgName,
        };
        if (existingQuestion) {
          const existingOption = existingQuestion.options.find(
            (opt) => opt.option_id === option.option_id
          );

          if (!existingOption) {
            existingQuestion.options.push(option);
          }
        } else {
          // Question doesn't exist, create a new question
          const newQuestion = {
            TestName: row.TestName,
            question_id: row.question_id,
            questionImgName: row.questionImgName,
            documen_name: row.documen_name,
            options: [option],
            subjectId: row.subjectId,
            sectionId: row.sectionId,
            qtype: {
              qtypeId: row.qtypeId,
              qtype_text: row.qtype_text,
            },
            testCreationTableId: {
              testCreationTableId: row.testCreationTableId,
              user_Id: row.user_Id,
            },
            solution: {
              solution_id: row.solution_id,
              solutionImgName: row.solutionImgName,
            },
            paragraph: {
              paragraph_Id: row.paragraph_Id,
              paragraphImg: row.paragraphImg,
            },
            paragraphqno: {
              paragraphQNo_Id: row.paragraphQNo_Id,
              paragraphQNo: row.paragraphQNo,
            },
          };

          questionData.questions.push(newQuestion);
        }
      });

      res.json(questionData);
    } else {
      res.status(404).json({ error: "No data found" });
    }
  } catch (error) {
    console.error("Error fetching question data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete(
  "/deleteBookmarkQuestion/:user_Id/:testCreationTableId/:question_id",
  async (req, res) => {
    const { user_Id, testCreationTableId, question_id } = req.params;
    console.log(user_Id, testCreationTableId, question_id);
    try {
      // Execute the DELETE query
      await db.query(
        "DELETE FROM bookmark_questions WHERE user_Id = ? AND testCreationTableId = ? AND question_id = ?",
        [user_Id, testCreationTableId, question_id]
      );

      res
        .status(200)
        .json({ message: "Bookmark question deleted successfully" });
    } catch (error) {
      console.error("Error deleting bookmark question:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// router.get("/usermarks/:userId", async (req, res) => {
//   const userId = req.params.userId;
//   console.log("ids:", userId);
//   try {
//     const [usermarks] = await db.query(
//       `
//       SELECT
//         sm.user_Id,
//         sm.testCreationTableId,
//         tc.totalMarks,
//         SUM(CASE WHEN sm.status = 1 THEN sm.std_marks ELSE 0 END) AS sumStatus1,
//         SUM(CASE WHEN sm.status = 0 THEN sm.std_marks ELSE 0 END) AS sumStatus0
//       FROM
//         student_marks sm
//       JOIN
//         test_creation_table tc ON sm.testCreationTableId = tc.testCreationTableId
//       WHERE
//         sm.user_Id = ?
//       GROUP BY
//         sm.user_Id, sm.testCreationTableId, tc.totalMarks;
//       `,
//       [userId]
//     );

//     if (usermarks.length > 0) {
//       const result = usermarks.map(mark => {
//         const totalDifference = mark.sumStatus1 - mark.sumStatus0;
//         const percentage = ((totalDifference / mark.totalMarks) * 100).toFixed(2);
//         return {
//           ...mark,
//           totalDifference,
//           percentage
//         };
//       });

//       // Calculate totalDifference and percentage for all testCreationTableIds
//       const totalDifference = result.reduce((acc, curr) => acc + curr.totalDifference, 0);
//       const totalMarksSum = result.reduce((acc, curr) => acc + curr.totalMarks, 0);
//       const overallpercentage = ((totalDifference / totalMarksSum) * 100).toFixed(2);

//       res.json({ usermarks: result,overallpercentage });
//     } else {
//       res.json({ message: "No data available." });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// router.get("/usermarks/:userId", async (req, res) => {
//   const userId = req.params.userId;
//   console.log("ids:", userId);
//   try {
//     const [usermarks] = await db.query(
//       `
//       SELECT
//         sm.user_Id,
//         sm.testCreationTableId,
//         tc.totalMarks,
//         tc.TestName,
//         SUM(CASE WHEN sm.status = 1 THEN sm.std_marks ELSE 0 END) AS sumStatus1,
//         SUM(CASE WHEN sm.status = 0 THEN sm.std_marks ELSE 0 END) AS sumStatus0
//       FROM
//         student_marks sm
//       JOIN
//         test_creation_table tc ON sm.testCreationTableId = tc.testCreationTableId
//       WHERE
//         sm.user_Id = ?
//       GROUP BY
//         sm.user_Id, sm.testCreationTableId, tc.totalMarks;
//       `,
//       [userId]
//     );

//     if (usermarks.length > 0) {
//       const result = usermarks.map(mark => {
//         const totalDifference = mark.sumStatus1 - mark.sumStatus0;
//         let percentage = ((totalDifference / mark.totalMarks) * 100).toFixed(2);
//         // Clamp percentage to minimum value of 0
//         percentage = Math.max(0, percentage);
//         return {
//           ...mark,
//           totalDifference,
//           percentage
//         };
//       });

//       // Calculate totalDifference and percentage for all testCreationTableIds
//       const totalDifference = result.reduce((acc, curr) => acc + curr.totalDifference, 0);
//       const totalMarksSum = result.reduce((acc, curr) => acc + curr.totalMarks, 0);
//       let overallpercentage = ((totalDifference / totalMarksSum) * 100).toFixed(2);
//       // Clamp overallpercentage to minimum value of 0
//       overallpercentage = Math.max(0, overallpercentage);

//       res.json({ usermarks: result, overallpercentage });
//     } else {
//       res.json({ message: "No data available." });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.get("/usermarks/:userId", async (req, res) => {
  const userId = req.params.userId;
  console.log("ids:", userId);
  try {
    const [usermarks] = await db.query(
      `
      SELECT
        sm.user_Id,
        sm.testCreationTableId,
        tc.totalMarks,
        tc.TestName,
        SUM(CASE WHEN sm.status = 1 THEN sm.std_marks ELSE 0 END) AS sumStatus1,
        SUM(CASE WHEN sm.status = 0 THEN sm.std_marks ELSE 0 END) AS sumStatus0
      FROM
        student_marks sm
      JOIN
        test_creation_table tc ON sm.testCreationTableId = tc.testCreationTableId
      WHERE
        sm.user_Id = ?
      GROUP BY
        sm.user_Id, sm.testCreationTableId, tc.totalMarks;
      `,
      [userId]
    );

    if (usermarks.length > 0) {
      const result = usermarks.map((mark) => {
        const totalDifference = mark.sumStatus1 - mark.sumStatus0;
        let percentage = ((totalDifference / mark.totalMarks) * 100).toFixed(2);
        // Clamp percentage to minimum value of 0
        percentage = Math.max(0, percentage);
        return {
          ...mark,
          totalDifference,
          percentage,
        };
      });

      // Calculate totalDifference and percentage for all testCreationTableIds
      const totalDifference = result.reduce(
        (acc, curr) => acc + curr.totalDifference,
        0
      );
      const totalMarksSum = result.reduce(
        (acc, curr) => acc + curr.totalMarks,
        0
      );
      let overallpercentage = ((totalDifference / totalMarksSum) * 100).toFixed(
        2
      );
      // Clamp overallpercentage to minimum value of 0
      overallpercentage = Math.max(0, overallpercentage);

      // Calculate average percentage of each test
      const testCount = result.length;
      const testPercentageSum = result.reduce(
        (acc, curr) => acc + parseFloat(curr.percentage),
        0
      );
      const averageTestPercentage = (testPercentageSum / testCount).toFixed(2);

      res.json({ usermarks: result, overallpercentage, averageTestPercentage });
    } else {
      res.json({ message: "No data available." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/attempted_test_count/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await db.query(
      `SELECT
      p.Portale_Name,
      p.Portale_Id,
      l.user_Id,
      (
      SELECT
          COUNT(*)
      FROM
          test_creation_table AS t
      JOIN student_buy_courses AS sbc
      ON
          t.courseCreationId = sbc.courseCreationId
      JOIN course_creation_table AS cct
      ON
          t.courseCreationId = cct.courseCreationId
      WHERE
          cct.Portale_Id = p.Portale_Id AND sbc.user_Id = l.user_Id
  ) AS test_count,
  (
      SELECT
          COUNT(*)
      FROM
          test_attempt_status
      WHERE
          user_Id = l.user_Id
  ) AS attempted_test_count,
  (
      (
      SELECT
          COUNT(*)
      FROM
          test_creation_table AS t
      JOIN student_buy_courses AS sbc
      ON
          t.courseCreationId = sbc.courseCreationId
      JOIN course_creation_table AS cct
      ON
          t.courseCreationId = cct.courseCreationId
      WHERE
          cct.Portale_Id = p.Portale_Id AND sbc.user_Id = l.user_Id
  ) -(
      SELECT
          COUNT(*)
      FROM
          test_attempt_status
      WHERE
          user_Id = l.user_Id
  )
  ) AS unattempted_test_count
  FROM
      LOG AS l
  JOIN portales AS p
  ON
      1 = 1
  WHERE
      l.user_Id = ?
  GROUP BY
      p.Portale_Id,
      l.user_Id;`,

      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
