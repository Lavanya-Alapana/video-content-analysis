import express from "express";
import AuthController from "../controllers/AuthController.js";
import {
  validateRegistration,
  validateLogin,
  handleValidationErrors,
} from "../validators/authValidator.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../utils/errorHandler.js";

const router = express.Router();

router.post(
  "/register",
  validateRegistration,
  handleValidationErrors,
  asyncHandler(AuthController.register.bind(AuthController)),
);

router.post(
  "/login",
  validateLogin,
  handleValidationErrors,
  asyncHandler(AuthController.login.bind(AuthController)),
);

router.get(
  "/me",
  authenticate,
  asyncHandler(AuthController.me.bind(AuthController)),
);

export default router;
