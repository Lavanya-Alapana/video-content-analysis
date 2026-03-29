import { query } from "express-validator";
import { VIDEO_STATUS } from "../constants/index.js";

export const validateVideoQuery = [
  query("status")
    .optional()
    .isIn(Object.values(VIDEO_STATUS))
    .withMessage("Invalid status filter"),
];
