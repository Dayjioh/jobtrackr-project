import { Pool } from "pg";

// Pool → gestion des connexions

//SELECT NOW() → test connexion

// res.rows → contient les données résultat SQL

const pool = new Pool({
  user: "jobtrackr_user",
  host: "localhost",
  database: "jobtrackr",
  password: "root",
  port: 5432,
});

export default pool;
