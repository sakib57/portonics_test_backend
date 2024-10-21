import { PrismaClient } from "@prisma/client";
import express from "express";
import authenticateToken from "../middlewares/authMiddleware.js";

const prismaClient = new PrismaClient();
const userRouter = express.Router();


// Get user
userRouter.get("/find-with-token", authenticateToken, async (req, res) => {
  try {
    const user = await prismaClient.user.findUnique({
      where: {
        email: req.user.email,
      },
    });
    return res.json({ userName: user.userName, email: user.email }, 200);
  } catch (error) {
    console.log(error);
  }
});

export default userRouter;
