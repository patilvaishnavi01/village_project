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

// 🔍 Search API
app.get("/search", async (req, res) => {
    const q = req.query.q;

    if (!q) {
        return res.json([]);
    }

    try {
        const [rows] = await pool.query(
            `
      SELECT 
        village_name,
        subdistrict,
        district,
        state
      FROM villages
      WHERE village_name LIKE ?
      LIMIT 10
      `,
            [`%${q}%`]
        );

        res.json(rows);
    } catch (error) {
        console.error("DB ERROR:", error);
        res.status(500).json({ error: "Database error" });
    }
});

// 🚀 Start server (Railway uses dynamic port)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});