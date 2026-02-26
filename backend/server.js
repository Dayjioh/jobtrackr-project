import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./lib/db.js";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import applicationRoutes from "./routes/applications.route.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // port Vite par défaut
    credentials: true, // obligatoire pour envoyer les cookies
  }),
);
app.use(express.json());
app.use(cookieParser());

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
