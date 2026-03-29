// Application Constants

export const USER_ROLES = {
  VIEWER: "viewer",
  EDITOR: "editor",
  ADMIN: "admin",
};

export const VIDEO_STATUS = {
  UPLOADED: "uploaded",
  PROCESSING: "processing",
  SAFE: "safe",
  FLAGGED: "flagged",
  FAILED: "failed",
};

export const CONTENT_CATEGORIES = {
  SAFE: "SAFE",
  NUDITY: "NUDITY",
  VIOLENCE: "VIOLENCE",
  HATE: "HATE",
};

export const SENSITIVITY_THRESHOLDS = {
  NUDITY: 0.6,
  VIOLENCE: 0.6,
  HIGH_CONFIDENCE: 0.8,
};

export const PROCESSING_CONFIG = {
  FRAMES_PER_SECOND: 1,
  MAX_FRAMES_TO_ANALYZE: 1, // Free tier limit
  FRAME_SAMPLE_POSITION: 0.5, // Middle of video
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

export const JWT_CONFIG = {
  EXPIRES_IN: "7d",
  ALGORITHM: "HS256",
};

export const QUEUE_NAMES = {
  VIDEO_PROCESSING: "video-processing",
};

export const SOCKET_EVENTS = {
  VIDEO_PROGRESS: "video-progress",
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
};
