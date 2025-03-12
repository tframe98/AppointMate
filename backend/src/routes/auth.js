import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    
    console.log("Request Body:", req.body);

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    
    const hashedPassword = await bcrypt.hash(String(password), 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || "BUSINESS_OWNER", // Default role to BUSINESS_OWNER
      },
    });

    
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ success: true, token, user });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});

export default router;