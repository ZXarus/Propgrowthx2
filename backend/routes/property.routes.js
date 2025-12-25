import express from "express";
import {
  getPropertyById,
  createProperty,
  getAllPropertiesByOwner,
  updateProperty,
} from "../controller/property.controller.js";
// import { protect } from "../middlewares/auth.middleware.js";// this  one i  add after all the features done for protect ok

const router = express.Router();

// router.get("/", protect, getPropertyById);
// router.post("/create", protect, createProperty);

router.get("/getById", getPropertyById); // for get one propty on  which he click
router.get("/get_all_prop_by_owner", getAllPropertiesByOwner); // get all propties
router.post("/create", createProperty);
router.patch("/update/:id", updateProperty);

export default router;
