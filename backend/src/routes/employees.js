import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/middleware.js";
import bcrypt from 'bcryptjs';

const router = express.Router();
const prisma = new PrismaClient();

const isAuthorized = (role) => {
  return role === "BUSINESS_OWNER" || role === "ADMIN";
};

// Get all employees for a business
router.get('/', verifyToken, async (req, res) => {
  if (!isAuthorized(req.role)) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const owner = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { business: true }
    });

    if (!owner || !owner.business) {
      return res.status(404).json({ error: "Business not found for owner." });
    }

    const employees = await prisma.employee.findMany({
      where: { businessId: owner.business.id },
    });

    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// Add a new employee to a business
router.post("/add", verifyToken, async (req, res) => {
  if (!isAuthorized(req.role)) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  const { email, password, name, position } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Email, password, and name are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const owner = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { business: true }
    });

    if (!owner || !owner.business) {
      return res.status(400).json({ error: "Owner doesn't have a business set up yet." });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "A user with this email already exists." });
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "EMPLOYEE",
        employee: {
          create: {
            name,
            position,
            business: { connect: { id: owner.business.id } },
          },
        },
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;