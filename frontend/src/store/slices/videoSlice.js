import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import videoService from "../../services/videoService";

export const fetchVideos = createAsyncThunk(
  "videos/fetchVideos",
  async (status = null, { rejectWithValue }) => {
    try {
      const videos = await videoService.getVideos(status);
      return videos;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch videos",
      );
    }
  },
);

export const uploadVideo = createAsyncThunk(
  "videos/uploadVideo",
  async ({ file, onProgress }, { rejectWithValue }) => {
    try {
      const data = await videoService.uploadVideo(file, onProgress);
      return data.video;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Upload failed");
    }
  },
);

export const deleteVideo = createAsyncThunk(
  "videos/deleteVideo",
  async (videoId, { rejectWithValue }) => {
    try {
      await videoService.deleteVideo(videoId);
      return videoId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Delete failed");
    }
  },
);

const videoSlice = createSlice({
  name: "videos",
  initialState: {
    items: [],
    selectedVideo: null,
    filter: "all",
    loading: false,
    uploading: false,
    uploadProgress: 0,
    error: null,
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSelectedVideo: (state, action) => {
      state.selectedVideo = action.payload;
    },
    updateVideoProgress: (state, action) => {
      const { videoId, status, progress, sensitivity } = action.payload;
      const video = state.items.find((v) => v._id === videoId);
      if (video) {
        video.status = status;
        video.processingProgress = progress;
        if (sensitivity) {
          video.sensitivity = sensitivity;
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Videos
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload Video
      .addCase(uploadVideo.pending, (state) => {
        state.uploading = true;
        state.uploadProgress = 0;
        state.error = null;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadProgress = 0;
        state.items.unshift(action.payload);
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.uploading = false;
        state.uploadProgress = 0;
        state.error = action.payload;
      })
      // Delete Video
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.items = state.items.filter((v) => v._id !== action.payload);
        if (state.selectedVideo?._id === action.payload) {
          state.selectedVideo = null;
        }
      });
  },
});

export const { setFilter, setSelectedVideo, updateVideoProgress, clearError } =
  videoSlice.actions;

export default videoSlice.reducer;
