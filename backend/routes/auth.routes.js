import express from "express";
import {
  login,
  register,
  forgotPassword,
  verifyOtp,
  getUserProfileWithProperties,
  passwordUpdate,
  profileDetails,
  updateProfile,
  updatedetails,
  privateProfileDetails,
} from "../controller/auth.controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/getId", verifyToken, async (req, res) => {
  if (req.user.id == null) {
    return null;
  }
  return res.status(200).json({
    id: req.user.id,
  });
});

router.get("/profileDetails", verifyToken, profileDetails);
router.post("/privateProfileDetails", privateProfileDetails);

router.patch("/update_pic/:profileId", upload.single("image"), updateProfile);

router.patch("/update_details/:profileId", updatedetails);

router.post("/forgot-password", forgotPassword);

router.post("/verify-otp", verifyOtp);
router.post("/update-password", passwordUpdate);
router.get("/me", verifyToken, getUserProfileWithProperties);

export default router;
