import { useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ShareIcon from '@mui/icons-material/Share';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';
import './SocialShare.css';

interface SocialShareProps {
  title: string;
  url: string;
  description?: string;
  hashtags?: string[];
  className?: string;
}

const SocialShare = ({ 
  title, 
  url, 
  description = '', 
  hashtags = [], 
  className = '' 
}: SocialShareProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || title);
  const hashtagsString = hashtags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ');

  // IMPROVED SHARE LINKS WITH BETTER FACEBOOK SUPPORT
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}${encodedDescription ? ` - ${encodedDescription}` : ''}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}${encodedDescription ? ` - ${encodedDescription}` : ''}&url=${encodedUrl}&hashtags=${hashtags.map(tag => tag.replace(/\s+/g, '')).join(',')}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}${encodedDescription ? ` - ${encodedDescription}` : ''}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}${encodedDescription ? ` - ${encodedDescription}` : ''}`,
  };

  const handleShare = (platform: string) => {
    const link = shareLinks[platform as keyof typeof shareLinks];
    if (link) {
      // Enhanced Facebook sharing
      if (platform === 'facebook') {
        // Open Facebook share dialog with proper dimensions
        window.open(
          link, 
          'facebook-share', 
          'width=626,height=436,scrollbars=yes,resizable=yes,toolbar=no,location=yes'
        );
      } else if (platform === 'twitter') {
        // Optimized Twitter sharing
        window.open(
          link, 
          'twitter-share', 
          'width=550,height=420,scrollbars=yes,resizable=yes'
        );
      } else if (platform === 'linkedin') {
        // LinkedIn sharing
        window.open(
          link, 
          'linkedin-share', 
          'width=520,height=570,scrollbars=yes,resizable=yes'
        );
      } else {
        // Other platforms
        window.open(
          link, 
          '_blank', 
          'width=600,height=400,scrollbars=yes,resizable=yes'
        );
      }
    }
    setShowOptions(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
        return;
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
    
    // Fallback to custom share options
    setShowOptions(!showOptions);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowOptions(false);
    }
  };

  return (
    <>
      <div className={`social-share-container ${className}`}>
        {/* FIXED: Match the styling with other buttons in PostDetailPage */}
        <Button
          variant="outlined"
          className="share-trigger-btn"
          onClick={handleNativeShare}
        >
          <ShareIcon className="me-2" />
          Share
        </Button>

        {showOptions && (
          <>
            {/* Backdrop */}
            <div 
              className="share-backdrop" 
              onClick={handleClickOutside}
            />
            
            {/* Share Options */}
            <div className="share-options-dropdown">
              <div className="share-options-header">
                <h6>Share this post</h6>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setShowOptions(false)}
                  className="close-btn"
                >
                  <CloseIcon />
                </Button>
              </div>

              <div className="share-buttons-grid">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Share on Facebook</Tooltip>}
                >
                  <Button
                    variant="outline-primary"
                    className="share-btn facebook"
                    onClick={() => handleShare('facebook')}
                  >
                    <FacebookIcon />
                    <span>Facebook</span>
                  </Button>
                </OverlayTrigger>

                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Share on Twitter</Tooltip>}
                >
                  <Button
                    variant="outline-info"
                    className="share-btn twitter"
                    onClick={() => handleShare('twitter')}
                  >
                    <TwitterIcon />
                    <span>Twitter</span>
                  </Button>
                </OverlayTrigger>

                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Share on LinkedIn</Tooltip>}
                >
                  <Button
                    variant="outline-primary"
                    className="share-btn linkedin"
                    onClick={() => handleShare('linkedin')}
                  >
                    <LinkedInIcon />
                    <span>LinkedIn</span>
                  </Button>
                </OverlayTrigger>

                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Share on WhatsApp</Tooltip>}
                >
                  <Button
                    variant="outline-success"
                    className="share-btn whatsapp"
                    onClick={() => handleShare('whatsapp')}
                  >
                    <WhatsAppIcon />
                    <span>WhatsApp</span>
                  </Button>
                </OverlayTrigger>

                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Share on Telegram</Tooltip>}
                >
                  <Button
                    variant="outline-info"
                    className="share-btn telegram"
                    onClick={() => handleShare('telegram')}
                  >
                    <TelegramIcon />
                    <span>Telegram</span>
                  </Button>
                </OverlayTrigger>

                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>{copied ? 'Copied!' : 'Copy Link'}</Tooltip>}
                >
                  <Button
                    variant={copied ? "success" : "outline-secondary"}
                    className="share-btn copy-link"
                    onClick={handleCopyLink}
                  >
                    <LinkIcon />
                    <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                  </Button>
                </OverlayTrigger>
              </div>

              {hashtags.length > 0 && (
                <div className="share-hashtags">
                  <small>Suggested hashtags: {hashtagsString}</small>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SocialShare;