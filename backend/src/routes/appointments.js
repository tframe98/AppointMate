import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/middleware.js";

const router = express.Router();
const prisma = new PrismaClient();
// Get all appointments
router.get("/", verifyToken, async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { employee: true, client: true, business: true },
    });
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// Create an appointment
router.post("/add", verifyToken, async (req, res) => {
  const { clientId, employeeId, serviceId, dateTime, notes } = req.body;
  try {
    const appointment = await prisma.appointment.create({
      data: {
        clientId,
        employeeId,
        serviceId,
        dateTime: new Date(dateTime),
        notes,
      },
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create appointment" });
  }
});

// Get employee-specific appointments
router.get("/employee-appointments", verifyToken, async (req, res) => {
  try {
    const employeeAppointments = await prisma.appointment.findMany({
      where: { employeeId: req.userId },
      include: { client: true, service: true },
    });
    res.json(employeeAppointments);
  } catch (error) {
    console.error("Error fetching employee appointments:", error);
    res.status(500).json({ error: "Error fetching employee appointments" });
  }
});

export default router;