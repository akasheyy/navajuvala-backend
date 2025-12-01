import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
process.env.TZ = "Asia/Kolkata";

// Routes
import adminRoutes from "./routes/adminRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

dotenv.config();

// Connect MongoDB Atlas
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Default test route
app.get("/", (req, res) => {
  res.send("Navajuvala Library API Running...");
});

// Public Routes (no auth needed)
app.use("/api", publicRoutes);

// Admin Routes (protected)
app.use("/api/admin", adminRoutes);

// Global Error Handler (Optional but recommended)
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: err.message });
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✔ Server running on ${PORT}`));
