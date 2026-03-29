import jwt from "jsonwebtoken";
import UserRepository from "../repositories/UserRepository.js";
import { HTTP_STATUS } from "../constants/index.js";
import { config } from "../config/env.js";
import { AppError } from "../utils/errorHandler.js";

export const authenticate = async (req, res, next) => {
  try {
    // Support both header and query parameter token (for video streaming)
    let token = req.headers.authorization?.split(" ")[1];

    if (!token && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      throw new AppError("No token provided", HTTP_STATUS.UNAUTHORIZED);
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await UserRepository.findById(decoded.userId);

    if (!user) {
      throw new AppError("User not found", HTTP_STATUS.UNAUTHORIZED);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: "Invalid token" });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        error: "Insufficient permissions",
      });
    }
    next();
  };
};
