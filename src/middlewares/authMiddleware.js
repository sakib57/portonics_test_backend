import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

// Verifying auth token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.json({ message: "UnAuthorized!" }, 401);
  }
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.json({ message: "Invalid Token!" }, 401);
  }
};

export default authenticateToken;
