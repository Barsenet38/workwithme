import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

import chalk from "chalk";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const ipAddress = req.ip;
  const userAgent = req.get("User-Agent");

  if (!username || !password) {
    console.log(chalk.red(`[LOGIN FAILED] Missing credentials. IP: ${ipAddress}, User-Agent: ${userAgent}`));
    return res.status(400).json({ success: false, message: "Username and password required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: username },
    });

    if (!user) {
      console.log(chalk.red(`[LOGIN FAILED] User not found. Username: ${username}, IP: ${ipAddress}, User-Agent: ${userAgent}`));
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      console.log(chalk.red(`[LOGIN FAILED] Invalid credentials. Username: ${username}, IP: ${ipAddress}, User-Agent: ${userAgent}`));
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "8h" }
    );

    console.log(chalk.green(`[LOGIN SUCCESS] Username: ${username}, IP: ${ipAddress}, User-Agent: ${userAgent}`));

    res.json({
      success: true,
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        departmentId: user.departmentId,
      },
      token,
    });
  } catch (err) {
    console.log(chalk.yellow(`[LOGIN ERROR] Username: ${username}, IP: ${ipAddress}, User-Agent: ${userAgent}`));
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};






