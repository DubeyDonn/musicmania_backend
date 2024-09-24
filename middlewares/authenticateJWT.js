import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { APP_KEY } from "../configs/appConst.js";

export const authenticateJWT = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Token:", token);

  if (token) {
    try {
      const decoded = jwt.verify(token, APP_KEY);
      req.user = await User.findById(decoded.userId);
      next();
    } catch (err) {
      console.error("JWT verification failed:", err);
      next(); // Proceed without user info if token is invalid
    }
  } else {
    next(); // Proceed without user info if no token is provided
  }
};
