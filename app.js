import express from "express";
import bodyParser from "body-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import authRouter from "./src/auth/router.js";
import cors from "cors";
import { config } from "dotenv";
import userRouter from "./src/user/router.js";
import orderRouter from "./src/order/router.js";
config();

const app = express();
const port = process.env.PORT || 3000;

const seaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Portonics Test",
      version: "1.0.0",
    },
  },
  apis: ["./src/auth/router.js","./src/order/router.js","./src/user/router.js"],
};
const swaggerDocs = swaggerJSDoc(seaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/orders", orderRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
