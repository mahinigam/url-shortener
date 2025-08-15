# Modern URL Shortener

> A sleek, production-ready URL shortener built with React 19, TypeScript, and Material-UI featuring a beautiful glassmorphism design.

![URL Shortener](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)
![Material-UI](https://img.shields.io/badge/Material--UI-5.17-blue?style=flat-square&logo=mui)
![Vite](https://img.shields.io/badge/Vite-7.0-purple?style=flat-square&logo=vite)
![Testing](https://img.shields.io/badge/Testing-Vitest-green?style=flat-square&logo=vitest)

## Features

### URL Shortening
- **Batch Processing**: Shorten up to 5 URLs simultaneously
- **Custom Shortcodes**: Option to use custom shortcodes or auto-generate them
- **Validity Control**: Set custom expiration times (default: 30 minutes)
- **Real-time Validation**: Client-side URL validation before processing

### Analytics & Statistics
- **Click Tracking**: Monitor clicks with timestamps and geolocation
- **Detailed Statistics**: View comprehensive analytics for all URLs
- **Top Performers**: See your most-clicked URLs
- **Expiration Management**: Track and manage expired URLs

### Design & User Experience
- **Glassmorphism Theme**: Modern black and white glass effect design
- **Inter Font**: Clean, professional typography throughout
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Frost Glass Effects**: Translucent components with backdrop blur
- **Client-side Routing**: Fast navigation with React Router
- **Error Handling**: Robust error boundaries and user-friendly messages

### Technical Features
- **TypeScript**: Strict typing for better code quality
- **Logging Middleware**: Comprehensive logging to external service
- **Local Storage**: Persistent data storage
- **Real-time Updates**: Automatic expiration status updates

## Technology Stack

- **Frontend**: React 19 + TypeScript 5.8
- **UI Framework**: Material-UI v5.17 (customized with glassmorphism theme)
- **Typography**: Inter font family
- **Routing**: React Router DOM v7.6
- **Build Tool**: Vite v7
- **Testing**: Vitest v3.2 + Testing Library
- **Linting**: ESLint v9 with TypeScript support
- **Styling**: Material-UI + Emotion + Custom glassmorphism effects
- **State Management**: React Context + useReducer
- **Design**: Black/white glassmorphism with backdrop blur effects

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mahinigam/url-shortener.git
   cd url-shortener
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

### Available Scripts

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production (TypeScript + Vite)
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI interface
- `npm run test:coverage` - Run tests with coverage report
- `npm run type-check` - TypeScript type checking
- `npm run security:audit` - Run npm security audit

## Usage

### Creating Shortened URLs

1. Navigate to the main page
2. Enter up to 5 URLs in the form (labels appear above input fields)
3. Optionally set custom validity periods and shortcodes
4. Click "Shorten URLs" to process
5. Copy and share your shortened URLs from the glassmorphism cards

### Viewing Statistics

1. Click "Statistics" in the navigation
2. View overview statistics with colorful accent icons
3. Browse all created URLs in glassmorphism cards
4. Check detailed click analytics
5. Manage expired URLs with the clear interface

### Using Shortened URLs

1. Share your shortened URL (e.g., `http://localhost:5173/abc123`)
2. When accessed, users see a glassmorphism redirect page
3. Automatic redirection occurs after 1.5 seconds
4. Clicks are automatically tracked with location data

## Configuration

### Logging Middleware

The application integrates with an external logging service:
- **Endpoint**: `http://20.244.56.144/evaluation-service/logs`
- **Stack**: "frontend"
- **Packages**: "api", "component", "hook", "page", "state", "style", "utils", "middleware"
- **Levels**: "debug", "info", "warn", "error", "fatal"

### Default Settings

- **Default Validity**: 30 minutes
- **Maximum URLs**: 5 per batch
- **Development Port**: 5173 (Vite default)
- **Shortcode Length**: 6 characters (auto-generated)

## Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components (glassmorphism styled)
│   ├── PerformanceMonitor.tsx  # Performance monitoring component
│   ├── UrlCard.tsx     # URL display card with glass effects
│   └── UrlForm.tsx     # URL input form with labels above fields
├── contexts/           # React context providers
│   └── UrlContext.tsx  # URL state management
├── hooks/              # Custom React hooks
│   ├── useHealthCheck.ts    # Health check monitoring
│   └── useUrls.ts      # URL management hook
├── pages/              # Page components with consistent theming
│   ├── UrlShortenerPage.tsx    # Main page with glassmorphism
│   ├── StatisticsPage.tsx      # Analytics with colorful icons
│   └── RedirectPage.tsx        # Redirect handling
├── theme/              # Material-UI theme (black/white glassmorphism)
│   └── index.ts        # Theme configuration
├── types/              # TypeScript type definitions
│   └── index.ts        # Application types
├── utils/              # Utility functions and helpers
│   ├── logger.ts       # Logging utilities
│   ├── monitoring.ts   # Performance monitoring
│   ├── rateLimiter.ts  # Rate limiting logic
│   ├── security.ts     # Security utilities
│   └── urlUtils.ts     # URL processing utilities
├── test/               # Test files
│   ├── App.test.tsx    # Main app tests
│   ├── setup.ts        # Test setup configuration
│   ├── UrlForm.test.tsx # Form component tests
│   └── urlUtils.test.ts # Utility function tests
└── App.tsx             # Main application with navigation & footer
```

### Data Flow

1. **URL Creation**: Form submission → Validation → Local storage → State update
2. **Click Tracking**: Shortcode access → URL lookup → Click recording → Redirect
3. **Statistics**: State query → Aggregation → Display

### State Management

The application uses React Context with useReducer for state management:
- **UrlContext**: Manages all URL data and operations
- **Local Storage**: Persists data between sessions
- **Real-time Updates**: Automatic expiration checking

## Features in Detail

### Glassmorphism Design
- **Black/White Color Scheme**: Pure black background with white text
- **Glass Effects**: Semi-transparent components with backdrop blur
- **Frost Glass Buttons**: All buttons have translucent frost appearance
- **Inter Typography**: Modern, clean font throughout the application
- **Consistent Theming**: Unified design language across all components

### URL Validation
- URL format validation using native URL constructor
- Shortcode validation (3-20 alphanumeric characters)
- Validity period validation (1-10080 minutes)
- Real-time feedback with glassmorphism styling

### Click Analytics
- Timestamp recording
- Source tracking (direct, redirect, etc.)
- Geolocation (coarse-grained via IP)
- User agent information
- Colorful accent icons for different metrics (blue, pink, green, orange)

### Error Handling
- Form validation with user-friendly messages
- Network error handling with glassmorphism alerts
- Expired URL handling with glass-themed cards
- 404 page for invalid shortcodes
- Error boundaries for component errors

## Quick Start

```bash
# Clone the repository
git clone https://github.com/mahinigam/url-shortener.git

# Navigate to project directory
cd url-shortener

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

## Available Scripts

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production (TypeScript + Vite)
- `npm run preview` - Preview production build
- `npm run test` - Run test suite with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI interface
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run type-check` - Run TypeScript type checking
- `npm run security:audit` - Run npm security audit

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations

- Code splitting with React Router
- Memoized calculations for statistics
- Debounced search/filter operations
- Optimized re-renders with React.memo
- Performance monitoring with custom hooks
- Bundle optimization with Vite
- Lazy loading of components

## Security Features

- Client-side URL validation
- XSS protection through React's built-in escaping
- Safe external link opening
- Input sanitization
- Rate limiting implementation
- Security utilities for data validation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm test && npm run lint`)
5. Run type checking (`npm run type-check`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Development

### Code Quality Tools
- **ESLint**: Code linting with TypeScript support
- **TypeScript**: Strict type checking
- **Vitest**: Fast unit testing
- **Testing Library**: Component testing utilities

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [React](https://reactjs.org/)
- UI components from [Material-UI](https://mui.com/)
- Icons from [Material Icons](https://fonts.google.com/icons)
- Font by [Inter](https://rsms.me/inter/)
