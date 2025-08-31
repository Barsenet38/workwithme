import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js"; // new
import managerRoutes from "./src/routes/managerRoutes.js"; // new

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * ================================
 *  Middleware
 * ================================
 */
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

/**
 * ================================
 *  API Routes
 * ================================
 */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", adminRoutes); // new
app.use("/manager", managerRoutes); // new
/**
 * ================================
 *  Health Check
 * ================================
 */
app.get("/", (_req, res) => {
  res.send("🚀 Server is running and ready to serve requests!");
});

/**
 * ================================
 *  Start Server
 * ================================
 */
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
