import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  BarChart as StatsIcon,
  Link as LinkIcon,
  Schedule as ScheduleIcon,
  Mouse as ClickIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useUrls } from '../hooks/useUrls';
import UrlCard from '../components/UrlCard';
import { formatDate } from '../utils/urlUtils';
import Logger from '../utils/logger';

const StatisticsPage: React.FC = () => {
  const { urls, clearExpiredUrls } = useUrls();
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  // Calculate statistics
  const stats = useMemo(() => {
    const activeUrls = urls.filter(url => !url.isExpired);
    const expiredUrls = urls.filter(url => url.isExpired);
    const totalClicks = urls.reduce((sum, url) => sum + url.clickCount, 0);
    const topUrls = urls
      .filter(url => url.clickCount > 0)
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, 5);

    return {
      totalUrls: urls.length,
      activeUrls: activeUrls.length,
      expiredUrls: expiredUrls.length,
      totalClicks,
      topUrls
    };
  }, [urls]);

  const handleClearExpired = () => {
    Logger.info('page', `Clearing ${stats.expiredUrls} expired URLs`);
    clearExpiredUrls();
    setClearDialogOpen(false);
  };

  // All clicks from all URLs for the detailed table
  const allClicks = useMemo(() => {
    return urls
      .flatMap(url => 
        url.clicks.map(click => ({
          ...click,
          shortCode: url.shortCode,
          originalUrl: url.originalUrl
        }))
      )
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 50); // Show last 50 clicks
  }, [urls]);

  React.useEffect(() => {
    Logger.info('page', 'Statistics page loaded');
  }, []);

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
          <StatsIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
        </Box>
        <Typography variant="h1" component="h1" gutterBottom>
          Analytics Dashboard
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            maxWidth: 600, 
            mx: 'auto',
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: 400,
            lineHeight: 1.6,
          }}
        >
          Track performance and manage your shortened URLs with detailed analytics and insights.
        </Typography>
      </Box>

      {/* Statistics Overview */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            textAlign: 'center',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-8px)',
            },
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  mb: 3,
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                }}
              >
                <LinkIcon sx={{ fontSize: 30, color: '#3B82F6' }} />
              </Box>
              <Typography variant="h3" component="div" sx={{ mb: 1, color: '#FFFFFF' }}>
                {stats.totalUrls}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Total URLs
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            textAlign: 'center',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-8px)',
            },
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.2)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  mb: 3,
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                }}
              >
                <ScheduleIcon sx={{ fontSize: 30, color: '#EC4899' }} />
              </Box>
              <Typography variant="h3" component="div" sx={{ mb: 1, color: '#FFFFFF' }}>
                {stats.activeUrls}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Active URLs
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            textAlign: 'center',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-8px)',
            },
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  mb: 3,
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                }}
              >
                <ClickIcon sx={{ fontSize: 30, color: '#84CC16' }} />
              </Box>
              <Typography variant="h3" component="div" sx={{ mb: 1, color: '#FFFFFF' }}>
                {stats.totalClicks}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Total Clicks
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            textAlign: 'center',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-8px)',
            },
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  mb: 3,
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                }}
              >
                <ClearIcon sx={{ fontSize: 30, color: '#F59E0B' }} />
              </Box>
              <Typography variant="h3" component="div" sx={{ mb: 1, color: '#FFFFFF' }}>
                {stats.expiredUrls}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Expired URLs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Clear Expired URLs Button */}
      {stats.expiredUrls > 0 && (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<ClearIcon />}
            onClick={() => setClearDialogOpen(true)}
          >
            Clear {stats.expiredUrls} Expired URL{stats.expiredUrls > 1 ? 's' : ''}
          </Button>
        </Box>
      )}

      {/* No URLs Message */}
      {urls.length === 0 && (
        <Alert severity="info" sx={{ mb: 4 }}>
          No URLs found. Visit the URL Shortener page to create your first shortened URL!
        </Alert>
      )}

      {/* URL List */}
      {urls.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            All URLs
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Complete list of all your shortened URLs
          </Typography>

          <Grid container spacing={3}>
            {urls
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .map((url) => (
                <Grid item xs={12} md={6} lg={4} key={url.id}>
                  <UrlCard url={url} showStats={true} />
                </Grid>
              ))}
          </Grid>
        </Box>
      )}

      {/* Top Performing URLs */}
      {stats.topUrls.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Top Performing URLs
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            URLs with the most clicks
          </Typography>

          <Grid container spacing={3}>
            {stats.topUrls.map((url, index) => (
              <Grid item xs={12} md={6} lg={4} key={url.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Chip 
                        label={`#${index + 1}`} 
                        color="primary" 
                        size="small" 
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {url.clickCount} click{url.clickCount !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        wordBreak: 'break-all',
                        mb: 1
                      }}
                    >
                      {url.shortUrl}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                    >
                      Created: {formatDate(url.createdAt)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Recent Clicks Table */}
      {allClicks.length > 0 && (
        <Box>
          <Typography variant="h4" component="h2" gutterBottom>
            Recent Clicks
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Detailed click data from all URLs (last 50 clicks)
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Short Code</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allClicks.map((click) => (
                  <TableRow key={click.id}>
                    <TableCell>
                      {formatDate(click.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ fontFamily: 'monospace' }}
                      >
                        {click.shortCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={click.source} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{click.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Clear Expired URLs Dialog */}
      <Dialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
        aria-labelledby="clear-dialog-title"
        aria-describedby="clear-dialog-description"
      >
        <DialogTitle id="clear-dialog-title">
          Clear Expired URLs
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="clear-dialog-description">
            Are you sure you want to remove {stats.expiredUrls} expired URL{stats.expiredUrls > 1 ? 's' : ''}? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleClearExpired} color="error" variant="contained">
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StatisticsPage;
