import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { Avatar } from '@mui/material';
import { getPosts, likePost, bookmarkPost, type Post } from '../services/blogService';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPosts({
        status: 'published',
        ordering: '-views_count',
        page: 1,
      });
      setPosts(data.results.slice(0, 6));
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId: number) => {
    try {
      const result = await likePost(postId);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, is_liked: result.status === 'liked', likes_count: result.likes_count }
            : post
        )
      );
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleBookmarkPost = async (postId: number) => {
    try {
      const result = await bookmarkPost(postId);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, is_bookmarked: result.status === 'bookmarked' }
            : post
        )
      );
    } catch (err) {
      console.error('Error bookmarking post:', err);
    }
  };

  return (
    <div className="home-page-modern">
      {/* Enhanced Hero Section */}
      <section className="hero-section-modern">
        <div className="hero-background-overlay"></div>
        <Container>
          <Row className="hero-row align-items-center min-vh-75">
            {/* Left Content */}
            <Col lg={4} xl={5} className="hero-content-col">
              <div className="hero-content-wrapper">
                
                
                <div className="hero-title-section">
                  <h1 className="hero-title animate-fade-in-up">
                    Discover Amazing
                    <span className="hero-title-highlight">Stories & Ideas</span>
                  </h1>
                  <div className="hero-actions animate-fade-in-up">
                    
                    {!isAuthenticated && (
                      <Button 
                        as={Link} 
                        to="/register" 
                        variant="outline-light" 
                        size="lg"
                        className="btn-hero-secondary btn-info verified-badge-enhanced "
                      >
                        Join Community
                      </Button>
                    )}
                  </div>
                </div>
                
                
                {/* Hero Stats */}
                <div className="hero-stats animate-fade-in-up">
                  <div className="stat-item">
                    <div className="stat-number">{posts.length}+</div>
                    <div className="stat-label">Posts</div>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <div className="stat-number">1K+</div>
                    <div className="stat-label">Writers</div>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <div className="stat-number">5K+</div>
                    <div className="stat-label">Readers</div>
                  </div>
                </div>
              </div>
            </Col>
            
            {/* Right Illustration */}
            <Col lg={8} xl={7} className="hero-illustration-col">
              <div className="hero-illustration-wrapper">
                <div className="hero-main-visual">
                  {/* Floating Cards */}
                  <div className="floating-card card-1">
                    <div className="card-header">
                      <div className="card-avatar"></div>
                      <div className="card-info">
                        <div className="card-title"></div>
                        <div className="card-date"></div>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="content-line"></div>
                      <div className="content-line short"></div>
                    </div>
                  </div>
                  
                  <div className="floating-card card-2">
                    <div className="card-header">
                      <div className="card-avatar"></div>
                      <div className="card-info">
                        <div className="card-title"></div>
                        <div className="card-date"></div>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="content-line"></div>
                      <div className="content-line short"></div>
                    </div>
                  </div>
                  
                  <div className="floating-card card-3">
                    <div className="card-header">
                      <div className="card-avatar"></div>
                      <div className="card-info">
                        <div className="card-title"></div>
                        <div className="card-date"></div>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="content-line"></div>
                      <div className="content-line short"></div>
                    </div>
                  </div>
                  
                  {/* Central Icon */}
                  <div className="hero-central-icon">
                    <div className="icon-wrapper">
                      <AutoStoriesIcon className="main-icon" />
                    </div>
                    <div className="icon-glow"></div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="decoration-circle circle-1"></div>
                  <div className="decoration-circle circle-2"></div>
                  <div className="decoration-circle circle-3"></div>
                  
                  {/* Floating Icons */}
                  <div className="floating-icon icon-1">💡</div>
                  <div className="floating-icon icon-2">📝</div>
                  <div className="floating-icon icon-3">🚀</div>
                  <div className="floating-icon icon-4">✨</div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Posts Section */}
      <section className="section-modern">
        <Container>
          <div className="section-header text-center mb-5">
            <div className="section-badge">📚 Featured</div>
            <h2 className="section-title gradient-text">Latest Stories</h2>
            <p className="section-subtitle text-muted">
              Discover the most engaging content from our community
            </p>
          </div>

          {loading ? (
            <Row>
              {[...Array(6)].map((_, i) => (
                <Col key={i} lg={4} md={6} className="mb-4">
                  <div className="card-skeleton">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-content">
                      <div className="skeleton-line"></div>
                      <div className="skeleton-line short"></div>
                      <div className="skeleton-line"></div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <Row className="g-4">
              {posts.map((post, index) => (
                <Col key={post.id} lg={4} md={6} className="mb-4">
                  <Card 
                    as={Link} 
                    to={`/posts/${post.id}`} 
                    className="post-card-modern h-100 text-decoration-none animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Card Image */}
                    <div className="post-image-container">
                      {post.featured_image ? (
                        <Card.Img 
                          variant="top" 
                          src={post.featured_image} 
                          alt={post.title}
                          className="post-image"
                        />
                      ) : (
                        <div className="post-image-placeholder">
                          <AutoStoriesIcon />
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className="post-status-badge">
                        {post.status === 'published' ? '🌟 Published' : '📝 Draft'}
                      </div>
                      
                      {/* Quick Actions */}
                      {isAuthenticated && (
                        <div className="post-quick-actions">
                          <div 
                            className="action-btn like-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleLikePost(post.id);
                            }}
                          >
                            {post.is_liked ? (
                              <FavoriteIcon className="text-danger" />
                            ) : (
                              <FavoriteBorderIcon />
                            )}
                          </div>
                          <div 
                            className="action-btn bookmark-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleBookmarkPost(post.id);
                            }}
                          >
                            {post.is_bookmarked ? (
                              <BookmarkIcon className="text-primary" />
                            ) : (
                              <BookmarkBorderIcon />
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <Card.Body className="d-flex flex-column p-4">
                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="post-tags mb-3">
                          {post.tags.slice(0, 2).map(tag => (
                            <span key={tag.id} className="tag-modern">
                              {tag.name}
                            </span>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="tag-modern">+{post.tags.length - 2}</span>
                          )}
                        </div>
                      )}

                      {/* Title */}
                      <Card.Title className="post-title mb-3">
                        {post.title}
                      </Card.Title>

                      {/* Excerpt */}
                      <Card.Text className="post-excerpt text-muted mb-4 flex-grow-1">
                        {post.excerpt || post.content.substring(0, 120) + '...'}
                      </Card.Text>

                      {/* Stats */}
                      <div className="post-stats mb-3">
                        <div className="stat-item">
                          <AccessTimeIcon />
                          <span>{post.reading_time}m read</span>
                        </div>
                        <div className="stat-item">
                          <FavoriteIcon />
                          <span>{post.likes_count}</span>
                        </div>
                        <div className="stat-item">
                          <ChatBubbleOutlineIcon />
                          <span>{post.comments_count}</span>
                        </div>
                        <div className="stat-item ms-auto">
                          <VisibilityIcon />
                          <span>{post.views_count}</span>
                        </div>
                      </div>

                      {/* Author */}
                      <div className="post-author">
                        <Avatar 
                          src={post.author.profile_picture || undefined}
                          className="author-avatar"
                        >
                          {post.author.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <div className="author-info">
                          <div className="author-name">{post.author.username}</div>
                          <small className="author-date text-muted">
                            {new Date(post.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* View All Button */}
          <div className="text-center mt-5">
            <Button 
              as={Link} 
              to="/posts" 
              size="lg"
              className="btn-modern btn-glass"
            >
              <AutoStoriesIcon className="me-2" />
              View All Posts
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;