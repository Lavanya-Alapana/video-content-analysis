import jwt from "jsonwebtoken";
import UserRepository from "../repositories/UserRepository.js";
import { config } from "../config/env.js";
import { JWT_CONFIG } from "../constants/index.js";

class AuthService {
  generateToken(userId) {
    return jwt.sign({ userId }, config.jwtSecret, {
      expiresIn: JWT_CONFIG.EXPIRES_IN,
    });
  }

  verifyToken(token) {
    return jwt.verify(token, config.jwtSecret);
  }

  async validateUser(email, password) {
    const user = await UserRepository.findByEmail(email);
    if (!user) return null;

    const isValid = await user.comparePassword(password);
    return isValid ? user : null;
  }

  sanitizeUser(user) {
    return {
      id: user._id,
      email: user.email,
      role: user.role,
      orgId: user.orgId,
    };
  }
}

export default new AuthService();
