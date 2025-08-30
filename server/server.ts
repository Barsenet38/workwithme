import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";

const app = express();
const PORT = 5000;

// CORS middleware
app.use(cors({
  origin: "http://localhost:3000", // <-- allow your frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // if you need cookies/auth headers
}));

// Body parser
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
