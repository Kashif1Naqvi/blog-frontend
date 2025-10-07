import React from 'react';
import { IconButton, Typography, Stack } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface LikeButtonProps {
  isLiked: boolean;
  likesCount: number;
  onToggleLike: () => void;
  size?: 'small' | 'medium' | 'large';
  showCount?: boolean;
  disabled?: boolean;
  variant?: 'post' | 'comment';
  className?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  isLiked,
  likesCount,
  onToggleLike,
  size = 'medium',
  showCount = true,
  disabled = false,
  variant = 'post',
  className = ''
}) => {
  const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
  const textSize = variant === 'comment' ? '0.75rem' : '0.875rem';
  
  return (
    <Stack 
      direction="row" 
      alignItems="center" 
      spacing={0.5} 
      className={className}
    >
      <IconButton
        size={size}
        onClick={onToggleLike}
        disabled={disabled}
        sx={{
          color: isLiked ? '#ef4444' : '#6b7280',
          transition: 'all 0.2s ease',
          '&:hover': {
            color: isLiked ? '#dc2626' : '#ef4444',
            transform: 'scale(1.1)',
            backgroundColor: isLiked 
              ? 'rgba(239, 68, 68, 0.1)' 
              : 'rgba(107, 114, 128, 0.1)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
        }}
      >
        {isLiked ? (
          <FavoriteIcon sx={{ fontSize: iconSize }} />
        ) : (
          <FavoriteBorderIcon sx={{ fontSize: iconSize }} />
        )}
      </IconButton>
      
      {showCount && (
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            fontSize: textSize,
            color: isLiked ? '#ef4444' : '#6b7280',
            minWidth: '20px',
            textAlign: 'left',
            transition: 'color 0.2s ease',
          }}
        >
          {likesCount}
        </Typography>
      )}
    </Stack>
  );
};

export default LikeButton;