import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, FloatingLabel } from 'react-bootstrap';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupsIcon from '@mui/icons-material/Groups';
import SecurityIcon from '@mui/icons-material/Security';
import { Avatar, IconButton } from '@mui/material';
import './AuthPages.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.username, formData.password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-enhanced">
      {/* Background Elements */}
      <div className="auth-background-overlay"></div>
      <div className="auth-floating-shapes">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      <Container fluid className="auth-container">
        <Row className="auth-row min-vh-100">
          {/* Left Side - Illustration & Features */}
          <Col lg={7} className="auth-left-panel d-none d-lg-flex">
            <div className="auth-illustration-wrapper">
              {/* Hero Content */}
              <div className="auth-hero-content">
                <div className="auth-logo-section">
                  <div className="auth-logo-wrapper">
                    <AutoStoriesIcon className="auth-logo-icon" />
                  </div>
                  <h1 className="auth-brand-title">Welcome Back!</h1>
                  <p className="auth-brand-subtitle">Continue your journey of sharing amazing stories</p>
                </div>

                {/* Feature Highlights */}
                <div className="auth-features-grid">
                  <div className="feature-card">
                    <div className="feature-icon-wrapper">
                      <AutoStoriesIcon className="feature-icon" />
                    </div>
                    <div className="feature-content">
                      <h4>Your Stories</h4>
                      <p>Access all your published posts and drafts</p>
                    </div>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon-wrapper">
                      <GroupsIcon className="feature-icon" />
                    </div>
                    <div className="feature-content">
                      <h4>Community</h4>
                      <p>Engage with readers and fellow writers</p>
                    </div>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon-wrapper">
                      <TrendingUpIcon className="feature-icon" />
                    </div>
                    <div className="feature-content">
                      <h4>Analytics</h4>
                      <p>Track your post performance and engagement</p>
                    </div>
                  </div>
                </div>

                {/* Welcome Back Message */}
                <div className="welcome-back-section">
                  <div className="welcome-card">
                    <div className="welcome-icon">👋</div>
                    <div className="welcome-content">
                      <h3>Ready to Write?</h3>
                      <p>Your audience is waiting for your next amazing story!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="auth-floating-elements">
                <div className="floating-card card-1">
                  <div className="card-header">
                    <div className="card-avatar"></div>
                    <div className="card-info">
                      <div className="card-title"></div>
                      <div className="card-subtitle"></div>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="content-line"></div>
                    <div className="content-line short"></div>
                  </div>
                </div>

                <div className="floating-card card-2">
                  <div className="card-header">
                    <div className="card-avatar green"></div>
                    <div className="card-info">
                      <div className="card-title"></div>
                      <div className="card-subtitle"></div>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="content-line"></div>
                    <div className="content-line short"></div>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* Right Side - Login Form */}
          <Col lg={5} className="auth-right-panel">
            <div className="auth-form-wrapper">
              <div className="auth-form-container">
                {/* Mobile Logo */}
                <div className="auth-mobile-logo d-lg-none text-center mb-4">
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      margin: '0 auto',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    <LoginIcon style={{ fontSize: 32 }} />
                  </Avatar>
                </div>

                {/* Form Header */}
                <div className="auth-form-header">
                  <h2 className="auth-form-title">Welcome Back</h2>
                  <p className="auth-form-subtitle">
                    Sign in to your account and continue your writing journey
                  </p>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert variant="danger" className="auth-alert-enhanced" dismissible onClose={() => setError('')}>
                    <div className="alert-content">
                      <div className="alert-icon">⚠️</div>
                      <div>{error}</div>
                    </div>
                  </Alert>
                )}

                {/* Login Form */}
                <Form onSubmit={handleSubmit} className="auth-form-enhanced">
                  <div className="form-group-enhanced">
                    <div className="input-icon-wrapper">
                      <PersonIcon className="input-icon" />
                    </div>
                    <FloatingLabel label="Username" className="floating-label-enhanced">
                      <Form.Control
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        autoComplete="username"
                        disabled={loading}
                        className="form-control-enhanced"
                      />
                    </FloatingLabel>
                  </div>

                  <div className="form-group-enhanced">
                    <div className="input-icon-wrapper">
                      <LockIcon className="input-icon" />
                    </div>
                    <FloatingLabel label="Password" className="floating-label-enhanced">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="current-password"
                        disabled={loading}
                        className="form-control-enhanced"
                      />
                    </FloatingLabel>
                    <div className="password-toggle-btn">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        className="toggle-visibility-btn"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </div>
                  </div>

                  <div className="form-options">
                    <Form.Check
                      type="checkbox"
                      id="remember"
                      className="custom-checkbox"
                      label="Remember me"
                    />
                    <RouterLink to="/forgot-password" className="auth-link">
                      Forgot Password?
                    </RouterLink>
                  </div>

                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    className="auth-submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="btn-spinner"></div>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <LoginIcon className="btn-icon" />
                        Sign In
                        <div className="btn-glow"></div>
                      </>
                    )}
                  </Button>
                </Form>

                {/* Register Link */}
                <div className="auth-switch-link">
                  <p>
                    Don't have an account?{' '}
                    <RouterLink to="/register" className="auth-link-primary">
                      Create Account
                    </RouterLink>
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="auth-footer">
                <div className="footer-links">
                  <RouterLink to="/help" className="footer-link">Help</RouterLink>
                  <RouterLink to="/privacy" className="footer-link">Privacy</RouterLink>
                  <RouterLink to="/terms" className="footer-link">Terms</RouterLink>
                </div>
                <p className="footer-copyright">
                  © 2025 Blog App. All rights reserved.
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage; 