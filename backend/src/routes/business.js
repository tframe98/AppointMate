import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/middleware.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/setup", verifyToken, async (req, res) => {
  try {
    const { businessName, businessType, email, phone, address, operatingHours } = req.body;
const services = Array.isArray(req.body.services) ? req.body.services : [];

    const business = await prisma.business.create({
      data: {
        name: businessName,
        type: businessType,
        email,
        phone,
        address,
        operatingHours,
        ownerId: req.user.userId,
        services: {
          create: services.map(service => ({
            name: service.name,
            price: service.price,
            description: service.description
          }))
        }
      },
    });

    await prisma.user.update({
      where: { id: req.user.userId },
      data: { businessId: business.id },
    });

    res.status(201).json({ success: true, business });
  } catch (error) {
    console.error("Error setting up business:", error);
    res.status(500).json({ error: "Failed to set up business" });
  }
});

export default router;