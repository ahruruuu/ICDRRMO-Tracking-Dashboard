const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');     
const upload = multer();              

const app = express();
app.use(cors());

// Allow JSON + URL Encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ambulance_db'
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database Connection Failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL (ambulance_db)");
});

// Save Form Data
app.post('/submit-form', upload.none(), (req, res) => {
  const { name, age, emergency, location, ambulance } = req.body;

  if (!name || !age || !emergency || !location || !ambulance) {
    return res.send("error: missing fields");
  }

  const sql = `
    INSERT INTO patients (name, age, emergency, location, ambulance)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, age, emergency, location, ambulance], (err) => {
    if (err) {
      console.error("❌ Insert Error:", err);
      return res.send("error");
    }

    console.log("✅ Data Inserted Successfully");
    res.send("success");
  });
});

// Fetch Data for Dashboards 2
app.get("/get-data/:ambulance", (req, res) => {
  const ambulance = req.params.ambulance;

  const sql = "SELECT * FROM patients WHERE ambulance = ? ORDER BY id DESC LIMIT 1";

  db.query(sql, [ambulance], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});



// Start Server
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
