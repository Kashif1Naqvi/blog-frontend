import { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Modal, Spinner, Alert, Image } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import {  Typography, Chip, IconButton } from '@mui/material';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, updateUserInfo } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      bio: user?.bio || '',
      profile_picture: null as File | null,
    },
    validationSchema: Yup.object({
      bio: Yup.string().max(500, 'Bio must be 500 characters or less'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');
        
        const formData = new FormData();
        formData.append('bio', values.bio);
        
        if (values.profile_picture) {
          formData.append('profile_picture', values.profile_picture);
        }
        
        updateUserInfo();
        setSuccess('Profile updated successfully! ✨');
        setShowEditModal(false);
        
        setTimeout(() => setSuccess(''), 4000);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to update profile');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      const file = e.currentTarget.files[0];
      formik.setFieldValue('profile_picture', file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (user?.profile_picture) {
      setImagePreview(user.profile_picture);
    }
  }, [user]);

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <Typography variant="h6" className="mt-3">Loading your profile...</Typography>
        </div>
      </Container>
    );
  }

  return (
    <div className="profile-page-enhanced">
      {/* Enhanced Hero Section with Glassmorphism */}
      <section className="profile-hero-enhanced">
        <div className="hero-gradient-bg"></div>
        <div className="hero-pattern-overlay"></div>
        
        <Container>
          <div className="profile-glassmorphism-card">
            {/* Profile Header */}
            <div className="profile-header-enhanced">
              <div className="profile-avatar-section-enhanced">
                <div className="avatar-glow-wrapper">
                  <div className="profile-avatar-enhanced">
                    {user.profile_picture ? (
                      <Image 
                        src={user.profile_picture} 
                        alt={user.username}
                        className="profile-image-enhanced"
                      />
                    ) : (
                      <div className="profile-avatar-placeholder-enhanced">
                        <PersonIcon className="placeholder-icon-enhanced" />
                      </div>
                    )}
                    <div className="profile-status-glow"></div>
                  </div>
                </div>
                
                <Button 
                  className="edit-profile-btn-enhanced"
                  onClick={() => setShowEditModal(true)}
                >
                  <EditIcon className="btn-icon" />
                  Edit Profile
                </Button>
              </div>

              <div className="profile-info-enhanced">
                <div className="profile-name-section-enhanced">
                  <h1 className="profile-name-enhanced">{user.username}</h1>
                  <div className="profile-badges">
                    <Chip 
                      icon={<VerifiedIcon className="badge-icon" />}
                      label="Member" 
                      className="member-badge-enhanced"
                      size="small"
                    />
                    <Chip 
                      icon={<StarIcon className="badge-icon" />}
                      label="Verified" 
                      className="verified-badge-enhanced"
                      size="small"
                    />
                  </div>
                </div>

                <div className="profile-details-enhanced">
                  <div className="detail-card">
                    <EmailIcon className="detail-icon-enhanced" />
                    <div className="detail-content">
                      <span className="detail-label">Email Address</span>
                      <span className="detail-value">{user.email}</span>
                    </div>
                  </div>
                  
                  <div className="detail-card">
                    <CalendarTodayIcon className="detail-icon-enhanced" />
                    <div className="detail-content">
                      <span className="detail-label">Member Since</span>
                      <span className="detail-value">
                        {new Date().toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>

                  {user.bio && (
                    <div className="detail-card bio-card">
                      <PersonIcon className="detail-icon-enhanced" />
                      <div className="detail-content">
                        <span className="detail-label">About Me</span>
                        <span className="detail-value bio-text">{user.bio}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Enhanced Alerts */}
      <Container className="alerts-section">
        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess('')} className="alert-enhanced success">
            <div className="alert-content-enhanced">
              <div className="alert-icon">✨</div>
              <div className="alert-text">{success}</div>
            </div>
          </Alert>
        )}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')} className="alert-enhanced error">
            <div className="alert-content-enhanced">
              <div className="alert-icon">⚠️</div>
              <div className="alert-text">{error}</div>
            </div>
          </Alert>
        )}
      </Container>

      {/* Compact About Section */}
      <Container className="about-section-container">
        <Card className="about-card-enhanced">
          <Card.Body className="about-content-enhanced">
            <div className="about-header">
              <div className="about-icon-wrapper">
                <PersonIcon className="about-main-icon" />
              </div>
              <h4 className="about-title-enhanced">About {user.username}</h4>
              <p className="about-subtitle">Member profile and details</p>
            </div>
            
            <div className="about-info-grid">
              <div className="info-item-enhanced">
                <div className="info-icon-circle">
                  <PersonIcon />
                </div>
                <div className="info-content">
                  <h6 className="info-title">Username</h6>
                  <p className="info-value">{user.username}</p>
                </div>
              </div>

              <div className="info-item-enhanced">
                <div className="info-icon-circle">
                  <EmailIcon />
                </div>
                <div className="info-content">
                  <h6 className="info-title">Email</h6>
                  <p className="info-value">{user.email}</p>
                </div>
              </div>

              <div className="info-item-enhanced">
                <div className="info-icon-circle">
                  <CalendarTodayIcon />
                </div>
                <div className="info-content">
                  <h6 className="info-title">Joined</h6>
                  <p className="info-value">
                    {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>
              </div>

              {/* Bio Section - Only show if bio exists or as full-width item */}
              <div className="info-item-enhanced bio-item">
                <div className="info-icon-circle">
                  <AutoFixHighIcon />
                </div>
                <div className="info-content">
                  <h6 className="info-title">Bio</h6>
                  <p className="info-value bio-enhanced">
                    {user.bio || (
                      <span className="no-bio">
                        <em>No bio provided yet. Click "Update Profile" to add one!</em>
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Compact Call to Action */}
            <div className="cta-section-enhanced">
              <div className="cta-illustration">
                <AutoFixHighIcon className="cta-icon" />
                <div className="cta-sparkles">
                  <span className="sparkle">✨</span>
                  <span className="sparkle">🌟</span>
                  <span className="sparkle">💫</span>
                </div>
              </div>
              <div className="cta-content-enhanced">
                <h5 className="cta-title-enhanced">Complete Your Profile</h5>
                <p className="cta-description-enhanced">
                  Add a personal bio and make your profile shine!
                </p>
                <Button 
                  className="btn-info verified-badge-enhanced cta-btn-enhanced"
                  onClick={() => setShowEditModal(true)}
                >
                  <AutoFixHighIcon style={{ fontSize: '18px' }} />
                  <span>Update Profile</span>
                  <div className="btn-glow"></div>
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>

      {/* Enhanced Edit Profile Modal */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)}
        centered
        size="sm"
        className="edit-modal-enhanced m-4"
      >
        <div className="modal-content-enhanced">
          <Modal.Header className="modal-header-enhanced">
            <div className="modal-title-section-enhanced">
              <div className="modal-icon-wrapper">
                <EditIcon className="modal-icon-enhanced" />
              </div>
              <div>
                <h4 className="modal-title-enhanced">Edit Profile</h4>
                <p className="modal-subtitle">Update your information and make it shine</p>
              </div>
            </div>
            <IconButton 
              onClick={() => setShowEditModal(false)}
              className="modal-close-btn-enhanced"
            >
              <CloseIcon />
            </IconButton>
          </Modal.Header>

          <Form onSubmit={formik.handleSubmit}>
            <Modal.Body className="modal-body-enhanced">
              {/* Enhanced Avatar Section */}
              <div className="edit-avatar-section-enhanced">
                <div className="avatar-preview-container">
                  <div className="avatar-preview-enhanced">
                    {imagePreview ? (
                      <Image 
                        src={imagePreview} 
                        alt="Preview"
                        className="preview-image-enhanced"
                      />
                    ) : (
                      <div className="preview-placeholder-enhanced">
                        <PersonIcon className="placeholder-icon-large-enhanced" />
                      </div>
                    )}
                    <div className="avatar-overlay-enhanced">
                      <CameraAltIcon className="camera-icon-enhanced" />
                      <span>Change Photo</span>
                    </div>
                  </div>
                </div>

                <div className="avatar-actions-enhanced">
                  <Form.Label className="upload-btn-enhanced">
                    <CameraAltIcon className="upload-icon" />
                    Choose New Photo
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      hidden
                    />
                  </Form.Label>
                  <p className="upload-hint-enhanced">
                    Recommended: Square image, at least 400x400px (JPG, PNG)
                  </p>
                </div>
              </div>

              {/* Enhanced Bio Section */}
              <div className="edit-bio-section-enhanced">
                <Form.Group>
                  <Form.Label className="form-label-enhanced">
                    <AutoFixHighIcon className="label-icon-enhanced" />
                    <span>Tell Your Story</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="bio"
                    placeholder="Share something interesting about yourself, your passions, hobbies, or what makes you unique..."
                    value={formik.values.bio}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.bio && !!formik.errors.bio}
                    className="textarea-enhanced"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.bio}
                  </Form.Control.Feedback>
                  <div className="character-count-enhanced">
                    <span className={`count ${formik.values.bio.length > 400 ? 'warning' : ''}`}>
                      {formik.values.bio.length}/500 characters
                    </span>
                  </div>
                </Form.Group>
              </div>
            </Modal.Body>

            <Modal.Footer className="modal-footer-enhanced">
              <Button 
                variant="outline-secondary" 
                onClick={() => setShowEditModal(false)}
                disabled={loading}
                className="cancel-btn-enhanced"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
                className="save-btn-enhanced"
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <SaveIcon className="btn-icon" />
                    <span>Save Changes</span>
                    <div className="btn-shine"></div>
                  </>
                )}
              </Button>
            </Modal.Footer>
            </Form>
          </div>
        </Modal>
      </div>
  );
};

export default ProfilePage;