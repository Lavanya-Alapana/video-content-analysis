import express from "express";
import cors from "cors";
import { createServer } from "http";
import { config, validateConfig } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { initializeSocket } from "./config/socket.js";
import authRoutes from "./routes/auth.js";
import videoRoutes from "./routes/video.js";
import { startWorker } from "./worker.js";
import {
  notFoundHandler,
  globalErrorHandler,
} from "./middleware/errorMiddleware.js";
import logger from "./utils/logger.js";

// Validate environment
validateConfig();

const app = express();
const httpServer = createServer(app);
const io = initializeSocket(httpServer);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
await connectDatabase();

// Make io available globally
app.set("io", io);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Error handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start server
httpServer.listen(config.port, () => {
  logger.success(`Server running on port ${config.port}`);
  startWorker(io);
});
