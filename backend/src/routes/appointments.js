import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/middleware.js'; // Update the path as necessary

const router = express.Router();
const prisma = new PrismaClient();

router.get("/employee-appointments", verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const appointments = await prisma.appointment.findMany({
      where: { employeeId: userId },
    });
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching employee appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

router.get('/schedule', verifyToken, async (req, res) => {
  const { date } = req.query; 
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        businessId: req.user.businessId,
        date: new Date(date),
      },
      include: {
        employee: true,
        client: true,
      },
    });

    const schedule = appointments.reduce((acc, app) => {
      const employeeName = app.employee?.name || 'Unassigned';
      if (!acc[employeeName]) {
        acc[employeeName] = [];
      }
      acc[employeeName].push({
        id: app.id,
        time: app.date.getHours() + app.date.getMinutes() / 60, // Convert time to position in pixels
        clientName: app.client.name,
        service: app.service
      });
      return acc;
    }, {});

    res.json(schedule);
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    res.status(500).send('Error fetching appointments');
  }
});

router.post("/add", verifyToken, async (req, res) => {
  try {
    const { name, email, service, date, time, employeeId, color } = req.body;

    const newAppointment = await prisma.appointment.create({
      data: {
        clientName: name,
        clientEmail: email,
        service,
        date: new Date(`${date}T${time}:00.000Z`),
        employeeId: parseInt(employeeId),
        color, 
      },
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("Error adding appointment:", error);
    res.status(500).json({ error: "Failed to add appointment" });
  }
});

export default router;