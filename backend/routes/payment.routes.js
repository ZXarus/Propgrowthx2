import express from "express";
import {
  getPayments,
  createPayment,
  updatePayment,
  getPaymentsById,
} from "../controller/payment.controller.js";

const router = express.Router();

router.get("/get", getPayments);
router.get("/get/:id", getPaymentsById);
router.post("/create", createPayment);
router.put("/update/:id", updatePayment);

export default router;
