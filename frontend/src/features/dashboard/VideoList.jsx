import { useSelector, useDispatch } from 'react-redux';
import { setSelectedVideo, deleteVideo } from '../../store/slices/videoSlice';
import { VIDEO_STATUS, STATUS_COLORS, USER_ROLES } from '../../constants';
import './VideoList.css';

export default function VideoList() {
  const dispatch = useDispatch();
  const { items: videos, loading } = useSelector((state) => state.videos);
  const { user } = useSelector((state) => state.auth);

  const canDelete = user?.role === USER_ROLES.EDITOR || user?.role === USER_ROLES.ADMIN;

  const handleDelete = async (e, videoId) => {
    e.stopPropagation();
    if (confirm('Delete this video?')) {
      await dispatch(deleteVideo(videoId));
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSize = (bytes) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  if (loading) {
    return <div className="loading-state">Loading videos...</div>;
  }

  if (videos.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📹</span>
        <h3>No videos found</h3>
        <p>Upload a video to get started</p>
      </div>
    );
  }

  return (
    <div className="video-list">
      <div className="list-header">
        <h2>Videos ({videos.length})</h2>
      </div>

      <div className="video-grid">
        {videos.map((video) => (
          <div
            key={video._id}
            className="video-card"
            onClick={() => dispatch(setSelectedVideo(video))}
          >
            <div className="video-card-header">
              <span 
                className={`status-badge status-${video.status}`}
                style={{ 
                  backgroundColor: STATUS_COLORS[video.status],
                  color: video.status === VIDEO_STATUS.SAFE ? '#000' : '#fff'
                }}
              >
                {video.status}
              </span>
              {canDelete && (
                <button
                  className="delete-btn"
                  onClick={(e) => handleDelete(e, video._id)}
                  title="Delete video"
                >
                  ×
                </button>
              )}
            </div>

            <div className="video-card-body">
              <h3 className="video-title">{video.originalName}</h3>
              
              <div className="video-meta">
                <span>{formatSize(video.size)}</span>
                <span>{formatDate(video.createdAt)}</span>
              </div>

              {video.status === VIDEO_STATUS.PROCESSING && (
                <div className="processing-bar">
                  <div 
                    className="processing-fill" 
                    style={{ width: `${video.processingProgress}%` }}
                  />
                  <span className="processing-text">
                    {video.processingProgress}%
                  </span>
                </div>
              )}

              {video.sensitivity && (
                <div className="sensitivity-scores">
                  <div className="score-item">
                    <span className="score-label">Nudity</span>
                    <span className="score-value">
                      {(video.sensitivity.nudityScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="score-item">
                    <span className="score-label">Violence</span>
                    <span className="score-value">
                      {(video.sensitivity.violenceScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="score-item">
                    <span className="score-label">Confidence</span>
                    <span className="score-value">
                      {(video.sensitivity.aiConfidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
