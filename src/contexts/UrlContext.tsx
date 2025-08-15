import React, { createContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ShortenedUrl, UrlContextType, ClickData, StorageData } from '../types';
import { updateUrlExpirationStatus } from '../utils/urlUtils';
import Logger from '../utils/logger';

// Action types
type UrlAction =
  | { type: 'SET_URLS'; payload: ShortenedUrl[] }
  | { type: 'ADD_URLS'; payload: ShortenedUrl[] }
  | { type: 'UPDATE_URL'; payload: { id: string; updates: Partial<ShortenedUrl> } }
  | { type: 'REMOVE_URL'; payload: string }
  | { type: 'INCREMENT_CLICK'; payload: { shortCode: string; clickData: ClickData } }
  | { type: 'CLEAR_EXPIRED' }
  | { type: 'UPDATE_EXPIRATION_STATUS' };

// Reducer function
const urlReducer = (state: ShortenedUrl[], action: UrlAction): ShortenedUrl[] => {
  switch (action.type) {
    case 'SET_URLS':
      return action.payload;
    
    case 'ADD_URLS':
      return [...state, ...action.payload];
    
    case 'UPDATE_URL':
      return state.map(url =>
        url.id === action.payload.id
          ? { ...url, ...action.payload.updates }
          : url
      );
    
    case 'REMOVE_URL':
      return state.filter(url => url.id !== action.payload);
    
    case 'INCREMENT_CLICK': {
      const updatedUrls = state.map(url =>
        url.shortCode === action.payload.shortCode
          ? {
              ...url,
              clickCount: url.clickCount + 1,
              clicks: [...url.clicks, action.payload.clickData]
            }
          : url
      );
      return updatedUrls;
    }
    
    case 'CLEAR_EXPIRED':
      return state.filter(url => !url.isExpired);
    
    case 'UPDATE_EXPIRATION_STATUS':
      return updateUrlExpirationStatus(state);
    
    default:
      return state;
  }
};

// Storage utilities
const STORAGE_KEY = 'url-shortener-data';

const saveToStorage = (urls: ShortenedUrl[]): void => {
  try {
    const data: StorageData = {
      urls: urls.map(url => ({
        ...url,
        createdAt: url.createdAt,
        expiresAt: url.expiresAt,
        clicks: url.clicks.map(click => ({
          ...click,
          timestamp: click.timestamp
        }))
      })),
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    Logger.debug('state', `Saved ${urls.length} URLs to localStorage`);
  } catch (error) {
    Logger.error('state', `Failed to save to localStorage: ${error}`);
  }
};

const loadFromStorage = (): ShortenedUrl[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const data: StorageData = JSON.parse(stored);
    const urls = data.urls.map(url => ({
      ...url,
      createdAt: new Date(url.createdAt),
      expiresAt: new Date(url.expiresAt),
      clicks: url.clicks.map(click => ({
        ...click,
        timestamp: new Date(click.timestamp)
      }))
    }));
    
    Logger.debug('state', `Loaded ${urls.length} URLs from localStorage`);
    return updateUrlExpirationStatus(urls);
  } catch (error) {
    Logger.error('state', `Failed to load from localStorage: ${error}`);
    return [];
  }
};

// Create context
const UrlContext = createContext<UrlContextType | undefined>(undefined);

// Provider component
interface UrlProviderProps {
  children: ReactNode;
}

export const UrlProvider: React.FC<UrlProviderProps> = ({ children }) => {
  const [urls, dispatch] = useReducer(urlReducer, [], loadFromStorage);
  const lastClickRef = React.useRef<{ shortCode: string; timestamp: number } | null>(null);
  
  // Create a Map for O(1) URL lookups by shortCode
  const urlMap = React.useMemo(() => {
    const map = new Map<string, ShortenedUrl>();
    urls.forEach(url => map.set(url.shortCode, url));
    return map;
  }, [urls]);

  // Save to localStorage whenever URLs change
  useEffect(() => {
    saveToStorage(urls);
  }, [urls]);

  // Update expiration status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'UPDATE_EXPIRATION_STATUS' });
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  // Context value
  const contextValue: UrlContextType = {
    urls,
    
    addUrls: (newUrls: ShortenedUrl[]) => {
      Logger.info('state', `Adding ${newUrls.length} new URLs`);
      dispatch({ type: 'ADD_URLS', payload: newUrls });
    },
    
    updateUrl: (id: string, updates: Partial<ShortenedUrl>) => {
      Logger.debug('state', `Updating URL ${id}`);
      dispatch({ type: 'UPDATE_URL', payload: { id, updates } });
    },
    
    removeUrl: (id: string) => {
      Logger.info('state', `Removing URL ${id}`);
      dispatch({ type: 'REMOVE_URL', payload: id });
    },
    
    getUrlByShortCode: (shortCode: string) => {
      const url = urlMap.get(shortCode);
      return url && !url.isExpired ? url : undefined;
    },
    
    // Optimized lookup method - still checks expiry but with O(1) Map access
    getUrlByShortCodeFast: (shortCode: string) => {
      const url = urlMap.get(shortCode);
      if (!url) return undefined;
      
      // Always check expiry for security - no shortcuts
      if (url.isExpired) return undefined;
      
      return url;
    },
    
    incrementClickCount: (shortCode: string, clickData: ClickData) => {
      // Prevent duplicate clicks within 1 second
      const now = Date.now();
      if (lastClickRef.current && 
          lastClickRef.current.shortCode === shortCode && 
          now - lastClickRef.current.timestamp < 1000) {
        Logger.debug('state', 'Duplicate click detected, ignoring');
        return;
      }
      
      lastClickRef.current = { shortCode, timestamp: now };
      
      Logger.info('state', `Incrementing click count for ${shortCode}`);
      dispatch({ type: 'INCREMENT_CLICK', payload: { shortCode, clickData } });
    },
    
    clearExpiredUrls: () => {
      const expiredCount = urls.filter(url => url.isExpired).length;
      if (expiredCount > 0) {
        Logger.info('state', `Clearing ${expiredCount} expired URLs`);
        dispatch({ type: 'CLEAR_EXPIRED' });
      }
    }
  };

  return (
    <UrlContext.Provider value={contextValue}>
      {children}
    </UrlContext.Provider>
  );
};

export default UrlContext;
