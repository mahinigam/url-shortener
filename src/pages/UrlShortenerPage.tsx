import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  Snackbar,
  Grid,
  Fade,
  CircularProgress,
  Card,
} from '@mui/material';
import { Link as LinkIcon } from '@mui/icons-material';
import UrlForm from '../components/UrlForm';
import UrlCard from '../components/UrlCard';
import { useUrls } from '../hooks/useUrls';
import type { UrlFormData } from '../types';
import { createShortenedUrls, validateUrlFormData } from '../utils/urlUtils';
import Logger from '../utils/logger';

const UrlShortenerPage: React.FC = () => {
  const { urls, addUrls } = useUrls();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info'
  });

  // Get recent URLs (created in this session)
  const recentUrls = urls
    .filter(url => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      return url.createdAt > oneHourAgo;
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10); // Show up to 10 recent URLs

  useEffect(() => {
    Logger.info('page', 'URL Shortener page loaded');
  }, []);

  const handleSubmit = async (formData: UrlFormData[]) => {
    setIsLoading(true);
    Logger.info('page', `Processing ${formData.length} URLs for shortening`);

    try {
      // Validate form data
      const errors = validateUrlFormData(formData);
      if (errors.length > 0) {
        setNotification({
          open: true,
          message: `Validation failed: ${errors[0].message}`,
          severity: 'error'
        });
        return;
      }

      // Create shortened URLs
      const shortenedUrls = createShortenedUrls(formData, urls);
      
      // Add to state
      addUrls(shortenedUrls);

      // Show success notification
      setNotification({
        open: true,
        message: `Successfully shortened ${shortenedUrls.length} URL${shortenedUrls.length > 1 ? 's' : ''}!`,
        severity: 'success'
      });

      Logger.info('page', `Successfully created ${shortenedUrls.length} shortened URLs`);

    } catch (error) {
      Logger.error('page', `Failed to create shortened URLs: ${error}`);
      setNotification({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to shorten URLs',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    setNotification({
      open: true,
      message: 'Short URL copied to clipboard!',
      severity: 'success'
    });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            mb: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <LinkIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
        </Box>
        <Typography variant="h1" component="h1" gutterBottom>
          URL Shortener
        </Typography>
      </Box>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* URL Form */}
        <Grid item xs={12} lg={6}>
          <UrlForm 
            onSubmit={handleSubmit} 
            isLoading={isLoading}
            maxUrls={5}
          />
        </Grid>

        {/* Recent URLs */}
        <Grid item xs={12} lg={6}>
          <Box>
            <Typography variant="h3" component="h2" gutterBottom>
              Recent URLs
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 3,
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              Your recently shortened URLs appear here
            </Typography>

            {isLoading && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                p: 4,
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}>
                <CircularProgress sx={{ color: '#FFFFFF' }} />
              </Box>
            )}

            {!isLoading && recentUrls.length === 0 && (
              <Alert 
                severity="info" 
                sx={{ 
                  mb: 2,
                  background: 'rgba(157, 78, 221, 0.1)',
                  border: '1px solid rgba(157, 78, 221, 0.3)',
                  color: '#FFFFFF',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                }}
              >
                No recent URLs found. Create your first shortened URL using the form on the left!
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {recentUrls.map((url, index) => (
                <Fade 
                  key={url.id} 
                  in={true} 
                  timeout={500 + index * 150}
                >
                  <div>
                    <UrlCard 
                      url={url} 
                      onCopy={handleCopy}
                      showStats={true}
                    />
                  </div>
                </Fade>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Features Section */}
      {recentUrls.length === 0 && !isLoading && (
        <Card sx={{ 
          mt: 8, 
          textAlign: 'center',
          p: 6,
        }}>
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E0E0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 4,
            }}
          >
            Features
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                p: 4,
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.03)',
                  transform: 'translateY(-8px)',
                  boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5)',
                },
              }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                  Batch Processing
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Shorten up to 5 URLs at once for maximum efficiency
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                p: 4,
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.03)',
                  transform: 'translateY(-8px)',
                  boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5)',
                },
              }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                  Custom Codes
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Choose your own custom shortcodes or let us generate them
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                p: 4,
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.03)',
                  transform: 'translateY(-8px)',
                  boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5)',
                },
              }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                  Analytics
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Track clicks and view detailed statistics for your links
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>
      )}

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={closeNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UrlShortenerPage;
