const express=require('express');
const router=express.Router();
const db=require('../DataBase/db2');
router.get('/getThemesClasses', async(req,res)=>{
    const sql='SELECT * FROM themes_table';
    try {
    const [rows,fields]=await db.query(sql);
    console.log(rows,"rows and fields ")
    res.json(rows)
    }catch (error){
        console.log("error while fetching the themes",error)
      res.status(500).json({ error: "Error while fetching themes" });
    }
})

router.post('/postThemeFromAdmin', async (req, res) => {
  try {
    // Delete the previous theme
    const delSql = 'DELETE FROM current_theme_table';
    await db.query(delSql);

    // Insert the new theme
    const sql = 'INSERT INTO current_theme_table VALUES (?, ?)';
    const { sNo, theme } = req.body;
    console.log(sNo, theme);
    const [result, fields] = await db.query(sql, [sNo, theme]);
    console.log(result, "this is the result");
    res.json(result);
  } catch (error) {
    console.log("Error while executing the query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get('/themeSelectedByAdmin',async(req,res)=>{
 
 try {
  const sql='SELECT * FROM current_theme_table';
  const[result,fields]=await db.query(sql);
  console.log("response",result)
  res.json(result)
 } catch (error) {
  console.log(error,"error in try catch block");
 } 

})

module.exports=router;