import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import applicationRoutes from "./routes/applications.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

pool.query("SELECT NOW()", (err, res) => {
  // console.log(res);
  const date = new Date(res.rows[0].now).toLocaleString("fr-FR"); // "21/02/2026, 02:01:14"

  console.log(`Database connected : ${date} ✅`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 👌`);
});
