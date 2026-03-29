import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import { PROCESSING_CONFIG } from "../constants/index.js";
import { ensureDirectoryExists } from "../utils/fileHelper.js";
import logger from "../utils/logger.js";

export const extractFrames = (videoPath, videoId) => {
  return new Promise((resolve, reject) => {
    const framesDir = path.join(process.cwd(), "frames", videoId);
    ensureDirectoryExists(framesDir);

    const outputPattern = path.join(framesDir, "frame_%04d.jpg");

    ffmpeg(videoPath)
      .outputOptions(["-vf", `fps=${PROCESSING_CONFIG.FRAMES_PER_SECOND}`])
      .output(outputPattern)
      .on("end", () => {
        const files = fs
          .readdirSync(framesDir)
          .filter((f) => f.endsWith(".jpg"))
          .map((f) => path.join(framesDir, f));

        logger.success(`Extracted ${files.length} frames`);
        resolve(files);
      })
      .on("error", (err) => {
        logger.error("FFmpeg error:", err);
        reject(err);
      })
      .run();
  });
};
