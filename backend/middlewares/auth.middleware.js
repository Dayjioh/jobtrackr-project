import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    /*
     * L'accessToken vient maintenant du cookie
     * cookie-parser le rend disponible via req.cookies
     */
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No access token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = decoded;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("💥 Erreur :", error.name, error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;