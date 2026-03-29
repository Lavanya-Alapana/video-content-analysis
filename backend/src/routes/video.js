import express from "express";
import VideoController from "../controllers/VideoController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { validateVideoQuery } from "../validators/videoValidator.js";
import { asyncHandler } from "../utils/errorHandler.js";
import { USER_ROLES } from "../constants/index.js";

const router = express.Router();

router.post(
  "/upload",
  authenticate,
  authorize(USER_ROLES.EDITOR, USER_ROLES.ADMIN),
  upload.single("video"),
  asyncHandler(VideoController.upload.bind(VideoController)),
);

router.get(
  "/",
  authenticate,
  validateVideoQuery,
  asyncHandler(VideoController.list.bind(VideoController)),
);

router.get(
  "/:id",
  authenticate,
  asyncHandler(VideoController.getById.bind(VideoController)),
);

router.get(
  "/:id/stream",
  authenticate,
  asyncHandler(VideoController.stream.bind(VideoController)),
);

router.delete(
  "/:id",
  authenticate,
  authorize(USER_ROLES.EDITOR, USER_ROLES.ADMIN),
  asyncHandler(VideoController.delete.bind(VideoController)),
);

export default router;
