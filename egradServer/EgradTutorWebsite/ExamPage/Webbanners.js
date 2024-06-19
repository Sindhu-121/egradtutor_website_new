const express = require('express');
const router = express.Router();
const pool = require('../../DataBase/db2');  // Import the connection pool
const multer = require('multer');

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.get('/webdesigns', async (req, res) => {
  try {
      const [rows] = await pool.query('SELECT design_Id, design FROM webdesigns');
      res.json(rows);
  } catch (error) {
      console.error('Error fetching design data:', error);
      res.status(500).send('Internal Server Error');
  }
});


router.post('/uploadbanner', upload.single('banner'), async (req, res) => {
  const { designId, EntranceExams_Id, Branch_Id } = req.body;

  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const banner = req.file.buffer;

  // Set EntranceExams_Id or Branch_Id to 0 if not provided
  const entranceExamsId = EntranceExams_Id || 0;
  const branchId = Branch_Id || 0;

  try {
    const connection = await pool.getConnection();
    let result;

    if (designId == 1) {
      [result] = await connection.execute(
        'INSERT INTO websvgbanners (banner, EntranceExams_Id, Branch_Id) VALUES (?, ?, ?)',
        [banner, entranceExamsId, branchId]
      );
    } else if (designId == 2) {
      [result] = await connection.execute(
        'INSERT INTO web_posters (web_poster_data, EntranceExams_Id, Branch_Id) VALUES (?, ?, ?)',
        [banner, entranceExamsId, branchId]
      );
    } else {
      connection.release();
      return res.status(400).json({ error: 'Invalid design ID' });
    }

    connection.release(); // Release the connection back to the pool

    res.status(200).json({ message: 'Banner uploaded successfully', id: result.insertId });
  } catch (error) {
    console.error('Error uploading banner:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/fetchbanners/:EntranceExams_Id', async (req, res) => {
  const { EntranceExams_Id } = req.params;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT *, display_order FROM websvgbanners WHERE EntranceExams_Id = ?',
      [EntranceExams_Id]
    );
    connection.release();  // Release the connection back to the pool

    if (rows.length > 0) {
      const banners = rows.map(row => ({
        ...row,
        banner: row.banner.toString('base64'), // Convert banner buffer to base64 string
      }));
      res.status(200).json(banners);
    } else {
      res.status(404).json({ message: 'No banners found for this EntranceExams_Id' });
    }
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Endpoint to update display order
router.put('/updateBannerStatus', async (req, res) => {
  const { bannerId, entranceExamId, bannerStatus } = req.body;

  try {
    const connection = await pool.getConnection();
    let result;

    // Update banner status in database
    const query = `UPDATE websvgbanners 
                   SET banner_status = ? 
                   WHERE banner_Id = ? AND EntranceExams_Id = ?`;

    [result] = await connection.execute(query, [bannerStatus, bannerId, entranceExamId]);

    connection.release(); // Release the connection back to the pool

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating banner status:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


router.put('/updateBannerOrder/:EntranceExams_Id/:banner_Id', async (req, res) => {
  const { display_order } = req.body;
  const { EntranceExams_Id, banner_Id } = req.params;
console.log("EntranceExams_Id:",EntranceExams_Id)
console.log("banner_Id:",banner_Id)
console.log("display_order:",display_order)


  try {
    const connection = await pool.getConnection();
    
    // Update the display order in the database
    const [result] = await connection.execute(
      'UPDATE websvgbanners SET display_order = ? WHERE banner_Id = ? AND EntranceExams_Id = ?',
      [display_order, banner_Id, EntranceExams_Id]
    );

    connection.release(); // Release the connection back to the pool

    res.status(200).json({ message: 'Display order updated successfully' });
  } catch (error) {
    console.error('Error updating display order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/fetchingbanners/:Branch_Id', async (req, res) => {
  const { Branch_Id } = req.params;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM websvgbanners WHERE Branch_Id = ?',
      [Branch_Id]
    );
    connection.release();  // Release the connection back to the pool

    if (rows.length > 0) {
      const banners = rows.map(row => ({
        ...row,
        banner: row.banner.toString('base64'), // Convert banner buffer to base64 string
      }));
      res.status(200).json(banners);
    } else {
      res.status(404).json({ message: 'No banners found for this EntranceExams_Id' });
    }
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/fetchposters', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT web_poster_id, web_poster_data FROM web_posters');
    connection.release();  

    const posters = rows.map(row => ({
      web_poster_id: row.web_poster_id,
      web_poster_data: row.web_poster_data.toString('base64')
    }));

    res.status(200).json(posters);
  } catch (error) {
    console.error('Error fetching posters:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/updatebanner/:selectedBannerId/:EntranceExams_Id', async (req, res) => {
  console.log('Endpoint hit with params:', req.params); // This log should appear
  const { selectedBannerId, EntranceExams_Id } = req.params;
  const { banner } = req.body;

  if (!banner) {
    return res.status(400).json({ error: 'No banner data provided' });
  }

  const bannerBuffer = Buffer.from(banner, 'base64');

  try {
    const connection = await pool.getConnection();
    const query = 'UPDATE websvgbanners SET banner = ? WHERE banner_Id = ? AND EntranceExams_Id = ?';
    console.log('Executing SQL query:', query);
    await connection.execute(query, [bannerBuffer, selectedBannerId, EntranceExams_Id]);
    connection.release();  // Release the connection back to the pool

    console.log('Banner updated successfully');
    res.status(200).json({ message: 'Banner updated successfully' });
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/updatebanner/:selectedBannerId/:Branch_Id', async (req, res) => {
  console.log('Endpoint hit with params:', req.params); // This log should appear
  const { selectedBannerId, Branch_Id } = req.params;
  const { banner } = req.body;

  if (!banner) {
    return res.status(400).json({ error: 'No banner data provided' });
  }

  const bannerBuffer = Buffer.from(banner, 'base64');

  try {
    const connection = await pool.getConnection();
    const query = 'UPDATE websvgbanners SET banner = ? WHERE banner_Id = ? AND Branch_Id = ?';
    console.log('Executing SQL query:', query);
    await connection.execute(query, [bannerBuffer, selectedBannerId, Branch_Id]);
    connection.release();  // Release the connection back to the pool

    console.log('Banner updated successfully');
    res.status(200).json({ message: 'Banner updated successfully' });
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


  router.put('/updateposters/:id', async (req, res) => {
    const { id } = req.params;
    const { posters } = req.body;
  
    if (!posters) {
      return res.status(400).json({ error: 'No posters data provided' });
    }
  
    const posterBuffer = Buffer.from(posters, 'base64'); // Use `posters` from req.body
  
    try {
      const connection = await pool.getConnection();
      await connection.execute(
        'UPDATE web_posters SET web_poster_data = ? WHERE web_poster_id = ?',
        [posterBuffer, id]
      );
      connection.release();  // Release the connection back to the pool
  
      res.status(200).json({ message: 'Poster updated successfully' });
    } catch (error) {
      console.error('Error updating poster:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


module.exports = router;
