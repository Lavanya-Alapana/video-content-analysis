import VideoRepository from "../repositories/VideoRepository.js";
import { extractFrames } from "./frameExtractor.js";
import { analyzeWithGemini } from "./geminiAnalyzer.js";
import {
  VIDEO_STATUS,
  SENSITIVITY_THRESHOLDS,
  PROCESSING_CONFIG,
} from "../constants/index.js";
import logger from "../utils/logger.js";
import fs from "fs";
import path from "path";

class ProcessingService {
  async processVideo(videoId, videoPath, io, progressCallback) {
    try {
      await VideoRepository.updateStatus(videoId, VIDEO_STATUS.PROCESSING, 0);
      this.emitProgress(
        io,
        videoId,
        VIDEO_STATUS.PROCESSING,
        0,
        "Starting analysis",
      );

      // Extract frames
      progressCallback(10);
      this.emitProgress(
        io,
        videoId,
        VIDEO_STATUS.PROCESSING,
        10,
        "Extracting frames",
      );
      const frames = await extractFrames(videoPath, videoId);

      if (frames.length === 0) {
        throw new Error("No frames extracted");
      }

      logger.success(`Extracted ${frames.length} frames`);

      // Sample frames
      const sampledFrames = this.sampleFrames(frames);
      logger.info(`Analyzing ${sampledFrames.length} frame with Gemini`);

      // Analyze
      progressCallback(30);
      this.emitProgress(
        io,
        videoId,
        VIDEO_STATUS.PROCESSING,
        30,
        "Analyzing content",
      );
      const results = await analyzeWithGemini(sampledFrames);

      // Aggregate results
      progressCallback(90);
      this.emitProgress(io, videoId, VIDEO_STATUS.PROCESSING, 90, "Finalizing");

      const analysis = this.aggregateResults(results);

      await VideoRepository.update(videoId, {
        status: analysis.status,
        processingProgress: 100,
        sensitivity: analysis.sensitivity,
      });

      // Cleanup frames
      this.cleanupFrames(frames);

      progressCallback(100);
      this.emitProgress(
        io,
        videoId,
        analysis.status,
        100,
        `Video classified as ${analysis.status}`,
        analysis.sensitivity,
      );

      logger.success(`Job completed: ${videoId}`);
      return analysis;
    } catch (error) {
      logger.error("Processing error:", error);

      await VideoRepository.updateStatus(videoId, VIDEO_STATUS.FAILED, 0);
      this.emitProgress(io, videoId, VIDEO_STATUS.FAILED, 0, error.message);

      throw error;
    }
  }

  sampleFrames(frames) {
    const { MAX_FRAMES_TO_ANALYZE, FRAME_SAMPLE_POSITION } = PROCESSING_CONFIG;
    const sampleIndex = Math.floor(frames.length * FRAME_SAMPLE_POSITION);
    return [frames[sampleIndex]];
  }

  aggregateResults(results) {
    const validResults = results.filter((r) => !r.error && r.confidence > 0);

    if (validResults.length === 0) {
      return {
        status: VIDEO_STATUS.SAFE,
        sensitivity: {
          nudityScore: 0,
          violenceScore: 0,
          aiConfidence: 0,
          details: "Analysis incomplete",
          flaggedFrames: [],
        },
      };
    }

    const nudityScore = Math.max(
      ...validResults.map((r) => r.nudityScore || 0),
    );
    const violenceScore = Math.max(
      ...validResults.map((r) => r.violenceScore || 0),
    );
    const avgConfidence =
      validResults.reduce((sum, r) => sum + r.confidence, 0) /
      validResults.length;

    const flaggedFrames = validResults
      .filter(
        (r) =>
          r.nudityScore > SENSITIVITY_THRESHOLDS.NUDITY ||
          r.violenceScore > SENSITIVITY_THRESHOLDS.VIOLENCE,
      )
      .map((f) => path.basename(f.framePath));

    const status =
      nudityScore > SENSITIVITY_THRESHOLDS.NUDITY ||
      violenceScore > SENSITIVITY_THRESHOLDS.VIOLENCE
        ? VIDEO_STATUS.FLAGGED
        : VIDEO_STATUS.SAFE;

    logger.info(
      `Result: Nudity=${nudityScore.toFixed(2)}, Violence=${violenceScore.toFixed(2)}, Status=${status}`,
    );

    return {
      status,
      sensitivity: {
        nudityScore,
        violenceScore,
        aiConfidence: avgConfidence,
        flaggedFrames,
        details: `Analyzed ${validResults.length} frame(s), ${flaggedFrames.length} flagged`,
      },
    };
  }

  cleanupFrames(frames) {
    if (frames.length === 0) return;

    const framesDir = path.dirname(frames[0]);
    if (fs.existsSync(framesDir)) {
      fs.rmSync(framesDir, { recursive: true, force: true });
    }
  }

  emitProgress(io, videoId, status, progress, message, sensitivity = null) {
    const payload = {
      videoId,
      status,
      progress,
      message,
      timestamp: new Date(),
    };

    if (sensitivity) {
      payload.sensitivity = sensitivity;
    }

    io?.emit("video-progress", payload);
  }
}

export default new ProcessingService();
