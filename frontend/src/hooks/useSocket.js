import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { SOCKET_URL, SOCKET_EVENTS } from "../constants";
import { updateVideoProgress, fetchVideos } from "../store/slices/videoSlice";

export const useSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on(SOCKET_EVENTS.VIDEO_PROGRESS, (data) => {
      dispatch(
        updateVideoProgress({
          videoId: data.videoId,
          status: data.status,
          progress: data.progress,
          sensitivity: data.sensitivity,
        }),
      );

      // If processing is complete (safe or flagged), fetch fresh data from API
      if (data.status === "safe" || data.status === "flagged") {
        setTimeout(() => {
          dispatch(fetchVideos());
        }, 500);
      }
    });

    return () => socket.disconnect();
  }, [dispatch]);
};
