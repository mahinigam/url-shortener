import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import { theme } from '../theme';
import { UrlProvider } from '../contexts/UrlContext';

// Import individual components instead of the full App to avoid router conflicts
import UrlShortenerPage from '../pages/UrlShortenerPage';
import StatisticsPage from '../pages/StatisticsPage';

// Mock the logger to avoid console spam during tests
vi.mock('../utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
}));

const renderWithProviders = (component: React.ReactElement, initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider theme={theme}>
        <UrlProvider>
          {component}
        </UrlProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe('App Component Pages', () => {
  it('renders URL Shortener page without crashing', () => {
    renderWithProviders(<UrlShortenerPage />);
    // Check for elements that should be present on the main page
    expect(screen.getByText('URL Shortener')).toBeInTheDocument();
    expect(screen.getByText(/Enter up to/)).toBeInTheDocument();
  });

  it('renders Statistics page without crashing', () => {
    renderWithProviders(<StatisticsPage />);
    // Check for elements that should be present on the statistics page
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  });
});
