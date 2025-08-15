// Type definitions for URL Shortener application

export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  createdAt: Date;
  expiresAt: Date;
  validityPeriod: number; // in minutes
  clickCount: number;
  clicks: ClickData[];
  isExpired: boolean;
  customShortCode?: string; // Track if a custom shortcode was used
}

export interface ClickData {
  id: string;
  timestamp: Date;
  source: string;
  location: string; // coarse-grained geographical location
  userAgent?: string;
}

export interface UrlFormData {
  originalUrl: string;
  validityPeriod?: number; // in minutes, defaults to 30
  customShortCode?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface CreateUrlRequest {
  urls: UrlFormData[];
}

export interface CreateUrlResponse {
  success: boolean;
  urls: ShortenedUrl[];
  errors?: ValidationError[];
}

// Context types for URL management
export interface UrlContextType {
  urls: ShortenedUrl[];
  addUrls: (urls: ShortenedUrl[]) => void;
  updateUrl: (id: string, updatedUrl: Partial<ShortenedUrl>) => void;
  removeUrl: (id: string) => void;
  getUrlByShortCode: (shortCode: string) => ShortenedUrl | undefined;
  getUrlByShortCodeFast: (shortCode: string) => ShortenedUrl | undefined;
  incrementClickCount: (shortCode: string, clickData: ClickData) => void;
  clearExpiredUrls: () => void;
}

// Theme and UI types
export interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Navigation types
export interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType;
}

// Form validation types
export interface FormErrors {
  [key: string]: string;
}

// Statistics types
export interface UrlStats {
  totalUrls: number;
  totalClicks: number;
  activeUrls: number;
  expiredUrls: number;
  topUrls: ShortenedUrl[];
}

// Location service types
export interface LocationData {
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
}

// Error types
export interface AppError {
  message: string;
  code?: string;
  stack?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: AppError;
}

// Local storage types
export interface StorageData {
  urls: ShortenedUrl[];
  lastUpdated: string;
}

// Component prop types
export interface UrlCardProps {
  url: ShortenedUrl;
  onCopy?: (shortUrl: string) => void;
  onDelete?: (id: string) => void;
  showStats?: boolean;
}

export interface UrlFormProps {
  onSubmit: (urls: UrlFormData[]) => void;
  isLoading?: boolean;
  maxUrls?: number;
}

export interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

export interface ClicksTableProps {
  clicks: ClickData[];
  title?: string;
}

// Responsive breakpoints (Material-UI compatible)
export interface Breakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

// Route types
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
}

export default {};
