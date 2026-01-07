import express from "express";
const router = express.Router();

import {
  createReview,
  getReviewsByProperty,
  updateReview,
  deleteReview,
} from "../controller/review.controller.js";

router.post("/create", createReview);
router.get("/get/:propertyId", getReviewsByProperty);

router.put("/update/:reviewId", updateReview);

router.delete("/delete/:reviewId", deleteReview);

export default router;
