import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import authRoutes from "./routes/auth.js";
import appointmentsRoutes from "./routes/appointments.js";
import employeesRoutes from "./routes/employees.js";
import businessRoutes from "./routes/business.js";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Prisma connection log
prisma.$connect()
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/business", businessRoutes);

app.get("/", (req, res) => {
  res.send("AppointMate Backend is Running");
});

// Handle unhandled routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Prisma client disconnected on app termination");
  process.exit(0);
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});