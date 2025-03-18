import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Thêm useLocation
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
  IconButton,
} from '@mui/material';
import { ExpandLess, ExpandMore, Menu, ChevronLeft } from '@mui/icons-material';

function SlideBar({ isSidebarOpen, setIsSidebarOpen }) {
  const [openSubmenu, setOpenSubmenu] = useState({});
  const location = useLocation(); // Lấy thông tin route hiện tại

  const handleToggle = (menu) => {
    setOpenSubmenu((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleOpenSidebar = () => {
    console.log('Nút Menu được nhấp! isSidebarOpen hiện tại:', isSidebarOpen);
    if (typeof setIsSidebarOpen === 'function') {
      setIsSidebarOpen(true);
    }
  };

  const handleCloseSidebar = () => {
    console.log('Nút đóng được nhấp! isSidebarOpen hiện tại:', isSidebarOpen);
    if (typeof setIsSidebarOpen === 'function') {
      setIsSidebarOpen(false);
    }
  };

  // Kiểm tra xem route hiện tại có phải là /login hay không
  const isLoginRoute = location.pathname === '/login';

  return (
    <>
      {/* Nút mở SlideBar chỉ hiển thị khi SlideBar đã bị ẩn và không ở màn đăng nhập */}
      {!isSidebarOpen && !isLoginRoute && (
        <IconButton
          onClick={handleOpenSidebar}
          sx={{
            position: 'fixed',
            top: 10,
            left: 10,
            zIndex: 1300,
            color: '#fff',
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
            padding: '8px',
            borderRadius: '50%',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
          }}
        >
          <Menu />
        </IconButton>
      )}

      <Drawer
        variant="persistent"
        open={isSidebarOpen}
        onClose={handleCloseSidebar}
        sx={{
          width: isSidebarOpen ? 190 : 0,
          flexShrink: 0,
          transition: 'width 0.3s ease',
          '& .MuiDrawer-paper': {
            width: isSidebarOpen ? 190 : 0,
            boxSizing: 'border-box',
            overflow: 'hidden',
            transition: 'width 0.3s ease',
            display: isSidebarOpen ? 'block' : 'none',
          },
        }}
      >
        {/* Nút đóng SlideBar chỉ hiển thị khi mở */}
        {isSidebarOpen && (
          <IconButton
            onClick={handleCloseSidebar}
            sx={{
              width: 40,
              height: 40,
              padding: 1,
              minWidth: 'unset',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 'auto',
            }}
          >
            <ChevronLeft fontSize="small" />
          </IconButton>
        )}

        <List>
          <ListItemButton component={Link} to="/TrangChu">
            <ListItemText primary="Trang chủ" />
          </ListItemButton>
          <ListItemButton component={Link} to="/quan-ly-phong">
            <ListItemText primary="Quản lý phòng" />
          </ListItemButton>
          <ListItemButton component={Link} to="/giao-dien-tao-dp">
            <ListItemText primary="Đặt phòng" />
          </ListItemButton>
          <ListItemButton component={Link} to="/quan-ly-dat-phong">
            <ListItemText primary="Quản lý đặt phòng" />
          </ListItemButton>

          <ListItemButton onClick={() => handleToggle('quanLyPhong')}>
            <ListItemText primary="Quản lý phòng" />
            {openSubmenu['quanLyPhong'] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openSubmenu['quanLyPhong']} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton component={Link} to="/phong" sx={{ pl: 4 }}>
                <ListItemText primary="Phòng" />
              </ListItemButton>
              <ListItemButton component={Link} to="/LoaiPhong" sx={{ pl: 4 }}>
                <ListItemText primary="Loại phòng" />
              </ListItemButton>
              <ListItemButton component={Link} to="/VatTu" sx={{ pl: 4 }}>
                <ListItemText primary="Vật tư" />
              </ListItemButton>
              <ListItemButton component={Link} to="/kiem-tra-phong" sx={{ pl: 4 }}>
                <ListItemText primary="Kiểm tra phòng" />
              </ListItemButton>
            </List>
          </Collapse>
          <Divider />
          <ListItemButton component={Link} to="/DichVu">
            <ListItemText primary="Dịch vụ" />
          </ListItemButton>
          <ListItemButton component={Link} to="/hinh-anh">
            <ListItemText primary="Hình ảnh" />
          </ListItemButton>
          <ListItemButton onClick={() => handleToggle('hoaDon')}>
            <ListItemText primary="Hóa đơn" />
            {openSubmenu['hoaDon'] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openSubmenu['hoaDon']} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton component={Link} to="/tra-phong" sx={{ pl: 4 }}>
                <ListItemText primary="Trả phòng" />
              </ListItemButton>
              <ListItemButton component={Link} to="/hoa-don" sx={{ pl: 4 }}>
                <ListItemText primary="Quản lý hóa đơn" />
              </ListItemButton>
            </List>
          </Collapse>
          <Divider />
          <ListItemButton component={Link} to="/NhanVien">
            <ListItemText primary="Nhân viên" />
          </ListItemButton>
          <ListItemButton component={Link} to="/TaiKhoan">
            <ListItemText primary="Tài khoản" />
          </ListItemButton>
          <ListItemButton component={Link} to="/VaiTro">
            <ListItemText primary="Vai trò" />
          </ListItemButton>
          <ListItemButton component={Link} to="/khach-hang">
            <ListItemText primary="Khách hàng" />
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
}

export default SlideBar;