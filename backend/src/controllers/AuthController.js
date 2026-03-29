import jwt from "jsonwebtoken";
import UserRepository from "../repositories/UserRepository.js";
import { HTTP_STATUS, JWT_CONFIG } from "../constants/index.js";
import { config } from "../config/env.js";

class AuthController {
  async register(req, res) {
    try {
      const { email, password, role, orgId } = req.body;

      const existingUser = await UserRepository.findByEmail(email);
      if (existingUser) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: "User already exists",
        });
      }

      const user = await UserRepository.create({
        email,
        password,
        role: role || "viewer",
        orgId: orgId || "org1",
      });

      const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
        expiresIn: JWT_CONFIG.EXPIRES_IN,
      });

      res.status(HTTP_STATUS.CREATED).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          orgId: user.orgId,
        },
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await UserRepository.findByEmail(email);
      if (!user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          error: "Invalid credentials",
        });
      }

      const isValid = await user.comparePassword(password);
      if (!isValid) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          error: "Invalid credentials",
        });
      }

      const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
        expiresIn: JWT_CONFIG.EXPIRES_IN,
      });

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          orgId: user.orgId,
        },
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: error.message });
    }
  }

  async me(req, res) {
    try {
      res.json({
        user: {
          id: req.user._id,
          email: req.user.email,
          role: req.user.role,
          orgId: req.user.orgId,
        },
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: error.message });
    }
  }
}

export default new AuthController();
