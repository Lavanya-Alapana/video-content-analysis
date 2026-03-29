import { Worker } from "bullmq";
import { getRedisConfig } from "./config/redis.js";
import { QUEUE_NAMES } from "./constants/index.js";
import ProcessingService from "./services/ProcessingService.js";
import logger from "./utils/logger.js";

export const startWorker = (io) => {
  const worker = new Worker(
    QUEUE_NAMES.VIDEO_PROCESSING,
    async (job) => {
      logger.processing(`Processing job ${job.id}:`, job.data);
      const { videoId, videoPath } = job.data;

      await ProcessingService.processVideo(
        videoId,
        videoPath,
        io,
        (progress) => {
          job.updateProgress(progress);
        },
      );
    },
    {
      connection: getRedisConfig(),
    },
  );

  worker.on("completed", (job) => {
    logger.success(`Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    logger.error(`Job ${job?.id} failed:`, err.message);
  });

  logger.info("Worker started and listening for jobs...");
};
