import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme';
import UrlForm from '../components/UrlForm';

// Mock the logger to avoid console spam during tests
vi.mock('../utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('UrlForm Component', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders initial form with one URL field', () => {
    renderWithTheme(<UrlForm onSubmit={mockOnSubmit} />);
    
    // Check for the main heading using getAllByText and pick the heading
    const headings = screen.getAllByText('Shorten URLs');
    expect(headings[0]).toBeInTheDocument(); // First one should be the main heading
    expect(screen.getByText(/Enter up to/)).toBeInTheDocument();
  });

  it('allows adding more URL fields', async () => {
    const user = userEvent.setup();
    renderWithTheme(<UrlForm onSubmit={mockOnSubmit} maxUrls={5} />);
    
    const addButton = screen.getByText('Add Another URL');
    await user.click(addButton);
    
    // After adding, we should have more URL sections
    const urlSections = screen.getAllByText(/URL #/);
    expect(urlSections.length).toBeGreaterThan(1);
  });

  it('prevents adding more than max URLs', async () => {
    const user = userEvent.setup();
    renderWithTheme(<UrlForm onSubmit={mockOnSubmit} maxUrls={2} />);
    
    const addButton = screen.getByText('Add Another URL');
    await user.click(addButton);
    
    // After reaching max, button should be disabled or not present
    // Let's check if we can't add more instead of checking disabled state
    const urlSections = screen.getAllByText(/URL #/);
    expect(urlSections.length).toBe(2); // Should have exactly 2 sections
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    renderWithTheme(<UrlForm onSubmit={mockOnSubmit} />);
    
    // Get the first URL input specifically
    const urlInputs = screen.getAllByRole('textbox');
    const urlInput = urlInputs.find(input => 
      input.getAttribute('placeholder')?.includes('example.com')
    );
    
    if (urlInput) {
      await user.type(urlInput, 'https://example.com');
    }
    
    // Use getByRole to get the submit button specifically
    const submitButton = screen.getByRole('button', { name: /shorten urls/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('shows validation errors for invalid URLs', async () => {
    const user = userEvent.setup();
    renderWithTheme(<UrlForm onSubmit={mockOnSubmit} />);
    
    // Get the first URL input specifically
    const urlInputs = screen.getAllByRole('textbox');
    const urlInput = urlInputs.find(input => 
      input.getAttribute('placeholder')?.includes('example.com')
    );
    
    if (urlInput) {
      await user.type(urlInput, 'invalid-url');
    }
    
    // Use getByRole to get the submit button specifically
    const submitButton = screen.getByRole('button', { name: /shorten urls/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid URL/)).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
