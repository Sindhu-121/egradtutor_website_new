const express= require('express')
const router=express.Router();
const db=require('../../DataBase/db2')


router.get('/unPurchasedCoursesOnHomePage/:Portale_Id',async(req,res)=>{
    const { Portale_Id } = req.params; 
    const query=`SELECT
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
    p.Portale_Name,
    COUNT(DISTINCT tct.testCreationTableId) AS testCount,
    GROUP_CONCAT(s.subjectName) AS subjectNames,
    t.topicName
FROM
    course_creation_table cct
LEFT JOIN exams e ON
    e.examId = cct.examId
LEFT JOIN portales p ON
    p.Portale_Id = cct.Portale_Id
LEFT JOIN course_subjects cs ON
    cs.courseCreationId = cct.courseCreationId
LEFT JOIN subjects s ON
    cs.subjectId = s.subjectId 
LEFT JOIN test_creation_table tct ON
    tct.courseCreationId = cct.courseCreationId
LEFT JOIN topics t ON
    t.courseCreationId = cct.courseCreationId
WHERE
    cct.Portale_Id = ? 
GROUP BY
    cct.courseCreationId;
`

const [results, fields] = await db.execute(query, [Portale_Id]);
const organizedData = {};
results.forEach((result) => {
    const cardImage = result.cardImage ? `data:image/png;base64,${result.cardImage.toString("base64")}` : null;

    const courseId = result.courseCreationId;
    const Portale_Id = result.Portale_Id;

    // Define properties based on portalId
    const properties = {
      Portale_Id: Portale_Id,
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
      testCount: result.testCount,
      subjectNames: result.subjectNames,
      customName: Portale_Id === 4 ? "OTS,OVL,PQB" : null,
      ...(Portale_Id === 4 && { topicName: `(TopicName:${result.topicName})` }),
    };

  

    // Assign properties to organizedData
    organizedData[courseId] = properties;
  });
  res.json(Object.values(organizedData));


})

module.exports= router;