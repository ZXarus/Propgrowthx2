import express from "express";
import {
  login,
  register,
  forgotPassword,
  verifyOtp,
  getUserProfileWithProperties,
  passwordUpdate,
  profileDeatils,
  updateProfile,
  updatedetails,
} from "../controller/auth.controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/login", login);

router.get("/profileDeatils/:profileId", profileDeatils);

router.patch("/update_pic/:profileId", upload.single("image"), updateProfile);

router.patch("/update_details/:profileId", updatedetails);

router.post("/register", register);
router.post("/forgot-password", forgotPassword);

router.post("/verify-otp", verifyOtp);
router.post("/update-password", passwordUpdate);
router.get("/me", verifyToken, getUserProfileWithProperties);

export default router;
