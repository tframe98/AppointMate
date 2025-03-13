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

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/business", businessRoutes);

app.get("/", (req, res) => {
  res.send("AppointMate Backend is Running");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});