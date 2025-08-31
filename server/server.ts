import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js"; // Add this
import adminRoutes from "./src/routes/adminRoutes.js";

const app = express();
const PORT = 5000;

// CORS middleware
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Body parser
app.use(express.json());   

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes); // Add this

app.get("/", (_req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));