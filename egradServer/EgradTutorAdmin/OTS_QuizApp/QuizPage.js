const express = require("express");
const router = express.Router();
const db = require("../DataBase/db2");
const jwt = require("jsonwebtoken");

router.get("/questionType/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;
    const [results] = await db.query(
      `
        SELECT q.question_id, q.testCreationTableId ,qt.qtypeId, qt.qtype_text, qts.typeofQuestion, qts.quesionTypeId FROM questions q 
        JOIN qtype qt ON q.question_id = qt.question_id 
        JOIN quesion_type qts ON qt.quesionTypeId = qts.quesionTypeId WHERE q.question_id = ?;
        `,
      [questionId]
    );

    res.json(results);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  // Query to fetch data from user_responses based on user_Id
  const fetchUserDataSql = "SELECT * FROM user_responses WHERE user_Id = 2";

  db.query(fetchUserDataSql, [userId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User responses not found" });
    }

    const userResponses = results;

    // You may want to filter out sensitive information before sending it to the client
    const sanitizedUserResponses = userResponses.map((response) => ({
      // Add fields as needed
      // Example: field1: response.field1,
      //          field2: response.field2,
    }));

    res.status(200).json(sanitizedUserResponses);
  });
});

router.delete("/clearresponseforPB/:userId", async (req, res) => {
  const userId = req.params.userId;
  console.log("clearresponseforPB", userId);
 
  try {
    // Assuming you have a MySQL connection named 'connection'
    const query = "DELETE FROM user_responsespb WHERE user_Id = ?";
    await db.query(query, [userId]);
 
    res.sendStatus(200); // Send a success status
  } catch (error) {
    console.error("Error deleting user data:", error);
    res.status(500).send("Failed to delete user data");
  }
});


