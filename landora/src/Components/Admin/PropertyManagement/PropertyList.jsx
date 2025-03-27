// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useContext } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Box, Typography, Button, Card, CardContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../../Auth/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUsers, faSackDollar, faHammer, faSignOutAlt, faBuilding } from '@fortawesome/free-solid-svg-icons';
//import { properties, MntRequests, maintenanceData } from "../Database/Data";

const drawerWidth = 230;

// URL for the background image  
const sidebarBackground = `
  linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)),
  url('https://wallpapers.com/images/hd/blank-white-vertical-grains-mcf32g28ary3jdej.jpg')
`;
const menuItems = [
  { text: 'Main Dashboard', icon: faTachometerAlt, path: '/admindashboard/dashboard' },
  { text: 'Property List', icon: faUsers, path: '/ property-management/list' },
  //{ text: 'Menu Item 1', icon: faBuilding, path: '/ property-management/1' },
  //{ text: 'Menu Item 2', icon: faSackDollar, path: '/ property-management/2' },
  //{ text: 'Menu Item 3', icon: faHammer, path: '/ property-management/3' },
];

function PropertyList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const [currentTab, setCurrentTab] = useState('');


  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(item => item.path === currentPath);
    if (currentItem) {
      setCurrentTab(currentItem.text);
    }
  }, [location.pathname]);

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundImage: sidebarBackground, // Apply background with overlay
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            color: ' #333', // Darker text for better readability
            paddingTop: '20px'
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={index} onClick={() => handleMenuClick(item.path)}>
              <ListItemIcon>
                <FontAwesomeIcon icon={item.icon} style={{ color: ' #ff932f' }} /> {/* Orange icons */}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ color: 'black' }} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
              component="main"
              sx={{
                flexGrow: 1,
                backgroundColor: '#f4f4f4', // Light background
                minHeight: '100vh',
                overflow: 'hidden',
              }}
            >
              {/* Header Bar */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'linear-gradient(to left, #babd02, #ff932f)',
                  padding: '15px 30px',
                  color: 'white',
                  height: '80px'
                }}
              >
                <Typography variant="h5">{currentTab}</Typography>
      
                <Button
                  variant="contained"
                  onClick={handleLogout}
                  sx={{
                    backgroundColor: '#ff3b3b',
                    color: 'white',
                    '&:hover': { backgroundColor: '#d32f2f' },
                    padding: '8px 16px'
                  }}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  Logout
                </Button>
              </Box>
      
              <Outlet /> {/* Render nested routes */}
            </Box>
    </Box>
  );
}

export default PropertyList;
