const express = require("express");
const router = express.Router();
const db= require("../DataBase/db2");


router.get("/fetchinstructions/:testCreationTableId", async (req, res) => {
    const { testCreationTableId } = req.params;
    try {
      // Fetch instructions from the database based on testCreationTableId
      const [instructionsRows] = await db.query(
        "SELECT tc.testCreationTableId,it.instructionHeading, ipt.points, it.instructionId, ipt.id FROM test_creation_table tc JOIN instruction it ON tc.instructionId = it.instructionId JOIN instructions_points ipt ON it.instructionId = ipt.instructionId  WHERE tc.testCreationTableId = ?;",
        [testCreationTableId]
      );
      res.json(instructionsRows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  

module.exports = router;