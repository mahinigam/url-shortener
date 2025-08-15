import { useContext } from 'react';
import type { UrlContextType } from '../types';
import UrlContext from '../contexts/UrlContext';
import Logger from '../utils/logger';

// Hook to use URL context
export const useUrls = (): UrlContextType => {
  const context = useContext(UrlContext);
  if (context === undefined) {
    Logger.error('hook', 'useUrls must be used within a UrlProvider');
    throw new Error('useUrls must be used within a UrlProvider');
  }
  return context;
};
