const express = require("express");
const router = express.Router();
const db = require("../DataBase/db2");



router.get("/questionCount", async (req, res) => {
  const { testCreationTableId, subjectId, sectionId } = req.params;
  try {
    const [results, fields] = await db.execute(
      `SELECT t.testCreationTableId, COUNT(q.question_id) AS total_question_count
        FROM
        test_creation_table t
        LEFT JOIN questions q ON t.testCreationTableId = q.testCreationTableId
        WHERE t.testCreationTableId = ?;`
    );
    res.json(results);
  } catch (error) {
    console.error("Error fetching course count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/questionCount/:testCreationTableId", async (req, res) => {
  const { testCreationTableId } = req.params;
  try {
    const [results, fields] = await db.execute(
      `SELECT t.testCreationTableId, COUNT(q.question_id) AS total_question_count
        FROM
        test_creation_table t
        LEFT JOIN questions q ON t.testCreationTableId = q.testCreationTableId
        WHERE t.testCreationTableId = ?;`,
      [testCreationTableId]
    );
    res.json(results);
  } catch (error) {
    console.error("Error fetching question count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/attemptCount/:testCreationTableId/:user_Id", async (req, res) => {
  const { testCreationTableId, user_Id } = req.params;

  try {
    if (!testCreationTableId || !user_Id) {
      // Check if any of the required parameters is missing
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const [results, fields] = await db.execute(
      `SELECT COUNT(*) AS total_attempted_questions
       FROM user_responses
       WHERE user_Id = ? AND testCreationTableId = ?`,
      [user_Id, testCreationTableId]
    );
    const totalAttempt = results[0].total_attempted_questions;

    const [updateResult] = await db.execute(
      `UPDATE student_exam_summery 
       SET Total_Attempted = ? 
       WHERE user_Id = ? AND testCreationTableId = ?`,
      [totalAttempt, user_Id, testCreationTableId]
    );
    const responseObj = {
      results: results,
      updateResult: updateResult
    };
    res.json(responseObj); 
  } catch (error) {
    console.error("Error fetching attempted question count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.get(
  "/correctAnswers/:testCreationTableId/:user_Id",
  async (req, res) => {
    const { testCreationTableId, user_Id } = req.params;

    try {
      if (!testCreationTableId || !user_Id) {
        // Check if any of the required parameters is missing
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const [results, fields] = await db.execute(
        `SELECT COUNT(*) AS total_matching_rows
        FROM user_responses ur
        JOIN answer a ON ur.question_id = a.question_id
        WHERE TRIM(ur.user_answer) = TRIM(a.answer_text)
        AND ur.user_Id = ? AND ur.testCreationTableId = ?`,
        [user_Id, testCreationTableId]
      );

      res.json(results);
    } catch (error) {
      console.error("Error fetching correct answers count:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

///////////////////////////////////////////////////////////////////////////////////////////////end//////////////////////////////////////////////////////////////////////
router.get("/getStudentMarks/:testCreationTableId/:user_Id", async (req, res) => {
  const { testCreationTableId, user_Id } = req.params;

  try {
    // Fetch all user responses for the given test and user
    const [userResponseRows] = await db.query(
      `SELECT
      ur.user_Id,
      ur.testCreationTableId,
      ur.subjectId,
      ur.sectionId,
      ur.question_id,
      ur.user_answer,
      a.answer_text,
      qt.qtype_text,
      qt.quesionTypeId,
      m.marks_text,
      m.nmarks_text,
      s.sectionId,
      s.noOfQuestions,
      s.QuestionLimit
  FROM
      user_responses ur
  JOIN
      sections s ON s.testCreationTableId = ur.testCreationTableId AND s.sectionId = ur.sectionId
  JOIN
      answer a ON ur.question_id = a.question_id
  JOIN
      qtype qt ON ur.question_id = qt.question_id
  LEFT JOIN
      marks m ON ur.question_id = m.question_id
  WHERE
      ur.testCreationTableId = ? AND ur.user_Id = ?;
  `,
      [testCreationTableId, user_Id]
    );

    // Calculate and save marks for each user response
    const savedRows = await calculateAndSaveMarks(userResponseRows);
    
    res.json(savedRows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function saveToDatabaseFunction(table, columns, values) {
  const columnsString = columns.join(', ');
  const placeholders = values.map(value => (value !== undefined ? '?' : 'NULL')).join(', ');

  // Replace undefined values with null
  const sanitizedValues = values.map(value => (value !== undefined ? value : null));

  try {
    const [rows] = await db.execute(`INSERT INTO ${table} (${columnsString}) VALUES (${placeholders})`, sanitizedValues);
    console.log(`Inserted row for Question ${values[4]}:`, rows);
    return rows;
  } catch (error) {
    console.error(`Error in saveToDatabaseFunction: ${error.message}`);
    throw error; // Throw the error to handle it appropriately in the calling function
  }
}

async function calculateAndSaveMarks(rows) {
  const savedRows = [];
  const correctAnswersCountMap = new Map();

  for (const row of rows) {
    const questionLimit = row.QuestionLimit;
    const sectionId = row.sectionId;

    if (!correctAnswersCountMap.has(sectionId)) {
      correctAnswersCountMap.set(sectionId, 0);
    }

    const correctAnswersCount = correctAnswersCountMap.get(sectionId);
    let std_marks = null;

    if (questionLimit !== null && correctAnswersCount < questionLimit) {
      // Await the asynchronous function
      std_marks = await calculateMarksWithLimit(row, correctAnswersCount, questionLimit);

      if (std_marks !== null) {
        correctAnswersCountMap.set(sectionId, correctAnswersCount + 1);
      }

      console.log(`Section ${sectionId}: correctAnswersCount: ${correctAnswersCount}, questionLimit: ${questionLimit}`);
      console.log(`Question ${row.question_id}: Inserting row for std_marks: ${std_marks}`);
    } else if (questionLimit === null) {
      // Await the asynchronous function
      std_marks = await calculateMarksWithoutLimit(row);

      console.log(`Question ${row.question_id}: Inserting row for std_marks: ${std_marks}`);
    } else {
      console.log(`Question ${row.question_id}: Skipping insertion due to question limit.`);
    }

    console.log(`Question ${row.question_id}: std_marks calculated: ${std_marks}, user_answer: ${row.user_answer}, correctAnswersCount: ${correctAnswersCount}, questionLimit: ${questionLimit}`);

    if (std_marks !== null) {
      const status = std_marks > 1 ? 1 : 0;
      // Await the asynchronous function
      const result = await saveToDatabaseFunction('student_marks', ['user_Id', 'testCreationTableId', 'subjectId', 'sectionId', 'question_id', 'std_marks', 'status'], [row.user_Id, row.testCreationTableId, row.subjectId, row.sectionId, row.question_id, std_marks, status]);
      savedRows.push(result);
    } else {
      console.log(`Question ${row.question_id}: Skipping insertion due to null std_marks value.`);
    }
  }

  return savedRows;
}



async function calculateMarksWithLimit(row, correctAnswersCount, questionLimit) {
  if (row.quesionTypeId === 3) {
    // For question type 3, increment correctAnswersCount only if the user's answer exactly matches the correct answer
    const userAnswerArray = row.user_answer.toLowerCase().split(',');
    const correctAnswerArray = row.answer_text.toLowerCase().split(',');
    
    const isCorrect = userAnswerArray.every(answer => correctAnswerArray.includes(answer));

    if (isCorrect) {
      correctAnswersCount++;
      return row.marks_text !== null ? row.marks_text : 0;
    } else {
      return row.nmarks_text !== null ? row.nmarks_text : 0;
    }
  } else if ([1, 2, 5, 7, 8].includes(row.quesionTypeId)) {
    // Handle non-decimal type questions
    const userAnswer = row.user_answer.toLowerCase();
    const correctAnswer = row.answer_text.toLowerCase().trim();

    if (userAnswer === correctAnswer) {
      // Increment correctAnswersCount only if the user's answer matches the correct answer
      correctAnswersCount++;
      return row.marks_text !== null ? row.marks_text : 0;
    } else {
      return row.nmarks_text !== null ? row.nmarks_text : 0;
    }
  } else if (row.quesionTypeId === 6) {
    if (correctAnswersCount < questionLimit) {
      return calculateDecimalMarks(row);
    } else {
      return null;
    }
  } else if (row.quesionTypeId === 4) {
    // For type 4 questions, increment correctAnswersCount if the user's answer matches any permutation of the correct answers
    if (row.answer_text.toLowerCase().split(',').sort().join('') === row.user_answer.toLowerCase().split(',').sort().join('')) {
      correctAnswersCount++;
      return row.marks_text !== null ? row.marks_text : 0;
    } else {
      return row.nmarks_text !== null ? row.nmarks_text : 0;
    }
  } else {
    return null;
  }
}



async function calculateMarksWithoutLimit(row) {
  if (row.quesionTypeId === 4) {
    return calculateMarksForType4(row);
  } else if (row.quesionTypeId === 3) {
    return calculateMarksForType3(row);
  } else {
    let std_marks = null;

    if ([1, 2, 5, 7, 8].includes(row.quesionTypeId)) {
      // Handling for non-decimal type questions without limit
      std_marks = calculateNonDecimalMarks(row);
    } else if (row.quesionTypeId === 6) {
      // Handling for decimal type questions without limit
      std_marks = calculateDecimalMarks(row);
    } else {
      // Handling for other question types without limit
      // Add your custom logic here if needed
      std_marks = null;
    }

    return std_marks;
  }
}



function calculateNonDecimalMarks(row) {
  if ([1, 2, 3, 5, 7, 8].includes(row.quesionTypeId)) {
    const userAnswer = row.user_answer.toLowerCase();
    const correctAnswer = row.answer_text.toLowerCase().trim();
    
    console.log(`Question ${row.question_id}: Comparing userAnswer: '${userAnswer}' to Correct Answer: '${correctAnswer}'`);

    if (userAnswer === correctAnswer) {
      console.log(`Question ${row.question_id}: Matched correct answer. Returning marks_text: ${row.marks_text}`);
      return row.marks_text !== null ? row.marks_text : 0;
    } else {
      console.log(`Question ${row.question_id}: Incorrect answer. Returning nmarks_text: ${row.nmarks_text}`);
      return row.nmarks_text !== null ? row.nmarks_text : 0;
    }
  } else {
    console.log(`Question ${row.question_id}: Handling other question types.`);
    return null;
  }
}
function calculateDecimalMarks(row) {
  if (row.quesionTypeId === 6) {
    const userAnswer = parseFloat(row.user_answer);
    const correctAnswerMin = parseFloat(row.answer_text.split('-')[0]);
    const correctAnswerMax = parseFloat(row.answer_text.split('-')[1]);

    console.log(`Question ${row.question_id}: Comparing userAnswer: ${userAnswer} to Correct Answer Range: ${correctAnswerMin}-${correctAnswerMax}`);

    // Check if the user answer is within the correct range
    return (userAnswer >= correctAnswerMin && userAnswer <= correctAnswerMax) ? row.marks_text || 0 : (row.nmarks_text !== null ? row.nmarks_text : 0);
  } else {
    return null;
  }
}



 
function calculateNonDecimalMarks(row) {
  // Implement your logic to calculate marks for non-decimal type questions
  if ([1, 2,3, 5, 7, 8].includes(row.quesionTypeId)) {
    const userAnswer = row.user_answer.toLowerCase(); // Assuming case-insensitive comparison
 
 console.log(`Question ${row.question_id}: Comparing userAnswer: '${userAnswer}' to Correct Answer: '${row.answer_text.toLowerCase().trim()}'`);
if (userAnswer === row.answer_text.toLowerCase().trim()) {
  // If the user's answer matches the correct answer, return marks_text from marks table
  console.log(`Question ${row.question_id}: Matched correct answer. Returning marks_text: ${row.marks_text}`);
  return row.marks_text !== null ? row.marks_text : 0;
} else {
  // If the user's answer is incorrect, return nmarks_text from marks table
  console.log(`Question ${row.question_id}: Incorrect answer. Returning nmarks_text: ${row.nmarks_text}`);
  return row.nmarks_text !== null ? row.nmarks_text : 0;
}
  } else {
    // Handle other question types, if needed
    console.log(`Question ${row.question_id}: Handling other question types.`);
    return null; // Replace with the appropriate logic or value
  }
}
 
 
function calculateDecimalMarks(row) {
  // Implement your logic to calculate marks for decimal type questions
  if (row.quesionTypeId === 6) {
    const userAnswer = parseFloat(row.user_answer);
    const correctAnswerMin = parseFloat(row.answer_text.split('-')[0]);
    const correctAnswerMax = parseFloat(row.answer_text.split('-')[1]);
 
    if (userAnswer >= correctAnswerMin && userAnswer <= correctAnswerMax) {
      // If the user's answer is within the correct range, return marks_text from marks table
      return row.marks_text || 0; // Assuming marks_text contains the marks value for correct answers
    } else {
      // If the user's answer is incorrect, return nmarks_text from marks table
      return row.nmarks_text || 0; // Assuming nmarks_text contains the marks value for incorrect answers
    }
  } else {
    return null;
  }
}

async function calculateMarksForType4(row) {
  if (row.quesionTypeId === 4) {
    const userAnswers = row.user_answer.toLowerCase().split(',').sort().join('');
    const correctAnswers = row.answer_text.toLowerCase().split(',').sort().join('');

    console.log(`Question ${row.question_id}: Comparing userAnswers: '${userAnswers}' to Correct Answers: '${correctAnswers}'`);

    // Check if the user's answers exactly match the correct answers or any permutation of them
    const correctPermutations = getPermutations(correctAnswers.split(','));
    const matched = correctPermutations.some(perm => perm.join('') === userAnswers);

    if (matched) {
      console.log(`Question ${row.question_id}: Matched correct answers. Returning marks_text: ${row.marks_text}`);
      return row.marks_text !== null ? row.marks_text : 0;
    } else {
      console.log(`Question ${row.question_id}: Incorrect answers. Returning nmarks_text: ${row.nmarks_text}`);
      return row.nmarks_text !== null ? row.nmarks_text : 0;
    }
  } else {
    return null;
  }
}

function calculateMarksForType3(row) {
  if (row.quesionTypeId === 3) {
    console.log("Correct Answers:", row.answer_text);
    console.log("User Answers:", row.user_answer);
    
    // Split the correct answer and user's answer into arrays
    const correctAnswers = row.answer_text.toLowerCase().split(',').sort();
    const userAnswers = row.user_answer.toLowerCase().split(',').sort();

    // Initialize variable to store total marks
    let totalMarks = 0;

    // Check if the user's answer exactly matches the correct answer
    if (correctAnswers.length === userAnswers.length && correctAnswers.every((value, index) => value === userAnswers[index])) {
      totalMarks = parseFloat(row.marks_text); // Assign full marks
    } else {
      // Calculate marks for each correct answer
      const correctCount = userAnswers.filter(answer => correctAnswers.includes(answer)).length;
      totalMarks = (correctCount / correctAnswers.length) * parseFloat(row.marks_text);
    }

    // Log the calculated marks
    console.log(`Question ${row.question_id}: std_marks calculated: ${totalMarks}, user_answer: ${row.user_answer}, questionLimit: null`);

    // Return the total marks
    return totalMarks;
  } else {
    return null; // Return null for other question types
  }
}










// Helper function to generate all permutations of an array
function getPermutations(arr) {
  const result = [];

  const permute = (arr, current = []) => {
    if (arr.length === 0) {
      result.push([...current]);
      return;
    }
    for (let i = 0; i < arr.length; i++) {
      const remaining = arr.filter((_, index) => index !== i);
      permute(remaining, [...current, arr[i]]);
    }
  };

  permute(arr);
  return result;
}






router.get(
  "/correctAnswers/:testCreationTableId/:user_Id",
  async (req, res) => {
    const { testCreationTableId, user_Id } = req.params;

    try {
      if (!testCreationTableId || !user_Id) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const [results, fields] = await db.execute(
        `SELECT COUNT(*) AS total_matching_rows
        FROM user_responses ur
        JOIN answer a ON ur.question_id = a.question_id
        WHERE TRIM(ur.user_answer) = TRIM(a.answer_text)
        AND ur.user_Id = ? AND ur.testCreationTableId = ?`,
        [user_Id, testCreationTableId]
      );

      const totalCorrect = results[0].total_matching_rows;

      const [updateResult] = await db.execute(
        `UPDATE student_exam_summery 
         SET Total_correct = ? 
         WHERE user_Id = ? AND testCreationTableId = ?`,
        [totalCorrect, user_Id, testCreationTableId]
      );

      const responseObj = {
        results: results,
        updateResult: updateResult
      };

      res.json(responseObj);  // Send both results and updateResult in the response
    } catch (error) {
      console.error("Error updating correct answers count:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/totalcurrectans/:testCreationTableId/:user_Id", async (req, res) => {
  const { testCreationTableId, user_Id } = req.params;
  try {
    const [results, fields] = await db.execute(
      "SELECT Total_correct,Total_wrong,Total_Attempted FROM student_exam_summery WHERE testCreationTableId = ? AND user_Id = ?",
      [testCreationTableId, user_Id]
    );
    res.json(results);
  } catch (error) {
    console.error("Error fetching question count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get(
  "/incorrectAnswers/:testCreationTableId/:user_Id",
  async (req, res) => {
    const { testCreationTableId, user_Id } = req.params;

    try {
      if (!testCreationTableId || !user_Id) {
        // Check if any of the required parameters is missing
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const [results, fields] = await db.execute(
        `SELECT COUNT(*) AS total_unmatched_rows
        FROM user_responses ur
        JOIN answer a ON ur.question_id = a.question_id
        WHERE TRIM(ur.user_answer) != TRIM(a.answer_text)
        AND ur.user_Id = ? AND ur.testCreationTableId = ?`,
        [user_Id, testCreationTableId]
      );
      const totalinCorrect = results[0].total_unmatched_rows;
      const [updateResult] = await db.execute(
        `UPDATE student_exam_summery 
         SET Total_wrong = ? 
         WHERE user_Id = ? AND testCreationTableId = ?`,
        [totalinCorrect, user_Id, testCreationTableId]
      );
      const responseObj = {
        results: results,
        updateResult: updateResult
      };

      res.json(responseObj);
    } catch (error) {
      console.error("Error fetching correct answers count:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);




router.get("/score/:testCreationTableId/:user_Id", async (req, res) => {
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
            TRIM(ur.user_answer) = TRIM(a.answer_text) AND ur.user_Id = ? AND ur.testCreationTableId = ? AND (
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
            TRIM(ur.user_answer) != TRIM(a.answer_text) AND ur.user_Id = ? AND ur.testCreationTableId = ? AND (
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
            TRIM(ur.user_answer) = TRIM(a.answer_text) AND ur.user_Id = ? AND ur.testCreationTableId = ? AND s.QuestionLimit IS NOT NULL AND s.QuestionLimit > 0
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
            TRIM(ur.user_answer) != TRIM(a.answer_text) AND ur.user_Id = ? AND ur.testCreationTableId = ? AND s.QuestionLimit IS NOT NULL AND s.QuestionLimit > 0
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

    // Initialize counters for total marks and wrong answers count
    let totalMarks = 0;
    let wrongAnswersCount = 0;

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
        user_answer,
        answer_text
      } = row;

      // Increment total marks
      totalMarks += marks_text;

      // Check if the user's answer is wrong
      if (user_answer.trim() !== answer_text.trim()) {
        wrongAnswersCount++;
      }

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

    // Output the result
    res.json({
      overallTotalMarks,
      overallNetMarks,
      wrongAnswersCount,
      totalMarks,
      subjects: subjectsArray,
    });
  } catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.get("/answer/:testCreationTableId/:user_Id", async (req, res) => {
  try {
    const { testCreationTableId, user_Id } = req.params;
    const [results] = await db.query(
      `
SELECT
    ROW_NUMBER() OVER (ORDER BY a.question_id) AS question_number,
    a.question_id,
    a.answer_text,
    ur.user_answer,
    TRIM(COALESCE(ur.user_answer, '--')) AS trimmed_user_answer,
    TRIM(a.answer_text) AS trimmed_answer_text,
    LENGTH(TRIM(COALESCE(ur.user_answer, '--'))) AS user_answer_length,
    LENGTH(TRIM(a.answer_text)) AS answer_text_length,
    CASE
        WHEN ur.user_answer IS NULL THEN 'N/A'
        WHEN TRIM(BINARY ur.user_answer) = TRIM(BINARY a.answer_text) AND ur.user_answer != '' THEN 'CORRECT'
        ELSE 'INCORRECT'
    END AS status
FROM
    answer a
LEFT JOIN
    user_responses ur ON a.question_id = ur.question_id AND ur.testCreationTableId = ?
ORDER BY
    a.question_id ASC;

      `,
      [testCreationTableId, user_Id]
    );

    console.log(results); // Log the results to see if STATUS is populated correctly

    res.json(results);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getResponse/:testCreationTableId/:user_Id/:questionId",
  async (req, res) => {
    try {
      const { testCreationTableId, user_Id, questionId } = req.params;
      const [results] = await db.query(
        `
      SELECT
      *
  FROM
      user_responses ur
  JOIN test_creation_table tc ON
      tc.testCreationTableId = ur.testCreationTableId
  JOIN LOG l ON
      l.user_Id = ur.user_Id
  JOIN questions q ON
      q.question_id = ur.question_id
      `,
        [testCreationTableId, user_Id]
      );

      console.log(results); // Log the results to see if STATUS is populated correctly

      res.json(results);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get("/getTimeLeftSubmissions/:testCreationTableId/:userId",
  async (req, res) => {
    try {
      const { testCreationTableId, userId } = req.params;

      // Your SQL query
      const query = `
        SELECT *
        FROM time_left_submission_of_test ts
        JOIN user_responses ur ON ts.user_Id = ur.user_Id AND ts.testCreationTableId = ur.testCreationTableId
        WHERE ur.user_Id = ? AND ts.testCreationTableId = ?
        LIMIT 1;
      `;

      // Execute the query using promises
      const [rows, fields] = await db.execute(query, [
        userId,
        testCreationTableId,
      ]);

      // Send the result as JSON
      res.json(rows);
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/testDetails", (req, res) => {
  const { user_Id, testCreationTableId } = req.params;

  // Execute the SQL query
  db.query(
    `SELECT test.TestName, course.courseName, exam.examName,course.courseCreationId
     FROM test_creation_table AS test
     JOIN course_creation_table AS course ON test.courseCreationId = course.courseCreationId
     JOIN exams AS exam ON course.examId = exam.examId
     JOIN user_responses AS ur ON test.testCreationTableId = ur.testCreationTableId
     JOIN log AS l ON ur.user_Id = l.user_Id
     WHERE ur.user_Id = ? AND ur.testCreationTableId = ?`,
    [user_Id, testCreationTableId],
    (error, results) => {
      if (error) {
        console.error("Error executing SQL query:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Check if any results were returned
      if (results.length === 0) {
        return res.status(404).json({ error: "No data found" });
      }

      // Return the results from the query
      res.json(results);
    }
  );
});

// @route   POST api/quiz /submitQuizResult/:id
router.get("/testName/:testCreationTableId/:Portale_Id", async (req, res) => {
  const { testCreationTableId,Portale_Id } = req.params;

  try {
    if (!testCreationTableId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const [results, fields] = await db.execute(
      `SELECT
      tct.TestName,
      cct.courseName,
      et.examName,
      p.Portale_Id,
      p.Portale_Name,
      tct.courseCreationId
  FROM
      test_creation_table AS tct
  JOIN course_creation_table AS cct
  ON
      tct.courseCreationId = cct.courseCreationId
  JOIN exams AS et
  ON
      cct.examId = et.examId
  LEFT JOIN portales AS p
  ON
      cct.Portale_Id = p.Portale_Id
  WHERE
      tct.testCreationTableId = ? AND cct.Portale_Id = ?
`,

      [testCreationTableId,Portale_Id]
    );

    res.json({
      results,
    });
  } catch (error) {
    console.error("Error fetching scores:", error);

    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/testDetails/:testCreationTableId", async (req, res) => {
  const { testCreationTableId } = req.params;

  try {
    if (!testCreationTableId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const [results, fields] = await db.execute(
      `SELECT test.TestName, course.courseName, exam.examName,course.courseCreationId

FROM test_creation_table AS test

JOIN course_creation_table AS course ON test.courseCreationId = course.courseCreationId

JOIN exams AS exam ON course.examId = exam.examId

WHERE test.testCreationTableId =  ?;

`,

      [testCreationTableId]
    );

    res.json({
      results,
    });
  } catch (error) {
    console.error("Error fetching scores:", error);

    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
