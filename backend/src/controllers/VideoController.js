import VideoRepository from "../repositories/VideoRepository.js";
import { HTTP_STATUS } from "../constants/index.js";
import VideoService from "../services/VideoService.js";
import fs from "fs";
import path from "path";

class VideoController {
  async upload(req, res) {
    try {
      if (!req.file) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: "No video file provided",
        });
      }

      const video = await VideoRepository.create({
        userId: req.user._id,
        orgId: req.user.orgId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
        status: "uploaded",
      });

      await VideoService.queueVideoProcessing(
        video._id.toString(),
        req.file.path,
      );

      res.status(HTTP_STATUS.CREATED).json({ video });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: error.message });
    }
  }

  async list(req, res) {
    try {
      const { status } = req.query;
      const filters = status ? { status } : {};

      const videos = await VideoRepository.findByOrg(req.user.orgId, filters);

      res.json({ videos });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const video = await VideoRepository.findById(req.params.id);

      if (!video || video.orgId !== req.user.orgId) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          error: "Video not found",
        });
      }

      res.json({ video });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: error.message });
    }
  }

  async stream(req, res) {
    try {
      const video = await VideoRepository.findById(req.params.id);

      if (!video || video.orgId !== req.user.orgId) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          error: "Video not found",
        });
      }

      const videoPath = path.resolve(video.path);
      const stat = fs.statSync(videoPath);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;
        const file = fs.createReadStream(videoPath, { start, end });

        res.writeHead(206, {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": video.mimetype,
        });

        file.pipe(res);
      } else {
        res.writeHead(200, {
          "Content-Length": fileSize,
          "Content-Type": video.mimetype,
        });
        fs.createReadStream(videoPath).pipe(res);
      }
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const video = await VideoRepository.findById(req.params.id);

      if (!video || video.orgId !== req.user.orgId) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          error: "Video not found",
        });
      }

      if (fs.existsSync(video.path)) {
        fs.unlinkSync(video.path);
      }

      await VideoRepository.delete(req.params.id);

      res.json({ message: "Video deleted successfully" });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: error.message });
    }
  }
}

export default new VideoController();
