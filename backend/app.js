import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import notifyRoutes from "./routes/notification.routes.js";
import complainRoutes from "./routes/complain.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/notify", notifyRoutes);
app.use("/api/complain", complainRoutes);
app.use("/api/review", reviewRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
