import express from "express";
import {
  getAllProfiles,
  getProfile,
  getProfileById,
  login,
  logout,
  signup,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", authMiddleware, getProfile);
// router.get("/profile/:id", getProfileById);
// router.get("/profiles", authMiddleware, getAllProfiles);

export default router;
