import express from "express";
import {
  createNotification,
  privateCreateNotification,
  getNotificationsForUser,
  updateNotification,
  deleteNotification,
} from "../controller/notify.controller.js";

const router = express.Router();

router.post("/create", createNotification);
router.post("/private/create", privateCreateNotification);
router.get("/get_all", getNotificationsForUser);
router.put("/update/:notificationId", updateNotification);
router.delete("/delete/:notificationId", deleteNotification);

export default router;
