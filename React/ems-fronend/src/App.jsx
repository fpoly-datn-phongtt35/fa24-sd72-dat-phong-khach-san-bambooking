import { useEffect, useState } from 'react';
import './App.css';
import RouterProvider from '../src/routers/RouterProvider';
import { Box } from '@mui/joy';
import SlideBar from '../src/components/Slidebar';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  useEffect(() => {
    if (location.pathname === '/login') {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Sidebar */}
      <SlideBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Nội dung chính */}
      <Box
        component="main"
        className="main-content"
        sx={{
          flexGrow: 1,
          width: '100%',
          transition: 'margin-left 0.3s ease',
          marginLeft: isSidebarOpen ? '190px' : '0',
          overflowX: 'hidden',
        }}
      >
        <RouterProvider isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </Box>
    </Box>
  );
}

export default App;