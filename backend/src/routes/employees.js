import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/middleware.js";

const router = express.Router();
const prisma = new PrismaClient();


router.get("/", verifyToken, async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});


router.post("/add", verifyToken, async (req, res) => {
  const { name, email, role, password } = req.body;

  if (!name || !email || !role || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingEmployee = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmployee) {
      return res.status(400).json({ error: "Employee with this email already exists" });
    }

    const newEmployee = await prisma.user.create({
      data: {
        name,
        email,
        role,
        password, 
      },
    });

    res.status(201).json(newEmployee);
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;