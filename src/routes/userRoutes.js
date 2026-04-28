import express from "express";
import {
  createUser,
  getAllUsersWithStats,
  updateUser,
  deleteUser,
  getSalesUsersWithOnboards,
  getOnboardsByUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", createUser);
router.get("/all", getAllUsersWithStats);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

router.get("/sales", getSalesUsersWithOnboards);
router.get("/sales/:id", getOnboardsByUser);

export default router;