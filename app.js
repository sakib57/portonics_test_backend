import express from "express";
import bodyParser from "body-parser";
import authRouter from './src/auth/router.js'
import cors from 'cors'
import { config } from "dotenv";
import userRouter from "./src/user/router.js";
import orderRouter from "./src/order/router.js";
config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(cors())

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth",authRouter)
app.use("/users",userRouter)
app.use("/orders",orderRouter)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
