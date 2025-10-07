import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, FloatingLabel } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SecurityIcon from '@mui/icons-material/Security';
import GroupsIcon from '@mui/icons-material/Groups';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Avatar, IconButton } from '@mui/material';
import './AuthPages.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(formData.username, formData.email, formData.password, formData.confirmPassword);
      navigate('/');
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData) {
        const errorMessage = Object.entries(errorData)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        setError(errorMessage);
      } else {
        setError('Registration failed. Please try again.');
      }
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
                  <h1 className="auth-brand-title">Blog App</h1>
                  <p className="auth-brand-subtitle">Share your stories with the world</p>
                </div>

                {/* Feature Highlights */}
                <div className="auth-features-grid">
                  <div className="feature-card">
                    <div className="feature-icon-wrapper">
                      <GroupsIcon className="feature-icon" />
                    </div>
                    <div className="feature-content">
                      <h4>Join Community</h4>
                      <p>Connect with thousands of writers and readers</p>
                    </div>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon-wrapper">
                      <SecurityIcon className="feature-icon" />
                    </div>
                    <div className="feature-content">
                      <h4>Secure Platform</h4>
                      <p>Your data is safe with enterprise-grade security</p>
                    </div>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon-wrapper">
                      <TrendingUpIcon className="feature-icon" />
                    </div>
                    <div className="feature-content">
                      <h4>Grow Your Audience</h4>
                      <p>Build your following and increase engagement</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="auth-stats">
                  <div className="stat-item">
                    <div className="stat-number">10K+</div>
                    <div className="stat-label">Active Writers</div>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <div className="stat-number">50K+</div>
                    <div className="stat-label">Stories Published</div>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <div className="stat-number">100K+</div>
                    <div className="stat-label">Happy Readers</div>
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

                <div className="floating-card card-3">
                  <div className="card-header">
                    <div className="card-avatar purple"></div>
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

          {/* Right Side - Registration Form */}
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
                    <PersonAddIcon style={{ fontSize: 32 }} />
                  </Avatar>
                </div>

                {/* Form Header */}
                <div className="auth-form-header">
                  <h2 className="auth-form-title">Create Your Account</h2>
                  <p className="auth-form-subtitle">
                    Join our community and start sharing your amazing stories
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

                {/* Registration Form */}
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
                      <EmailIcon className="input-icon" />
                    </div>
                    <FloatingLabel label="Email Address" className="floating-label-enhanced">
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
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
                        autoComplete="new-password"
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

                  <div className="form-group-enhanced">
                    <div className="input-icon-wrapper">
                      <LockIcon className="input-icon" />
                    </div>
                    <FloatingLabel label="Confirm Password" className="floating-label-enhanced">
                      <Form.Control
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                        disabled={loading}
                        className="form-control-enhanced"
                      />
                    </FloatingLabel>
                    <div className="password-toggle-btn">
                      <IconButton
                        size="small"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="toggle-visibility-btn"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </div>
                  </div>

                  <div className="form-check-enhanced">
                    <Form.Check
                      type="checkbox"
                      id="terms"
                      className="custom-checkbox"
                      label={
                        <span className="checkbox-label">
                          I agree to the{' '}
                          <Link to="/terms" className="auth-link">
                            Terms & Conditions
                          </Link>{' '}
                          and{' '}
                          <Link to="/privacy" className="auth-link">
                            Privacy Policy
                          </Link>
                        </span>
                      }
                      required
                    />
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
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <PersonAddIcon className="btn-icon" />
                        Create Account
                        <div className="btn-glow"></div>
                      </>
                    )}
                  </Button>
                </Form>
                {/* Login Link */}
                <div className="auth-switch-link">
                  <p>
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link-primary">
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="auth-footer">
                <div className="footer-links">
                  <Link to="/help" className="footer-link">Help</Link>
                  <Link to="/privacy" className="footer-link">Privacy</Link>
                  <Link to="/terms" className="footer-link">Terms</Link>
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

export default RegisterPage;