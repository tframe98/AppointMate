import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/middleware.js";

const router = express.Router();
const prisma = new PrismaClient();

const isAuthorized = (role) => {
  return role === "BUSINESS_OWNER" || role === "ADMIN" || role === "EMPLOYEE";
};

router.get("/", verifyToken, async (req, res) => {
  if (!isAuthorized(req.role)) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const clients = await prisma.client.findMany({
      where: {
        businessId: req.businessId || undefined, // optionally restrict by businessId
      },
    });
    res.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

router.post("/add", verifyToken, async (req, res) => {
  if (!isAuthorized(req.role)) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingClient = await prisma.client.findUnique({
      where: { email },
    });

    if (existingClient) {
      return res.status(400).json({ error: "Client with this email already exists" });
    }

    const newClient = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        business: {
          connect: {
            id: req.businessId, 
          },
        },
      },
    });

    res.status(201).json(newClient);
  } catch (error) {
    console.error("Error adding client:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;