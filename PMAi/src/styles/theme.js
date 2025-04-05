// Theme configuration for the PMAi application
// This file contains styling variables to maintain consistency across the application

const theme = {
  // Color Scheme
  colors: {
    // Primary colors
    primary: {
      main: '#6366f1', // Indigo-500
      light: '#818cf8', // Indigo-400
      dark: '#4f46e5', // Indigo-600
      gradient: 'linear-gradient(135deg, #6366f1, #3b82f6)' // Indigo to blue gradient
    },
    
    // Secondary colors
    secondary: {
      main: '#3b82f6', // Blue-500
      light: '#60a5fa', // Blue-400
      dark: '#2563eb', // Blue-600
      gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' // Blue to purple gradient
    },
    
    // Accent colors for highlights
    accent: {
      success: '#10b981', // Emerald-500
      warning: '#f59e0b', // Amber-500
      error: '#ef4444', // Red-500
      info: '#06b6d4', // Cyan-500
    },
    
    // Neutral colors for backgrounds and text
    neutral: {
      bg: {
        primary: '#111827', // Gray-900
        secondary: '#1f2937', // Gray-800
        tertiary: '#374151', // Gray-700
      },
      text: {
        primary: '#f9fafb', // Gray-50
        secondary: '#e5e7eb', // Gray-200
        tertiary: '#9ca3af', // Gray-400
        disabled: '#6b7280', // Gray-500
      },
    },
    
    // Gradient backgrounds
    gradients: {
      page: 'linear-gradient(to bottom right, #111827, #1e3a8a)', // Dark blue gradient
      card: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(55, 65, 81, 0.8))', // Gray-800 to Gray-700
      cardHover: 'linear-gradient(135deg, rgba(31, 41, 55, 0.9), rgba(55, 65, 81, 0.9))', // Darker variant
      glass: 'rgba(31, 41, 55, 0.6)', // Translucent dark gray for glass effect
    },
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
      mono: `'Roboto Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`,
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // Spacing
  spacing: {
    '0': '0',
    '1': '0.25rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '8': '2rem',
    '10': '2.5rem',
    '12': '3rem',
    '16': '4rem',
    '20': '5rem',
    '24': '6rem',
    '32': '8rem',
    '40': '10rem',
    '48': '12rem',
    '56': '14rem',
    '64': '16rem',
  },
  
  // Borders
  borders: {
    radius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px',
    },
    width: {
      none: '0',
      thin: '1px',
      thick: '2px',
      thicker: '4px',
    },
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    glow: '0 0 15px rgba(99, 102, 241, 0.5)', // Glowing effect with primary color
    none: 'none',
  },
  
  // Animations
  animations: {
    transition: {
      fast: 'all 0.15s ease',
      normal: 'all 0.3s ease',
      slow: 'all 0.5s ease',
    },
    keyframes: {
      fadeIn: `@keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }`,
      slideUp: `@keyframes slideUp {
        from { transform: translateY(10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }`,
      pulse: `@keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }`,
    },
  },
  
  // Z-indices
  zIndex: {
    '0': 0,
    '10': 10,
    '20': 20,
    '30': 30,
    '40': 40,
    '50': 50,
    'auto': 'auto',
  },
  
  // Glass effect
  glass: {
    background: 'rgba(31, 41, 55, 0.6)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
};

export default theme; 