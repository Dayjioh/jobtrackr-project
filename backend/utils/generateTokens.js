import jwt from "jsonwebtoken";

/*
 * Génère un accessToken et un refreshToken
 * à partir de l'id de l'utilisateur
 */

/*
 * Génère un accessToken de courte durée (15min)
 * stocké dans Zustand côté frontend
 */
const generateAccessToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });

/*
 * Génère un refreshToken de longue durée (7j)
 * stocké dans Redis + cookie httpOnly
 */
const generateRefreshToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

export { generateAccessToken, generateRefreshToken };
