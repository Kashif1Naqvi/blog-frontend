import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostsListPage from './pages/PostsListPage';
import PostDetailPage from './pages/PostDetailPage';
import PostFormPage from './pages/PostFormPage';
import MyPostsPage from './pages/MyPostsPage';
import ProfilePage from './pages/ProfilePage';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider as CustomThemeProvider } from './contexts/ThemeContext';

const modernTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    secondary: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
      main: '#d946ef',
      light: '#e879f9',
      dark: '#a21caf',
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.5rem',
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
      background: 'linear-gradient(135deg, #2563eb 0%, #d946ef 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
      letterSpacing: '-0.015em',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontWeight: 500,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 28px',
          fontSize: '0.9375rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px) scale(1.02)',
            boxShadow: '0 20px 40px -12px rgba(37, 99, 235, 0.4)',
          },
          '&:active': {
            transform: 'translateY(0) scale(0.98)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #d946ef 100%)',
          color: '#ffffff',
          border: '1px solid transparent',
          '&:hover': {
            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #c026d3 100%)',
          },
        },
        outlined: {
          borderWidth: '2px',
          borderColor: '#2563eb',
          color: '#2563eb',
          background: 'rgba(37, 99, 235, 0.04)',
          '&:hover': {
            borderWidth: '2px',
            borderColor: '#1d4ed8',
            background: 'rgba(37, 99, 235, 0.08)',
            transform: 'translateY(-2px)',
          },
        },
        text: {
          color: '#2563eb',
          '&:hover': {
            background: 'rgba(37, 99, 235, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          overflow: 'hidden',
          transition: 'all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          border: '1px solid #e2e8f0',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #2563eb, #d946ef)',
            opacity: 0,
            transition: 'opacity 250ms',
          },
          '&:hover': {
            transform: 'translateY(-8px) rotateX(2deg)',
            boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.25)',
            borderColor: '#93c5fd',
            '&::before': {
              opacity: 1,
            },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 250ms',
            background: '#ffffff',
            backdropFilter: 'blur(10px)',
            '& fieldset': {
              borderColor: '#e2e8f0',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: '#cbd5e1',
            },
            '&.Mui-focused': {
              background: '#ffffff',
              '& fieldset': {
                borderColor: '#2563eb',
                borderWidth: '2px',
                boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)',
              },
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
          fontSize: '0.8125rem',
          height: 36,
          transition: 'all 250ms',
          '&:hover': {
            transform: 'translateY(-2px) scale(1.05)',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)',
          },
        },
        filled: {
          background: 'linear-gradient(135deg, #2563eb 0%, #d946ef 100%)',
          color: '#ffffff',
        },
        outlined: {
          borderWidth: '2px',
          borderColor: '#2563eb',
          color: '#2563eb',
          background: 'rgba(37, 99, 235, 0.04)',
          '&:hover': {
            background: 'rgba(37, 99, 235, 0.08)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          border: '3px solid #ffffff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          transition: 'all 250ms',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.2)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 8px',
          padding: '12px 16px',
          transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(217, 70, 239, 0.12) 100%)',
            color: '#2563eb',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.18) 0%, rgba(217, 70, 239, 0.18) 100%)',
            },
          },
          '&:hover': {
            background: 'rgba(37, 99, 235, 0.06)',
            transform: 'translateX(4px)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(37, 99, 235, 0.15)',
        },
      },
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <CustomThemeProvider>
        <ThemeProvider theme={modernTheme}>
          <CssBaseline />
          <AuthProvider>
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/posts" element={<PostsListPage />} />
                  <Route path="/posts/:id" element={<PostDetailPage />} />
                  <Route 
                    path="/posts/create" 
                    element={
                      <ProtectedRoute>
                        <PostFormPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/posts/edit/:id" 
                    element={
                      <ProtectedRoute>
                        <PostFormPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/my-posts" 
                    element={
                      <ProtectedRoute>
                        <MyPostsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </Layout>
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </CustomThemeProvider>
    </HelmetProvider>

  );
}

export default App;
