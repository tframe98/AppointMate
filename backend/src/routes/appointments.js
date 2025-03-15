import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/middleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// Helper: Check if user role is allowed
const isAuthorized = (role) => {
  return role === "BUSINESS_OWNER" || role === "ADMIN" || role === "EMPLOYEE";
};

// Get all appointments
router.get("/", verifyToken, async (req, res) => {
  if (!isAuthorized(req.role)) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

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
  if (!isAuthorized(req.role)) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  const { clientId, employeeId, serviceId, dateTime, notes } = req.body;

  if (!clientId || !employeeId || !serviceId || !dateTime) {
    return res.status(400).json({ error: "Missing required fields" });
  }

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
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
});

// Get employee-specific appointments
router.get("/employee-appointments", verifyToken, async (req, res) => {
  if (!isAuthorized(req.role)) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        employeeId: req.userId,
      },
      include: {
        client: true,
        employee: true,
      },
    });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching employee appointments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;