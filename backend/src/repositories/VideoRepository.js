import Video from "../models/Video.js";

class VideoRepository {
  async create(videoData) {
    return Video.create(videoData);
  }

  async findById(id) {
    return Video.findById(id);
  }

  async findByOrg(orgId, filters = {}) {
    const query = { orgId, ...filters };
    return Video.find(query).sort({ createdAt: -1 });
  }

  async update(id, updates) {
    return Video.findByIdAndUpdate(id, updates, { new: true });
  }

  async delete(id) {
    return Video.findByIdAndDelete(id);
  }

  async findByStatus(orgId, status) {
    return Video.find({ orgId, status }).sort({ createdAt: -1 });
  }

  async updateSensitivity(id, sensitivity) {
    return Video.findByIdAndUpdate(
      id,
      { sensitivity, processingProgress: 100 },
      { new: true },
    );
  }

  async updateStatus(id, status, progress = 0) {
    return Video.findByIdAndUpdate(
      id,
      { status, processingProgress: progress },
      { new: true },
    );
  }
}

export default new VideoRepository();