router.post("/responseforPB", async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { userId, questionId, testCreationTableId, subjectId, sectionId } =
      req.body;
    console.log(`Response for question ${questionId} saved to the database`);
 
    // Validate data types
    const userIdNumber = parseInt(userId, 10);
    const testCreationTableIdNumber = parseInt(testCreationTableId, 10);
    const subjectIdNumber = parseInt(subjectId, 10);
    const sectionIdNumber = parseInt(sectionId, 10);
 
    if (
      isNaN(userIdNumber) ||
      isNaN(testCreationTableIdNumber) ||
      isNaN(subjectIdNumber) ||
      isNaN(sectionIdNumber)
    ) {
      console.error(
        "Invalid integer value for userId, testCreationTableId, or questionId"
      );
      return res
        .status(400)
        .json({ success: false, message: "Invalid data types" });
    }
 
    // Check if the values already exist in the database
    const checkQuery =
      "SELECT * FROM user_responsesPB WHERE user_Id = ? AND testCreationTableId = ? AND question_id = ?";
 
    // Initialize questionIdNumber here
    const questionIdNumber = parseInt(questionId, 10);
 
    const checkValues = [
      userIdNumber,
      testCreationTableIdNumber,
      questionIdNumber,
    ];
 
    const existingResponse = await db.query(checkQuery, checkValues);
 
    if (existingResponse.length > 0 && existingResponse[0].length > 0) {
      console.log("Response already exists in the database");
 
      // Handle existing response logic here...
    } else {
      // If the response does not already exist, proceed with insertion
      const sql =
        "INSERT INTO user_responsesPB (user_Id, testCreationTableId, subjectId, sectionId, question_id, user_answer, option_id) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?)";
 
      const response = req.body[questionId];
 
      const optionIndexes1 = response.optionIndexes1.join(",");
      const optionIndexes2 = response.optionIndexes2.join(",");
      const optionIndexes1CharCodes =
        response.optionIndexes1CharCodes.join(",");
      const optionIndexes2CharCodes =
        response.optionIndexes2CharCodes.join(",");
      const calculatorInputValue = response.calculatorInputValue;
 
      const queryValues = [
        userIdNumber,
        testCreationTableIdNumber,
        subjectIdNumber,
        sectionIdNumber,
        questionIdNumber,
        optionIndexes1CharCodes +
          optionIndexes2CharCodes +
          calculatorInputValue,
        optionIndexes1 + optionIndexes2,
      ];
 
      console.log("Executing SQL query:", sql, queryValues);
 
      try {
        const result = await db.query(sql, queryValues);
 
        if (!result) {
          console.error("Error saving response to the database");
          res
            .status(500)
            .json({ success: false, message: "Internal server error" });
          return;
        }
 
        console.log(
          `Response for question ${questionIdNumber} saved to the database`
        );
        res.json({ success: true, message: "Response saved successfully" });
      } catch (dbError) {
        console.error("Database query error:", dbError);
        res.status(500).json({
          success: false,
          message: "Error saving response to the database",
          dbError: dbError.message,
        });
      }
    }
  } catch (error) {
    console.error("Error handling the request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


//MAIN CODE
// router.get("/questionOptions/:testCreationTableId", async (req, res) => {
//   const { testCreationTableId } = req.params;
//   try {
//     const [rows] = await db.query(
//       `SELECT 
//         q.question_id, q.questionImgName, 
//         o.option_id, o.optionImgName, o.option_index,
//         s.solution_id, s.solutionImgName, 
//         qt.qtypeId, qt.qtype_text,
//         ur.user_answer, ur.user_Sno, qts.typeofQuestion,
//         ans.answer_id, ans.answer_text,
//         m.markesId, m.marks_text,
//         si.sort_id, si.sortid_text,
//         doc.documen_name, doc.sectionId, 
//         doc.subjectId, doc.testCreationTableId,
//         P.paragraphImg, p.paragraph_Id,
//         pq.paragraphQNo_Id, pq.paragraphQNo, qts.quesionTypeId,
//         tct.TestName  -- New column from testcreationtable
//     FROM 
//         questions q 
//         LEFT OUTER JOIN options o ON q.question_id = o.question_id
//         LEFT OUTER JOIN qtype qt ON q.question_id = qt.question_id 
//         LEFT OUTER JOIN quesion_type qts ON qt.quesionTypeId = qts.quesionTypeId 
//         LEFT OUTER JOIN answer ans ON q.question_id = ans.question_id 
//         LEFT OUTER JOIN marks m ON q.question_id = m.question_id 
//         LEFT OUTER JOIN sortid si ON q.question_id = si.question_id 
//         LEFT OUTER JOIN solution s ON q.question_id = s.solution_id 
//         LEFT OUTER JOIN paragraph p ON q.document_Id = p.document_Id
//         LEFT OUTER JOIN paragraphqno pq ON p.paragraph_Id = pq.paragraph_Id AND q.question_id = pq.question_id
//         LEFT OUTER JOIN ots_document doc ON q.document_Id = doc.document_Id
//         LEFT OUTER JOIN user_responses ur ON q.question_id = ur.question_id and o.option_id = ur.option_id
//         LEFT OUTER JOIN test_creation_table tct ON doc.testCreationTableId = tct.testCreationTableId  -- Joining with testcreationtable
//     WHERE 
//         doc.testCreationTableId = ?
//     ORDER BY q.question_id ASC, o.option_index ASC; 
//   `,
//       [testCreationTableId]
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
//           ans: row.user_answer,
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



//PROBLEM SOLVED OF PARAGRAPH QUESTIONS WORKING WITH COMPLETELY
// router.get("/questionOptions/:testCreationTableId", async (req, res) => {
//   const { testCreationTableId } = req.params;
//   try {
//     const [rows] = await db.query(
//       `SELECT 
//       q.question_id, q.questionImgName, 
//       o.option_id, o.optionImgName, o.option_index,
//       s.solution_id, s.solutionImgName, 
//       qt.qtypeId, qt.qtype_text,
//       ur.user_answer, ur.user_Sno, qts.typeofQuestion,
//       ans.answer_id, ans.answer_text,
//       m.markesId, m.marks_text,
//       si.sort_id, si.sortid_text,
//       doc.documen_name, doc.sectionId, 
//       doc.subjectId, doc.testCreationTableId,
//       p.paragraphImg, p.paragraph_Id,
//       pq.paragraphQNo_Id, pq.paragraphQNo, qts.quesionTypeId,
//       tct.TestName  
//   FROM 
//       questions q 
//       LEFT OUTER JOIN options o ON q.question_id = o.question_id
//       LEFT OUTER JOIN qtype qt ON q.question_id = qt.question_id 
//       LEFT OUTER JOIN quesion_type qts ON qt.quesionTypeId = qts.quesionTypeId 
//       LEFT OUTER JOIN answer ans ON q.question_id = ans.question_id 
//       LEFT OUTER JOIN marks m ON q.question_id = m.question_id 
//       LEFT OUTER JOIN sortid si ON q.question_id = si.question_id 
//       LEFT OUTER JOIN solution s ON q.question_id = s.solution_id 
//       LEFT OUTER JOIN paragraphqno pq ON q.question_id = pq.question_id
//       LEFT OUTER JOIN paragraph p ON pq.paragraph_Id = p.paragraph_Id  -- Corrected join condition
//       LEFT OUTER JOIN ots_document doc ON q.document_Id = doc.document_Id
//       LEFT OUTER JOIN user_responses ur ON q.question_id = ur.question_id and o.option_id = ur.option_id
//       LEFT OUTER JOIN test_creation_table tct ON doc.testCreationTableId = tct.testCreationTableId
//   WHERE 
//       doc.testCreationTableId = ?
//   ORDER BY q.question_id ASC, o.option_index ASC;
//   `,
//       [testCreationTableId]
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
//           ans: row.user_answer,
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
//PROBLEM SOLVED OF PARAGRAPH QUESTIONS WORKING WITH COMPLETELY AND ALSO FETCHING ACCORDING TO SORTID_TEXT IN ORDER
// router.get("/questionOptions/:testCreationTableId", async (req, res) => {
//   const { testCreationTableId } = req.params;
//   try {
//     const [rows] = await db.query(
//       `SELECT 
//       q.question_id, q.questionImgName, 
//       o.option_id, o.optionImgName, o.option_index,
//       s.solution_id, s.solutionImgName, 
//       qt.qtypeId, qt.qtype_text,
//       ur.user_answer, ur.user_Sno, qts.typeofQuestion,
//       ans.answer_id, ans.answer_text,
//       m.markesId, m.marks_text,
//       si.sort_id, si.sortid_text,
//       doc.documen_name, doc.sectionId, 
//       doc.subjectId, doc.testCreationTableId,
//       p.paragraphImg, p.paragraph_Id,
//       pq.paragraphQNo_Id, pq.paragraphQNo, qts.quesionTypeId,
//       tct.TestName  
//   FROM 
//       questions q 
//       LEFT OUTER JOIN options o ON q.question_id = o.question_id
//       LEFT OUTER JOIN qtype qt ON q.question_id = qt.question_id 
//       LEFT OUTER JOIN quesion_type qts ON qt.quesionTypeId = qts.quesionTypeId 
//       LEFT OUTER JOIN answer ans ON q.question_id = ans.question_id 
//       LEFT OUTER JOIN marks m ON q.question_id = m.question_id 
//       LEFT OUTER JOIN sortid si ON q.question_id = si.question_id 
//       LEFT OUTER JOIN solution s ON q.question_id = s.solution_id 
//       LEFT OUTER JOIN paragraphqno pq ON q.question_id = pq.question_id
//       LEFT OUTER JOIN paragraph p ON pq.paragraph_Id = p.paragraph_Id
//       LEFT OUTER JOIN ots_document doc ON q.document_Id = doc.document_Id
//       LEFT OUTER JOIN user_responses ur ON q.question_id = ur.question_id and o.option_id = ur.option_id
//       LEFT OUTER JOIN test_creation_table tct ON doc.testCreationTableId = tct.testCreationTableId
//   WHERE 
//       doc.testCreationTableId = ?
//   ORDER BY 
//    q.question_id ASC, o.option_index ASC;
//   `,
//       [testCreationTableId]
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
//           ans: row.user_answer,
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

//             solution: {              
//               solution_id: row.solution_id,              
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

router.get("/questionOptions/:testCreationTableId/:userId", async (req, res) => {
  const { testCreationTableId, userId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT 
      q.question_id, q.questionImgName, 
      o.option_id, o.optionImgName, o.option_index,
      s.solution_id, s.solutionImgName, 
      qt.qtypeId, qt.qtype_text,
      ur.user_answer, ur.user_Sno, qts.typeofQuestion,
      ans.answer_id, ans.answer_text,
      m.markesId, m.marks_text,
      si.sort_id, si.sortid_text,
      doc.documen_name, doc.sectionId, 
      doc.subjectId, doc.testCreationTableId,
      p.paragraphImg, p.paragraph_Id,
      pq.paragraphQNo_Id, pq.paragraphQNo, qts.quesionTypeId,
      tct.TestName  
  FROM 
      questions q 
      LEFT OUTER JOIN options o ON q.question_id = o.question_id
      LEFT OUTER JOIN qtype qt ON q.question_id = qt.question_id 
      LEFT OUTER JOIN quesion_type qts ON qt.quesionTypeId = qts.quesionTypeId 
      LEFT OUTER JOIN answer ans ON q.question_id = ans.question_id 
      LEFT OUTER JOIN marks m ON q.question_id = m.question_id 
      LEFT OUTER JOIN sortid si ON q.question_id = si.question_id 
      LEFT OUTER JOIN solution s ON q.question_id = s.solution_id 
      LEFT OUTER JOIN paragraphqno pq ON q.question_id = pq.question_id
      LEFT OUTER JOIN paragraph p ON pq.paragraph_Id = p.paragraph_Id
      LEFT OUTER JOIN ots_document doc ON q.document_Id = doc.document_Id
      LEFT OUTER JOIN user_responses ur ON q.question_id = ur.question_id 
      LEFT OUTER JOIN test_creation_table tct ON doc.testCreationTableId = tct.testCreationTableId
      LEFT OUTER JOIN log l ON ur.user_Id = l.user_Id AND ur.user_Id = l.user_Id
  WHERE 
      doc.testCreationTableId = ? AND
      (l.user_Id = ? OR ur.user_answer IS NULL)
  ORDER BY 
       q.question_id ASC, o.option_index ASC;
  
      `,
      [testCreationTableId, userId]
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
          ans: row.user_answer,
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
            quesion_type: {
              quesionTypeId: row.quesionTypeId,
              quesion_type: row.quesion_type,
              typeofQuestion: row.typeofQuestion,
            },
            answer: {
              answer_id: row.answer_id,
              answer_text: row.answer_text,
            },
            useranswer: {
              urid: row.question_id,
              ans: row.user_answer,
            },
            marks: {
              markesId: row.markesId,
              marks_text: row.marks_text,
            },
            sortid: {
              sort_id: row.sort_id,
              sortid_text: row.sortid_text,
            },
            solution: {              
              solution_id: row.solution_id,              
              solutionImgName: row.solutionImgName,            
            },

            paragraph: {},
            paragraphqno: {},
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
});

router.get("/questionOptionsForPB/:testCreationTableId/:userId", async (req, res) => {
  const { testCreationTableId, userId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT 
      q.question_id, q.questionImgName, 
      o.option_id, o.optionImgName, o.option_index,
      s.solution_id, s.solutionImgName, 
      qt.qtypeId, qt.qtype_text,
      ur.user_answer, ur.user_Sno, qts.typeofQuestion,
      ans.answer_id, ans.answer_text,
      m.markesId, m.marks_text,
      si.sort_id, si.sortid_text,
      doc.documen_name, doc.sectionId, 
      doc.subjectId, doc.testCreationTableId,
      p.paragraphImg, p.paragraph_Id,
      pq.paragraphQNo_Id, pq.paragraphQNo, qts.quesionTypeId,
      tct.TestName  
  FROM 
      questions q 
      LEFT OUTER JOIN options o ON q.question_id = o.question_id
      LEFT OUTER JOIN qtype qt ON q.question_id = qt.question_id 
      LEFT OUTER JOIN quesion_type qts ON qt.quesionTypeId = qts.quesionTypeId 
      LEFT OUTER JOIN answer ans ON q.question_id = ans.question_id 
      LEFT OUTER JOIN marks m ON q.question_id = m.question_id 
      LEFT OUTER JOIN sortid si ON q.question_id = si.question_id 
      LEFT OUTER JOIN solution s ON q.question_id = s.solution_id 
      LEFT OUTER JOIN paragraphqno pq ON q.question_id = pq.question_id
      LEFT OUTER JOIN paragraph p ON pq.paragraph_Id = p.paragraph_Id
      LEFT OUTER JOIN ots_document doc ON q.document_Id = doc.document_Id
      LEFT OUTER JOIN user_responsespb ur ON q.question_id = ur.question_id 
      LEFT OUTER JOIN test_creation_table tct ON doc.testCreationTableId = tct.testCreationTableId
      LEFT OUTER JOIN log l ON ur.user_Id = l.user_Id AND ur.user_Id = l.user_Id
  WHERE 
      doc.testCreationTableId = ? AND
      (l.user_Id = ? OR ur.user_answer IS NULL)
  ORDER BY 
       q.question_id ASC, o.option_index ASC;
  
      `,
      [testCreationTableId, userId]
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
          ans: row.user_answer,
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
            quesion_type: {
              quesionTypeId: row.quesionTypeId,
              quesion_type: row.quesion_type,
              typeofQuestion: row.typeofQuestion,
            },
            answer: {
              answer_id: row.answer_id,
              answer_text: row.answer_text,
            },
            useranswer: {
              urid: row.question_id,
              ans: row.user_answer,
            },
            marks: {
              markesId: row.markesId,
              marks_text: row.marks_text,
            },
            sortid: {
              sort_id: row.sort_id,
              sortid_text: row.sortid_text,
            },
            solution: {              
              solution_id: row.solution_id,              
              solutionImgName: row.solutionImgName,            
            },

            paragraph: {},
            paragraphqno: {},
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
});


router.post("/submitTimeLeft", async (req, res) => {
  try {
    const { userId, testCreationTableId, timeLeft } = req.body;

    // Validate data types
    const userIdNumber = parseInt(userId, 10);
    const testCreationTableIdNumber = parseInt(testCreationTableId, 10);

    if (
      isNaN(userIdNumber) ||
      isNaN(testCreationTableIdNumber) ||
      typeof timeLeft !== "string"
    ) {
      console.error("Invalid data types");
      return res
        .status(400)
        .json({ success: false, message: "Invalid data types" });
    }

    // Continue with processing
    const sql =
      "INSERT INTO time_left_submission_of_test (user_Id, testCreationTableId, time_left) VALUES (?,?,?)";

    const queryValues = [userIdNumber, testCreationTableIdNumber, timeLeft];

    console.log(
      "Executing SQL query for time left submission:",
      sql,
      queryValues
    );

    await new Promise((resolve, reject) => {
      db.query(sql, queryValues, (err, result) => {
        if (err) {
          console.error("Error saving time left to the database:", err);
          reject(err);
        } else {
          console.log("Time left submission saved to the database");
          resolve(result);
        }
      });
    });

    res.json({
      success: true,
      message: "Time left submission saved successfully",
    });
  } catch (error) {
    console.error("Error handling time left submission:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});




router.post("/saveExamSummary", async (req, res) => {
  try {
    const {
      userId,
      totalUnattempted,
      totalAnswered,
      NotVisitedb,
      testCreationTableId,
    } = req.body;

    // Assuming you have a table called student_exam_summary with appropriate columns
    const insertQuery = `
    INSERT INTO student_exam_summery 
    (user_id, Total_unAttemted, Total_answered, Not_visited_count,testCreationTableId) 
    VALUES 
    (?, ?, ?, ?, ?)
  `;
  const values = [
    userId,
    totalUnattempted,
    totalAnswered,
    NotVisitedb,
    testCreationTableId,
  ];
    const result = await db.query(insertQuery, values);
    console.log("Generated query:", insertQuery);

    res.json({ success: true, message: "Exam summary saved successfully" });
  } catch (error) {
    console.error("Error saving exam summary:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});



router.post('/calculate-marks', async (req, res) => {
  // Pass the MySQL connection to the controller function
  await marksController.calculateMarks(req, res, db);
});


// marksController.js

const calculateMarks = async (req, res) => {
  try {
    // Extract necessary data from the request body
    const { userId, testCreationTableId, subjectId, sectionId } = req.body;

   

    // Fetch user responses, correct answers, question types, and marks data
    const userResponses = await db.query(
      'SELECT ur.question_id, ur.user_answer, at.answer_text, at.nmarks_text, qt.question_type_id FROM user_responses ur JOIN answer at ON ur.question_id = at.question_id JOIN qtype qt ON ur.question_id = qt.question_id WHERE ur.user_id = ? AND ur.test_creation_table_id = ? AND ur.subject_id = ? AND ur.section_id = ?',
      [userId, testCreationTableId, subjectId, sectionId]
    );

    // Perform marks calculation
    const marks = [];
    for (const response of userResponses) {
      const { question_id, user_answer, answer_text, nmarks_text, question_type_id } = response;

      // Implement marking logic based on question type and correctness of the answer
      let marksText = 0; // Default value if not evaluated

      switch (question_type_id) {
        case 1: // MCQ4
        case 2: // MCQ5
        case 7: // TF
        case 8: // CTQ
          marksText = user_answer === answer_text ? 'Correct' : 'Incorrect';
          break;

        case 3: // MSQN
          // Implement partial marking logic
          // Example: if question has 3 marks, divide them equally for correct options
          const correctOptions = answer_text.split(',');
          const userOptions = user_answer.split(',');
          const marksPerOption = 3 / correctOptions.length;

          let partialMarks = 0;

          userOptions.forEach((option) => {
            if (correctOptions.includes(option)) {
              partialMarks += marksPerOption;
            } else {
              // Deduct marks for incorrect options
              partialMarks -= marksPerOption;
            }
          });

          marksText = partialMarks >= 0 ? partialMarks.toFixed(2) : '0.00';
          break;

        case 4: // MSQ
          // Similar to MSQN without negative marking
          // Implement partial marking logic for correct options
          const correctOptionsMSQ = answer_text.split(',');
          const userOptionsMSQ = user_answer.split(',');
          const marksPerOptionMSQ = 3 / correctOptionsMSQ.length;

          let partialMarksMSQ = 0;

          userOptionsMSQ.forEach((option) => {
            if (correctOptionsMSQ.includes(option)) {
              partialMarksMSQ += marksPerOptionMSQ;
            } else {
              // No negative marking for MSQ, so don't deduct marks for incorrect options
            }
          });

          marksText = partialMarksMSQ >= 0 ? partialMarksMSQ.toFixed(2) : '0.00';
          break;

        case 5: // NATI
          // Implement marking logic based on data in the marks table
          // Example: Fetch marks_text from marks table based on the correct answer
          try {
            marksText = await getMarksDataNATI(db, question_id, answer_text);
          } catch (error) {
            console.error('Error getting marks for NATI:', error);
            // Handle the error appropriately
          }

          break;

        case 6: // NATD
          // Implement marking logic based on range and data in the marks table
          // Example: Fetch marks_text from marks table based on the correct answer within the range
          try {
            marksText = await getRangeMarksDataNATD(db, question_id, user_answer);
          } catch (error) {
            console.error('Error getting marks for NATD:', error);
            // Handle the error appropriately
          }
          break;

        default:
          // Handle other question types
          break;
      }

      const mark = {
        user_Id: userId,
        testCreationTableId,
        subjectId,
        sectionId,
        question_id,
        marksText,
      };

      marks.push(mark);
    }

    // Save marks in the student_marks table
    await Promise.all(
      marks.map(async (mark) => {
        const { user_Id, testCreationTableId, subjectId, sectionId, question_id, marksText } = mark;
        await db.query(
          'INSERT INTO student_marks (user_Id, testCreationTableId, subjectId, sectionId, question_id, marks_text) VALUES (?, ?, ?, ?, ?, ?)',
          [
            user_Id,
            testCreationTableId,
            subjectId,
            sectionId,
            question_id,
            marksText,
          ]
        );
      })
    );

    res.json({ success: true, message: 'Marks calculated and saved successfully' });
  } catch (error) {
    console.error('Error calculating and saving marks:', error);

    // Send a more informative error response
    res.status(500).json({ success: false, message: 'Failed to calculate and save marks', error: error.message });
  }
};

// Function to fetch marks_data for NATI
const getMarksDataNATI = async (db, question_id, answer_text) => {
  try {
    const marksDataNATI = await db.query(
      'SELECT marks_text FROM marks WHERE question_id = ? AND answer_text = ?',
      [question_id, answer_text]
    );

    if (marksDataNATI.length > 0) {
      return marksDataNATI[0].marks_text;
    } else {
      // Handle the case when no matching data is found in the marks table
      return 'Not Evaluated';
    }
  } catch (error) {
    console.error('Error fetching marksDataNATI:', error);
    throw error; // Rethrow the error to handle it at a higher level
  }
};

// Function to fetch marks_data for NATD
const getRangeMarksDataNATD = async (db, question_id, user_answer) => {
  try {
    const rangeMarksDataNATD = await db.query(
      'SELECT marks_text FROM marks WHERE question_id = ? AND ? BETWEEN start_range AND end_range',
      [question_id, user_answer]
    );

    if (rangeMarksDataNATD.length > 0) {
      return rangeMarksDataNATD[0].marks_text;
    } else {
      // Handle the case when no matching data is found in the marks table
      return 'Not Evaluated';
    }
  } catch (error) {
    console.error('Error fetching rangeMarksDataNATD:', error);
    throw error; // Rethrow the error to handle it at a higher level
  }
};

module.exports = { calculateMarks };








// router.post("/response", async (req, res) => {
//   try {
//     console.log("Request Body:", req.body);
//     const { userId, questionId, testCreationTableId, subjectId, sectionId } =
//       req.body;
//     console.log(`Response for question ${questionId} saved to the database`);

//     // Validate data types
//     const userIdNumber = parseInt(userId, 10);
//     const testCreationTableIdNumber = parseInt(testCreationTableId, 10);
//     const subjectIdNumber = parseInt(subjectId, 10);
//     const sectionIdNumber = parseInt(sectionId, 10);

//     if (
//       isNaN(userIdNumber) ||
//       isNaN(testCreationTableIdNumber) ||
//       isNaN(subjectIdNumber) ||
//       isNaN(sectionIdNumber)
//     ) {
//       console.error(
//         "Invalid integer value for userId, testCreationTableId, or questionId"
//       );
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid data types" });
//     }

//     const sql =
//       "INSERT INTO user_responses (user_Id, testCreationTableId, subjectId, sectionId, question_id, user_answer,option_id) " +
//       "VALUES (?, ?, ?, ?, ?, ?,?) ";

//     const response = req.body[questionId];

//     const questionIdNumber = parseInt(questionId, 10);

//     if (isNaN(questionIdNumber)) {
//       console.error(`Invalid integer value for questionId: ${questionId}`);
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid data types for questionId" });
//     }

//     const optionIndexes1 = response.optionIndexes1.join(",");
//     const optionIndexes2 = response.optionIndexes2.join(",");

//     const optionIndexes1CharCodes = response.optionIndexes1CharCodes.join(",");
//     const optionIndexes2CharCodes = response.optionIndexes2CharCodes.join(",");
//     const calculatorInputValue = response.calculatorInputValue;

//     const queryValues = [
//       userIdNumber,
//       testCreationTableIdNumber,
//       subjectIdNumber,
//       sectionIdNumber,
//       questionIdNumber,
//       optionIndexes1CharCodes + optionIndexes2CharCodes + calculatorInputValue,
//       optionIndexes1 + optionIndexes2,
//     ];
//     console.log("optionIndexes2---:", optionIndexes2);
//     console.log("Executing SQL query:", sql, queryValues);

//     try {
//       const result = await db.query(sql, queryValues);

//       if (!result) {
//         console.error("Error saving response to the database");
//         res
//           .status(500)
//           .json({ success: false, message: "Internal server error" });
//         return;
//       }

//       console.log(
//         `Response for question ${questionIdNumber} saved to the database`
//       );
//       res.json({ success: true, message: "Response saved successfully" });
//     } catch (dbError) {
//       console.error("Database query error:", dbError);
//       res.status(500).json({
//         success: false,
//         message: "Error saving response to the database",
//         dbError: dbError.message,
//       });
//     }
//   } catch (error) {
//     console.error("Error handling the request:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });





// router.delete("/clearResponse/:questionId", async (req, res) => {
//   try {
//     const { questionId } = req.params;

//     // Validate that questionId is a valid integer
//     const questionIdNumber = parseInt(questionId, 10);
//     if (isNaN(questionIdNumber)) {
//       console.error(`Invalid integer value for questionId: ${questionId}`);
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid questionId" });
//     }

//     // Execute SQL query to clear the user's response for the specified question
//     const clearQuery = "UPDATE user_responses SET user_answer = NULL WHERE question_id = ?";
//     await new Promise((resolve, reject) => {
//       db.query(clearQuery, [questionIdNumber], (err, result) => {
//         if (err) {
//           console.error("Error clearing user response:", err);
//           reject(err);
//         } else {
//           console.log(`User response for question ${questionIdNumber} cleared`);
//           resolve(result);
//         }
//       });
//     });

//     res
//       .status(200)
//       .json({ success: true, message: "User response cleared successfully" });
//   } catch (error) {
//     console.error("Error clearing user response:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });



//main
// router.post("/response", async (req, res) => {
//   try {
//     console.log("Request Body:", req.body);
//     const { userId, questionId, testCreationTableId, subjectId, sectionId } = req.body;
//     console.log(`Response for question ${questionId} saved to the database`);
 
//     // Validate data types
//     const userIdNumber = parseInt(userId, 10);
//     const testCreationTableIdNumber = parseInt(testCreationTableId, 10);
//     const subjectIdNumber = parseInt(subjectId, 10);
//     const sectionIdNumber = parseInt(sectionId, 10);
 
//     if (
//       isNaN(userIdNumber) ||
//       isNaN(testCreationTableIdNumber) ||
//       isNaN(subjectIdNumber) ||
//       isNaN(sectionIdNumber)
//     ) {
//       console.error("Invalid integer value for userId, testCreationTableId, or questionId");
//       return res.status(400).json({ success: false, message: "Invalid data types" });
//     }
 
//     // Check if the values already exist in the database
//     const checkQuery =
//       "SELECT * FROM user_responses WHERE question_id = ?";
 
//     const checkValues = [
//       parseInt(questionId, 10),
//     ];
 
//     const existingResponse = await db.query(checkQuery, checkValues);
 
//     if (existingResponse.length > 0 && existingResponse[0].length > 0) {
//       console.log("Response already exists in the database");
 
//       // Map existing response values to variables
//       const existingUserResponse = existingResponse[0][0];
//       const existingUserId = existingUserResponse.user_Id;
//       const existingTestCreationTableId =
//         existingUserResponse.testCreationTableId;
//       const existingSubjectId = existingUserResponse.subjectId;
//       const existingSectionId = existingUserResponse.sectionId;
//       const existingQuestionId = existingUserResponse.question_id;
 
//       // Update the user's answer
//       const updateQuery =
//         "UPDATE user_responses SET user_answer = ?, option_id = ? WHERE question_id = ?";
 
//       const response = req.body[questionId];
//       const optionIndexes1CharCodes = response.optionIndexes1CharCodes.join(",");
//       const optionIndexes2CharCodes = response.optionIndexes2CharCodes.join(",");
//       const calculatorInputValue = response.calculatorInputValue;
 
//       const updateValues = [
//         optionIndexes1CharCodes + optionIndexes2CharCodes + calculatorInputValue,
//         response.optionIndexes1.join(",") + response.optionIndexes2.join(","),
//         existingQuestionId,
//       ];
 
//       console.log("Executing SQL query:", updateQuery, updateValues);
 
//       try {
//         const result = await db.query(updateQuery, updateValues);
 
//         if (!result) {
//           console.error("Error updating user's answer in the database");
//           res
//             .status(500)
//             .json({ success: false, message: "Internal server error" });
//           return;
//         }
 
//         console.log(`User's answer for question ${existingQuestionId} updated successfully`);
//         return res.status(200).json({
//           success: true,
//           message: "User's answer updated successfully",
//         });
//       } catch (dbError) {
//         console.error("Database query error:", dbError);
//         res.status(500).json({
//           success: false,
//           message: "Error updating user's answer in the database",
//           dbError: dbError.message,
//         });
//       }
//     }
 
//     // If the response does not already exist, proceed with insertion
//     const sql =
//       "INSERT INTO user_responses (user_Id, testCreationTableId, subjectId, sectionId, question_id, user_answer, option_id) " +
//       "VALUES (?, ?, ?, ?, ?, ?, ?)";
 
//     const response = req.body[questionId];
//     const questionIdNumber = parseInt(questionId, 10);
 
//     if (isNaN(questionIdNumber)) {
//       console.error(`Invalid integer value for questionId: ${questionId}`);
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid data types for questionId" });
//     }
 
//     const optionIndexes1 = response.optionIndexes1.join(",");
//     const optionIndexes2 = response.optionIndexes2.join(",");
//     const optionIndexes1CharCodes = response.optionIndexes1CharCodes.join(",");
//     const optionIndexes2CharCodes = response.optionIndexes2CharCodes.join(",");
//     const calculatorInputValue = response.calculatorInputValue;
 
//     const queryValues = [
//       userIdNumber,
//       testCreationTableIdNumber,
//       subjectIdNumber,
//       sectionIdNumber,
//       questionIdNumber,
//       optionIndexes1CharCodes + optionIndexes2CharCodes + calculatorInputValue,
//       optionIndexes1 + optionIndexes2,
//     ];
 
//     console.log("Executing SQL query:", sql, queryValues);
 
//     try {
//       const result = await db.query(sql, queryValues);
 
//       if (!result) {
//         console.error("Error saving response to the database");
//         res
//           .status(500)
//           .json({ success: false, message: "Internal server error" });
//         return;
//       }
 
//       console.log(`Response for question ${questionIdNumber} saved to the database`);
//       res.json({ success: true, message: "Response saved successfully" });
//     } catch (dbError) {
//       console.error("Database query error:", dbError);
//       res.status(500).json({
//         success: false,
//         message: "Error saving response to the database",
//         dbError: dbError.message,
//       });
//     }
//   } catch (error) {
//     console.error("Error handling the request:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });


router.post("/response", async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { userId, questionId, testCreationTableId, subjectId, sectionId } = req.body;
    console.log(`Response for question ${questionId} saved to the database`);

    // Validate data types
    const userIdNumber = parseInt(userId, 10);
    const testCreationTableIdNumber = parseInt(testCreationTableId, 10);
    const subjectIdNumber = parseInt(subjectId, 10);
    const sectionIdNumber = parseInt(sectionId, 10);

    if (
      isNaN(userIdNumber) ||
      isNaN(testCreationTableIdNumber) ||
      isNaN(subjectIdNumber) ||
      isNaN(sectionIdNumber)
    ) {
      console.error("Invalid integer value for userId, testCreationTableId, or questionId");
      return res.status(400).json({ success: false, message: "Invalid data types" });
    }

    // Check if the values already exist in the database
    const checkQuery =
      "SELECT * FROM user_responses WHERE user_Id = ? AND testCreationTableId = ? AND question_id = ?";

    // Initialize questionIdNumber here
    const questionIdNumber = parseInt(questionId, 10);

    const checkValues = [
      userIdNumber,
      testCreationTableIdNumber,
      questionIdNumber,
    ];

    const existingResponse = await db.query(checkQuery, checkValues);

    if (existingResponse.length > 0 && existingResponse[0].length > 0) {
      console.log("Response already exists in the database");

      // Handle existing response logic here...
    } else {
      // If the response does not already exist, proceed with insertion
      const sql =
        "INSERT INTO user_responses (user_Id, testCreationTableId, subjectId, sectionId, question_id, user_answer, option_id) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?)";

      const response = req.body[questionId];

      const optionIndexes1 = response.optionIndexes1.join(",");
      const optionIndexes2 = response.optionIndexes2.join(",");
      const optionIndexes1CharCodes = response.optionIndexes1CharCodes.join(",");
      const optionIndexes2CharCodes = response.optionIndexes2CharCodes.join(",");
      const calculatorInputValue = response.calculatorInputValue;

      const queryValues = [
        userIdNumber,
        testCreationTableIdNumber,
        subjectIdNumber,
        sectionIdNumber,
        questionIdNumber,
        optionIndexes1CharCodes + optionIndexes2CharCodes + calculatorInputValue,
        optionIndexes1 + optionIndexes2,
      ];

      console.log("Executing SQL query:", sql, queryValues);

      try {
        const result = await db.query(sql, queryValues);

        if (!result) {
          console.error("Error saving response to the database");
          res
            .status(500)
            .json({ success: false, message: "Internal server error" });
          return;
        }

        console.log(`Response for question ${questionIdNumber} saved to the database`);
        res.json({ success: true, message: "Response saved successfully" });
      } catch (dbError) {
        console.error("Database query error:", dbError);
        res.status(500).json({
          success: false,
          message: "Error saving response to the database",
          dbError: dbError.message,
        });
      }
    }
  } catch (error) {
    console.error("Error handling the request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


// router.post("/response", async (req, res) => {
//   try {
//     console.log("Request Body:", req.body);
//     const { userId, testCreationTableId, subjectId, sectionId } = req.body;

//     // Validate data types
//     const userIdNumber = parseInt(userId, 10);
//     const testCreationTableIdNumber = parseInt(testCreationTableId, 10);
//     const subjectIdNumber = parseInt(subjectId, 10);
//     const sectionIdNumber = parseInt(sectionId, 10);

//     if (
//       isNaN(userIdNumber) ||
//       isNaN(testCreationTableIdNumber) ||
//       isNaN(subjectIdNumber) ||
//       isNaN(sectionIdNumber)
//     ) {
//       console.error("Invalid integer value for userId, testCreationTableId, or questionId");
//       return res.status(400).json({ success: false, message: "Invalid data types" });
//     }

//     // Check if the response already exists in the database
//     const existingResponse = await db.query(
//       "SELECT user_Id, question_id FROM user_responses WHERE user_Id = ? AND testCreationTableId = ?",
//       [userIdNumber, testCreationTableIdNumber]
//     );

//     if (existingResponse.length > 0) {
//       console.log("Response already exists in the database");
      
//       // Iterate over each response in existingResponse to update
//       for (const response of existingResponse) {
//         const { question_id } = response;
//         const responseDetails = req.body[question_id];

//         if (!responseDetails) {
//           console.error(`Response details not found for question ${question_id}`);
//           continue; // Skip to next iteration
//         }

//         const { userAnswer } = responseDetails;

//         if (userAnswer === undefined) {
//           console.error("userAnswer is undefined in the response object");
//           continue; // Skip to next iteration
//         }

//         const updateQuery =
//           "UPDATE user_responses SET user_answer = ? WHERE user_Id = ? AND testCreationTableId = ? AND question_id = ?";
        
//         const updateValues = [
//           userAnswer,
//           userIdNumber,
//           testCreationTableIdNumber,
//           question_id
//         ];

//         console.log("Executing SQL query:", updateQuery, updateValues);

//         try {
//           await db.query(updateQuery, updateValues);
//           console.log(`User's answer for question ${question_id} updated successfully`);
//         } catch (dbError) {
//           console.error("Database query error:", dbError);
//         }
//       }

//       return res.status(200).json({
//         success: true,
//         message: "User's answers updated successfully",
//       });
//     }

//     // If the response does not already exist, return success with a message
//     console.log("No existing responses found in the database");
//     return res.status(200).json({ success: true, message: "No existing responses found" });
//   } catch (error) {
//     console.error("Error handling the request:", error);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });







router.put("/updateResponse/:questionId", async (req, res) => {
  try {
    const questionId = parseInt(req.params.questionId, 10);
    const { updatedResponse, userId, testCreationTableId } = req.body;

    if (
      updatedResponse &&
      (updatedResponse.optionIndexes1 || updatedResponse.optionIndexes2)
    ) {
      let userAnswer = "";

      if (updatedResponse.optionIndexes1) {
        userAnswer += updatedResponse.optionIndexes1.join(",");
      }

      if (updatedResponse.optionIndexes2) {
        userAnswer += updatedResponse.optionIndexes2.join(",");
      }

      if (updatedResponse.calculatorInputValue) {
        userAnswer += updatedResponse.calculatorInputValue;
      }

      const sql =
        "UPDATE user_responses SET user_answer = ? WHERE user_Id = ? AND testCreationTableId = ? AND question_id = ?";

      db.query(sql, [userAnswer, userId, testCreationTableId, questionId], (err, result) => {
        if (err) {
          console.error("Error updating response in the database:", err);
          res.status(500).json({ success: false, message: "Internal server error" });
        } else {
          if (result.affectedRows > 0) {
            console.log(`Response for question ${questionId} updated successfully`);
            res.json({ success: true, message: "Response updated successfully" });
          } else {
            console.error(`No records found for question ${questionId}`);
            res.status(404).json({ success: false, message: "Response not found" });
          }
        }
      });
    } else {
      console.error(`Invalid updated response data for question ${questionId}`);
      res.status(400).json({ success: false, message: "Invalid updated response data" });
    }
  } catch (error) {
    console.error("Error handling the request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});









// router.post("/response", async (req, res) => {
//   try {
//     console.log("Request Body:", req.body);
//     const { userId, testCreationTableId, subjectId, sectionId, currentQuestionTypeId } = req.body;
//     const questionId = req.body.questionId.toString(); // Convert to string if not already

//     // Extract response details from request body
//     const { optionIndexes1, optionIndexes2, optionIndexes1CharCodes, optionIndexes2CharCodes, calculatorInputValue } = req.body[questionId];

//     // Ensure that optionIndexes1, optionIndexes2, optionIndexes1CharCodes, and optionIndexes2CharCodes are arrays
//     const safeOptionIndexes1 = Array.isArray(optionIndexes1) ? optionIndexes1 : [];
//     const safeOptionIndexes2 = Array.isArray(optionIndexes2) ? optionIndexes2 : [];
//     const safeOptionIndexes1CharCodes = Array.isArray(optionIndexes1CharCodes) ? optionIndexes1CharCodes : [];
//     const safeOptionIndexes2CharCodes = Array.isArray(optionIndexes2CharCodes) ? optionIndexes2CharCodes : [];

//     // Validate data types
//     const userIdNumber = parseInt(userId, 10);
//     const testCreationTableIdNumber = parseInt(testCreationTableId, 10);
//     const subjectIdNumber = parseInt(subjectId, 10);
//     const sectionIdNumber = parseInt(sectionId, 10);
//     const questionIdNumber = parseInt(questionId, 10);
//     const currentQuestionTypeIdNumber = parseInt(currentQuestionTypeId, 10);

//     if (
//       isNaN(userIdNumber) ||
//       isNaN(testCreationTableIdNumber) ||
//       isNaN(subjectIdNumber) ||
//       isNaN(sectionIdNumber) ||
//       isNaN(questionIdNumber) ||
//       isNaN(currentQuestionTypeIdNumber)
//     ) {
//       console.error("Invalid integer value for one of the parameters");
//       return res.status(400).json({ success: false, message: "Invalid data types" });
//     }

//     // Prepare SQL query
//     const sql =
//       "INSERT INTO user_responses_new (user_Id, testCreationTableId, subjectId, sectionId, question_id, user_answer, option_id, quesionTypeId) " +
//       "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

//     const queryValues = [
//       userIdNumber,
//       testCreationTableIdNumber,
//       subjectIdNumber,
//       sectionIdNumber,
//       questionIdNumber,
//       safeOptionIndexes1CharCodes.join(',') + safeOptionIndexes2CharCodes.join(',') + calculatorInputValue,
//       safeOptionIndexes1.join(',') + safeOptionIndexes2.join(','),
//       currentQuestionTypeIdNumber
//     ];

//     console.log("Executing SQL query:", sql, queryValues);

//     try {
//       const result = await db.query(sql, queryValues);

//       if (!result) {
//         console.error("Error saving response to the database");
//         res.status(500).json({ success: false, message: "Internal server error" });
//         return;
//       }

//       console.log(`Response for question ${questionId} saved to the database`);
//       res.json({ success: true, message: "Response saved successfully" });
//     } catch (dbError) {
//       console.error("Database query error:", dbError);
//       res.status(500).json({
//         success: false,
//         message: "Error saving response to the database",
//         dbError: dbError.message,
//       });
//     }
//   } catch (error) {
//     console.error("Error handling the request:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });









//main code
// router.put("/updateResponse/:questionId", async (req, res) => {
//   try {
//     const questionId = parseInt(req.params.questionId, 10);
//     const { updatedResponse, userId, testCreationTableId } = req.body;

//     if (
//       updatedResponse &&
//       (updatedResponse.optionIndexes1 || updatedResponse.optionIndexes2)
//     ) {
//       let userAnswer = "";

//       if (updatedResponse.optionIndexes1) {
//         userAnswer += updatedResponse.optionIndexes1.join("");
//       }

//       if (updatedResponse.optionIndexes2) {
//         userAnswer += updatedResponse.optionIndexes2.join(",");
//       }

//       if (updatedResponse.calculatorInputValue) {
//         userAnswer += updatedResponse.calculatorInputValue;
//       }

//       const sql =
//         "UPDATE user_responses SET user_answer = ? WHERE question_id = ?";

//       db.query(sql, [userAnswer, questionId], (err, result) => {
//         if (err) {
//           console.error("Error updating response in the database:", err);
//           res
//             .status(500)
//             .json({ success: false, message: "Internal server error" });
//         } else {
//           if (result.affectedRows > 0) {
//             console.log(
//               `Response for question ${questionId} updated successfully`
//             );
//             res.json({
//               success: true,
//               message: "Response updated successfully",
//             });
//           } else {
//             console.error(`No records found for question ${questionId}`);
//             res
//               .status(404)
//               .json({ success: false, message: "Response not found" });
//           }
//         }
//       });
//     } else {
//       console.error(`Invalid updated response data for question ${questionId}`);
//       res
//         .status(400)
//         .json({ success: false, message: "Invalid updated response data" });
//     }
//   } catch (error) {
//     console.error("Error handling the request:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });

// Update a response
// router.put("/updateResponse/:questionId", async (req, res) => {
//   try {
//     const questionId = parseInt(req.params.questionId, 10);
//     const { updatedResponse, userId, testCreationTableId } = req.body;

//     if (
//       updatedResponse &&
//       (updatedResponse.optionIndexes1 || updatedResponse.optionIndexes2)
//     ) {
//       let userAnswer = "";

//       if (updatedResponse.optionIndexes1) {
//         userAnswer += updatedResponse.optionIndexes1.join("");
//       }

//       if (updatedResponse.optionIndexes2) {
//         userAnswer += updatedResponse.optionIndexes2.join(",");
//       }

//       if (updatedResponse.calculatorInputValue) {
//         userAnswer += updatedResponse.calculatorInputValue;
//       }

//       const sql =
//         "UPDATE user_responses_new SET user_answer = ? WHERE question_id = ?";

//       db.query(sql, [userAnswer, questionId], (err, result) => {
//         if (err) {
//           console.error("Error updating response in the database:", err);
//           res
//             .status(500)
//             .json({ success: false, message: "Internal server error" });
//         } else {
//           if (result.affectedRows > 0) {
//             console.log(
//               `Response for question ${questionId} updated successfully`
//             );
//             res.json({
//               success: true,
//               message: "Response updated successfully",
//             });
//           } else {
//             console.error(`No records found for question ${questionId}`);
//             res
//               .status(404)
//               .json({ success: false, message: "Response not found" });
//           }
//         }
//       });
//     } else {
//       console.error(`Invalid updated response data for question ${questionId}`);
//       res
//         .status(400)
//         .json({ success: false, message: "Invalid updated response data" });
//     }
//   } catch (error) {
//     console.error("Error handling the request:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });


router.put("/clearResponse/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;
 
    const updateQuery = "UPDATE user_responses SET user_answer = NULL WHERE question_id = ?";
    db.query(updateQuery, [questionId], (err, result) => {
      if (err) {
        console.error("Error clearing user response:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
      } else {
        console.log(`User response for question ${questionId} cleared`);
        res.status(200).json({ success: true, message: "User response cleared successfully" });
      }
    });
  } catch (error) {
    console.error("Error clearing user response:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
 


// router.post('/insertTestAttemptStatus', (req, res) => {
//   const { userId, courseCreationId, testCreationTableId, test_status } = req.body;

//   // Insert query
//   const query = 'INSERT INTO test_attempt_status (user_Id, courseCreationId, testCreationTableId, test_status) VALUES (?, ?, ?, ?)';

//   // Execute the query
//   db.query(query, [userId, courseCreationId, testCreationTableId, test_status], (error, results) => {
//     if (error) {
//       console.error('Error inserting test attempt status:', error);
//       return res.status(500).json({ error: 'Failed to insert test attempt status' });
//     }
//     console.log('Test attempt status inserted successfully');
//     res.json({ success: true });
//   });
// });

router.post('/insertTestAttemptStatus', (req, res) => {
  const { userId, courseCreationId, testCreationTableId, test_status } = req.body;

  console.log('Request body:', req.body); // Log the request body

  // Insert query
  const query = 'INSERT INTO test_attempt_status (user_Id, courseCreationId, testCreationTableId, test_status) VALUES (?, ?, ?, ?)';

  // Execute the query
  db.query(query, [userId, courseCreationId, testCreationTableId, test_status], (error, results) => {
    if (error) {
      console.error('Error inserting test attempt status:', error);
      return res.status(500).json({ error: 'Failed to insert test attempt status' });
    }
    console.log('Test attempt status inserted successfully');

    // Retrieve the inserted data from the database
    const insertedId = results.insertId; // Assuming your primary key is auto-incremented
    const selectQuery = 'SELECT * FROM test_attempt_status WHERE id = ?';

    db.query(selectQuery, [insertedId], (selectError, selectResults) => {
      if (selectError) {
        console.error('Error fetching inserted data:', selectError);
        return res.status(500).json({ error: 'Failed to fetch inserted data' });
      }

      const insertedData = selectResults[0];
      console.log('Inserted data:', insertedData);

      // Return the success response along with the inserted data
      res.json({ success: true, insertedData });
    });
  });
});










module.exports = router;
