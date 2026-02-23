import pool from "../lib/db.js";

const createApplication = async (req, res) => {
  try {
    const { company, position, status } = req.body;

    if (!company || !position) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newApplication = await pool.query(
      `INSERT INTO applications (company, position, status, user_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [company, position, status || "applied", req.userId],
    );

    res.status(201).json({
      message: "Application created successfully",
      application: newApplication.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const applications = await pool.query(
      "SELECT * FROM applications WHERE user_id = $1 ORDER BY applied_at DESC",
      [req.userId],
    );

    res.json(applications.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateApplication = async (req, res) => {
  try {
    const { company, position, status } = req.body;
    const { id } = req.params;

    // Vérifier les champs obligatoires
    if (!company || !position) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // UPDATE sécurisé
    const updatedApp = await pool.query(
      `UPDATE applications
       SET company = $1, position = $2, status = $3
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [company, position, status || "applied", id, req.userId],
    );

    if (updatedApp.rows.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(updatedApp.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedApp = await pool.query(
      `DELETE FROM applications
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, req.userId],
    );

    if (deletedApp.rows.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({
      message: "Application deleted",
      application: deletedApp.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { createApplication, getAllApplications, updateApplication, deleteApplication };
