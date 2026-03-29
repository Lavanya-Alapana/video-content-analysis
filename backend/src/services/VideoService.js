import { Queue } from "bullmq";
import { getRedisConfig } from "../config/redis.js";
import { QUEUE_NAMES } from "../constants/index.js";

class VideoService {
  constructor() {
    this.queue = new Queue(QUEUE_NAMES.VIDEO_PROCESSING, {
      connection: getRedisConfig(),
    });
  }

  async queueVideoProcessing(videoId, videoPath) {
    await this.queue.add("process-video", {
      videoId,
      videoPath,
    });
  }

  async getQueueStats() {
    return {
      waiting: await this.queue.getWaitingCount(),
      active: await this.queue.getActiveCount(),
      completed: await this.queue.getCompletedCount(),
      failed: await this.queue.getFailedCount(),
    };
  }
}

export default new VideoService();
