import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // 1. Est-ce que le middleware est bien appelé ?
    console.log("🔵 authMiddleware called");

    // 2. Que contient l'intégralité des headers ?
    console.log("📦 Headers reçus :", req.headers);

    const authHeader = req.headers.authorization;
    console.log("🔑 Authorization header :", authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];
    console.log("🪙 Token extrait :", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token décodé :", decoded);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.log("💥 Erreur :", error.name, error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
