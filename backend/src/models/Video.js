import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orgId: { type: String, required: true },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    mimetype: { type: String, required: true },
    status: {
      type: String,
      enum: ["uploaded", "processing", "safe", "flagged", "failed"],
      default: "uploaded",
    },
    processingProgress: { type: Number, default: 0 },
    sensitivity: {
      nudityScore: { type: Number, default: 0 },
      violenceScore: { type: Number, default: 0 },
      aiConfidence: { type: Number, default: 0 },
      flaggedFrames: [String],
      details: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Video", videoSchema);
