import express from 'express';
import { PrismaClient } from '@prisma/client';
const router = express.Router();
const prisma = new PrismaClient();

// Assuming verifyToken is a middleware you have defined elsewhere and imported
import { verifyToken } from './middleware'; // Update the path as necessary

router.get('/schedule', verifyToken, async (req, res) => {
  const { date } = req.query; // Assuming 'date' is passed as 'YYYY-MM-DD'
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

export default router;