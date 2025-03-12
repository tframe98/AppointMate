import express from "express";
import cors from "cors";
import employeesRoutes from "./routes/employees.js";
import clientsRoutes from "./routes/clients.js";
import authRoutes from "./routes/auth.js";
import appointmentsRoutes from "./routes/appointments.js";
import "dotenv/config";
import businessRoutes from "./routes/business.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
// Register Routes
app.use("/api/employees", employeesRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/business", businessRoutes);

app.listen(5001, () => console.log("Server running on port 5001"));