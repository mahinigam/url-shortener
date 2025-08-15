import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Link as LinkIcon, BarChart as StatsIcon } from '@mui/icons-material';

import { UrlProvider } from './contexts/UrlContext';
import { theme } from './theme';
import UrlShortenerPage from './pages/UrlShortenerPage';
import StatisticsPage from './pages/StatisticsPage';
import RedirectPage from './pages/RedirectPage';
import Logger from './utils/logger';

// Navigation component with glassmorphism
const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: 0,
      }}
    >
      <Toolbar sx={{ padding: { xs: '0 16px', sm: '0 24px' } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <LinkIcon sx={{ mr: 1, color: '#FFFFFF' }} />
            <Typography 
              variant="h6" 
              component="div"
              sx={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E0E0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                fontSize: '1.5rem',
              }}
            >
              URL Shortener
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component={RouterLink}
            to="/"
            variant={location.pathname === '/' ? 'contained' : 'outlined'}
            startIcon={<LinkIcon />}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              ...(location.pathname === '/' ? {} : {
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                },
              }),
            }}
          >
            Shortener
          </Button>
          <Button
            component={RouterLink}
            to="/statistics"
            variant={location.pathname === '/statistics' ? 'contained' : 'outlined'}
            startIcon={<StatsIcon />}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              ...(location.pathname === '/statistics' ? {} : {
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                },
              }),
            }}
          >
            Statistics
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Logger.error('component', `Error boundary caught error: ${error.message}`);
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom color="error">
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

// Main App Component
const App: React.FC = () => {
  React.useEffect(() => {
    Logger.info('component', 'URL Shortener App initialized');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <UrlProvider>
          <Router>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navigation />
              
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Routes>
                  <Route path="/" element={<UrlShortenerPage />} />
                  <Route path="/statistics" element={<StatisticsPage />} />
                  <Route path="/:shortCode" element={<RedirectPage />} />
                </Routes>
              </Box>
              
              {/* Glassmorphism Footer */}
              <Box 
                component="footer" 
                sx={{ 
                  mt: 'auto',
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderBottom: 'none',
                }}
              >
                <Container maxWidth="lg" sx={{ py: 4 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 3,
                  }}>
                    {/* Logo and Brand */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px',
                          padding: '8px 12px',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        <LinkIcon sx={{ color: '#FFFFFF', fontSize: 24 }} />
                      </Box>
                      <Box>
                        <Typography 
                          variant="h6" 
                          sx={{
                            background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E0E0 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 700,
                            fontSize: '1.25rem',
                          }}
                        >
                          URL Shortener
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          Professional link management
                        </Typography>
                      </Box>
                    </Box>

                    {/* Features */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 1, sm: 3 },
                      textAlign: { xs: 'center', sm: 'left' },
                    }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        • Batch URL Shortening
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        • Custom Shortcodes
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        • Advanced Analytics
                      </Typography>
                    </Box>

                    {/* Tech Stack */}
                    <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 0.5 }}>
                        Built with React + TypeScript + Material-UI
                      </Typography>
                    </Box>
                  </Box>

                  {/* Divider */}
                  <Box sx={{ 
                    height: '1px', 
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
                    my: 3,
                  }} />

                  {/* Bottom Section */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                  }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      © 2025 URL Shortener. Made with{' '}
                      <Box component="span" sx={{ color: '#FF0000', mx: 0.5 }}>♥</Box>
                    for better link management.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box sx={{
                        px: 2,
                        py: 0.5,
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '20px',
                        color: '#FFFFFF',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}>
                        v1.0.0
                      </Box>
                    </Box>
                  </Box>
                </Container>
              </Box>
            </Box>
          </Router>
        </UrlProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
