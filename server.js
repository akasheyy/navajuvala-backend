import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";

process.env.TZ = "Asia/Kolkata";

import adminRoutes from "./routes/adminRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

dotenv.config();
connectDB();

const app = express();
const __dirname = path.resolve();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

// // ================= FRONTEND SERVE =================

// // Path to frontend build
// app.use(express.static(path.join(__dirname, "frontend/dist")));

// // SPA fallback (IMPORTANT)
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
// });

// ================= SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✔ Server running on port ${PORT}`)
);
