import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Launch as LaunchIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
  BarChart as StatsIcon,
} from '@mui/icons-material';
import type { UrlCardProps } from '../types';
import { formatDate, formatTimeRemaining, copyToClipboard } from '../utils/urlUtils';
import Logger from '../utils/logger';

const UrlCard: React.FC<UrlCardProps> = ({ 
  url, 
  onCopy, 
  onDelete, 
  showStats = false
}) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleCopy = async () => {
    Logger.info('component', `Copying URL to clipboard: ${url.shortUrl}`);
    const success = await copyToClipboard(url.shortUrl);
    
    if (success) {
      setSnackbar({
        open: true,
        message: 'Short URL copied to clipboard!',
        severity: 'success'
      });
      onCopy?.(url.shortUrl);
    } else {
      setSnackbar({
        open: true,
        message: 'Failed to copy URL',
        severity: 'error'
      });
    }
  };

  const handleLaunch = () => {
    Logger.info('component', `Opening short URL for tracking: ${url.shortUrl}`);
    // Use the short URL instead of original URL to track clicks
    window.open(url.shortUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDelete = () => {
    if (onDelete) {
      Logger.info('component', `Deleting URL: ${url.id}`);
      onDelete(url.id);
    }
  };

  const getStatusChip = () => {
    if (url.isExpired) {
      return <Chip label="Expired" color="error" size="small" />;
    }
    
    const timeRemaining = formatTimeRemaining(url.expiresAt);
    return (
      <Chip 
        label={`Expires in ${timeRemaining}`} 
        color="success" 
        size="small"
        icon={<TimeIcon />}
      />
    );
  };

  const truncateUrl = (urlString: string, maxLength: number = 50) => {
    if (urlString.length <= maxLength) return urlString;
    return urlString.substring(0, maxLength) + '...';
  };

  return (
    <>
      <Card 
        sx={{ 
          opacity: url.isExpired ? 0.6 : 1,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <CardContent>
          {/* Header with status */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Short URL
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {getStatusChip()}
              {onDelete && (
                <Tooltip title="Delete URL">
                  <IconButton 
                    onClick={handleDelete} 
                    size="small" 
                    color="error"
                    disabled={url.isExpired}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          {/* Short URL */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Short URL:
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              p: 1, 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  flexGrow: 1, 
                  fontFamily: 'monospace',
                  wordBreak: 'break-all'
                }}
              >
                {url.shortUrl}
              </Typography>
              <Tooltip title="Copy to clipboard">
                <IconButton onClick={handleCopy} size="small" color="primary">
                  <CopyIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Visit via short URL">
                <IconButton onClick={handleLaunch} size="small" color="secondary">
                  <LaunchIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Original URL */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Original URL:
            </Typography>
            <Tooltip title={url.originalUrl}>
              <Typography 
                variant="body2" 
                sx={{ 
                  wordBreak: 'break-all',
                  color: 'primary.main',
                  cursor: 'pointer'
                }}
                onClick={handleLaunch}
              >
                {truncateUrl(url.originalUrl, 60)}
              </Typography>
            </Tooltip>
          </Box>

          {/* Metadata */}
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Created:
              </Typography>
              <Typography variant="body2">
                {formatDate(url.createdAt)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Expires:
              </Typography>
              <Typography variant="body2" color={url.isExpired ? 'error.main' : 'text.primary'}>
                {formatDate(url.expiresAt)}
              </Typography>
            </Box>

            {showStats && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Clicks:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StatsIcon fontSize="small" color="action" />
                    <Typography variant="body2" fontWeight="bold">
                      {url.clickCount}
                    </Typography>
                  </Box>
                </Box>

                {url.customShortCode && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Custom Code:
                    </Typography>
                    <Chip label="Custom" size="small" variant="outlined" color="primary" />
                  </Box>
                )}
              </>
            )}
          </Box>

          {/* Actions */}
          {!url.isExpired && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleCopy}
                startIcon={<CopyIcon />}
                fullWidth
              >
                Copy
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleLaunch}
                startIcon={<LaunchIcon />}
                fullWidth
              >
                Visit
              </Button>
            </Box>
          )}

          {/* Expired warning */}
          {url.isExpired && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This URL has expired and can no longer be used.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UrlCard;
