const express = require("express");
const router = express.Router();
const db = require("../DataBase/db2");





router.get(
  "/feachingtest/:courseCreationId/:typeOfTestId",
  async (req, res) => {
    const { courseCreationId, typeOfTestId } = req.params;
    try {
      // Fetch tests from the database based on courseCreationId and typeOfTestId
      const [testRows] = await db.query(
        "SELECT * FROM test_creation_table WHERE courseCreationId = ? AND courseTypeOfTestId = ?",
        [courseCreationId, typeOfTestId]
      );
      res.json(testRows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/feachingtest/:courseCreationId", async (req, res) => {
  const { courseCreationId } = req.params;
  try {
    // Fetch exams from the database
    const [rows] = await db.query(
      `SELECT 
          tc.courseCreationId,
          ct.courseName,
          tc.testCreationTableId,
          tc.TestName, 
          tc.testStartDate, 
          tc.testEndDate, 
          tc.testStartTime, 
          tc.testEndTime, 
          tc.Duration, 
          tc.TotalQuestions, 
          tc.totalMarks, 
          tc.calculator, 
        
          tc.instructionId
      FROM 
          test_creation_table AS tc 
      JOIN 
          course_creation_table AS ct ON ct.courseCreationId = tc.courseCreationId
      WHERE 
          tc.courseCreationId = ?`,
      [courseCreationId]
    );

    console.log('courseCreationId:', courseCreationId);
    
    res.json(rows);
  } catch (error) {
    console.error('Error executing MySQL query:', error);
    res.status(500).json({ error: error.message }); // Send error message as response
  }
});

router.get("/feachingOveralltest/:courseCreationId/:user_Id", async (req, res) => {
  const { courseCreationId, user_Id } = req.params;
  try {
    // Log the parameters
    console.log('courseCreationId and user_Id:', courseCreationId, user_Id);

    // Construct and log the query
    const query = `
    SELECT DISTINCT 
    tpt.typeOfTestId, 
    tpt.typeOfTestName, 
    cct.courseCreationId, 
    cct.courseName,
    tct.*,
    tas.test_status,
    sbc.user_Id,
    ses.test_end_time,
    p.Portale_Id,
    p.Portale_Name,
    tct.TestName
FROM 
    type_of_test tpt 
JOIN 
    course_typeoftests ctpt ON tpt.typeOfTestId = ctpt.typeOfTestId 
JOIN 
    course_creation_table cct ON ctpt.courseCreationId = cct.courseCreationId 
JOIN 
    test_creation_table tct ON cct.courseCreationId = tct.courseCreationId 
JOIN
    student_buy_courses sbc ON sbc.courseCreationId = cct.courseCreationId
LEFT JOIN
    test_attempt_status tas ON tas.testCreationTableId = tct.testCreationTableId AND tas.user_Id = sbc.user_Id
LEFT JOIN
    student_exam_summery ses ON ses.testCreationTableId = tct.testCreationTableId AND ses.user_Id = sbc.user_Id
LEFT JOIN 
    portales AS p ON p.Portale_Id = cct.Portale_Id
WHERE 
    cct.courseCreationId = ?
    AND tct.testCreationTableId IN (
        SELECT testCreationTableId 
        FROM test_creation_table 
        WHERE courseCreationId = cct.courseCreationId 
        AND courseTypeOfTestId = tpt.typeOfTestId
    )
    AND sbc.user_Id = ?
    AND tct.status = 'active';


    `;
    console.log('Query:', query);

    // Fetch exams from the database
    const [rows] = await db.query(query, [courseCreationId, user_Id]); // Reordered the parameters here
    console.log(rows)
    res.json(rows);
  } catch (error) {
    console.error('Error executing MySQL query:', error);
    res.status(500).json({ error: error.message }); // Send error message as response
  }



  }
);
// router.get("/feachingOveralltest/:CourseData_Id/:user_Id", async (req, res) => {
//   const { CourseData_Id, user_Id } = req.params;
//   console.log('CourseData_Id and user_Id:', CourseData_Id, user_Id); // Check if you receive the correct IDs

//   try {
//     const query = `
    //   SELECT DISTINCT
    //   cct.*,
    //   cd.*,
    //   oc.*,
    //   sbc.user_Id,
    //   tct.*,
    //   ol.*,
    //   ses.test_end_time,
    //   ctpt.*,
    //   tpt.typeOfTestId,
    //   tpt.typeOfTestName,
    //   tas.test_status,
    //   tp.Test_pattern_name
    // FROM
    //   course_data cd
    // LEFT JOIN course_creation_table cct ON
    //   cd.courseCreationId = cct.courseCreationId
    // LEFT JOIN ovl_course oc ON
    //   oc.OVL_Course_Id = cd.OVL_Course_Id
    // LEFT JOIN student_buy_courses sbc ON
    //   sbc.CourseData_Id = cd.CourseData_Id
    // LEFT JOIN test_creation_table tct ON
    //   cct.courseCreationId = tct.courseCreationId AND tct.status = 'active'
    // LEFT JOIN ovl_links ol ON
    //   oc.OVL_Course_Id = ol.OVL_Course_Id
    // LEFT JOIN student_exam_summery ses ON
    //   ses.testCreationTableId = tct.testCreationTableId AND ses.user_Id = sbc.user_Id
    // LEFT JOIN course_typeoftests ctpt ON
    //   ctpt.courseCreationId = tct.courseCreationId
    // LEFT JOIN type_of_test tpt ON
    //   tpt.typeOfTestId = ctpt.typeOfTestId
    // LEFT JOIN test_pattern tp ON tct.Test_Pattern_Id=tp.Test_Pattern_Id
    // LEFT JOIN test_attempt_status tas ON
    //   tas.testCreationTableId = tct.testCreationTableId AND tas.user_Id = sbc.user_Id
    // WHERE
    //   cd.CourseData_Id = ?
    //   AND tct.testCreationTableId IN (
    //     SELECT testCreationTableId 
    //     FROM test_creation_table 
    //     WHERE courseCreationId = cct.courseCreationId 
    //     AND courseTypeOfTestId = tpt.typeOfTestId
    //   )
    //   AND sbc.user_Id = ? AND tct.status = 'active';
//     `;
    
//     const [rows] = await db.query(query, [CourseData_Id, user_Id]); 
//     console.log(rows);
//     res.json(rows);
//   } catch (error) {
//     console.error('Error executing MySQL query:', error);
//     res.status(500).json({ error: error.message }); // Send error message as response
//   }
// });



router.get("/feachingtypeoftest", async (req, res) => {
  try {
    // Fetch type_of_test data from the database
    const [typeOfTestRows] = await db.query("SELECT * FROM type_of_test");
    res.json(typeOfTestRows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});







router.get("/testAttemptStatus/:user_Id/:courseCreationId/:testCreationTableId", async (req, res) => {
  const { user_Id, testCreationTableId, courseCreationId } = req.params;
  try {
    // Fetch exams from the database
    const [rows] = await db.query(
      `SELECT * FROM test_attempt_status WHERE user_Id = ? AND testCreationTableId = ? AND courseCreationId = ?`,
      [user_Id, testCreationTableId, courseCreationId]
    );
 
    res.json(rows);
  } catch (error) {
    console.error('Error executing MySQL query:', error);
    res.status(500).json({ error: error.message }); // Send error message as response
  }
});

router.get("/feachingAttempted_TestDetails/:user_Id", async (req, res) => {
  const { user_Id } = req.params;
  try {
    // Fetch exams from the database
    const [rows] = await db.query(
      `SELECT DISTINCT 
      tpt.typeOfTestId, 
      tpt.typeOfTestName, 
      cct.courseCreationId, 
      tct.*,
      tas.test_status,
      u.user_Id,
      u.username,
      u.email,
      u.role,
      u.profile_image,
      u.studentregistationId,
      ses.test_end_time
FROM 
      type_of_test tpt 
  JOIN 
      course_typeoftests ctpt ON tpt.typeOfTestId = ctpt.typeOfTestId 
  JOIN 
      course_creation_table cct ON ctpt.courseCreationId = cct.courseCreationId 
  JOIN 
      test_creation_table tct ON cct.courseCreationId = tct.courseCreationId 
  LEFT JOIN
      test_attempt_status tas ON tas.testCreationTableId = tct.testCreationTableId
  LEFT JOIN
      log u ON tas.user_Id = u.user_Id
  LEFT JOIN
      student_exam_summery ses ON tct.testCreationTableId = ses.testCreationTableId AND u.user_Id = ses.user_Id
WHERE 
      tct.testCreationTableId IN (
          SELECT testCreationTableId 
          FROM test_creation_table 
          WHERE courseCreationId = cct.courseCreationId 
          AND courseTypeOfTestId = tpt.typeOfTestId
      )
      AND tas.test_status = 'Completed'
      AND u.user_Id = ?; 

  
  
  `,
      [user_Id]
    );
 
    console.log('user_Id:', user_Id);
   
    res.json(rows);
  } catch (error) {
    console.error('Error executing MySQL query:', error);
    res.status(500).json({ error: error.message }); // Send error message as response
  }
});


module.exports = router;
