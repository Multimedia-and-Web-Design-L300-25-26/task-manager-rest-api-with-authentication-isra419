import express from "express";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Task routes (protected inside taskRoutes with authMiddleware)
app.use("/api/tasks", taskRoutes);

// Optional health check route (helps tests confirm server works)
app.get("/", (req, res) => {
  res.json({ message: "Task Manager API running" });
});

export default app;
