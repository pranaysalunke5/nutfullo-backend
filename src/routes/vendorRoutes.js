import express from "express";
import {
  createVendor,
  getVendors,
  updateVendor,
  deleteVendor,
} from "../controllers/vendorController.js";

// import { protect } from "../middleware/authMiddleware.js"; // optional

const router = express.Router();

// 👉 BASE: /api/vendors

router.route("/")
  .get(getVendors)        // GET all
  .post(createVendor);    // CREATE

router.route("/:id")
  .put(updateVendor)      // UPDATE
  .delete(deleteVendor);  // DELETE

export default router;