require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("API running 🚀");
});

app.get("/search", async (req, res) => {
    const q = req.query.q;

    if (!q) return res.json([]);

    try {
        const [rows] = await db.query(
            `SELECT 
      v.village_name,
      sd.subdistrict_name,
      d.district_name,
      s.state_name
    FROM villages v
   JOIN subdistricts sd ON v.subdistrict_code = sd.subdistrict_code
   JOIN districts d ON sd.district_code = d.district_code
   JOIN states s ON d.state_code = s.state_code
   WHERE LOWER(village_name) LIKE LOWER(?)
   LIMIT 10`,
            [`%${q}%`]
        );


        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.listen(5000, () => {
    console.log("🚀 Server running on port 5000");
});