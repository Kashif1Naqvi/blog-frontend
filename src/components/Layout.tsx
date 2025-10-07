import type { ReactNode } from 'react';
import { 
  AppBar, 
  Box, 
  Button, 
  Container, 
  Toolbar, 
  Typography, 
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme as useMuiTheme, // Rename MUI's useTheme
  useMediaQuery,
  IconButton,
  Avatar,
  Stack,
  Tooltip
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const DRAWER_WIDTH = 260;
const DRAWER_WIDTH_COLLAPSED = 72;

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, logout, user } = useAuth();
  const muiTheme = useMuiTheme(); // MUI theme for breakpoints
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md')); // Use MUI theme for breakpoints
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopToggle = () => {
    setDesktopOpen(!desktopOpen);
  };

  const currentDrawerWidth = isMobile 
    ? DRAWER_WIDTH 
    : (desktopOpen ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED);

  const drawerContent = (isCollapsed: boolean) => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box sx={{ p: isCollapsed ? 1 : 3, textAlign: isCollapsed ? 'center' : 'left' }}>
        {isCollapsed ? (
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40,
              mx: 'auto',
              background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
              fontWeight: 800,
              fontSize: '1.2rem'
            }}
          >
            B
          </Avatar>
        ) : (
          <>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Blog App
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Share your stories
            </Typography>
          </>
        )}
      </Box>

      {/* User Profile Section (only for authenticated users) */}
      {isAuthenticated && (
        <Box sx={{ px: isCollapsed ? 1 : 2, pb: 2 }}>
          {isCollapsed ? (
            <Tooltip title={`${user?.username}`} placement="right">
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40,
                  mx: 'auto',
                  bgcolor: 'primary.main',
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s'
                  }
                }}
                component={RouterLink}
                to="/profile"
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
          ) : (
            <Box sx={{ 
              p: 2,
              borderRadius: 1,
              background: 'linear-gradient(135deg, ##ffffff 0%, ##ffffff 100%)',
              border: '1px solid #e2e8f0'
            }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar 
                  sx={{ 
                    width: 40, 
                    height: 40,
                    bgcolor: 'primary.main',
                    fontWeight: 600
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600} noWrap>
                    {user?.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {user?.email}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}
        </Box>
      )}
      
      <Divider sx={{ mx: isCollapsed ? 1 : 2 }} />
      
      {/* Navigation List */}
      <List sx={{ px: 1, py: 2, flex: 1 }}>
        <ListItem disablePadding>
          <Tooltip title={isCollapsed ? "Home" : ""} placement="right">
            <ListItemButton 
              component={RouterLink} 
              to="/"
              selected={location.pathname === '/'}
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
            >
              <ListItemIcon sx={{ minWidth: isCollapsed ? 'auto' : 40 }}>
                <HomeIcon />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText 
                  primary="Home" 
                  primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9375rem' }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>
        
        {isAuthenticated ? (
          <>
            <ListItem disablePadding>
              <Tooltip title={isCollapsed ? "My Profile" : ""} placement="right">
                <ListItemButton 
                  component={RouterLink} 
                  to="/profile"
                  selected={location.pathname === '/profile'}
                  onClick={() => isMobile && setMobileOpen(false)}
                  sx={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                >
                  <ListItemIcon sx={{ minWidth: isCollapsed ? 'auto' : 40 }}>
                    <PersonIcon />
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText 
                      primary="My Profile" 
                      primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9375rem' }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
            
            <ListItem disablePadding>
              <Tooltip title={isCollapsed ? "My Posts" : ""} placement="right">
                <ListItemButton 
                  component={RouterLink} 
                  to="/my-posts"
                  selected={location.pathname === '/my-posts'}
                  onClick={() => isMobile && setMobileOpen(false)}
                  sx={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                >
                  <ListItemIcon sx={{ minWidth: isCollapsed ? 'auto' : 40 }}>
                    <ArticleIcon />
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText 
                      primary="My Posts" 
                      primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9375rem' }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
            
            <ListItem disablePadding>
              <Tooltip title={isCollapsed ? "All Posts" : ""} placement="right">
                <ListItemButton 
                  component={RouterLink} 
                  to="/posts"
                  selected={location.pathname === '/posts'}
                  onClick={() => isMobile && setMobileOpen(false)}
                  sx={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                >
                  <ListItemIcon sx={{ minWidth: isCollapsed ? 'auto' : 40 }}>
                    <BookmarkIcon />
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText 
                      primary="All Posts" 
                      primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9375rem' }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <Tooltip title={isCollapsed ? "Login" : ""} placement="right">
                <ListItemButton 
                  component={RouterLink} 
                  to="/login"
                  selected={location.pathname === '/login'}
                  onClick={() => isMobile && setMobileOpen(false)}
                  sx={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                >
                  <ListItemIcon sx={{ minWidth: isCollapsed ? 'auto' : 40 }}>
                    <LoginIcon />
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText 
                      primary="Login" 
                      primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9375rem' }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
            
            <ListItem disablePadding>
              <Tooltip title={isCollapsed ? "Register" : ""} placement="right">
                <ListItemButton 
                  component={RouterLink} 
                  to="/register"
                  selected={location.pathname === '/register'}
                  onClick={() => isMobile && setMobileOpen(false)}
                  sx={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                >
                  <ListItemIcon sx={{ minWidth: isCollapsed ? 'auto' : 40 }}>
                    <AppRegistrationIcon />
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText 
                      primary="Register" 
                      primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9375rem' }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </>
        )}
      </List>

      {/* Logout Button */}
      {isAuthenticated && (
        <Box sx={{ p: isCollapsed ? 1 : 2 }}>
          {isCollapsed ? (
            <Tooltip title="Logout" placement="right">
              <IconButton
                color="error"
                onClick={() => logout()}
                sx={{ 
                  width: '100%',
                  height: 48,
                  borderRadius: 2,
                  border: '2px solid',
                  borderColor: 'error.main',
                  '&:hover': {
                    bgcolor: 'error.main',
                    color: 'white'
                  }
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={() => logout()}
              sx={{ 
                borderRadius: 2,
                py: 1,
                borderWidth: 2,
                
                '&:hover': {
                  borderWidth: 2,
                }
              }}
            >
              Logout 
            </Button>
          )}
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }}>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={isMobile ? handleDrawerToggle : handleDesktopToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'white',
              fontWeight: 800,
              letterSpacing: '0.5px',
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            Blog App
          </Typography>
          
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1.5 }}>
            {/* <ThemeToggle /> */}
            {isAuthenticated ? (
              <>
                
                <Button 
                  color="inherit" 
                  onClick={() => logout()}
                  startIcon={<LogoutIcon />}
                  sx={{ 
                    borderRadius: 2,
                    px: 2.5,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color:"whitesmoke", 
                    '&:hover': { 
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                    }
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/login"
                  startIcon={<LoginIcon />}
                  sx={{ 
                    borderRadius: 2,
                    px: 2.5,
                    color: "whitesmoke",
                    '&:hover': { 
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  Login
                </Button>
                <Button 
                  color='info'
                  component={RouterLink} 
                  to="/register"
                  startIcon={<AppRegistrationIcon />}
                  sx={{ 
                    borderRadius: 2,
                    px: 2.5,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: 'whitesmoke',
                    '&:hover': { 
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                    }
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ 
          width: { md: currentDrawerWidth }, 
          flexShrink: { md: 0 },
          transition: muiTheme.transitions.create('width', { // Use MUI theme for transitions
            easing: muiTheme.transitions.easing.sharp,
            duration: muiTheme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawerContent(false)}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: currentDrawerWidth,
              top: { xs: 64, sm: 70 },
              height: { xs: 'calc(100% - 64px)', sm: 'calc(100% - 70px)' },
              transition: muiTheme.transitions.create('width', { // Use MUI theme for transitions
                easing: muiTheme.transitions.easing.sharp,
                duration: muiTheme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
            },
          }}
          open
        >
          {drawerContent(!desktopOpen)}
          
          {/* Toggle Button for Desktop */}
          <Box 
            sx={{ 
              position: 'absolute',
              top: 8,
              right: -16,
              zIndex: 1,
            }}
          >
            
          </Box>
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { 
            xs: '100%', 
            md: `calc(100% - ${currentDrawerWidth}px)` 
          },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          transition: muiTheme.transitions.create(['width', 'margin'], { // Use MUI theme for transitions
            easing: muiTheme.transitions.easing.sharp,
            duration: muiTheme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Content area with proper padding for AppBar */}
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            mt: { xs: '64px', sm: '70px' },
          }}
        >
          {children}
        </Box>

        {/* Footer */}
        <Box 
          component="footer" 
          sx={{ 
            py: 4, 
            px: 3,
            mt: 'auto', 
            background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
            borderTop: '1px solid #e2e8f0'
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
              <Box sx={{ maxWidth: 300 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 800,
                    mb: 1.5,
                    background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Blog App
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Share your thoughts with the world. Connect, inspire, and grow together.
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                  Quick Links
                </Typography>
                <Stack spacing={0.5}>
                  <Button 
                    component={RouterLink} 
                    to="/" 
                    size="small" 
                    color="inherit"
                    sx={{ 
                      justifyContent: 'flex-start', 
                      textTransform: 'none',
                      color: 'text.secondary',
                      fontWeight: 500,
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: 'transparent'
                      }
                    }}
                  >
                    Home
                  </Button>
                  <Button 
                    component={RouterLink} 
                    to="/about" 
                    size="small" 
                    color="inherit"
                    sx={{ 
                      justifyContent: 'flex-start', 
                      textTransform: 'none',
                      color: 'text.secondary',
                      fontWeight: 500,
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: 'transparent'
                      }
                    }}
                  >
                    About
                  </Button>
                  <Button 
                    component={RouterLink} 
                    to="/contact" 
                    size="small" 
                    color="inherit"
                    sx={{ 
                      justifyContent: 'flex-start', 
                      textTransform: 'none',
                      color: 'text.secondary',
                      fontWeight: 500,
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: 'transparent'
                      }
                    }}
                  >
                    Contact
                  </Button>
                </Stack>
              </Box>
            </Box>
            
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e2e8f0' }}>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ fontWeight: 500 }}>
                © {new Date().getFullYear()} Blog App. All rights reserved.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;