import { useState, useEffect } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Avatar,
  Stack,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  Divider,
  IconButton,
  Container,
  Button,
  Paper,
  Fade,
  Skeleton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ExploreIcon from '@mui/icons-material/Explore';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import StarIcon from '@mui/icons-material/Star';
import { getPosts, getTags, likePost, bookmarkPost, type Post, type Tag } from '../services/blogService';
import { useAuth } from '../contexts/AuthContext';
import './PostsListPage.css';

const PostsListPage = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [ordering, setOrdering] = useState(searchParams.get('ordering') || '-created_at');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [searchQuery, selectedTag, ordering, currentPage]);

  const loadTags = async () => {
    try {
      const data = await getTags();
      setTags(data);
    } catch (err) {
      console.error('Error loading tags:', err);
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      
      const params: any = {
        page: currentPage,
        ordering,
      };
      
      if (searchQuery) params.search = searchQuery;
      if (selectedTag) params.tag = selectedTag;
      
      const data = await getPosts(params);
      setPosts(data.results);
      setTotalPages(Math.ceil(data.count / 10));
      
      const newParams: any = {};
      if (searchQuery) newParams.search = searchQuery;
      if (selectedTag) newParams.tag = selectedTag;
      if (ordering !== '-created_at') newParams.ordering = ordering;
      if (currentPage > 1) newParams.page = String(currentPage);
      setSearchParams(newParams);
    } catch (err) {
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleTagChange = (tagSlug: string) => {
    setSelectedTag(tagSlug);
    setCurrentPage(1);
  };

  const handleOrderingChange = (value: string) => {
    setOrdering(value);
    setCurrentPage(1);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLikePost = async (postId: number) => {
    if (!isAuthenticated) return;
    
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
    if (!isAuthenticated) return;
    
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

  const getOrderingIcon = (orderType: string) => {
    switch (orderType) {
      case '-created_at': return <NewReleasesIcon />;
      case '-views_count': return <TrendingUpIcon />;
      case '-likes_count': return <LocalFireDepartmentIcon />;
      case '-published_at': return <StarIcon />;
      default: return <NewReleasesIcon />;
    }
  };

  const getOrderingLabel = (orderType: string) => {
    switch (orderType) {
      case '-created_at': return 'Latest Posts';
      case '-views_count': return 'Most Viewed';
      case '-likes_count': return 'Most Liked';
      case '-published_at': return 'Recently Published';
      default: return 'Latest Posts';
    }
  };

  return (
    <div className="posts-list-page-modern">
      {/* Hero Header */}
      <section className="discover-hero-section">
        <div className="hero-background-pattern"></div>
        <Container maxWidth="lg">
          <Box className="hero-content">
            <Fade in timeout={800}>
              <Box className="hero-icon-wrapper">
                <ExploreIcon className="hero-main-icon" />
              </Box>
            </Fade>
            
            <Fade in timeout={1000}>
              <Box className="hero-text-content">
                <Typography variant="h2" className="hero-title">
                  Discover Amazing
                  <span className="gradient-text"> Stories</span>
                </Typography>
                <Typography variant="h6" className="hero-subtitle">
                  Explore the latest articles, insights, and stories from our vibrant community
                </Typography>
                <Box className="hero-stats">
                  <div className="stat-item">
                    <AutoStoriesIcon className="stat-icon" />
                    <span className="stat-number">{posts.length}+</span>
                    <span className="stat-label">Posts</span>
                  </div>
                  <div className="stat-item">
                    <TrendingUpIcon className="stat-icon" />
                    <span className="stat-number">{tags.length}+</span>
                    <span className="stat-label">Topics</span>
                  </div>
                </Box>
              </Box>
            </Fade>
          </Box>
        </Container>
      </section>

      {/* Filters & Search */}
      <section className="filters-section-modern">
        <Container maxWidth="lg">
          <Paper className="filters-container" elevation={0}>
            {/* Search Bar */}
            <Box className="search-section">
              <TextField
                fullWidth
                placeholder="Search posts, authors, or topics..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-field-modern"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="search-icon" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Filter Controls */}
            <Box className="filter-controls">
              <FormControl className="sort-control">
                <InputLabel className="control-label">Sort By</InputLabel>
                <Select
                  value={ordering}
                  label="Sort By"
                  onChange={(e) => handleOrderingChange(e.target.value)}
                  className="sort-select"
                  startAdornment={
                    <InputAdornment position="start">
                      {getOrderingIcon(ordering)}
                    </InputAdornment>
                  }
                >
                  <MenuItem value="-created_at">Latest Posts</MenuItem>
                  <MenuItem value="-published_at">Recently Published</MenuItem>
                  <MenuItem value="-views_count">Most Viewed</MenuItem>
                  <MenuItem value="-likes_count">Most Liked</MenuItem>
                </Select>
              </FormControl>

              <Box className="active-filters">
                {selectedTag && (
                  <Chip
                    label={`Topic: ${tags.find(t => t.slug === selectedTag)?.name}`}
                    onDelete={() => handleTagChange('')}
                    className="active-filter-chip"
                    deleteIcon={<Box>×</Box>}
                  />
                )}
                {searchQuery && (
                  <Chip
                    label={`Search: "${searchQuery}"`}
                    onDelete={() => setSearchQuery('')}
                    className="active-filter-chip"
                    deleteIcon={<Box>×</Box>}
                  />
                )}
              </Box>
            </Box>

            {/* Tag Pills */}
            {tags.length > 0 && (
              <Box className="tags-section">
                <Typography variant="subtitle2" className="tags-label">
                  <FilterListIcon className="tags-icon" />
                  Filter by Topic
                </Typography>
                <Box className="tags-container">
                  <Chip
                    label="All Topics"
                    onClick={() => handleTagChange('')}
                    className={`tag-pill ${selectedTag === '' ? 'active' : ''}`}
                    icon={<AutoStoriesIcon />}
                  />
                  {tags.slice(0, 8).map((tag) => (
                    <Chip
                      key={tag.id}
                      label={tag.name}
                      onClick={() => handleTagChange(tag.slug)}
                      className={`tag-pill ${selectedTag === tag.slug ? 'active' : ''}`}
                    />
                  ))}
                  {tags.length > 8 && (
                    <Chip
                      label={`+${tags.length - 8} more`}
                      className="tag-pill more-tags"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
            )}

            {/* Results Info */}
            <Box className="results-info">
              <Typography variant="body2" className="results-text">
                {getOrderingIcon(ordering)}
                <span>{getOrderingLabel(ordering)}</span>
                {selectedTag && (
                  <span> in <strong>{tags.find(t => t.slug === selectedTag)?.name}</strong></span>
                )}
              </Typography>
            </Box>
          </Paper>
        </Container>
      </section>

      {/* Posts Grid */}
      <section className="posts-grid-section">
        <Container maxWidth="lg">
          {loading ? (
            <Grid container spacing={4}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Card className="post-skeleton-card">
                    <Skeleton variant="rectangular" height={220} />
                    <CardContent>
                      <Skeleton variant="text" width="60%" height={24} />
                      <Skeleton variant="text" width="100%" height={20} />
                      <Skeleton variant="text" width="80%" height={20} />
                      <Box sx={{ mt: 2 }}>
                        <Skeleton variant="circular" width={40} height={40} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : posts.length === 0 ? (
            <Box className="empty-state-modern">
              <div className="empty-illustration">
                <SearchIcon className="empty-icon" />
              </div>
              <Typography variant="h5" className="empty-title">
                No posts found
              </Typography>
              <Typography variant="body1" className="empty-description">
                Try adjusting your search terms or explore different topics
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag('');
                }}
                className="empty-action-btn"
                startIcon={<AutoStoriesIcon />}
              >
                Browse All Posts
              </Button>
            </Box>
          ) : (
            <>
              <Grid container spacing={4}>
                {posts.map((post, index) => (
                  <Grid item xs={12} md={6} lg={4} key={post.id}>
                    <Fade in timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
                      <Card
                        component={RouterLink}
                        to={`/posts/${post.id}`}
                        className="modern-post-card"
                        elevation={0}
                      >
                        {/* Featured Image */}
                        <Box className="card-image-container">
                          {post.featured_image ? (
                            <CardMedia
                              component="img"
                              height="240"
                              image={post.featured_image}
                              alt={post.title}
                              className="card-image"
                            />
                          ) : (
                            <Box className="card-image-placeholder">
                              <AutoStoriesIcon className="placeholder-icon" />
                              <Typography variant="caption" className="placeholder-text">
                                No Image
                              </Typography>
                            </Box>
                          )}

                          {/* Status Badge */}
                          <Chip
                            label={post.status === 'published' ? '✨ Published' : '📝 Draft'}
                            size="small"
                            className={`status-badge ${post.status}`}
                          />

                          {/* Quick Actions */}
                          <Box className="card-quick-actions">
                            {isAuthenticated && (
                              <>
                                <IconButton
                                  size="small"
                                  className="action-btn like-btn"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleLikePost(post.id);
                                  }}
                                >
                                  {post.is_liked ? (
                                    <FavoriteIcon className="liked" />
                                  ) : (
                                    <FavoriteBorderIcon />
                                  )}
                                </IconButton>
                                <IconButton
                                  size="small"
                                  className="action-btn bookmark-btn"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleBookmarkPost(post.id);
                                  }}
                                >
                                  {post.is_bookmarked ? (
                                    <BookmarkIcon className="bookmarked" />
                                  ) : (
                                    <BookmarkBorderIcon />
                                  )}
                                </IconButton>
                                <IconButton
                                  size="small"
                                  className="action-btn share-btn"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                >
                                  <ShareIcon />
                                </IconButton>
                              </>
                            )}
                          </Box>

                          {/* Reading Time Badge */}
                          <Box className="reading-time-badge">
                            <AccessTimeIcon />
                            <span>{post.reading_time}m read</span>
                          </Box>
                        </Box>

                        {/* Card Content */}
                        <CardContent className="card-content-modern">
                          {/* Tags */}
                          {post.tags.length > 0 && (
                            <Box className="card-tags">
                              {post.tags.slice(0, 2).map((tag) => (
                                <Chip
                                  key={tag.id}
                                  label={tag.name}
                                  size="small"
                                  className="content-tag"
                                />
                              ))}
                              {post.tags.length > 2 && (
                                <Chip
                                  label={`+${post.tags.length - 2}`}
                                  size="small"
                                  className="content-tag more-tags"
                                />
                              )}
                            </Box>
                          )}

                          {/* Title */}
                          <Typography variant="h6" className="card-title">
                            {post.title}
                          </Typography>

                          {/* Excerpt */}
                          <Typography variant="body2" className="card-excerpt">
                            {post.excerpt || post.content.substring(0, 120) + '...'}
                          </Typography>

                          {/* Stats Bar */}
                          <Box className="card-stats-bar">
                            <Box className="stats-left">
                              <div className="stat-item">
                                <FavoriteIcon className="stat-icon likes" />
                                <span>{post.likes_count}</span>
                              </div>
                              <div className="stat-item">
                                <ChatBubbleOutlineIcon className="stat-icon comments" />
                                <span>{post.comments_count}</span>
                              </div>
                              <div className="stat-item">
                                <VisibilityIcon className="stat-icon views" />
                                <span>{post.views_count}</span>
                              </div>
                            </Box>
                          </Box>

                          {/* Author Info */}
                          <Box className="card-author">
                            <Avatar
                              src={post.author.profile_picture || undefined}
                              className="author-avatar"
                            >
                              {post.author.username.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box className="author-info">
                              <Typography variant="subtitle2" className="author-name">
                                {post.author.username}
                              </Typography>
                              <Typography variant="caption" className="publish-date">
                                {new Date(post.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box className="pagination-section">
                  <Paper className="pagination-container" elevation={0}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                      className="pagination-control"
                      showFirstButton
                      showLastButton
                    />
                    <Typography variant="body2" className="pagination-info">
                      Page {currentPage} of {totalPages}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </>
          )}
        </Container>
      </section>
    </div>
  );
};

export default PostsListPage;