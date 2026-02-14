import express from "express";
const router = express.Router();

import {
  createComplaint,
  getUserComplaints,
  updateComplaint,
  deleteComplaint,
  deleteOldComplaints,
} from "../controller/complain.controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";

router.post("/create/:pid/:tid", createComplaint);

router.get("/getComplainByuserId/:role", verifyToken, getUserComplaints);
router.put("/update/:complaintId", updateComplaint);
router.delete("/delete/:complaintId", deleteComplaint);

router.delete("/cleanup/old", deleteOldComplaints);

export default router;
