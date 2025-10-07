import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CreateIcon from '@mui/icons-material/Create';
import { Avatar } from '@mui/material';
import { getPosts, likePost, bookmarkPost, type Post } from '../services/blogService';
import './PostsPage.css';

const PostsPage = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('-created_at');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [searchQuery, selectedTag, sortBy, page]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setSelectedTag('null')
      const data = await getPosts({
        status: 'published',
        search: searchQuery || undefined,
        tags: selectedTag || undefined,
        ordering: sortBy,
        page: page,
      });
      
      if (page === 1) {
        setPosts(data.results);
      } else {
        setPosts(prev => [...prev, ...data.results]);
      }
      
      setHasMore(!!data.next);
    } catch (err) {
      console.error('Error loading posts:', err);
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
    <div className="posts-page-modern">
      <Container fluid className="px-4">
        {/* Header */}
        <div className="page-header mb-5">
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="page-title gradient-text">All Posts</h1>
              <p className="page-subtitle text-muted">
                Discover amazing stories from our community
              </p>
            </Col>
            <Col md={4} className="text-end">
              {isAuthenticated && (
                <Button 
                  as={RouterLink as any} 
                  to="/create-post"
                  className="btn-modern btn-primary-modern"
                >
                  <CreateIcon className="me-2" />
                  Write Post
                </Button>
              )}
            </Col>
          </Row>
        </div>

        {/* Filters */}
        <div className="filters-section mb-5">
          <Row>
            <Col lg={8}>
              <div className="search-wrapper">
                <Form.Control
                  type="text"
                  placeholder="Search posts, authors, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <SearchIcon className="search-icon" />
              </div>
            </Col>
            <Col lg={4}>
              <Form.Select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="-created_at">Latest First</option>
                <option value="created_at">Oldest First</option>
                <option value="-likes_count">Most Liked</option>
                <option value="-views_count">Most Viewed</option>
              </Form.Select>
            </Col>
          </Row>
        </div>

        {/* Posts Grid */}
        {loading && page === 1 ? (
          <Row className="g-4">
            {[...Array(9)].map((_, i) => (
              <Col key={i} xl={4} lg={6} md={6} className="mb-4">
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
          <>
            <Row className="g-4">
              {posts.map((post, index) => (
                <Col key={post.id} xl={4} lg={6} md={6} className="mb-4">
                  <Card 
                    as={RouterLink as any} 
                    to={`/posts/${post.id}`} 
                    className="post-card-modern h-100 text-decoration-none animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
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
                          <span>{post.reading_time}m</span>
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
                              day: 'numeric'
                            })}
                          </small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-5">
                <Button
                  onClick={() => setPage(p => p + 1)}
                  disabled={loading}
                  className="btn-modern btn-glass"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <CreateIcon className="me-2" />
                      Load More Posts
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default PostsPage;