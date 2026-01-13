import express from "express";
const router = express.Router();

import {
  createComplaint,
  getUserComplaints,
  updateComplaint,
  deleteComplaint,
  deleteOldComplaints,
} from "../controller/complain.controller.js";

router.post("/create", createComplaint);
router.get("/get/:userId", getUserComplaints);
router.put("/update/:complaintId", updateComplaint);
router.delete("/delete/:complaintId", deleteComplaint);

router.delete("/cleanup/old", deleteOldComplaints);

export default router;
