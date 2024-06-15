const express = require("express");
const router = express.Router();
const db = require("../DataBase/db2");
// const dbHelper = require('../dbHelper');

const multer = require("multer");
const mammoth = require("mammoth");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs").promises;

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = "uploads/";
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    cb(null, Date.now() + path.extname(file.originalname));
    // cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.get("/tests", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT testCreationTableId, TestName FROM test_creation_table"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching test data:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/subjects/:testCreationTableId", async (req, res) => {
  const { testCreationTableId } = req.params;

  try {
    const [subjects] = await db.query(
      `
        SELECT s.subjectName,s.subjectId
        FROM test_creation_table tt
        INNER JOIN course_subjects AS cs ON tt.courseCreationId = cs.courseCreationId
        INNER JOIN subjects AS s ON cs.subjectId = s.subjectId
        WHERE tt.testCreationTableId = ?
      `,
      [testCreationTableId]
    );

    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).send("Error fetching subjects.");
  }
});

router.get("/sections/:subjectId/:testCreationTableId", async (req, res) => {
  const { subjectId, testCreationTableId } = req.params;
  try {
    const [
      rows,
    ] = await db.query(
      "SELECT s.sectionName, s.sectionId, s.testCreationTableId, s.subjectId FROM sections s JOIN test_creation_table tt ON s.testCreationTableId = tt.testCreationTableId WHERE s.subjectId = ? AND s.testCreationTableId = ?",
      [subjectId, testCreationTableId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching sections data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/upload", upload.single("document"), async (req, res) => {
  const docxFilePath = `uploads/${req.file.filename}`;
  const outputDir = `uploads/${req.file.originalname}`;
  const docName = `${req.file.originalname}`;
  try {
    await fs.mkdir(outputDir, { recursive: true });
    const result = await mammoth.convertToHtml({ path: docxFilePath });
    const htmlContent = result.value;
    const $ = cheerio.load(htmlContent);
    const textResult = await mammoth.extractRawText({ path: docxFilePath });
    const textContent = textResult.value;
    const textSections = textContent.split("\n\n");

    const [documentResult] = await db.query("INSERT INTO ots_document SET ?", {
      documen_name: docName,
      testCreationTableId: req.body.testCreationTableId,
      subjectId: req.body.subjectId,
      sectionId: req.body.sectionId,
    });
    const document_Id = documentResult.insertId;

    // Get all images in the order they appear in the HTML
    const images = [];
    $("img").each(function (i, element) {
      const base64Data = $(this)
        .attr("src")
        .replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Buffer.from(base64Data, "base64");
      images.push(imageBuffer);
    });

    let j = 0;
    let image_index = 0;
    let que_id = 0;
    let k = 1;
    console.log(textSections);
    const marksPattern = /\[Marks\](\d+),(\d+)/;
    let qtypeMappings = {
      MCQ4: 1,
      MCQ5: 2,
      MSQN: 3,
      MSQ: 4,
      NATI: 5,
      NATD: 6,
      TF: 7,
      CTQ: 8,
    };
    for (let i = 0; i < textSections.length; i++) {
      if (textSections[i].includes("[qtype]")) {
        const qtypeText = textSections[i].replace("[qtype]", "").trim();
        if (qtypeMappings.hasOwnProperty(qtypeText)) {
          const qtypeRecord = {
            qtype_text: textSections[i].replace("[qtype]", ""),
            question_id: que_id,
            quesionTypeId: qtypeMappings[qtypeText],
          };
          await insertRecord("qtype", qtypeRecord);
        }
        console.log();
      } else if (textSections[i].includes("[ans]")) {
        // Save in the answer table
        const answerRecord = {
          answer_text: textSections[i].replace("[ans]", ""),
          question_id: que_id,
        };
        await insertRecord("answer", answerRecord);
      } else {
        const match = textSections[i].match(marksPattern);
        if (match) {
          const marksText = match[1];
          const nMarksText = match[2];
          // Save in the marks table
          const marksRecord = {
            marks_text: marksText,
            nmarks_text: nMarksText,
            question_id: que_id,
          };
          await insertRecord("marks", marksRecord);
        } else if (textSections[i].includes("[sortid]")) {
          const sortidRecord = {
            sortid_text: textSections[i].replace("[sortid]", ""),
            question_id: que_id,
          };
          await insertRecord("sortid", sortidRecord);
        } else if (textSections[i].includes("[Q]")) {
          const imageName = `snapshot_${document_Id}_${req.body.subjectId}_question_${k}.png`;
          k++;
          const imagePath = `${outputDir}/${imageName}`;
          await fs.writeFile(imagePath, images[image_index]);
          image_index++;
          const questionRecord = {
            questionImgName: imageName,
            testCreationTableId: req.body.testCreationTableId,
            subjectId: req.body.subjectId,
            document_Id: document_Id,
            sectionId: req.body.sectionId,
          };
          que_id = await insertRecord("questions", questionRecord);
          // question_id.push(Question_id)
        } else if (textSections[i].includes("(a)")) {
          const imageName = `snapshot_${document_Id}_${req.body.subjectId}_option_a_${k}.png`;
          const imagePath = `${outputDir}/${imageName}`;
          await fs.writeFile(imagePath, images[image_index]);
          image_index++;
          const optionRecord = {
            optionImgName: imageName,
            option_index: "a",
            question_id: que_id,
          };
          await insertRecord("options", optionRecord);
        } else if (textSections[i].includes("(b)")) {
          const imageName = `snapshot_${document_Id}_${req.body.subjectId}_option_b_${k}.png`;
          const imagePath = `${outputDir}/${imageName}`;
          await fs.writeFile(imagePath, images[image_index]);
          image_index++;
          const optionRecord = {
            optionImgName: imageName,
            option_index: "b",
            question_id: que_id,
          };
          await insertRecord("options", optionRecord);
        } else if (textSections[i].includes("(c)")) {
          const imageName = `snapshot_${document_Id}_${req.body.subjectId}_option_c_${k}.png`;
          const imagePath = `${outputDir}/${imageName}`;
          await fs.writeFile(imagePath, images[image_index]);
          image_index++;
          const optionRecord = {
            optionImgName: imageName,
            option_index: "c",
            question_id: que_id,
          };
          await insertRecord("options", optionRecord);
        } else if (textSections[i].includes("(d)")) {
          const imageName = `snapshot_${document_Id}_${req.body.subjectId}_option_d_${k}.png`;
          const imagePath = `${outputDir}/${imageName}`;
          await fs.writeFile(imagePath, images[image_index]);
          image_index++;
          const optionRecord = {
            optionImgName: imageName,
            option_index: "d",
            question_id: que_id,
          };
          await insertRecord("options", optionRecord);
        } else if (textSections[i].includes("(e)")) {
          const imageName = `snapshot_${document_Id}_${req.body.subjectId}_option_d_${k}.png`;
          const imagePath = `${outputDir}/${imageName}`;
          await fs.writeFile(imagePath, images[image_index]);
          image_index++;
          const optionRecord = {
            optionImgName: imageName,
            option_index: "e",
            question_id: que_id,
          };
          await insertRecord("options", optionRecord);
        } else if (textSections[i].includes("[soln]")) {
          const imageName = `snapshot_${document_Id}_${req.body.subjectId}_solution_${k}.png`;
          const imagePath = `${outputDir}/${imageName}`;
          await fs.writeFile(imagePath, images[image_index]);
          image_index++;
          const solutionRecord = {
            solutionImgName: imageName,
            question_id: que_id,
          };
          await insertRecord("solution", solutionRecord);
        } else if (textSections[i].includes("[PRG]")) {
          const imageName = `snapshot_${document_Id}_${req.body.subjectId}_paragraph_${k}.png`;
          const imagePath = `${outputDir}/${imageName}`;
          await fs.writeFile(imagePath, images[image_index]);
          image_index++;
          const paragraphRecord = {
            paragraphImg: imageName,
            document_Id: document_Id,
          };
          paragraph_Id = await insertRecord("paragraph", paragraphRecord);
          // await insertRecord('paragraph', paragraphRecord);
        } else if (textSections[i].includes("[PQNo]")) {
          // Save in the marks table
          const paragraphqnoRecord = {
            paragraphQNo: textSections[i].replace("[PQNo]", ""),
            paragraph_Id: paragraph_Id,
            question_id: que_id,
          };
          await insertRecord("paragraphqno", paragraphqnoRecord);
        }
      }
    }
    res.send(
      "Text content and images extracted and saved to the database with the selected topic ID successfully."
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("Error extracting content and saving it to the database.");
  }
});
async function insertRecord(table, record) {
  try {
    const [result] = await db.query(`INSERT INTO ${table} SET ?`, record);
    console.log(`${table} id: ${result.insertId}`);
    return result.insertId;
  } catch (err) {
    console.error(`Error inserting data into ${table}: ${err}`);
    throw err;
  }
}

const imagesDirectory = path.join(__dirname, "uploads");
router.use("/uploads", express.static(imagesDirectory));

router.use(express.json());
router.use("/images", express.static(imagesDirectory));

router.get("/image-list", async (req, res) => {
  try {
    const files = await fs.readdir(imagesDirectory);
    console.log("Files in uploads directory:", files);
    const imageNames = files.filter((file) => file.endsWith(".png"));
    res.json(imageNames);
  } catch (error) {
    console.error("Error fetching image list:", error);
    res.status(500).send("Error fetching image list.");
  }
});

// router.post("/upload", upload.single("document"), async (req, res) => {
//   const docxFilePath = `uploads/${req.file.filename}`;
//   const outputDir = `uploads/${req.file.originalname}`;
//   const docName = `${req.file.originalname}`;
//   try {
//     await fs.mkdir(outputDir, { recursive: true });
//     const result = await mammoth.convertToHtml({ path: docxFilePath });
//     const htmlContent = result.value;
//     const $ = cheerio.load(htmlContent);
//     const textResult = await mammoth.extractRawText({ path: docxFilePath });
//     const textContent = textResult.value;
//     const textSections = textContent.split('\n\n');

//     const [documentResult] = await db.query("INSERT INTO ots_document SET ?", {
//       documen_name: docName,
//             testCreationTableId: req.body.testCreationTableId,
//             subjectId: req.body.subjectId,
//             sectionId:req.body.sectionId,
//           });
//           const document_Id = documentResult.insertId;

//     // Get all images in the order they appear in the HTML
//     const images = [];
//     $('img').each(function (i, element) {
//       const base64Data = $(this).attr('src').replace(/^data:image\/\w+;base64,/, '');
//       const imageBuffer = Buffer.from(base64Data, 'base64');
//       images.push(imageBuffer);
//     });

//     let j=0;let image_index=0;
//     let que_id=0;let k=1;
//     console.log(textSections);
//     let qtypeMappings = {
//       MCQ4: 1,
//       MCQ5: 2,
//       MSQN: 3,
//       MSQ: 4,
//       NATI:5,
//       NATD:6,
//       TF:7,
//       CTQ:8,
//               };
//     for (let i = 0; i < textSections.length; i++) {
//       if (textSections[i].includes('[qtype]')) {
//         const qtypeText = textSections[i].replace('[qtype]', '').trim();
//         if (qtypeMappings.hasOwnProperty(qtypeText)){
//           const qtypeRecord = {
//             qtype_text: textSections[i].replace('[qtype]', ''),
//             question_id: que_id,
//             quesionTypeId: qtypeMappings[qtypeText],
//           };
//           await insertRecord('qtype', qtypeRecord);
//         }
//         console.log()

//       } else if (textSections[i].includes('[ans]')) {
//         // Save in the answer table
//         const answerRecord = {
//           answer_text: textSections[i].replace('[ans]', ''),
//           question_id: que_id
//         };
//         await insertRecord('answer', answerRecord);
//       } else if (textSections[i].includes('[Marks]')) {
//         // Save in the marks table
//         const marksRecord = {
//           marks_text: textSections[i].replace('[Marks]', ''),
//           question_id: que_id
//         };
//         await insertRecord('marks', marksRecord);
//       }else if (textSections[i].includes('[sortid]')) {
//         const sortidRecord = {
//           sortid_text: textSections[i].replace('[sortid]', ''),
//           question_id: que_id
//         };
//         await insertRecord('sortid', sortidRecord);
//       }
//       else if (textSections[i].includes('[Q]')) {
//         const imageName = `snapshot_${document_Id}_${req.body.subjectId}_question_${k}.png`;k++;
//         const imagePath = `${outputDir}/${imageName}`;
//         await fs.writeFile(imagePath, images[image_index]);image_index++;
//         const questionRecord = {
//           questionImgName: imageName,
//           testCreationTableId: req.body.testCreationTableId,
//           subjectId: req.body.subjectId,
//           document_Id: document_Id,
//           sectionId: req.body.sectionId
//         };
//         que_id = await insertRecord('questions', questionRecord);
//         // question_id.push(Question_id)

//       }
//       else if (textSections[i].includes('(a)')) {
//         const imageName = `snapshot_${document_Id}_${req.body.subjectId}_option_a_${k}.png`;
//         const imagePath = `${outputDir}/${imageName}`;
//         await fs.writeFile(imagePath, images[image_index]);image_index++;
//         const optionRecord = {
//           optionImgName: imageName,
//           option_index:'a',
//           question_id: que_id
//         };
//         await insertRecord('options', optionRecord);

//       }else if (textSections[i].includes('(b)')) {
//         const imageName = `snapshot_${document_Id}_${req.body.subjectId}_option_b_${k}.png`;
//         const imagePath = `${outputDir}/${imageName}`;
//         await fs.writeFile(imagePath, images[image_index]);image_index++;
//         const optionRecord = {
//           optionImgName: imageName,
//           option_index:'b',
//           question_id: que_id
//         };
//         await insertRecord('options', optionRecord);

//       }else if (textSections[i].includes('(c)')) {
//         const imageName = `snapshot_${document_Id}_${req.body.subjectId}_option_c_${k}.png`;
//         const imagePath = `${outputDir}/${imageName}`;
//         await fs.writeFile(imagePath, images[image_index]);image_index++;
//         const optionRecord = {
//           optionImgName: imageName,
//           option_index:'c',
//           question_id: que_id
//         };
//         await insertRecord('options', optionRecord);

//       }else if (textSections[i].includes('(d)')) {
//         const imageName = `snapshot_${document_Id}_${req.body.subjectId}_option_d_${k}.png`;
//         const imagePath = `${outputDir}/${imageName}`;
//         await fs.writeFile(imagePath, images[image_index]);image_index++;
//         const optionRecord = {
//           optionImgName: imageName,
//           option_index:'d',
//           question_id: que_id
//         };
//         await insertRecord('options', optionRecord);

//       }else if (textSections[i].includes('(e)')) {
//         const imageName = `snapshot_${document_Id}_${req.body.subjectId}_option_d_${k}.png`;
//         const imagePath = `${outputDir}/${imageName}`;
//         await fs.writeFile(imagePath, images[image_index]);image_index++;
//         const optionRecord = {
//           optionImgName: imageName,
//           option_index:'e',
//           question_id: que_id
//         };
//         await insertRecord('options', optionRecord);

//       }else if (textSections[i].includes('[soln]')) {
//         const imageName = `snapshot_${document_Id}_${req.body.subjectId}_solution_${k}.png`;
//         const imagePath = `${outputDir}/${imageName}`;
//         await fs.writeFile(imagePath, images[image_index]);image_index++;
//         const solutionRecord = {
//           solutionImgName: imageName,
//           question_id: que_id
//         };
//         await insertRecord('solution', solutionRecord);

//       }

//     }

//     res.send('Text content and images extracted and saved to the database with the selected topic ID successfully.');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error extracting content and saving it to the database.');
//   }
// });
// async function insertRecord(table, record) {
//   try {
//     const [result] = await db.query(`INSERT INTO ${table} SET ?`, record);
//     console.log(`${table} id: ${result.insertId}`);
//     return result.insertId;
//   } catch (err) {
//     console.error(`Error inserting data into ${table}: ${err}`);
//     throw err;
//   }
// }

// const imagesDirectory = path.join(__dirname, 'uploads');
// router.use('/uploads', express.static(imagesDirectory));

// router.use(express.json());
// router.use('/images', express.static(imagesDirectory));

// router.get('/image-list', async (req, res) => {
//   try {
//     const files = await fs.readdir(imagesDirectory);
//     console.log('Files in uploads directory:', files);
//     const imageNames = files.filter(file => file.endsWith('.png'));
//     res.json(imageNames);
//   } catch (error) {
//     console.error('Error fetching image list:', error);
//     res.status(500).send('Error fetching image list.');
//   }
// });
// end -------------------

// doc name getting
router.get("/documentName", async (req, res) => {
  try {
    const query =
      "SELECT o.document_Id,o.documen_name,o.testCreationTableId,o.subjectId,o.sectionId ,tt.TestName,s.subjectName FROM ots_document AS o INNER JOIN test_creation_table AS tt ON o.testCreationTableId=tt.testCreationTableId INNER JOIN subjects AS s ON s.subjectId=o.subjectId ";
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// end ----------

router.get(
  "/fulldocimages/:testCreationTableId/:subjectId/:sectionId",
  async (req, res) => {
    const { testCreationTableId, subjectId, sectionId } = req.params;
    try {
      const [rows] = await db.query(
        `
 
      SELECT DISTINCT
      q.question_id, q.questionImgName,
      o.option_id, o.optionImgName, o.option_index,
      s.solution_id, s.solutionImgName,
      qt.qtypeId, qt.qtype_text,
      ans.answer_id, ans.answer_text, 
      m.markesId, m.marks_text,
      si.sort_id, si.sortid_text,
      doc.documen_name, doc.sectionId,
      doc.subjectId, doc.testCreationTableId,
      P.paragraphImg, p.paragraph_Id,
      pq.paragraphQNo_Id, pq.paragraphQNo
  FROM
      questions q
      LEFT OUTER JOIN options o ON q.question_id = o.question_id
      LEFT OUTER JOIN qtype qt ON q.question_id = qt.question_id
      LEFT OUTER JOIN answer ans ON q.question_id = ans.question_id
      LEFT OUTER JOIN marks m ON q.question_id = m.question_id
      LEFT OUTER JOIN sortid si ON q.question_id = si.question_id
      LEFT OUTER JOIN solution s ON q.question_id = s.solution_id
      LEFT OUTER JOIN paragraph p ON q.document_Id = p.document_Id
      LEFT OUTER JOIN paragraphqno pq ON p.paragraph_Id = pq.paragraph_Id AND q.question_id = pq.question_id
      LEFT OUTER JOIN ots_document doc ON q.document_Id = doc.document_Id  
  WHERE
      doc.testCreationTableId = ? AND doc.subjectId = ? AND doc.sectionId = ?
  ORDER BY q.question_id ASC;
 
 
 
      `,
        [testCreationTableId, subjectId, sectionId]
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
            const newQuestion = {
              question_id: row.question_id,
              questionImgName: row.questionImgName,
              documen_name: row.documen_name,
              options: [option],
              solution: {
                solution_id: row.solution_id,
                solutionImgName: row.solutionImgName,
              },
              qtype: {
                qtypeId: row.qtypeId,
                qtype_text: row.qtype_text,
              },
              answer: {
                answer_id: row.answer_id,
                answer_text: row.answer_text,
              },
              marks: {
                markesId: row.markesId,
                marks_text: row.marks_text,
              },
              sortid: {
                sort_id: row.sort_id,
                sortid_text: row.sortid_text,
              },
              paragraph: {},
              paragraphqno: {},
            };

            // Check if paragraphqno data exists for the question
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
        // Handle the case where no rows are returned (empty result set)
        res.status(404).json({ error: "No data found" });
      }
    } catch (error) {
      console.error("Error fetching question data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// router.get('/fulldocimages/:testCreationTableId/:subjectId/:sectionId', async (req, res) => {
//   const { testCreationTableId, subjectId, sectionId } = req.params;
//   try {
//     const [rows] = await db.query(`
//       SELECT
//         q.question_id, q.questionImgName,
//         o.option_id, o.optionImgName,o.option_index,
//         s.solution_id, s.solutionImgName,
//         qt.qtypeId,qt.qtype_text,
//         ans.answer_id,ans.answer_text,
//         m.markesId ,m.marks_text,
//         si.sort_id ,si.sortid_text,
//         doc.documen_name, doc.sectionId,
//         doc.subjectId, doc.testCreationTableId ,
//         P.paragraphImg,p.paragraph_Id
//       FROM
//         questions q
//         LEFT OUTER JOIN options o ON q.question_id = o.question_id
//         LEFT OUTER JOIN qtype qt ON q.question_id = qt.question_id
//         LEFT OUTER JOIN answer ans ON q.question_id = ans.question_id
//         LEFT OUTER JOIN marks m ON q.question_id = m.question_id
//         LEFT OUTER JOIN sortid si ON q.question_id = si.question_id
//         LEFT OUTER JOIN solution s ON q.question_id = s.question_id
//         LEFT OUTER JOIN paragraph p ON q.question_id = p.question_id
//         LEFT OUTER JOIN ots_document doc ON q.testCreationTableId = doc.testCreationTableId
//       WHERE
//         doc.testCreationTableId = ? AND doc.subjectId = ? AND doc.sectionId = ?;
//     `, [testCreationTableId, subjectId, sectionId]);

//     // Check if rows is not empty
//     if (rows.length > 0) {
//       const questionData = {
//         questions: [],
//       };

//       // Organize data into an array of questions
//       rows.forEach(row => {
//         const existingQuestion = questionData.questions.find(q => q.question_id === row.question_id);

//         if (existingQuestion) {
//           // Question already exists, add option to the existing question
//           existingQuestion.options.push({
//             option_id: row.option_id,
//             option_index:row.option_index,
//             optionImgName: row.optionImgName,
//           });
//         } else {
//           // Question doesn't exist, create a new question
//           const newQuestion = {
//             question_id: row.question_id,
//             questionImgName: row.questionImgName,
//             documen_name: row.documen_name,
//             options: [
//               {
//                 option_id: row.option_id,
//                 optionImgName: row.optionImgName,
//               },
//             ],
//             solution: {
//               solution_id: row.solution_id,
//               solutionImgName: row.solutionImgName,
//             },
//             qtype:{
//               qtypeId:row.qtypeId,
//               qtype_text:row.qtype_text,
//             },
//             answer:{
//               answer_id :row.answer_id ,
//               answer_text:row.answer_text,
//             },
//             marks:{
//               markesId:row.markesId,
//               marks_text:row.marks_text,
//             },
//             sortid:{
//               sort_id:row.sort_id,
//               sortid_text:row.sortid_text
//             },
//           };

//           questionData.questions.push(newQuestion);
//         }
//       });

//       res.json(questionData);
//     } else {
//       // Handle the case where no rows are returned (empty result set)
//       res.status(404).json({ error: 'No data found' });
//     }
//   } catch (error) {
//     console.error('Error fetching question data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

//doc delete
router.delete("/DocumentDelete/:document_Id", async (req, res) => {
  const document_Id = req.params.document_Id;

  try {
    await db.query(
      "DELETE questions, ots_document, options , solution,answer,marks,qtype  FROM ots_document LEFT JOIN questions ON questions.document_Id = ots_document.document_Id LEFT JOIN options ON options.question_id = questions.question_id LEFT JOIN solution ON solution.question_id = questions.question_id LEFT JOIN answer ON answer.question_id = questions.question_id LEFT JOIN marks ON marks.question_id = questions.question_id  LEFT JOIN qtype ON qtype.question_id = questions.question_id   WHERE ots_document.document_Id = ? ",
      [document_Id]
    );
    res.json({
      message: `course with ID ${document_Id} deleted from the database`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//  end for document section code ------------------------------------------/

module.exports = router;

// doc upload code -----------------
// router.post("/upload", upload.single("document"), async (req, res) => {
//   const docxFilePath = `uploads/${req.file.filename}`;
//   const outputDir = `uploads/${req.file.originalname}_images`;

//   const docName = `${req.file.originalname}`;
//   try {
//     await fs.mkdir(outputDir, { recursive: true });
//     const result = await mammoth.convertToHtml({ path: docxFilePath });
//     const htmlContent = result.value;
//     const $ = cheerio.load(htmlContent);
//     const textResult = await mammoth.extractRawText({ path: docxFilePath });
//     const textContent = textResult.value;
//     const textSections = textContent.split("\n\n");

//     // Insert documentName and get documentId
//     const [documentResult] = await db.query("INSERT INTO ots_document SET ?", {
//       documen_name: docName,
//       testCreationTableId: req.body.testCreationTableId,
//       subjectId: req.body.subjectId,
//     });
//     const document_Id = documentResult.insertId;

//     // Get all images in the order they routerear in the HTML
//     const images = [];
//     $("img").each(function (i, element) {
//       const base64Data = $(this)
//         .attr("src")
//         .replace(/^data:image\/\w+;base64,/, "");
//       const imageBuffer = Buffer.from(base64Data, "base64");
//       images.push(imageBuffer);
//     });

//     let j = 0;
//     let Question_id;
//     for (let i = 0; i < images.length; i++) {
//       if (j == 0) {
//         const questionRecord = {
//           question_img: images[i],
//           testCreationTableId: req.body.testCreationTableId,
//           sectionId: req.body.sectionId,
//           document_Id: document_Id,
//           subjectId: req.body.subjectId,
//         };
//         console.log(j);
//         Question_id = await insertRecord("questions", questionRecord);
//         j++;
//       } else if (j > 0 && j < 5) {
//         const optionRecord = {
//           option_img: images[i],
//           question_id: Question_id,
//         };
//         console.log(j);
//         await insertRecord("options", optionRecord);
//         j++;
//       } else if (j == 5) {
//         const solutionRecord = {
//           solution_img: images[i],
//           question_id: Question_id,
//         };
//         console.log(j);
//         await insertRecord("solution", solutionRecord);
//         j = 0;
//       }
//     }
//     res.send(
//       "Text content and images extracted and saved to the database with the selected topic ID successfully."
//     );
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .send("Error extracting content and saving it to the database.");
//   }
// });
