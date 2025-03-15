import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/middleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// Helper: Check if user role is allowed
const isAuthorized = (role) => {
  return role === "BUSINESS_OWNER" || role === "ADMIN";
};

router.post("/setup", verifyToken, async (req, res) => {
  if (!isAuthorized(req.role)) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

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
        ownerId: req.userId,
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
      where: { id: req.userId }, 
      data: {
        business: {
          connect: { id: business.id }
        }
      }
    });

    res.status(201).json({ success: true, business });
  } catch (error) {
    console.error("Error setting up business:", error);
    res.status(500).json({ error: "Failed to set up business" });
  }
});

export default router;