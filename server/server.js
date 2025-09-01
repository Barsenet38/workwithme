const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./src/routes/AuthRoutes.js");
const managerRoutes = require("./src/routes/ManagerRoutes.js"); // 👈 new
const teamRoutes = require("./src/routes/TeamRoutes.js");
const approvalsRouter = require("./src/routes/approvals.js");

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/manager", managerRoutes); // 👈 new
app.use("/manager/team", teamRoutes);
app.use("/manager/approvals", approvalsRouter);

app.get("/", (req, res) => {
  res.send("✅ Server is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
