import express from 'express';
import { PrismaClient } from '@prisma/client';
import verifyToken from '../middleware/verifyToken';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', verifyToken, async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      where: { businessId: req.user.businessId }, // Fetch only clients of the business
      include: {
        appointments: true, // Optionally include appointment details
      },
    });

    res.status(200).json(clients);
  } catch (error) {
    console.error('Failed to fetch clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

export default router;