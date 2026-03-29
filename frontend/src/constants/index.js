// API Configuration
export const API_BASE_URL = "http://localhost:5000";
export const SOCKET_URL = "http://localhost:5000";

// User Roles
export const USER_ROLES = {
  VIEWER: "viewer",
  EDITOR: "editor",
  ADMIN: "admin",
};

// Video Status
export const VIDEO_STATUS = {
  UPLOADED: "uploaded",
  PROCESSING: "processing",
  SAFE: "safe",
  FLAGGED: "flagged",
  FAILED: "failed",
};

// Status Colors (Black & White Theme)
export const STATUS_COLORS = {
  [VIDEO_STATUS.UPLOADED]: "#666666",
  [VIDEO_STATUS.PROCESSING]: "#888888",
  [VIDEO_STATUS.SAFE]: "#ffffff",
  [VIDEO_STATUS.FLAGGED]: "#000000",
  [VIDEO_STATUS.FAILED]: "#444444",
};

// Filter Options
export const VIDEO_FILTERS = {
  ALL: "all",
  SAFE: "safe",
  FLAGGED: "flagged",
  PROCESSING: "processing",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
};

// Socket Events
export const SOCKET_EVENTS = {
  VIDEO_PROGRESS: "video-progress",
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
};

// File Upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  ACCEPTED_FORMATS: ["video/mp4", "video/webm", "video/ogg"],
};
