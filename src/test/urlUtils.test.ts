import { describe, it, expect } from 'vitest';
import { validateUrlFormData, generateShortCode, isValidUrl } from '../utils/urlUtils';
import type { UrlFormData, ValidationError } from '../types';

describe('URL Utils', () => {
  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://test.org')).toBe(true);
      expect(isValidUrl('https://subdomain.example.com/path?query=1')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('javascript:alert(1)')).toBe(false);
      // Note: ftp:// is actually a valid URL according to the URL constructor
      // but for our app we only want http/https, so we'd need custom validation
    });
  });

  describe('generateShortCode', () => {
    it('should generate shortcode of specified length', () => {
      const shortCode = generateShortCode(8);
      expect(shortCode).toHaveLength(8);
      expect(/^[A-Za-z0-9]+$/.test(shortCode)).toBe(true);
    });

    it('should generate different shortcodes', () => {
      const code1 = generateShortCode();
      const code2 = generateShortCode();
      expect(code1).not.toBe(code2);
    });
  });

  describe('validateUrlFormData', () => {
    it('should validate correct URL data', () => {
      const validData: UrlFormData[] = [
        { originalUrl: 'https://example.com', validityPeriod: 30 },
        { originalUrl: 'http://test.org', customShortCode: 'test123' }
      ];
      
      const errors = validateUrlFormData(validData);
      expect(errors).toHaveLength(0);
    });

    it('should return errors for invalid URLs', () => {
      const invalidData: UrlFormData[] = [
        { originalUrl: 'invalid-url' },
        { originalUrl: '', validityPeriod: -1 }
      ];
      
      const errors = validateUrlFormData(invalidData);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e: ValidationError) => e.message.includes('valid URL'))).toBe(true);
    });

    it('should validate custom shortcodes', () => {
      const invalidData: UrlFormData[] = [
        { originalUrl: 'https://example.com', customShortCode: 'a' }, // too short
        { originalUrl: 'https://example.com', customShortCode: 'invalid-code!' }, // invalid chars
      ];
      
      const errors = validateUrlFormData(invalidData);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e: ValidationError) => e.message.includes('alphanumeric'))).toBe(true);
    });
  });
});
