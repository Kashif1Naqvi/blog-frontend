import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Alert, Spinner, Image } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import SaveIcon from '@mui/icons-material/Save';
import PublishIcon from '@mui/icons-material/Publish';
import { createPost, updatePost, getPost } from '../services/blogService';
import './PostFormPage.css';

const PostFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      excerpt: '',
      featured_image: null as File | null,
      tags: [] as string[],
      status: 'draft' as 'draft' | 'published',
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required('Title is required')
        .min(5, 'Title must be at least 5 characters')
        .max(200, 'Title must be less than 200 characters'),
      content: Yup.string()
        .required('Content is required')
        .min(50, 'Content must be at least 50 characters'),
      excerpt: Yup.string()
        .max(500, 'Excerpt must be less than 500 characters'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('content', values.content);
        formData.append('excerpt', values.excerpt);
        formData.append('status', values.status);
        
        if (values.featured_image) {
          formData.append('featured_image', values.featured_image);
        }
        
        if (values.tags.length > 0) {
          values.tags.forEach(tag => {
            formData.append('tags', tag);
          });
        }
        
        if (isEditing) {
          await updatePost(Number(id), formData);
        } else {
          await createPost(formData);
        }
        
        navigate('/my-posts');
      } catch (err: any) {
        console.error('Error saving post:', err);
        setError(err.response?.data?.message || 'Failed to save post. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (isEditing) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const post = await getPost(Number(id));
      
      formik.setValues({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        featured_image: null,
        tags: post.tags.map(tag => tag.name),
        status: post.status,
      });
      
      if (post.featured_image) {
        setImagePreview(post.featured_image);
      }
    } catch (err) {
      console.error('Error loading post:', err);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      const file = event.currentTarget.files[0];
      formik.setFieldValue('featured_image', file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !formik.values.tags.includes(trimmedTag)) {
      formik.setFieldValue('tags', [...formik.values.tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    formik.setFieldValue(
      'tags',
      formik.values.tags.filter(tag => tag !== tagToRemove)
    );
  };

  const handleTagInputKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTag();
    }
  };

  if (loading && isEditing) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <div className="post-form-page">
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="mb-4">
              <h2 className="fw-bold mb-2">
                {isEditing ? 'Edit Post' : 'Create New Post'}
              </h2>
              <p className="text-muted">
                {isEditing ? 'Update your post details' : 'Share your thoughts with the community'}
              </p>
            </div>

            {error && (
              <Alert variant="danger" dismissible onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <Form onSubmit={formik.handleSubmit}>
                  {/* Title */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Title *</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      placeholder="Enter an engaging title for your post"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.title && !!formik.errors.title}
                      size="lg"
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.title}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Content */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Content *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={12}
                      name="content"
                      placeholder="Write your post content here..."
                      value={formik.values.content}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.content && !!formik.errors.content}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.content}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Excerpt */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Excerpt (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="excerpt"
                      placeholder="Brief summary of your post"
                      value={formik.values.excerpt}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.excerpt && !!formik.errors.excerpt}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.excerpt}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Leave empty to auto-generate from content
                    </Form.Text>
                  </Form.Group>

                  {/* Featured Image */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Featured Image</Form.Label>
                    
                    {imagePreview && (
                      <div className="mb-3 position-relative">
                        <Image 
                          src={imagePreview} 
                          alt="Preview" 
                          fluid 
                          rounded
                          style={{ maxHeight: 300, objectFit: 'cover' }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0 m-2"
                          onClick={() => {
                            setImagePreview(null);
                            formik.setFieldValue('featured_image', null);
                          }}
                        >
                          <CloseIcon style={{ fontSize: 18 }} />
                        </Button>
                      </div>
                    )}
                    
                    <div className="d-grid">
                      <Form.Label className="btn btn-outline-primary">
                        <ImageIcon style={{ fontSize: 20, marginRight: 8 }} />
                        {imagePreview ? 'Change Image' : 'Upload Image'}
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          hidden
                        />
                      </Form.Label>
                    </div>
                    <Form.Text className="text-muted">
                      Recommended size: 1200x630px (Max 5MB)
                    </Form.Text>
                  </Form.Group>

                  {/* Tags */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Tags</Form.Label>
                    <div className="d-flex gap-2 mb-2">
                      <Form.Control
                        type="text"
                        placeholder="Add tag (press Enter)"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleTagInputKeyPress}
                      />
                      <Button 
                        variant="outline-primary" 
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                      >
                        Add
                      </Button>
                    </div>
                    
                    <div className="d-flex flex-wrap gap-2">
                      {formik.values.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          bg="primary" 
                          className="d-flex align-items-center gap-1 py-2 px-3"
                          style={{ fontSize: '0.875rem' }}
                        >
                          {tag}
                          <CloseIcon 
                            style={{ fontSize: 16, cursor: 'pointer' }}
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </Form.Group>

                  {/* Status */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Status</Form.Label>
                    <div>
                      <Form.Check
                        type="radio"
                        id="status-draft"
                        name="status"
                        label="Save as Draft"
                        value="draft"
                        checked={formik.values.status === 'draft'}
                        onChange={formik.handleChange}
                        inline
                      />
                      <Form.Check
                        type="radio"
                        id="status-published"
                        name="status"
                        label="Publish Immediately"
                        value="published"
                        checked={formik.values.status === 'published'}
                        onChange={formik.handleChange}
                        inline
                      />
                    </div>
                  </Form.Group>

                  {/* Action Buttons */}
                  <div className="d-flex gap-3 justify-content-end">
                    <Button
                      variant="outline-secondary"
                      size="lg"
                      onClick={() => navigate('/my-posts')}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          {isEditing ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        <>
                          {formik.values.status === 'published' ? (
                            <PublishIcon style={{ fontSize: 20, marginRight: 8 }} />
                          ) : (
                            <SaveIcon style={{ fontSize: 20, marginRight: 8 }} />
                          )}
                          {isEditing ? 'Update Post' : 'Create Post'}
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PostFormPage;