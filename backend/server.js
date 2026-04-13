import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check (IMPORTANT for Railway)
app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

app.get("/search", async (req, res) => {
    const q = req.query.q;

    if (!q) return res.json([]);

    try {
        const [rows] = await pool.query(
            `
      SELECT 
        v.village_name,
        sd.subdistrict_name,
        d.district_name,
        s.state_name
      FROM villages v
      JOIN subdistricts sd ON v.subdistrict_id = sd.id
      JOIN districts d ON sd.district_id = d.id
      JOIN states s ON d.state_id = s.id
      WHERE v.village_name LIKE ?
      LIMIT 10
      `,
            [`%${q}%`]
        );

        res.json(rows);
    } catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// 🚀 Start server (Railway uses dynamic port)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});