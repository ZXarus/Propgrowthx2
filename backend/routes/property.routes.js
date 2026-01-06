import express from "express";
import {
  getPropertyById,
  createProperty,
  getAllPropertiesByOwner,
  updateProperty,
  getAll,
  buyProperty,
  getAllPropertiesByBuyer,
  createReview,
  getReviewsByProperty,
  createNotification,
  getAllNotifications,
  createComplaint,
  getUserComplaints,
} from "../controller/property.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
const router = express.Router();

router.get("/getById", getPropertyById); // for get one propty on  which he click
router.get("/get_all_prop_by_owner", getAllPropertiesByOwner); // get all propties
router.get("/get_all_prop_by_buyer", getAllPropertiesByBuyer); // get all propties
router.get("/get_all", getAll); // get all propties
router.post("/create", upload.array("images", 5), createProperty);
router.patch("/update/:id", updateProperty);
router.post("/buy", buyProperty);

router.post("/reviews/create", createReview);
router.get("/reviews/get/:propertyId", getReviewsByProperty);

router.post("/notifications/create", createNotification);
router.get("/notifications/get_all", getAllNotifications);

router.post("/complaint/create", createComplaint);
router.get("/complaint/get/:userId", getUserComplaints);

export default router;
