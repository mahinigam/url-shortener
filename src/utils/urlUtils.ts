import type { ShortenedUrl, UrlFormData, ValidationError, ClickData } from '../types';
import Logger from './logger';

/**
 * Validates a URL format and security
 */
export const isValidUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return false;
  
  try {
    const parsedUrl = new URL(url);
    
    // Only allow http and https protocols for security
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return false;
    }
    
    // Block local/internal URLs for security
    const hostname = parsedUrl.hostname.toLowerCase();
    if (hostname === 'localhost' || 
        hostname === '127.0.0.1' || 
        hostname.endsWith('.local') ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        (hostname.startsWith('172.') && 
         parseInt(hostname.split('.')[1]) >= 16 && 
         parseInt(hostname.split('.')[1]) <= 31)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates custom shortcode format
 */
export const isValidShortCode = (shortCode: string): boolean => {
  // Alphanumeric, reasonable length (3-20 characters)
  const shortCodeRegex = /^[a-zA-Z0-9]{3,20}$/;
  return shortCodeRegex.test(shortCode);
};

/**
 * Validates validity period
 */
export const isValidValidityPeriod = (period: number): boolean => {
  return period > 0 && period <= 10080; // max 7 days (in minutes)
};

/**
 * Validates form data for URL shortening
 */
export const validateUrlFormData = (formData: UrlFormData[]): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  Logger.debug('utils', `Validating ${formData.length} URLs`);
  
  formData.forEach((data, index) => {
    const fieldPrefix = `url_${index}`;
    
    // Validate original URL
    if (!data.originalUrl.trim()) {
      errors.push({
        field: `${fieldPrefix}_originalUrl`,
        message: 'URL is required'
      });
    } else if (!isValidUrl(data.originalUrl)) {
      errors.push({
        field: `${fieldPrefix}_originalUrl`,
        message: 'Please enter a valid URL'
      });
    }
    
    // Validate validity period
    if (data.validityPeriod !== undefined && !isValidValidityPeriod(data.validityPeriod)) {
      errors.push({
        field: `${fieldPrefix}_validityPeriod`,
        message: 'Validity period must be between 1 and 10080 minutes (7 days)'
      });
    }
    
    // Validate custom shortcode
    if (data.customShortCode && !isValidShortCode(data.customShortCode)) {
      errors.push({
        field: `${fieldPrefix}_customShortCode`,
        message: 'Shortcode must be 3-20 alphanumeric characters'
      });
    }
  });
  
  if (errors.length > 0) {
    Logger.warn('utils', `Validation failed with ${errors.length} errors`);
  }
  
  return errors;
};

/**
 * Generates a random shortcode
 */
export const generateShortCode = (length: number = 6): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Checks if a shortcode is unique among existing URLs
 */
export const isShortCodeUnique = (shortCode: string, existingUrls: ShortenedUrl[]): boolean => {
  return !existingUrls.some(url => url.shortCode === shortCode);
};

/**
 * Generates a unique shortcode
 */
export const generateUniqueShortCode = (existingUrls: ShortenedUrl[], length: number = 6): string => {
  let shortCode = generateShortCode(length);
  let attempts = 0;
  const maxAttempts = 100;
  
  while (!isShortCodeUnique(shortCode, existingUrls) && attempts < maxAttempts) {
    shortCode = generateShortCode(length);
    attempts++;
  }
  
  if (attempts >= maxAttempts) {
    // If we can't generate a unique code, use timestamp
    shortCode = generateShortCode(3) + Date.now().toString(36);
  }
  
  Logger.debug('utils', `Generated unique shortcode: ${shortCode} (attempts: ${attempts})`);
  return shortCode;
};

/**
 * Creates shortened URLs from form data
 */
export const createShortenedUrls = (formData: UrlFormData[], existingUrls: ShortenedUrl[]): ShortenedUrl[] => {
  Logger.info('utils', `Creating ${formData.length} shortened URLs`);
  
  return formData.map((data) => {
    const id = generateId();
    const validityPeriod = data.validityPeriod || 30; // default 30 minutes
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + validityPeriod * 60000);
    
    let shortCode = data.customShortCode;
    if (!shortCode) {
      shortCode = generateUniqueShortCode(existingUrls);
    } else if (!isShortCodeUnique(shortCode, existingUrls)) {
      throw new Error(`Shortcode "${shortCode}" is already in use`);
    }
    
    const shortUrl = `${window.location.origin}/${shortCode}`;
    
    const shortenedUrl: ShortenedUrl = {
      id,
      originalUrl: data.originalUrl,
      shortCode,
      shortUrl,
      createdAt,
      expiresAt,
      validityPeriod,
      clickCount: 0,
      clicks: [],
      isExpired: false,
      customShortCode: data.customShortCode
    };
    
    Logger.info('utils', `Created shortened URL: ${shortCode} -> ${data.originalUrl}`);
    return shortenedUrl;
  });
};

/**
 * Generates a unique ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Checks if a URL has expired
 */
export const isUrlExpired = (url: ShortenedUrl): boolean => {
  return new Date() > url.expiresAt;
};

/**
 * Updates URL expiration status
 */
export const updateUrlExpirationStatus = (urls: ShortenedUrl[]): ShortenedUrl[] => {
  return urls.map(url => ({
    ...url,
    isExpired: isUrlExpired(url)
  }));
};

/**
 * Filters out expired URLs
 */
export const filterActiveUrls = (urls: ShortenedUrl[]): ShortenedUrl[] => {
  return urls.filter(url => !isUrlExpired(url));
};

/**
 * Gets coarse-grained location information
 */
export const getLocationInfo = async (): Promise<string> => {
  try {
    // Use a simple IP geolocation service
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      return `${data.city || 'Unknown'}, ${data.country_name || 'Unknown'}`;
    }
  } catch (error) {
    Logger.warn('utils', `Failed to get location info: ${error}`);
  }
  return 'Unknown Location';
};

/**
 * Creates click data
 */
export const createClickData = async (source: string = 'direct'): Promise<ClickData> => {
  const location = await getLocationInfo();
  
  return {
    id: generateId(),
    timestamp: new Date(),
    source,
    location,
    userAgent: navigator.userAgent
  };
};

/**
 * Formats date for display
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Formats time remaining until expiration
 */
export const formatTimeRemaining = (expiresAt: Date): string => {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) {
    return 'Expired';
  }
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else {
    return `${minutes}m`;
  }
};

/**
 * Copies text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    Logger.debug('utils', `Copied to clipboard: ${text}`);
    return true;
  } catch (error) {
    Logger.warn('utils', `Failed to copy to clipboard: ${error}`);
    return false;
  }
};

/**
 * Debounce function for search/filter operations
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => func(...args), delay);
  };
};
