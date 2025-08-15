import React, { useEffect, useState, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Launch as LaunchIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useUrls } from '../hooks/useUrls';
import { createClickData, isValidUrl } from '../utils/urlUtils';
import Logger from '../utils/logger';

const RedirectPage: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const { getUrlByShortCodeFast, incrementClickCount } = useUrls();
  const [isRedirecting, setIsRedirecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<ReturnType<typeof getUrlByShortCodeFast>>(undefined);
  const hasProcessedClick = useRef(false);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!shortCode || hasProcessedClick.current) {
        if (!shortCode) {
          setError('No short code provided');
          setIsRedirecting(false);
        }
        return;
      }

      Logger.info('page', `Processing redirect for shortcode: ${shortCode}`);

      // Use optimized lookup - still validates expiry and security
      const foundUrl = getUrlByShortCodeFast(shortCode);
      
      if (!foundUrl) {
        Logger.warn('page', `Short URL not found or expired: ${shortCode}`);
        setError('Short URL not found or has expired');
        setIsRedirecting(false);
        return;
      }

      // Security validation: Check if the original URL is still valid before redirecting
      if (!isValidUrl(foundUrl.originalUrl)) {
        Logger.error('page', `Invalid or malicious URL detected: ${foundUrl.originalUrl}`);
        setError('This link appears to be invalid or potentially malicious and cannot be accessed');
        setIsRedirecting(false);
        return;
      }

      // Additional security check: Prevent redirect to local/internal URLs
      try {
        const targetUrl = new URL(foundUrl.originalUrl);
        if (targetUrl.hostname === 'localhost' || 
            targetUrl.hostname === '127.0.0.1' || 
            targetUrl.hostname.endsWith('.local') ||
            targetUrl.hostname.startsWith('192.168.') ||
            targetUrl.hostname.startsWith('10.') ||
            (targetUrl.hostname.startsWith('172.') && 
             parseInt(targetUrl.hostname.split('.')[1]) >= 16 && 
             parseInt(targetUrl.hostname.split('.')[1]) <= 31)) {
          Logger.warn('page', `Blocked redirect to internal/local URL: ${foundUrl.originalUrl}`);
          setError('Redirects to local or internal addresses are not allowed for security reasons');
          setIsRedirecting(false);
          return;
        }
      } catch {
        Logger.error('page', `Failed to parse target URL: ${foundUrl.originalUrl}`);
        setError('Invalid URL format detected');
        setIsRedirecting(false);
        return;
      }

      try {
        // Mark as processed to prevent duplicates
        hasProcessedClick.current = true;
        
        // Create click data for analytics
        const clickData = await createClickData('redirect');
        
        // Log analytics before redirect
        incrementClickCount(shortCode, clickData);
        
        Logger.info('page', `Redirecting to: ${foundUrl.originalUrl}`);
        
        // Faster redirect with replace instead of href
        // Reduced delay from 1500ms to 200ms
        setTimeout(() => {
          window.location.replace(foundUrl.originalUrl);
        }, 200);
        
        setUrl(foundUrl);
      } catch (error) {
        Logger.error('page', `Failed to process redirect: ${error}`);
        setError('Failed to process redirect');
        setIsRedirecting(false);
      }
    };

    handleRedirect();
  }, [shortCode, getUrlByShortCodeFast, incrementClickCount]);

  // If no short code, redirect to home
  if (!shortCode) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        {isRedirecting && !error ? (
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}>
            <CardContent sx={{ py: 6 }}>
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h4" component="h1" gutterBottom>
                Redirecting...
              </Typography>
              {url && (
                <>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Taking you to your destination
                  </Typography>
                  <Box sx={{ 
                    p: 2, 
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    mb: 3
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        wordBreak: 'break-all',
                        fontFamily: 'monospace'
                      }}
                    >
                      {url.originalUrl}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    If you are not redirected automatically, click the button below
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        ) : error ? (
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}>
            <CardContent sx={{ py: 6 }}>
              <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
              <Typography variant="h4" component="h1" gutterBottom color="error">
                URL Not Found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {error}
              </Typography>
              
              {url && (
                <Alert severity="warning" sx={{ mb: 3, textAlign: 'left' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    URL Information:
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Short Code:</strong> {url.shortCode}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Created:</strong> {url.createdAt.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Expired:</strong> {url.expiresAt.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Total Clicks:</strong> {url.clickCount}
                  </Typography>
                </Alert>
              )}

              <Button
                variant="contained"
                href="/"
                size="large"
                sx={{ mr: 2 }}
              >
                Go Home
              </Button>
              
              <Button
                variant="outlined"
                href="/statistics"
                size="large"
              >
                View Statistics
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {/* Manual redirect button */}
        {url && !error && (
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<LaunchIcon />}
              onClick={() => window.location.href = url.originalUrl}
            >
              Continue to Destination
            </Button>
          </Box>
        )}

        {/* URL expired but show option to visit anyway */}
        {url && error === 'This short URL has expired' && (
          <Box sx={{ mt: 3 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                This URL has expired, but you can still visit the original destination if it's still valid.
              </Typography>
            </Alert>
            <Button
              variant="outlined"
              startIcon={<LaunchIcon />}
              onClick={() => window.open(url.originalUrl, '_blank', 'noopener,noreferrer')}
            >
              Visit Original URL
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default RedirectPage;
