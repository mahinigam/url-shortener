import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  IconButton,
  Alert,
  Collapse,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
  Timer as TimerIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import type { UrlFormData, ValidationError, UrlFormProps } from '../types';
import { validateUrlFormData, isValidUrl } from '../utils/urlUtils';
import Logger from '../utils/logger';

interface FormState {
  urls: UrlFormData[];
  errors: ValidationError[];
  showErrors: boolean;
}

const UrlForm: React.FC<UrlFormProps> = ({ 
  onSubmit, 
  isLoading = false, 
  maxUrls = 5 
}) => {
  const [formState, setFormState] = useState<FormState>({
    urls: [{ originalUrl: '', validityPeriod: 30, customShortCode: '' }],
    errors: [],
    showErrors: false,
  });

  const addUrlField = () => {
    if (formState.urls.length < maxUrls) {
      Logger.debug('component', 'Adding new URL field');
      setFormState(prev => ({
        ...prev,
        urls: [...prev.urls, { originalUrl: '', validityPeriod: 30, customShortCode: '' }],
      }));
    }
  };

  const removeUrlField = (index: number) => {
    if (formState.urls.length > 1) {
      Logger.debug('component', `Removing URL field at index ${index}`);
      setFormState(prev => ({
        ...prev,
        urls: prev.urls.filter((_, i) => i !== index),
      }));
    }
  };

  const updateUrlField = (index: number, field: keyof UrlFormData, value: string | number) => {
    setFormState(prev => ({
      ...prev,
      urls: prev.urls.map((url, i) => 
        i === index ? { ...url, [field]: value } : url
      ),
      showErrors: false, // Hide errors when user starts typing
    }));
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return formState.errors.find(error => error.field === fieldName)?.message;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    Logger.info('component', 'Submitting URL form');
    
    // Filter out empty URLs and normalize validity periods
    const validUrls = formState.urls
      .filter(url => url.originalUrl.trim() !== '')
      .map(url => ({
        ...url,
        validityPeriod: url.validityPeriod === 0 ? 30 : url.validityPeriod // Set default if empty
      }));
    
    if (validUrls.length === 0) {
      setFormState(prev => ({
        ...prev,
        errors: [{ field: 'general', message: 'Please enter at least one URL' }],
        showErrors: true,
      }));
      return;
    }

    // Validate the form data
    const errors = validateUrlFormData(validUrls);
    
    if (errors.length > 0) {
      setFormState(prev => ({
        ...prev,
        errors,
        showErrors: true,
      }));
      Logger.warn('component', `Form validation failed with ${errors.length} errors`);
      return;
    }

    // Submit the valid URLs
    onSubmit(validUrls);
    
    // Reset form
    setFormState({
      urls: [{ originalUrl: '', validityPeriod: 30, customShortCode: '' }],
      errors: [],
      showErrors: false,
    });
  };

  const generalError = formState.errors.find(error => error.field === 'general');

  return (
    <Card sx={{
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(25px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Shorten URLs
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Enter up to {maxUrls} URLs to shorten. URLs expire after 30 minutes by default.
        </Typography>

        <Collapse in={formState.showErrors && !!generalError}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {generalError?.message}
          </Alert>
        </Collapse>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {formState.urls.map((url, index) => (
              <Card 
                variant="outlined" 
                sx={{ 
                  p: 2,
                  background: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                }} 
                key={index}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    URL #{index + 1}
                  </Typography>
                  {formState.urls.length > 1 && (
                    <IconButton
                      onClick={() => removeUrlField(index)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#FFFFFF', fontWeight: 600 }}>
                      Original URL *
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="https://example.com/very-long-url"
                      value={url.originalUrl}
                      onChange={(e) => updateUrlField(index, 'originalUrl', e.target.value)}
                      error={!!getFieldError(`url_${index}_originalUrl`)}
                      helperText={getFieldError(`url_${index}_originalUrl`)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LinkIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      required
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: '#FFFFFF', fontWeight: 600 }}>
                        Validity Period (minutes)
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        placeholder="30"
                        value={url.validityPeriod === 0 ? '' : url.validityPeriod}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            updateUrlField(index, 'validityPeriod', 0);
                          } else {
                            const numValue = parseInt(value);
                            if (!isNaN(numValue)) {
                              updateUrlField(index, 'validityPeriod', numValue);
                            }
                          }
                        }}
                        error={!!getFieldError(`url_${index}_validityPeriod`)}
                        helperText={getFieldError(`url_${index}_validityPeriod`) || 'Enter minutes (1-10080). Default: 30 minutes'}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <TimerIcon color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <Typography variant="caption" color="text.secondary">
                                min
                              </Typography>
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{ 
                          min: 1, 
                          max: 10080,
                          step: 1,
                        }}
                      />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: '#FFFFFF', fontWeight: 600 }}>
                        Custom Shortcode (optional)
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="my-link"
                        value={url.customShortCode}
                        onChange={(e) => updateUrlField(index, 'customShortCode', e.target.value)}
                        error={!!getFieldError(`url_${index}_customShortCode`)}
                        helperText={getFieldError(`url_${index}_customShortCode`) || 'Leave empty for auto-generation'}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CodeIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                {url.originalUrl && isValidUrl(url.originalUrl) && (
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label="Valid URL"
                      size="small"
                      sx={{
                        backgroundColor: '#4CAF50',
                        color: '#FFFFFF',
                        fontWeight: 600,
                        '& .MuiChip-label': {
                          color: '#FFFFFF'
                        }
                      }}
                    />
                  </Box>
                )}
              </Card>
            ))}
          </Box>

          <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {formState.urls.length < maxUrls && (
              <Button
                variant="outlined"
                onClick={addUrlField}
                startIcon={<AddIcon />}
                disabled={isLoading}
              >
                Add Another URL
              </Button>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || formState.urls.every(url => !url.originalUrl.trim())}
              sx={{ ml: 'auto' }}
            >
              {isLoading ? 'Shortening...' : 'Shorten URLs'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UrlForm;
