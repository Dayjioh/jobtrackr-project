import { redis } from "../lib/redis.js";

/*
 * Stocke le refreshToken dans Redis avec expiration 7 jours
 * préfixe jobtracker: pour éviter les conflits avec d'autres projets dans Upstash
 */
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `jobtracker:refreshToken:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60 // 7 jours en secondes
  );
};

/*
 * Récupère le refreshToken depuis Redis
 */
const getRefreshToken = async (userId) => {
  return await redis.get(`jobtracker:refreshToken:${userId}`);
};

/*
 * Supprime le refreshToken de Redis au logout
 */
const deleteRefreshToken = async (userId) => {
  await redis.del(`jobtracker:refreshToken:${userId}`);
};

export { storeRefreshToken, getRefreshToken, deleteRefreshToken };