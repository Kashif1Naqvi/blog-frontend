import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge, Nav, Dropdown, Modal, Spinner, Alert } from 'react-bootstrap';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import ArticleIcon from '@mui/icons-material/Article';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PublishIcon from '@mui/icons-material/Publish';
import DraftsIcon from '@mui/icons-material/Drafts';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { getMyPosts, deletePost, type Post } from '../services/blogService';
import './MyPostsPage.css';

const MyPostsPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyPosts();
      setPosts(data.results);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPost) return;

    try {
      setDeleting(true);
      await deletePost(selectedPost.id);
      setPosts(posts.filter(post => post.id !== selectedPost.id));
      setShowDeleteModal(false);
      setSelectedPost(null);
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'all') return true;
    if (activeTab === 'published') return post.status === 'published';
    if (activeTab === 'drafts') return post.status === 'draft';
    return true;
  });

  const getTabStats = () => {
    const published = posts.filter(p => p.status === 'published').length;
    const drafts = posts.filter(p => p.status === 'draft').length;
    return { all: posts.length, published, drafts };
  };

  const stats = getTabStats();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatStats = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div className="my-posts-page-enhanced">
      {/* Enhanced Hero Header */}
      <section className="posts-hero-section">
        <div className="hero-gradient-overlay"></div>
        <Container>
          <div className="hero-content-wrapper">
            <div className="hero-text-section">
              <div className="hero-badge">
                <ArticleIcon className="badge-icon" />
                <span>My Content</span>
              </div>
              <h1 className="hero-title">My Posts</h1>
              <p className="hero-subtitle">
                Create, manage, and track your blog posts. Share your thoughts with the world!
              </p>
              
              {/* Hero Stats */}
              <div className="hero-stats-grid">
                <div className="stat-card">
                  <div className="stat-icon-wrapper">
                    <AutoStoriesIcon className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <div className="stat-number">{stats.all}</div>
                    <div className="stat-label">Total Posts</div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon-wrapper published">
                    <PublishIcon className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <div className="stat-number">{stats.published}</div>
                    <div className="stat-label">Published</div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon-wrapper drafts">
                    <DraftsIcon className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <div className="stat-number">{stats.drafts}</div>
                    <div className="stat-label">Drafts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="posts-content-section">
        {/* Error Alert */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)} className="error-alert-enhanced">
            <div className="alert-content">
              <div className="alert-icon">⚠️</div>
              <div>{error}</div>
            </div>
          </Alert>
        )}

        {/* Enhanced Tabs */}
        <div className="tabs-section-enhanced">
          <Nav variant="pills" className="posts-nav-enhanced">
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'all'}
                onClick={() => setActiveTab('all')}
                className="nav-link-enhanced"
              >
                <ArticleIcon className="nav-icon" />
                <span>All Posts</span>
                <Badge className="nav-badge">{stats.all}</Badge>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'published'}
                onClick={() => setActiveTab('published')}
                className="nav-link-enhanced"
              >
                <PublishIcon className="nav-icon" />
                <span>Published</span>
                <Badge className="nav-badge published">{stats.published}</Badge>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'drafts'}
                onClick={() => setActiveTab('drafts')}
                className="nav-link-enhanced"
              >
                <DraftsIcon className="nav-icon" />
                <span>Drafts</span>
                <Badge className="nav-badge drafts">{stats.drafts}</Badge>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'create'} 
                onClick={() => navigate("/posts/create")}
                className="nav-link-enhanced"
              >
                Create
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="loading-section">
            <div className="loading-spinner">
              <Spinner animation="border" variant="primary" />
              <p>Loading your posts...</p>
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="empty-state-enhanced">
            <div className="empty-illustration">
              <ArticleIcon className="empty-icon" />
            </div>
            <h3 className="empty-title">
              {activeTab === 'all' ? 'No posts yet' : 
               activeTab === 'published' ? 'No published posts' : 'No drafts'}
            </h3>
            <p className="empty-description">
              {activeTab === 'all' 
                ? 'Start sharing your thoughts with the world by creating your first post!'
                : activeTab === 'published'
                ? 'Publish your drafts to share them with the community.'
                : 'Save your work as drafts and publish when ready.'}
            </p>
            <Button 
              className="empty-action-btn"
              as={RouterLink as any}
              to="/posts/create"
            >
              <AddIcon className="me-2" />
              Create Your First Post
            </Button>
          </div>
        ) : (
          <Row className="posts-grid-enhanced">
            {filteredPosts.map((post, index) => (
              <Col xl={3} lg={3} md={3} key={post.id} className="mb-4">
                <div className="post-card-enhanced" style={{ animationDelay: `${index * 100}ms` }}>
                  {/* Featured Image */}
                  <div className="post-image-container">
                    {post.featured_image ? (
                      <img 
                        src={post.featured_image} 
                        alt={post.title}
                        className="post-image"
                      />
                    ) : (
                      <div className="post-image-placeholder">
                        <AutoStoriesIcon className="placeholder-icon" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className={`status-badge-enhanced ${post.status}`}>
                      {post.status === 'published' ? (
                        <>
                          <PublishIcon className="status-icon" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <DraftsIcon className="status-icon" />
                          <span>Draft</span>
                        </>
                      )}
                    </div>

                    {/* Quick Actions Overlay */}
                    <div className="quick-actions-overlay">
                      <Button
                        variant="light"
                        size="sm"
                        as={RouterLink as any}
                        to={`/posts/${post.id}`}
                        className="quick-action-btn view"
                      >
                        <VisibilityIcon />
                      </Button>
                      <Button
                        variant="light"
                        size="sm"
                        as={RouterLink as any}
                        to={`/posts/edit/${post.id}`}
                        className="quick-action-btn edit"
                      >
                        <EditIcon />
                      </Button>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="post-content-enhanced">
                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="post-tags-enhanced">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag.id} className="tag-pill-enhanced">
                            {tag.name}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="tag-pill-enhanced more">
                            +{post.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="post-title-enhanced">
                      <RouterLink to={`/posts/${post.id}`} className="title-link">
                        {post.title}
                      </RouterLink>
                    </h3>

                    {/* Excerpt */}
                    <p className="post-excerpt-enhanced">
                      {post.excerpt || post.content.substring(0, 120) + '...'}
                    </p>

                    {/* Enhanced Stats Bar */}
                    <div className="stats-bar-enhanced">
                      <div className="stats-left">
                        <div className="stat-item-enhanced">
                          <VisibilityIcon className="stat-icon views" />
                          <span>{formatStats(post.views_count)}</span>
                        </div>
                        <div className="stat-item-enhanced">
                          <ThumbUpIcon className="stat-icon likes" />
                          <span>{formatStats(post.likes_count)}</span>
                        </div>
                        <div className="stat-item-enhanced">
                          <CommentIcon className="stat-icon comments" />
                          <span>{formatStats(post.comments_count)}</span>
                        </div>
                        <div className="stat-item-enhanced reading-time">
                          <AccessTimeIcon className="stat-icon time" />
                          <span>{post.reading_time}m</span>
                        </div>
                      </div>
                      
                      <Dropdown align="end">
                        <Dropdown.Toggle 
                          variant="link" 
                          className="post-menu-btn"
                        >
                          <MoreVertIcon />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="post-menu-enhanced">
                          <Dropdown.Item as={RouterLink as any} to={`/posts/${post.id}`}>
                            <VisibilityIcon className="menu-icon" />
                            View Post
                          </Dropdown.Item>
                          <Dropdown.Item as={RouterLink as any} to={`/posts/edit/${post.id}`}>
                            <EditIcon className="menu-icon" />
                            Edit Post
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item 
                            className="delete-item"
                            onClick={() => {
                              setSelectedPost(post);
                              setShowDeleteModal(true);
                            }}
                          >
                            <DeleteIcon className="menu-icon" />
                            Delete Post
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>

                    {/* Publication Date */}
                    <div className="post-date-enhanced">
                      <AccessTimeIcon className="date-icon" />
                      <span>
                        {post.status === 'published' && post.published_at
                          ? `Published ${formatDate(post.published_at)}`
                          : `Created ${formatDate(post.created_at)}`}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Enhanced Delete Modal */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => !deleting && setShowDeleteModal(false)}
        centered
        className="delete-modal-enhanced"
      >
        <div className="modal-content-enhanced">
          <Modal.Header className="modal-header-enhanced">
            <div className="modal-icon-wrapper danger">
              <DeleteIcon />
            </div>
            <div>
              <Modal.Title className="modal-title-enhanced">Delete Post?</Modal.Title>
              <p className="modal-subtitle">This action cannot be undone</p>
            </div>
          </Modal.Header>
          
          <Modal.Body className="modal-body-enhanced">
            <div className="delete-confirmation">
              <p>Are you sure you want to delete:</p>
              <div className="post-preview">
                <strong>"{selectedPost?.title}"</strong>
              </div>
              <p className="warning-text">
                This will permanently remove the post and all its comments.
              </p>
            </div>
          </Modal.Body>
          
          <Modal.Footer className="modal-footer-enhanced">
            <Button 
              variant="outline-secondary" 
              onClick={() => setShowDeleteModal(false)}
              disabled={deleting}
              className="cancel-btn-enhanced"
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="delete-btn-enhanced"
            >
              {deleting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <DeleteIcon className="me-2" />
                  Delete Post
                </>
              )}
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
};

export default MyPostsPage;