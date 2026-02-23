import pool from "../lib/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Vérifier si email existe déjà
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Vérifier si le mot de passe respecte les règles
    const passwordRules = [
      {
        rule: (p) => p.length >= 8,
        message: "Password must be at least 8 characters long",
      },
      {
        rule: (p) => /[A-Z]/.test(p),
        message: "Password must contain at least one uppercase letter",
      },
      {
        rule: (p) => /[a-z]/.test(p),
        message: "Password must contain at least one lowercase letter",
      },
      {
        rule: (p) => /[0-9]/.test(p),
        message: "Password must contain at least one number",
      },
      {
        rule: (p) => /[^a-zA-Z0-9]/.test(p),
        message: "Password must contain at least one special character",
      },
    ];

    const failedRule = passwordRules.find(({ rule }) => !rule(password));
    if (failedRule) {
      return res.status(400).json({ message: failedRule.message });
    }

    // Vérifie si l'email respecte la régle de format
    const emailRules = [
      {
        rule: (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e),
        message: "Email must be a valid address (ex: example@example.com)",
      },
    ];

    const failedEmailRule = emailRules.find(({ rule }) => !rule(email));
    if (failedEmailRule) {
      return res.status(400).json({ message: failedEmailRule.message });
    }

    // Insert user
    const newUser = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at",
      [email, hashedPassword],
    );

    res.status(201).json({
      message: "User created",
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Chercher user
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req, res) => {
  res.send("logout");
};

const getProfile = async (req, res) => {
  
  try {
    res.json({ userId: req.userId });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getAllProfiles = async (req, res) => {
  try {
    /*
     * pool.query() envoie une requête SQL à PostgreSQL
     * rows contient le tableau de résultats
     */
    const { rows } = await pool.query("SELECT id, email FROM users");

    if (rows.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({
      message: "Users fetched successfully",
      count: rows.length,
      users: rows,
    });
  } catch (error) {
    console.error("❌ getAllProfiles error :", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/*
 * getProfileById - Récupère un utilisateur par son id
 * Méthode : GET /api/auth/profiles/:id
 * req.params.id contient l'id passé dans l'URL
 */
const getProfileById = async (req, res) => {
  try {
    /*
     * On récupère l'id depuis les paramètres de l'URL
     * ex: /api/auth/profiles/1 → req.params.id = "1"
     */
    const { id } = req.params;

    /*
     * $1 est un paramètre sécurisé qui évite les injections SQL
     * il sera remplacé par la valeur de id
     * NE JAMAIS faire : `SELECT * FROM users WHERE id = ${id}` ← dangereux
     */
    const { rows } = await pool.query(
      "SELECT id, email FROM users WHERE id = $1",
      [id]
    );

    /*
     * rows[0] car on attend un seul utilisateur
     * si rows est vide, l'utilisateur n'existe pas
     */
    if (!rows[0]) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User fetched successfully",
      id: rows[0].id,
      email: rows[0].email
    });
  } catch (error) {
    console.error("❌ getProfileById error :", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { signup, login, logout, getProfile, getAllProfiles,getProfileById };
