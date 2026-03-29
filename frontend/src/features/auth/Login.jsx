import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, clearError } from '../../store/slices/authSlice';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (result.type === 'auth/login/fulfilled') {
      navigate('/dashboard');
    }
  };

  const demoUsers = [
    { email: 'admin@test.com', password: 'admin123', role: 'Admin' },
    { email: 'editor@test.com', password: 'editor123', role: 'Editor' },
    { email: 'viewer@test.com', password: 'viewer123', role: 'Viewer' },
  ];

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Video Content Moderation</h1>
          <p>Professional content analysis platform</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-users">
          <p className="demo-title">Demo Accounts</p>
          {demoUsers.map((user) => (
            <div key={user.email} className="demo-user">
              <span className="demo-role">{user.role}</span>
              <span className="demo-email">{user.email}</span>
              <span className="demo-password">{user.password}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
