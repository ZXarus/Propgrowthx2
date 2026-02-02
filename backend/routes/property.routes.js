import express from "express";
import {
  getPropertyById,
  createProperty,
  getAllPropertiesByOwner,
  updateProperty,
  getAll,
  buyProperty,
  getAllPropertiesByBuyer,
  updatePropertyPic,
  requestForInvitation,
  acceptInvitation,
} from "../controller/property.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";
const router = express.Router();

router.get("/getById/:property_Id", getPropertyById); // for get one propty on  which he click
router.get("/get_all_prop_by_owner", getAllPropertiesByOwner); // get all propties
router.get("/get_all_prop_by_buyer", getAllPropertiesByBuyer); // get all propties
router.get("/get_all", getAll); // get all propties
router.post(
  "/create",
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "veri_image", maxCount: 1 },
  ]),
  createProperty,
);
router.patch("/update/:id", updateProperty);
router.patch("/updatePic/:id", upload.single("image"), updatePropertyPic);

router.post("/buy/:property_Id", verifyToken, buyProperty);

router.post("/request_for_invitation", requestForInvitation);
router.get(
  "/accept_invitation/:property_Id/:tenantId/:owner_id",
  acceptInvitation,
);

export default router;
