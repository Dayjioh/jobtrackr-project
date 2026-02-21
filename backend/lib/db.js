import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Pool → gestion des connexions

//SELECT NOW() → test connexion

// res.rows → contient les données résultat SQL

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export default pool;
