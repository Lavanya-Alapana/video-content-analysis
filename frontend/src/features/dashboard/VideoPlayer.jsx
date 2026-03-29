import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedVideo } from '../../store/slices/videoSlice';
import videoService from '../../services/videoService';
import './VideoPlayer.css';

export default function VideoPlayer() {
  const dispatch = useDispatch();
  const { selectedVideo } = useSelector((state) => state.videos);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [selectedVideo]);

  const handleClose = () => {
    dispatch(setSelectedVideo(null));
  };

  if (!selectedVideo) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="player-overlay" onClick={handleClose}>
      <div className="player-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>
          ×
        </button>

        <div className="player-header">
          <h2>{selectedVideo.originalName}</h2>
          <div className="header-actions">
            <span className={`status-badge status-${selectedVideo.status}`}>
              {selectedVideo.status}
            </span>
            <a 
              href={videoService.getStreamUrl(selectedVideo._id)}
              download={selectedVideo.originalName}
              className="download-btn"
              title="Download video"
            >
              ⬇ Download
            </a>
          </div>
        </div>

        <div className="player-content">
          <video 
            ref={videoRef} 
            controls 
            className="video-player"
            preload="metadata"
          >
            <source
              src={videoService.getStreamUrl(selectedVideo._id)}
              type={selectedVideo.mimetype}
            />
            Your browser does not support video playback.
          </video>

          <div className="video-details">
            <div className="detail-section">
              <h4>Video Information</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Size</span>
                  <span className="detail-value">
                    {(selectedVideo.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Format</span>
                  <span className="detail-value">
                    {selectedVideo.mimetype.split('/')[1].toUpperCase()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Uploaded</span>
                  <span className="detail-value">
                    {formatDate(selectedVideo.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {selectedVideo.sensitivity && (
              <div className="detail-section">
                <h4>Sensitivity Analysis</h4>
                <div className="sensitivity-grid">
                  <div className="sensitivity-item">
                    <span className="sensitivity-label">Nudity Score</span>
                    <div className="score-bar">
                      <div 
                        className="score-fill"
                        style={{ 
                          width: `${selectedVideo.sensitivity.nudityScore * 100}%`,
                          backgroundColor: selectedVideo.sensitivity.nudityScore > 0.6 ? '#000' : '#ccc'
                        }}
                      />
                    </div>
                    <span className="sensitivity-value">
                      {(selectedVideo.sensitivity.nudityScore * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="sensitivity-item">
                    <span className="sensitivity-label">Violence Score</span>
                    <div className="score-bar">
                      <div 
                        className="score-fill"
                        style={{ 
                          width: `${selectedVideo.sensitivity.violenceScore * 100}%`,
                          backgroundColor: selectedVideo.sensitivity.violenceScore > 0.6 ? '#000' : '#ccc'
                        }}
                      />
                    </div>
                    <span className="sensitivity-value">
                      {(selectedVideo.sensitivity.violenceScore * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="sensitivity-item">
                    <span className="sensitivity-label">AI Confidence</span>
                    <div className="score-bar">
                      <div 
                        className="score-fill"
                        style={{ 
                          width: `${selectedVideo.sensitivity.aiConfidence * 100}%`,
                          backgroundColor: '#666'
                        }}
                      />
                    </div>
                    <span className="sensitivity-value">
                      {(selectedVideo.sensitivity.aiConfidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {selectedVideo.sensitivity.details && (
                  <p className="analysis-details">
                    {selectedVideo.sensitivity.details}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
