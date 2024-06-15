const express = require("express");
const router = express.Router();
const db= require("../DataBase/db2");

router.get('/TestActivation/:testCreationTableId', async (req, res) => {
    const { testCreationTableId } = req.params;
  
    // Fetch subjects
    try {
      const [rows] = await db.query(`SELECT
      t.testCreationTableId,
      t.TestName,
      t.TotalQuestions,
      s.subjectId,
      s.subjectName,
      sc.sectionId,
      sc.sectionName,
      sc.noOfQuestions,
      subquery2.numberOfQuestionsInSection,
      subquery.numberOfQuestionsInSubject,
      MAX(ts.status) AS status
  FROM
      test_creation_table AS t
  LEFT JOIN course_subjects AS cs ON t.courseCreationId = cs.courseCreationId
  LEFT JOIN subjects AS s ON s.subjectId = cs.subjectId
  LEFT JOIN sections AS sc ON t.testCreationTableId = sc.testCreationTableId AND sc.subjectId = s.subjectId
  LEFT JOIN test_states AS ts ON t.testCreationTableId = ts.testCreationTableId
  LEFT JOIN (
      SELECT
          q.testCreationTableId,
          q.subjectId,
          COUNT(q.question_id) AS numberOfQuestionsInSubject
      FROM
          questions AS q
      GROUP BY
          q.testCreationTableId,
          q.subjectId
  ) AS subquery ON t.testCreationTableId = subquery.testCreationTableId AND s.subjectId = subquery.subjectId
  LEFT JOIN (
      SELECT
          q.testCreationTableId,
          q.sectionId,
          COUNT(q.question_id) AS numberOfQuestionsInSection
      FROM
          questions AS q
      GROUP BY
          q.testCreationTableId,
          q.sectionId
  ) AS subquery2 ON t.testCreationTableId = subquery2.testCreationTableId AND sc.sectionId = subquery2.sectionId
  GROUP BY
      t.testCreationTableId,
      t.TestName,
      t.TotalQuestions,
      s.subjectId,
      s.subjectName,
      sc.sectionId,
      sc.sectionName,
      sc.noOfQuestions,
      subquery.numberOfQuestionsInSubject,
      subquery2.numberOfQuestionsInSection;
  `, [testCreationTableId]);
  
      // Initialize the tests array
      const tests = [];
  
      // Process the rows and organize the data
      rows.forEach(row => {
        const existingTest = tests.find(test => test.testCreationTableId === row.testCreationTableId);
        if (existingTest) {
          // Test already exists, add subject and section to existing test
          const existingSubject = existingTest.subjects.find(subject => subject.subjectId === row.subjectId);
          if (existingSubject) {
            // Subject already exists, add section to existing subject
            existingSubject.sections.push({
              status:row.status,
              sectionId: row.sectionId,
              sectionName: row.sectionName,
              numberOfQuestionsInSection:row.numberOfQuestionsInSection,
              numberOfQuestions: row.noOfQuestions,
            });
          } else {
            // Subject does not exist, create a new subject
            existingTest.subjects.push({
              status:row.status,
              subjectId: row.subjectId,
              subjectName: row.subjectName,
              numberOfQuestionsInSubject:row.numberOfQuestionsInSubject,
              sections: [{
                sectionId: row.sectionId,
                sectionName: row.sectionName,
                numberOfQuestionsInSection:row.numberOfQuestionsInSection,
                numberOfQuestions: row.noOfQuestions,
              }],
            });
          }
        } else {
          // Test does not exist, create a new test with subject and section
          tests.push({
            status:row.status,
            testCreationTableId: row.testCreationTableId,
            TestName: row.TestName,
            TotalQuestions: row.TotalQuestions,
            subjects: [{
              subjectId: row.subjectId,
              subjectName: row.subjectName,
              numberOfQuestionsInSubject:row.numberOfQuestionsInSubject,
              sections: [{
                sectionId: row.sectionId,
                sectionName: row.sectionName,
                numberOfQuestionsInSection:row.numberOfQuestionsInSection,
                numberOfQuestions: row.noOfQuestions,
              }],
            }],
          });
        }
      });
  
      res.json(tests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  // Add a new endpoint for updating test activation status
  router.post('/updateTestActivationStatus/:testCreationTableId', async (req, res) => {
    const { testCreationTableId } = req.params;
    const { status } = req.body;
  
    try {
      // Assuming you have a 'test_states' table with columns 'teststatesId', 'status', and 'testCreationTableId'
      await db.query('INSERT INTO test_states (status, testCreationTableId) VALUES (?, ?) ON DUPLICATE KEY UPDATE status = ?', [status, testCreationTableId, status]);
  
      res.json({ success: true, message: 'Activation state updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });






module.exports = router;