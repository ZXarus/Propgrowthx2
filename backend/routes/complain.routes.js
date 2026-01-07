import express from "express";
const router = express.Router();

import {
  createComplaint,
  getUserComplaints,
  updateComplaint,
  deleteComplaint,
} from "../controller/complain.controller.js";

router.post("/create", createComplaint);
router.get("/get/:propertyId", getUserComplaints);
router.put("/update/:complaintId", updateComplaint);
router.delete("/delete/:complaintId", deleteComplaint);

export default router;
