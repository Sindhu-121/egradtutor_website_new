const express = require('express');
const router = express.Router();
const db = require('../DataBase/db2');


  router.get('/exam/count', async (req, res) => {
    try {
      const [results, fields] = await db.execute(
        'SELECT examName, COUNT(*) AS count FROM exams'
      );
      res.json(results);
    } catch (error) {
      console.error('Error fetching exam count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.get('/exam', async (req, res) => {
    try {
      const [results, fields] = await db.execute(
        'SELECT examName FROM exams ORDER BY examName'
      );
      res.json(results);
    } catch (error) {
      console.error('Error fetching exam names:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


  router.get('/courses/count', async (req, res) => {
    try {
      const [results, fields] = await db.execute(
        'SELECT COUNT(courseCreationId) AS count FROM course_creation_table'
      );
      res.json(results);
    } catch (error) {
      console.error('Error fetching course count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.get('/course', async (req, res) => {
    try {
      const [results, fields] = await db.execute(
        'SELECT courseName FROM course_creation_table ORDER BY courseName'
      );
      res.json(results);
    } catch (error) {
      console.error('Error fetching Courses:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  router.get('/test/count', async (req, res) => {
    try {
      const [results, fields] = await db.execute(
        'SELECT COUNT(testCreationTableId) AS count FROM test_creation_table'
      );
      res.json(results);
    } catch (error) {
      console.error('Error fetching test count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  router.get('/videos/count', async (req, res) => {
    try {
      const [results, fields] = await db.execute(
        'SELECT COUNT(OVL_Linke_Id) AS count FROM ovl_links'
      );
      res.json(results);
    } catch (error) {
      console.error('Error fetching videos count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.get('/Test', async (req, res) => {
    try {
      const [results, fields] = await db.execute(
        'SELECT TestName FROM test_creation_table ORDER BY  TestName '
      );
      res.json(results);
    } catch (error) {
      console.error('Error fetching test:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/user/count', async (req, res) => {
    try {
      const [results, fields] = await db.execute(
        "SELECT COUNT(user_Id) AS count FROM log WHERE role = 'viewer'"
      );
      res.json(results);
    } catch (error) {
      console.error('Error fetching course count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.get('/question/count', async (req, res) => {
    try {
      const [results, fields] = await db.execute(
        'SELECT COUNT(question_id) AS count FROM questions'
      );
      res.json(results);
    } catch (error) {
      console.error('Error fetching course count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/AdminTestList', async (req, res) => {
    try {
      const [results, fields] = await db.execute(
        `
        SELECT tc.*, cc.courseName, 
        DATE_FORMAT(tc.testEndDate, '%d-%m-%y') AS formatted_EndDate, 
        DATE_FORMAT(tc.testEndTime, '%H:%i:%s') AS formatted_EndTime, 
        DATE_FORMAT(tc.testStartDate, '%d-%m-%y') AS formatted_StartDate, 
        DATE_FORMAT(tc.testStartTime, '%H:%i:%s') AS formatted_StartTime
        FROM test_creation_table tc
        JOIN course_creation_table cc ON tc.courseCreationId = cc.courseCreationId;
      `
      );
      res.json(results);
    } catch (error) {
      console.error('Error fetching test list:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//   @desc Get Test by ID from Admin
  // router.get("/AdminDcUsermarks/:userId/:testCreationTableId", async (req, res) => {
  //   const testCreationTableId = req.params.testCreationTableId;
  //   const userId = req.params.userId;
  //   console.log("ids:", userId, testCreationTableId);
  //   try {
  //     const [usermarks] = await db.query(
  //       `
  //       SELECT
  //     sm.user_Id,
  //     sm.testCreationTableId,
  //     tc.totalMarks,
  //     SUM(CASE WHEN sm.status = 1 THEN sm.std_marks ELSE 0 END) AS sumStatus1,
  //     SUM(CASE WHEN sm.status = 0 THEN sm.std_marks ELSE 0 END) AS sumStatus0
  // FROM
  //     student_marks sm
  // JOIN
  //     test_creation_table tc ON sm.testCreationTableId = tc.testCreationTableId
  // WHERE
  //     sm.testCreationTableId = ? AND sm.user_Id = ?
  // GROUP BY
  //     sm.user_Id, sm.testCreationTableId, tc.totalMarks;
  
  //       `,
  //       [testCreationTableId, userId]
  //     );
  
  //     if (usermarks.length > 0) {
  //       const totalDifference = usermarks[0].sumStatus1 - usermarks[0].sumStatus0;
  //       const percentage = (
  //         (totalDifference / usermarks[0].totalMarks) *
  //         100
  //       ).toFixed(2);
  
  //       res.json({ usermarks, totalDifference, percentage });
  //     } else {
  //       res.json({ message: "No data available." });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // });


// router.get("/AdminDcUsermarks/:testCreationTableId", async (req, res) => {
//   const testCreationTableId = req.params.testCreationTableId;
//   console.log("testCreationTableId:", testCreationTableId);
//   try {
//     const [usermarks] = await db.query(
//       `
//       SELECT
//           sm.user_Id,
//           sm.testCreationTableId,
//           tc.totalMarks,
//           cct.courseName,
//           l.username,
//           tc.*,
//           SUM(CASE WHEN sm.status = 1 THEN sm.std_marks ELSE 0 END) AS sumStatus1,
//           SUM(CASE WHEN sm.status = 0 THEN sm.std_marks ELSE 0 END) AS sumStatus0
//       FROM
//           student_marks sm
//       JOIN
//           test_creation_table tc ON sm.testCreationTableId = tc.testCreationTableId
//           JOIN
//           course_creation_table cct ON tc.courseCreationId = cct.courseCreationId
//           JOIN
//           log l ON sm.user_Id = l.user_Id
//       WHERE
//           sm.testCreationTableId = ?
//       GROUP BY
//           sm.user_Id, sm.testCreationTableId, tc.totalMarks;
//       `,
//       [testCreationTableId]
//     );

//     if (usermarks.length > 0) {
//       // Calculate the sum of sumStatus1
//       const sumStatus1Sum = usermarks.reduce((total, currentUser) => total + parseInt(currentUser.sumStatus1), 0); // Parse sumStatus1 as integer

//       // Calculate the average of sumStatus1
//       const averageSumStatus1 = (sumStatus1Sum / usermarks.length).toFixed(2);

//       // Find the user with maximum percentage
//       let maxPercentageUser = usermarks.reduce((maxUser, currentUser) => {
//         const totalDifference = parseInt(currentUser.sumStatus1) - parseInt(currentUser.sumStatus0); // Parse sumStatus1 and sumStatus0 as integers
//         const percentage = (totalDifference / currentUser.totalMarks) * 100;
//         return percentage > maxUser.percentage ? { user: currentUser, percentage } : maxUser;
//       }, { user: null, percentage: -Infinity }).user;

//       const totalDifference = parseInt(maxPercentageUser.sumStatus1) - parseInt(maxPercentageUser.sumStatus0); // Parse sumStatus1 and sumStatus0 as integers
//       const percentage = ((totalDifference / maxPercentageUser.totalMarks) * 100).toFixed(2);

//       const attemptedUsersCount = usermarks.length;

//       res.json({ usermarks, maxPercentageUser, totalDifference, percentage, attemptedUsersCount, averageSumStatus1 });
//     } else {
//       res.json({ message: "No data available." });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// router.get("/AdminDcUsermarks/:testCreationTableId", async (req, res) => {
//   const testCreationTableId = req.params.testCreationTableId;
//   console.log("testCreationTableId:", testCreationTableId);
//   try {
//     const [usermarks] = await db.query(
//       `
//       SELECT
//           sm.user_Id,
//           sm.testCreationTableId,
//           tc.totalMarks,
//           cct.courseName,
//           l.username,
//           tc.*,
//           SUM(CASE WHEN sm.status = 1 THEN sm.std_marks ELSE 0 END) AS sumStatus1,
//           SUM(CASE WHEN sm.status = 0 THEN sm.std_marks ELSE 0 END) AS sumStatus0
//       FROM
//           student_marks sm
//       JOIN
//           test_creation_table tc ON sm.testCreationTableId = tc.testCreationTableId
//           JOIN
//           course_creation_table cct ON tc.courseCreationId = cct.courseCreationId
//           JOIN
//           log l ON sm.user_Id = l.user_Id
//       WHERE
//           sm.testCreationTableId = ?
//       GROUP BY
//           sm.user_Id, sm.testCreationTableId, tc.totalMarks;
//       `,
//       [testCreationTableId]
//     );

//     if (usermarks.length > 0) {
//       // Calculate the sum of sumStatus1
//       const sumStatus1Sum = usermarks.reduce((total, currentUser) => total + parseInt(currentUser.sumStatus1), 0); // Parse sumStatus1 as integer

//       // Calculate the average of sumStatus1
//       const averageSumStatus1 = (sumStatus1Sum / usermarks.length).toFixed(2);

//       // Find the user with maximum percentage
//       let maxPercentageUser = usermarks.reduce((maxUser, currentUser) => {
//         const totalDifference = parseInt(currentUser.sumStatus1) - parseInt(currentUser.sumStatus0); // Parse sumStatus1 and sumStatus0 as integers
//         const percentage = (totalDifference / currentUser.totalMarks) * 100;
//         return percentage > maxUser.percentage ? { user: currentUser, percentage } : maxUser;
//       }, { user: null, percentage: -Infinity }).user;

//       const totalDifference = parseInt(maxPercentageUser.sumStatus1) - parseInt(maxPercentageUser.sumStatus0); // Parse sumStatus1 and sumStatus0 as integers
//       const percentage = ((totalDifference / maxPercentageUser.totalMarks) * 100).toFixed(2);

//       const attemptedUsersCount = usermarks.length;

//       // Now add the query for question-wise statistics
//       const [questionStats] = await db.query(
//         `
//         SELECT
//             q.question_id AS 'Q.No',
//             COUNT(DISTINCT tas.user_Id) AS 'TotalParticipants',
//             SUM(CASE WHEN sm.status = 1 THEN 1 ELSE 0 END) AS 'CorrectedBy',
//             SUM(CASE WHEN sm.status = 0 THEN 1 ELSE 0 END) AS 'In-correctedBy',
//             SUM(CASE WHEN sm.status IS NULL THEN 1 ELSE 0 END) AS 'Un-attemptedBy',
//             0 AS 'UnseenBy' -- Assuming you don't have a table for unseenquestions
//         FROM
//             test_attempt_status tas
//         JOIN
//             test_creation_table tct ON tas.testCreationTableId = tct.testCreationTableId
//         JOIN
//             questions q ON tct.testCreationTableId = q.testCreationTableId
//         LEFT JOIN
//             student_marks sm ON tas.user_Id = sm.user_Id 
//                               AND q.question_id = sm.question_id
//                               AND tas.testCreationTableId = sm.testCreationTableId -- Added condition
//         WHERE
//             tas.testCreationTableId = ?
//         GROUP BY
//             q.question_id;
//         `,
//         [testCreationTableId]
//       );

//       res.json({ usermarks, maxPercentageUser, totalDifference, percentage, attemptedUsersCount, averageSumStatus1, questionStats });
//     } else {
//       res.json({ message: "No data available." });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// router.get("/AdminDcUsermarks/:testCreationTableId", async (req, res) => {
//   const testCreationTableId = req.params.testCreationTableId;
//   console.log("testCreationTableId:", testCreationTableId);
//   try {
//     const [usermarks] = await db.query(
//       `
//       SELECT
//           sm.user_Id,
//           sm.testCreationTableId,
//           tc.totalMarks,
//           cct.courseName,
//           l.username,
//           tc.*,
//           SUM(CASE WHEN sm.status = 1 THEN sm.std_marks ELSE 0 END) AS sumStatus1,
//           SUM(CASE WHEN sm.status = 0 THEN sm.std_marks ELSE 0 END) AS sumStatus0
//       FROM
//           student_marks sm
//       JOIN
//           test_creation_table tc ON sm.testCreationTableId = tc.testCreationTableId
//           JOIN
//           course_creation_table cct ON tc.courseCreationId = cct.courseCreationId
//           JOIN
//           log l ON sm.user_Id = l.user_Id
//       WHERE
//           sm.testCreationTableId = ?
//       GROUP BY
//           sm.user_Id, sm.testCreationTableId, tc.totalMarks;
//       `,
//       [testCreationTableId]
//     );

//     if (usermarks.length > 0) {
//       // Calculate the sum of sumStatus1
//       const sumStatus1Sum = usermarks.reduce(
//         (total, currentUser) => total + parseInt(currentUser.sumStatus1),
//         0
//       ); // Parse sumStatus1 as integer

//       // Calculate the average of sumStatus1
//       const averageSumStatus1 = (sumStatus1Sum / usermarks.length).toFixed(2);

//       // Find the user with maximum percentage
//       let maxPercentageUser = usermarks.reduce(
//         (maxUser, currentUser) => {
//           const totalDifference =
//             parseInt(currentUser.sumStatus1) - parseInt(currentUser.sumStatus0); // Parse sumStatus1 and sumStatus0 as integers
//           const percentage = (totalDifference / currentUser.totalMarks) * 100;
//           return percentage > maxUser.percentage
//             ? { user: currentUser, percentage }
//             : maxUser;
//         },
//         { user: null, percentage: -Infinity }
//       ).user;

//       const totalDifference =
//         parseInt(maxPercentageUser.sumStatus1) -
//         parseInt(maxPercentageUser.sumStatus0); // Parse sumStatus1 and sumStatus0 as integers
//       const percentage = (
//         (totalDifference / maxPercentageUser.totalMarks) *
//         100
//       ).toFixed(2);

//       const attemptedUsersCount = usermarks.length;

//       // Now add the query for question-wise statistics
//       const [questionStats] = await db.query(
//         `
//         SELECT
//             q.question_id AS 'Q.No',
//             COUNT(DISTINCT tas.user_Id) AS 'TotalParticipants',
//             SUM(CASE WHEN sm.status = 1 THEN 1 ELSE 0 END) AS 'CorrectedBy',
//             SUM(CASE WHEN sm.status = 0 THEN 1 ELSE 0 END) AS 'In-correctedBy',
//             SUM(CASE WHEN sm.status IS NULL THEN 1 ELSE 0 END) AS 'Un-attemptedBy',
//             0 AS 'UnseenBy' -- Assuming you don't have a table for unseenquestions
//         FROM
//             test_attempt_status tas
//         JOIN
//             test_creation_table tct ON tas.testCreationTableId = tct.testCreationTableId
//         JOIN
//             questions q ON tct.testCreationTableId = q.testCreationTableId
//         LEFT JOIN
//             student_marks sm ON tas.user_Id = sm.user_Id 
//                               AND q.question_id = sm.question_id
//                               AND tas.testCreationTableId = sm.testCreationTableId -- Added condition
//         WHERE
//             tas.testCreationTableId = ?
//         GROUP BY
//             q.question_id;
//         `,
//         [testCreationTableId]
//       );

//       const userStats = usermarks.map((user) => {
//         const totalDifference =
//           parseInt(user.sumStatus1) - parseInt(user.sumStatus0); // Parse sumStatus1 and sumStatus0 as integers
//         const percentage = ((totalDifference / user.totalMarks) * 100).toFixed(
//           2
//         );
//         return { ...user, percentage }; // Add percentage to user object
//       });

//       // Additional query to get individual user marks and percentage
//       const [individualUserStats] = await db.query(
//         `
//         SELECT
//             user_Id,
//             testCreationTableId,
//             SUM(CASE WHEN status = 1 THEN std_marks ELSE 0 END) AS totalMarks,
//             SUM(CASE WHEN status = 0 THEN std_marks ELSE 0 END) AS sumStatus0,
//             SUM(CASE WHEN status = 1 THEN std_marks ELSE 0 END) AS sumStatus1
//         FROM
//             student_marks
//         WHERE
//             testCreationTableId = ?
//         GROUP BY
//             user_Id, testCreationTableId;
//         `,
//         [testCreationTableId]
//       );

//       res.json({
//         usermarks,
//         maxPercentageUser,
//         totalDifference,
//         percentage,
//         attemptedUsersCount,
//         averageSumStatus1,
//         questionStats,
//         userStats,
//         individualUserStats, // Include individual user marks and percentage
//       });
//     } else {
//       res.json({ message: "No data available." });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// router.get("/AdminDcUsermarks/:testCreationTableId", async (req, res) => {
//   const testCreationTableId = req.params.testCreationTableId;
//   console.log("testCreationTableId:", testCreationTableId);
//   try {
//     const [usermarks] = await db.query(
//       `
//       SELECT
//           sm.user_Id,
//           sm.testCreationTableId,
//           tc.totalMarks,
//           cct.courseName,
//           l.username,
//           tc.*,
//           SUM(CASE WHEN sm.status = 1 THEN sm.std_marks ELSE 0 END) AS sumStatus1,
//           SUM(CASE WHEN sm.status = 0 THEN sm.std_marks ELSE 0 END) AS sumStatus0
//       FROM
//           student_marks sm
//       JOIN
//           test_creation_table tc ON sm.testCreationTableId = tc.testCreationTableId
//           JOIN
//           course_creation_table cct ON tc.courseCreationId = cct.courseCreationId
//           JOIN
//           log l ON sm.user_Id = l.user_Id
//       WHERE
//           sm.testCreationTableId = ?
//       GROUP BY
//           sm.user_Id, sm.testCreationTableId, tc.totalMarks;
//       `,
//       [testCreationTableId]
//     );

//     const [usermarks3] = await db.query(
//       `
//       SELECT
//           sm.user_Id,
//           sm.testCreationTableId,
//           tc.totalMarks,
//           l.username,
//           tlst.time_left,
//           SUM(CASE WHEN sm.status = 1 THEN 1 ELSE 0 END) AS correct_count,
//           SUM(CASE WHEN sm.status = 0 THEN 1 ELSE 0 END) AS incorrect_count
//       FROM
//           student_marks sm
//           JOIN test_creation_table tc ON sm.testCreationTableId = tc.testCreationTableId
//           JOIN course_creation_table cct ON tc.courseCreationId = cct.courseCreationId
//           JOIN log l ON sm.user_Id = l.user_Id
//           JOIN (
//               SELECT
//                   MAX(time_left_id) AS max_id,
//                   testCreationTableId,
//                   user_Id
//               FROM
//                   time_left_submission_of_test
//               GROUP BY
//                   testCreationTableId,
//                   user_Id
//           ) max_ids ON sm.testCreationTableId = max_ids.testCreationTableId
//                       AND sm.user_Id = max_ids.user_Id
//           JOIN time_left_submission_of_test tlst ON max_ids.max_id = tlst.time_left_id
//       WHERE
//           sm.testCreationTableId = ?
//       GROUP BY
//           sm.user_Id,
//           sm.testCreationTableId,
//           tc.totalMarks,
//           l.username,
//           tlst.time_left;
//     `,
//       [testCreationTableId]
//     );


//     if (usermarks.length > 0) {
//       // Calculate the sum of sumStatus1
//       const sumStatus1Sum = usermarks.reduce(
//         (total, currentUser) => total + parseInt(currentUser.sumStatus1),
//         0
//       ); // Parse sumStatus1 as integer

//       // Calculate the average of sumStatus1
//       const averageSumStatus1 = (sumStatus1Sum / usermarks.length).toFixed(2);

//       // Find the user with maximum percentage
//       let maxPercentageUser = usermarks.reduce(
//         (maxUser, currentUser) => {
//           const totalDifference =
//             parseInt(currentUser.sumStatus1) - parseInt(currentUser.sumStatus0); // Parse sumStatus1 and sumStatus0 as integers
//           const percentage = (totalDifference / currentUser.totalMarks) * 100;
//           return percentage > maxUser.percentage
//             ? { user: currentUser, percentage }
//             : maxUser;
//         },
//         { user: null, percentage: -Infinity }
//       ).user;

//       const totalDifference =
//         parseInt(maxPercentageUser.sumStatus1) -
//         parseInt(maxPercentageUser.sumStatus0); // Parse sumStatus1 and sumStatus0 as integers
//       let percentage = (
//         (totalDifference / maxPercentageUser.totalMarks) *
//         100
//       ).toFixed(2);
//       percentage = percentage < 0 ? 0 : percentage; // Set percentage to 0 if it's negative

//       const attemptedUsersCount = usermarks.length;

//       // Now add the query for question-wise statistics
//       const [questionStats] = await db.query(
//         `
//         SELECT
//             q.question_id AS 'Q.No',
//             COUNT(DISTINCT tas.user_Id) AS 'TotalParticipants',
//             SUM(CASE WHEN sm.status = 1 THEN 1 ELSE 0 END) AS 'CorrectedBy',
//             SUM(CASE WHEN sm.status = 0 THEN 1 ELSE 0 END) AS 'In-correctedBy',
//             SUM(CASE WHEN sm.status IS NULL THEN 1 ELSE 0 END) AS 'Un-attemptedBy',
//             0 AS 'UnseenBy' -- Assuming you don't have a table for unseenquestions
//         FROM
//             test_attempt_status tas
//         JOIN
//             test_creation_table tct ON tas.testCreationTableId = tct.testCreationTableId
//         JOIN
//             questions q ON tct.testCreationTableId = q.testCreationTableId
//         LEFT JOIN
//             student_marks sm ON tas.user_Id = sm.user_Id 
//                               AND q.question_id = sm.question_id
//                               AND tas.testCreationTableId = sm.testCreationTableId -- Added condition
//         WHERE
//             tas.testCreationTableId = ?
//         GROUP BY
//             q.question_id;
//         `,
//         [testCreationTableId]
//       );

//       const userStats = usermarks.map((user) => {
//         const totalDifference =
//           parseInt(user.sumStatus1) - parseInt(user.sumStatus0); // Parse sumStatus1 and sumStatus0 as integers
//         let percentage = ((totalDifference / user.totalMarks) * 100).toFixed(2);
//         percentage = percentage < 0 ? 0 : percentage; // Set percentage to 0 if it's negative
//         return { ...user, percentage }; // Add percentage to user object
//       });

//       res.json({
//         usermarks,
//         maxPercentageUser,
//         totalDifference,
//         percentage,
//         attemptedUsersCount,
//         averageSumStatus1,
//         questionStats,
//         userStats,
//         usermarks3,
       
//       });
//     } else {
//       res.json({ message: "No data available." });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// router.get("/AdminDcUsermarks/:testCreationTableId", async (req, res) => {
//   const testCreationTableId = req.params.testCreationTableId;
//   console.log("testCreationTableId:", testCreationTableId);
//   try {
//     const [usermarks] = await db.query(`
//       SELECT
//           sm.user_Id,
//           sm.testCreationTableId,
//           tc.totalMarks,
//           cct.courseName,
//           l.username,
//           tc.*,
//           SUM(CASE WHEN sm.status = 1 THEN sm.std_marks ELSE 0 END) AS sumStatus1,
//           SUM(CASE WHEN sm.status = 0 THEN sm.std_marks ELSE 0 END) AS sumStatus0
//       FROM
//           student_marks sm
//       JOIN
//           test_creation_table tc ON sm.testCreationTableId = tc.testCreationTableId
//       JOIN
//           course_creation_table cct ON tc.courseCreationId = cct.courseCreationId
//       JOIN
//           log l ON sm.user_Id = l.user_Id
//       WHERE
//           sm.testCreationTableId = ?
//       GROUP BY
//           sm.user_Id, sm.testCreationTableId, tc.totalMarks;
//     `, [testCreationTableId]);

//     const [usermarks3] = await db.query(`
//       SELECT
//           sm.user_Id,
//           sm.testCreationTableId,
//           tc.totalMarks,
//           l.username,
//           tlst.time_left,
//           SUM(CASE WHEN sm.status = 1 THEN 1 ELSE 0 END) AS correct_count,
//           SUM(CASE WHEN sm.status = 0 THEN 1 ELSE 0 END) AS incorrect_count,
//           (SUM(CASE WHEN sm.status = 1 THEN 1 ELSE 0 END) - SUM(CASE WHEN sm.status = 0 THEN 1 ELSE 0 END)) AS net_marks
//       FROM
//           student_marks sm
//           JOIN test_creation_table tc ON sm.testCreationTableId = tc.testCreationTableId
//           JOIN course_creation_table cct ON tc.courseCreationId = cct.courseCreationId
//           JOIN log l ON sm.user_Id = l.user_Id
//           JOIN (
//               SELECT
//                   MAX(time_left_id) AS max_id,
//                   testCreationTableId,
//                   user_Id
//               FROM
//                   time_left_submission_of_test
//               GROUP BY
//                   testCreationTableId,
//                   user_Id
//           ) max_ids ON sm.testCreationTableId = max_ids.testCreationTableId
//                       AND sm.user_Id = max_ids.user_Id
//           JOIN time_left_submission_of_test tlst ON max_ids.max_id = tlst.time_left_id
//       WHERE
//           sm.testCreationTableId = ?
//       GROUP BY
//           sm.user_Id,
//           sm.testCreationTableId,
//           tc.totalMarks,
//           l.username,
//           tlst.time_left;
//     `, [testCreationTableId]);

//     if (usermarks.length > 0) {
//       // Calculate the sum of sumStatus1
//       const sumStatus1Sum = usermarks.reduce(
//         (total, currentUser) => total + parseInt(currentUser.sumStatus1),
//         0
//       ); // Parse sumStatus1 as integer

//       // Calculate the average of sumStatus1
//       const averageSumStatus1 = (sumStatus1Sum / usermarks.length).toFixed(2);

//       // Find the user with maximum percentage
//       let maxPercentageUser = usermarks.reduce(
//         (maxUser, currentUser) => {
//           const totalDifference =
//             parseInt(currentUser.sumStatus1) - parseInt(currentUser.sumStatus0); // Parse sumStatus1 and sumStatus0 as integers
//           const percentage = (totalDifference / currentUser.totalMarks) * 100;
//           return percentage > maxUser.percentage
//             ? { user: currentUser, percentage }
//             : maxUser;
//         },
//         { user: null, percentage: -Infinity }
//       ).user;

//       const totalDifference =
//         parseInt(maxPercentageUser.sumStatus1) -
//         parseInt(maxPercentageUser.sumStatus0); // Parse sumStatus1 and sumStatus0 as integers
//       let percentage = (
//         (totalDifference / maxPercentageUser.totalMarks) *
//         100
//       ).toFixed(2);
//       percentage = percentage < 0 ? 0 : percentage; // Set percentage to 0 if it's negative

//       const attemptedUsersCount = usermarks.length;

//       // Now add the query for question-wise statistics
//       const [questionStats] = await db.query(`
//         SELECT
//             q.question_id AS 'Q.No',
//             COUNT(DISTINCT tas.user_Id) AS 'TotalParticipants',
//             SUM(CASE WHEN sm.status = 1 THEN 1 ELSE 0 END) AS 'CorrectedBy',
//             SUM(CASE WHEN sm.status = 0 THEN 1 ELSE 0 END) AS 'In-correctedBy',
//             SUM(CASE WHEN sm.status IS NULL THEN 1 ELSE 0 END) AS 'Un-attemptedBy',
//             0 AS 'UnseenBy' -- Assuming you don't have a table for unseenquestions
//         FROM
//             test_attempt_status tas
//         JOIN
//             test_creation_table tct ON tas.testCreationTableId = tct.testCreationTableId
//         JOIN
//             questions q ON tct.testCreationTableId = q.testCreationTableId
//         LEFT JOIN
//             student_marks sm ON tas.user_Id = sm.user_Id 
//                               AND q.question_id = sm.question_id
//                               AND tas.testCreationTableId = sm.testCreationTableId -- Added condition
//         WHERE
//             tas.testCreationTableId = ?
//         GROUP BY
//             q.question_id;
//       `, [testCreationTableId]);

//       const userStats = usermarks.map((user) => {
//         const totalDifference =
//           parseInt(user.sumStatus1) - parseInt(user.sumStatus0); // Parse sumStatus1 and sumStatus0 as integers
//         let percentage = ((totalDifference / user.totalMarks) * 100).toFixed(2);
//         percentage = percentage < 0 ? 0 : percentage; // Set percentage to 0 if it's negative
//         return { ...user, percentage }; // Add percentage to user object
//       });

//       // const usermarks3Stats = usermarks3.map(user => {
//       //   const netMarks = user.correct_count - user.incorrect_count;
//       //   return { ...user, netMarks };
//       // });
//     //   const usermarks3Stats = usermarks3.map(user => {
//     //     const netMarks = user.correct_marks - user.incorrect_marks;
//     //     return { ...user, netMarks };
//     // });
//     const usermarks3Stats = usermarks3.map(user => {
//       const netMarks = (user.correct_count * 4) - user.incorrect_count;
//       return { ...user, netMarks };
//     });

//       res.json({
//         usermarks,
//         maxPercentageUser,
//         totalDifference,
//         percentage,
//         attemptedUsersCount,
//         averageSumStatus1,
//         questionStats,
//         userStats,
//         usermarks3: usermarks3Stats,
//       });
//     } else {
//       res.json({ message: "No data available." });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.get("/AdminDcUsermarks/:testCreationTableId", async (req, res) => {
  const testCreationTableId = req.params.testCreationTableId;
  console.log("testCreationTableId:", testCreationTableId);
  try {
    const [usermarks] = await db.query(
      `
      SELECT
          sm.user_Id,
          sm.testCreationTableId,
          tc.totalMarks,
          cct.courseName,
          l.username,
          tc.*,
          SUM(CASE WHEN sm.status = 1 THEN sm.std_marks ELSE 0 END) AS sumStatus1,
          SUM(CASE WHEN sm.status = 0 THEN sm.std_marks ELSE 0 END) AS sumStatus0
      FROM
          student_marks sm
      JOIN
          test_creation_table tc ON sm.testCreationTableId = tc.testCreationTableId
          JOIN
          course_creation_table cct ON tc.courseCreationId = cct.courseCreationId
          JOIN
          log l ON sm.user_Id = l.user_Id
      WHERE
          sm.testCreationTableId = ?
      GROUP BY
          sm.user_Id, sm.testCreationTableId, tc.totalMarks;
      `,
      [testCreationTableId]
    );

    const [usermarks3] = await db.query(
      `
      SELECT
      sm.user_Id,
      sm.testCreationTableId,
      tc.totalMarks,
      l.username,
      tlst.time_left,
      SUM(CASE WHEN sm.status = 1 THEN 1 ELSE 0 END) AS correct_count,
      SUM(CASE WHEN sm.status = 0 THEN 1 ELSE 0 END) AS incorrect_count,
      (SUM(CASE WHEN sm.status = 1 THEN 1 ELSE 0 END) - SUM(CASE WHEN sm.status = 0 THEN 1 ELSE 0 END)) AS net_marks,
      SUM(CASE WHEN sm.std_marks = 4 THEN 4 ELSE 0 END) AS correct_marks,
      SUM(CASE WHEN sm.std_marks = 1 THEN 1 ELSE 0 END) AS incorrect_marks,
      (SUM(CASE WHEN sm.std_marks = 4 THEN 4 ELSE 0 END) - SUM(CASE WHEN sm.std_marks = 1 THEN 1 ELSE 0 END)) AS total_marks
  FROM
      student_marks sm
      JOIN test_creation_table tc ON sm.testCreationTableId = tc.testCreationTableId
      JOIN log l ON sm.user_Id = l.user_Id
      JOIN (
          SELECT
              MAX(time_left_id) AS max_id,
              testCreationTableId,
              user_Id
          FROM
              time_left_submission_of_test
          GROUP BY
              testCreationTableId,
              user_Id
      ) max_ids ON sm.testCreationTableId = max_ids.testCreationTableId
                  AND sm.user_Id = max_ids.user_Id
      JOIN time_left_submission_of_test tlst ON max_ids.max_id = tlst.time_left_id
  WHERE
      sm.testCreationTableId = ?
  GROUP BY
      sm.user_Id,
      sm.testCreationTableId,
      tc.totalMarks,
      l.username,
      tlst.time_left;
  
    `,
      [testCreationTableId]
    );


    if (usermarks.length > 0) {
      // Calculate the sum of sumStatus1
      const sumStatus1Sum = usermarks.reduce(
        (total, currentUser) => total + parseInt(currentUser.sumStatus1),
        0
      ); // Parse sumStatus1 as integer

      // Calculate the average of sumStatus1
      const averageSumStatus1 = (sumStatus1Sum / usermarks.length).toFixed(2);

      // Find the user with maximum percentage
      let maxPercentageUser = usermarks.reduce(
        (maxUser, currentUser) => {
          const totalDifference =
            parseInt(currentUser.sumStatus1) - parseInt(currentUser.sumStatus0); // Parse sumStatus1 and sumStatus0 as integers
          const percentage = (totalDifference / currentUser.totalMarks) * 100;
          return percentage > maxUser.percentage
            ? { user: currentUser, percentage }
            : maxUser;
        },
        { user: null, percentage: -Infinity }
      ).user;

      const totalDifference =
        parseInt(maxPercentageUser.sumStatus1) -
        parseInt(maxPercentageUser.sumStatus0); // Parse sumStatus1 and sumStatus0 as integers
      let percentage = (
        (totalDifference / maxPercentageUser.totalMarks) *
        100
      ).toFixed(2);
      percentage = percentage < 0 ? 0 : percentage; // Set percentage to 0 if it's negative

      const attemptedUsersCount = usermarks.length;

      // Now add the query for question-wise statistics
      const [questionStats] = await db.query(
        `
        SELECT
            q.question_id AS 'Q.No',
            COUNT(DISTINCT tas.user_Id) AS 'TotalParticipants',
            SUM(CASE WHEN sm.status = 1 THEN 1 ELSE 0 END) AS 'CorrectedBy',
            SUM(CASE WHEN sm.status = 0 THEN 1 ELSE 0 END) AS 'In-correctedBy',
            SUM(CASE WHEN sm.status IS NULL THEN 1 ELSE 0 END) AS 'Un-attemptedBy',
            0 AS 'UnseenBy' -- Assuming you don't have a table for unseenquestions
        FROM
            test_attempt_status tas
        JOIN
            test_creation_table tct ON tas.testCreationTableId = tct.testCreationTableId
        JOIN
            questions q ON tct.testCreationTableId = q.testCreationTableId
        LEFT JOIN
            student_marks sm ON tas.user_Id = sm.user_Id 
                              AND q.question_id = sm.question_id
                              AND tas.testCreationTableId = sm.testCreationTableId -- Added condition
        WHERE
            tas.testCreationTableId = ?
        GROUP BY
            q.question_id;
        `,
        [testCreationTableId]
      );

      const userStats = usermarks.map((user) => {
        const totalDifference =
          parseInt(user.sumStatus1) - parseInt(user.sumStatus0); // Parse sumStatus1 and sumStatus0 as integers
        let percentage = ((totalDifference / user.totalMarks) * 100).toFixed(2);
        percentage = percentage < 0 ? 0 : percentage; // Set percentage to 0 if it's negative
        return { ...user, percentage }; // Add percentage to user object
      });

      res.json({
        usermarks,
        maxPercentageUser,
        totalDifference,
        percentage,
        attemptedUsersCount,
        averageSumStatus1,
        questionStats,
        userStats,
        usermarks3,
       
      });
    } else {
      res.json({ message: "No data available." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




  module.exports = router;