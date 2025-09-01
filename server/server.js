// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./src/routes/AuthRoutes.js"); // 👈 make sure file name matches

dotenv.config();
const app = express();

// ✅ Enable CORS
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("✅ Server is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
