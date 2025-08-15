import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

// Black and white glassmorphism color palette
const glassColors = {
  primary: {
    main: '#FFFFFF', // Pure white as primary
    light: '#FFFFFF',
    dark: '#E0E0E0',
    contrastText: '#000000',
  },
  secondary: {
    main: '#000000', // Pure black as secondary
    light: '#333333',
    dark: '#000000',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#000000', // Pure black
    paper: 'rgba(10, 10, 10, 0.9)', // Darker glass effect
    glass: 'rgba(255, 255, 255, 0.03)', // More subtle glass overlay
    glassStrong: 'rgba(255, 255, 255, 0.07)', // Darker glass for cards
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.3)',
  },
  divider: 'rgba(255, 255, 255, 0.1)',
  error: {
    main: '#808080',
    light: '#A0A0A0',
    dark: '#606060',
  },
  warning: {
    main: '#CCCCCC',
    light: '#E0E0E0',
    dark: '#999999',
  },
  success: {
    main: '#4CAF50', // Green color for valid URL
    light: '#81C784',
    dark: '#388E3C',
    contrastText: '#FFFFFF',
  },
};

// Custom glassmorphism theme
const glassThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    ...glassColors,
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"SF Pro Display"',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E0E0 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      '@media (max-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      background: 'linear-gradient(135deg, #FFFFFF 0%, #CCCCCC 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#FFFFFF',
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#FFFFFF',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#FFFFFF',
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#FFFFFF',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: 'rgba(255, 255, 255, 0.9)',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: 'rgba(255, 255, 255, 0.7)',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@import': [
          "url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap')",
        ],
        body: {
          background: 'linear-gradient(135deg, #000000 0%, #0A0A0A 50%, #000000 100%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0, 0, 0, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
            zIndex: -1,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 16,
          padding: '14px 28px',
          fontSize: '1rem',
          fontWeight: 600,
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            borderRadius: 'inherit',
            pointerEvents: 'none',
          },
        },
        contained: {
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(30px)',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          '&::before': {
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)',
          },
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            transform: 'translateY(-2px)',
            '&::before': {
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
            },
          },
          '&:active': {
            transform: 'translateY(-1px)',
            background: 'rgba(255, 255, 255, 0.1)',
          },
        },
        outlined: {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#FFFFFF',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          '&::before': {
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
          },
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            transform: 'translateY(-1px)',
            '&::before': {
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)',
            },
          },
          '&:active': {
            transform: 'translateY(0px)',
            background: 'rgba(255, 255, 255, 0.06)',
          },
        },
        text: {
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          '&::before': {
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          },
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            '&::before': {
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
            },
          },
          '&:active': {
            background: 'rgba(255, 255, 255, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '& fieldset': {
              border: 'none',
            },
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            },
            '&.Mui-focused': {
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid #FFFFFF',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-focused': {
              color: '#FFFFFF',
            },
          },
          '& .MuiInputBase-input': {
            color: '#FFFFFF',
          },
          '& .MuiFormHelperText-root': {
            color: 'rgba(255, 255, 255, 0.5)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: 20,
          color: '#FFFFFF',
          fontWeight: 600,
          '&.MuiChip-colorSuccess': {
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
          },
          '&.MuiChip-colorError': {
            background: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(0, 0, 0, 0.3)',
            color: '#000000',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
          color: '#FFFFFF',
          '&.MuiAlert-standardSuccess': {
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#FFFFFF',
          },
          '&.MuiAlert-standardError': {
            background: 'rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 0, 0, 0.3)',
            color: '#000000',
          },
          '&.MuiAlert-standardWarning': {
            background: 'rgba(128, 128, 128, 0.1)',
            border: '1px solid rgba(128, 128, 128, 0.3)',
            color: '#808080',
          },
          '&.MuiAlert-standardInfo': {
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          position: 'relative',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 12,
          padding: '12px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)',
            borderRadius: 'inherit',
            pointerEvents: 'none',
          },
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            transform: 'scale(1.05) translateY(-1px)',
            '&::before': {
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.1) 100%)',
            },
          },
          '&:active': {
            transform: 'scale(1.02)',
            background: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          '& .MuiTypography-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: 600,
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
};

// Create the glassmorphism theme
export const theme = createTheme(glassThemeOptions);

export default theme;
