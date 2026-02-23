import express from "express";
import {
  createApplication,
  deleteApplication,
  getAllApplications,
  updateApplication,
} from "../controllers/applications.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createApplication);
router.get("/", authMiddleware, getAllApplications);
router.put("/:id", authMiddleware, updateApplication);
router.delete("/:id", authMiddleware, deleteApplication);

export default router;
