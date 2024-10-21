import express from "express";
// import db from "../lib/db.js";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

const prismaClient = new PrismaClient();
const authRouter = express.Router();

// Register route
authRouter.post("/register", async (req, res) => {
  try {
    console.log(req.body)
    const { userName, email, password } = req.body;
    const userExist = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });
    if (userExist) {
      return res.json({ message: "User already exist!" }, 403);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await prismaClient.user.create({
      data: {
        userName,
        email,
        password: hashedPassword,
      },
    });
    if (response) {
      const token = jwt.sign(
        { id: response.id, email: response.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      return res.json(
        {
          token: token,
          user: { userName: response.userName, email: response.email },
        },
        200
      );
    }
    return res.json({ message: "Something wrong!" }, 500);
  } catch (error) {
    console.log(error);
    return res.json({ message: "Server error!" }, 500);
  }
});


// Login route
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.json({ message: "Invalid credentials!" }, 403);
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.json({ message: "Invalid credentials!" }, 403);
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return res.json(
      { token: token, user: { userName: user.userName, email: user.email } },
      200
    );
  } catch (error) {
    console.log(error);
  }
});

export default authRouter;
