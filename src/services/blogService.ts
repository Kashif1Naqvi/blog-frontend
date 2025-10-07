import api from './api';

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  author: {
    id: number;
    username: string;
    email: string;
    profile_picture: string | null;
  };
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  status: 'draft' | 'published';
  views_count: number;
  likes_count: number;
  comments_count: number;
  reading_time: number;
  is_liked: boolean;
  is_bookmarked: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface Comment {
  id: number;
  author: {
    id: number;
    username: string;
    profile_picture: string | null;
  };
  content: string;
  parent: number | null;
  replies: Comment[];
  created_at: string;
  updated_at: string;
  can_edit: boolean;
  can_delete: boolean;
  is_liked: boolean;
  likes_count: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface PostsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Post[];
}

// Posts
export const getPosts = async (params?: {
  page?: number;
  search?: string;
  status?: string;
  author?: number;
  tags?: string;
  ordering?: string;
}) => {
  const response = await api.get('/blog/posts/', { params });
  return response.data as PostsResponse;
};

export const getPost = async (id: number) => {
  const response = await api.get(`/blog/posts/${id}/`);
  return response.data as Post;
};

export const createPost = async (data: FormData) => {
  const response = await api.post('/blog/posts/', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updatePost = async (id: number, data: FormData) => {
  const response = await api.put(`/blog/posts/${id}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deletePost = async (id: number) => {
  await api.delete(`/blog/posts/${id}/`);
};

export const getMyPosts = async () => {
  const response = await api.get('/blog/posts/my_posts/');
  return response.data as PostsResponse;
};

export const getTrendingPosts = async () => {
  const response = await api.get('/blog/posts/trending/');
  return response.data as Post[];
};

// Likes
export const likePost = async (id: number) => {
  const response = await api.post(`/blog/posts/${id}/like/`);
  return response.data;
};

// Bookmarks
export const bookmarkPost = async (id: number) => {
  const response = await api.post(`/blog/posts/${id}/bookmark/`);
  return response.data;
};

export const getBookmarks = async () => {
  const response = await api.get('/blog/bookmarks/');
  return response.data;
};

// Comments
export const getPostComments = async (postId: number) => {
  const response = await api.get(`/blog/posts/${postId}/comments/`);
  return response.data as Comment[];
};

export const createComment = async (postId: number, content: string, parent?: number) => {
  const response = await api.post(`/blog/posts/${postId}/comments/`, {
    post: postId,
    content,
    parent,
  });
  return response.data;
};

export const updateComment = async (id: number, content: string) => {
  const response = await api.patch(`/blog/comments/${id}/`, { content });
  return response.data;
};

export const deleteComment = async (id: number) => {
  await api.delete(`/blog/comments/${id}/`);
};

export const replyToComment = async (commentId: number, content: string) => {
  const response = await api.post(`/blog/comments/${commentId}/reply/`, { content });
  return response.data;
};

// Tags
export const getTags = async () => {
  const response = await api.get('/blog/tags/');
  return response.data as Tag[];
};

export const getTagPosts = async (tagId: number) => {
  const response = await api.get(`/blog/tags/${tagId}/posts/`);
  return response.data as Post[];
};

// Comment likes
export const likeComment = async (id: number) => {
  const response = await api.post(`/blog/comments/${id}/like/`);
  return response.data;
};