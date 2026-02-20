import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error", err);
  } else {
    console.log("Database connected:", res.rows[0]);
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
