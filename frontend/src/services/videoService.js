import api from "./api";
import { STORAGE_KEYS } from "../constants";

class VideoService {
  async uploadVideo(file, onProgress) {
    const formData = new FormData();
    formData.append("video", file);

    const { data } = await api.post("/api/videos/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        onProgress?.(progress);
      },
    });

    return data;
  }

  async getVideos(status = null) {
    const url = status ? `/api/videos?status=${status}` : "/api/videos";
    const { data } = await api.get(url);
    return data.videos;
  }

  async getVideoById(id) {
    const { data } = await api.get(`/api/videos/${id}`);
    return data.video;
  }

  async deleteVideo(id) {
    const { data } = await api.delete(`/api/videos/${id}`);
    return data;
  }

  getStreamUrl(videoId) {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return `${api.defaults.baseURL}/api/videos/${videoId}/stream?token=${token}`;
  }
}

export default new VideoService();
