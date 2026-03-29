import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { fetchVideos, setFilter } from '../../store/slices/videoSlice';
import { USER_ROLES, VIDEO_FILTERS } from '../../constants';
import { useSocket } from '../../hooks/useSocket';
import VideoUpload from './VideoUpload';
import VideoList from './VideoList';
import VideoPlayer from './VideoPlayer';
import './Dashboard.css';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { filter, selectedVideo } = useSelector((state) => state.videos);

  useSocket();

  useEffect(() => {
    const statusFilter = filter === VIDEO_FILTERS.ALL ? null : filter;
    dispatch(fetchVideos(statusFilter));
  }, [dispatch, filter]);

  const canUpload = user?.role === USER_ROLES.EDITOR || user?.role === USER_ROLES.ADMIN;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Content Moderation</h1>
            <p className="header-subtitle">AI-Powered Video Analysis</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-email">{user?.email}</span>
              <span className="user-role">{user?.role}</span>
            </div>
            <button 
              onClick={() => dispatch(logout())} 
              className="btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="sidebar">
          <div className="filter-section">
            <h3>Filters</h3>
            <div className="filter-buttons">
              {Object.entries(VIDEO_FILTERS).map(([key, value]) => (
                <button
                  key={value}
                  className={`filter-btn ${filter === value ? 'active' : ''}`}
                  onClick={() => dispatch(setFilter(value))}
                >
                  {key.charAt(0) + key.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {canUpload && (
            <div className="upload-section">
              <VideoUpload />
            </div>
          )}
        </aside>

        <main className="main-content">
          <VideoList />
        </main>
      </div>

      {selectedVideo && <VideoPlayer />}
    </div>
  );
}
