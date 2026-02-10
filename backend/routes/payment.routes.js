import express from "express";
import {
  getPayments,
  createPayment,
  updatePayment,
  getPaymentsById,
} from "../controller/payment.controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";
const router = express.Router();

router.get("/get", getPayments);
router.get("/getbyId/", verifyToken, getPaymentsById);
router.post("/create", createPayment);
router.put("/update/:id", updatePayment);

export default router;
