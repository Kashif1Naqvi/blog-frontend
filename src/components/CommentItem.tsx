import React, { useState } from 'react';
import { Card, Form, Button, Dropdown, Alert } from 'react-bootstrap';
import { Avatar, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ReplyIcon from '@mui/icons-material/Reply';
import type { Comment } from '../services/blogService';
import { updateComment, deleteComment } from '../services/blogService';
import { useAuth } from '../contexts/AuthContext';

interface CommentItemProps {
  comment: Comment;
  onUpdate: (updatedComment: Comment) => void;
  onDelete: (commentId: number) => void;
  onReply: (commentId: number) => void;
  depth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onUpdate,
  onDelete,
  onReply,
  depth = 0
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = async () => {
    if (!editContent.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const updatedComment = await updateComment(comment.id, editContent);
      onUpdate(updatedComment);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Error updating comment:', err);
      setError(err.response?.data?.error || 'Failed to update comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      setLoading(true);
      await deleteComment(comment.id);
      onDelete(comment.id);
    } catch (err: any) {
      console.error('Error deleting comment:', err);
      setError(err.response?.data?.error || 'Failed to delete comment');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
    setError(null);
  };

  const canEdit = user && comment.can_edit;
  const canDelete = user && comment.can_delete;

  return (
    <div style={{ marginLeft: depth * 20 }} className="mb-3">
      <Card className="comment-card">
        <Card.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="d-flex align-items-center gap-2">
              <Avatar 
                src={comment.author.profile_picture || undefined}
                style={{ width: 32, height: 32 }}
              >
                {comment.author.username.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <div className="fw-semibold text-primary">
                  {comment.author.username}
                </div>
                <small className="text-muted">
                  {new Date(comment.created_at).toLocaleString()}
                  {comment.updated_at !== comment.created_at && (
                    <span className="ms-1">(edited)</span>
                  )}
                </small>
              </div>
            </div>

            {(canEdit || canDelete) && (
              <Dropdown>
                <Dropdown.Toggle 
                  as={IconButton}
                  size="sm"
                  disabled={loading}
                >
                  <MoreVertIcon style={{ fontSize: 16 }} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {canEdit && (
                    <Dropdown.Item onClick={() => setIsEditing(true)}>
                      <EditIcon style={{ fontSize: 16, marginRight: 8 }} />
                      Edit
                    </Dropdown.Item>
                  )}
                  {canDelete && (
                    <Dropdown.Item 
                      onClick={handleDelete}
                      className="text-danger"
                    >
                      <DeleteIcon style={{ fontSize: 16, marginRight: 8 }} />
                      Delete
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>

          {isEditing ? (
            <div>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  disabled={loading}
                />
              </Form.Group>
              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleEdit}
                  disabled={loading || !editContent.trim()}
                >
                  <SaveIcon style={{ fontSize: 16, marginRight: 4 }} />
                  {loading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  <CancelIcon style={{ fontSize: 16, marginRight: 4 }} />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-2">{comment.content}</p>
              {user && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => onReply(comment.id)}
                  className="p-0 text-decoration-none"
                >
                  <ReplyIcon style={{ fontSize: 16, marginRight: 4 }} />
                  Reply
                </Button>
              )}
            </div>
          )}

          {/* Render Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onReply={onReply}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default CommentItem;