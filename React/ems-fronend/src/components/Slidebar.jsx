import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import ImageIcon from '@mui/icons-material/Image';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';

import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
  IconButton,
  ListItemIcon,
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
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 1300,
            color: "#fff",
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
            padding: "8px",
            borderRadius: "50%",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease",
          }}
        >
          <Menu />
        </IconButton>
      )}

      <Drawer
        variant="persistent"
        // open={isSidebarOpen}
        open={isSidebarOpen && !isLoginRoute}
        onClose={handleCloseSidebar}
        sx={{
          width: isSidebarOpen ? 190 : 0,
          flexShrink: 0,
          transition: "width 0.3s ease",
          "& .MuiDrawer-paper": {
            width: isSidebarOpen ? 190 : 0,
            boxSizing: "border-box",
            overflow: "hidden",
            transition: "width 0.3s ease",
            display: isSidebarOpen ? "block" : "none",
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
              minWidth: "unset",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "auto",
            }}
          >
            <ChevronLeft fontSize="small" />
          </IconButton>
        )}

        <List>
          <ListItemButton component={Link} to="/trang-chu">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Trang chủ" />
          </ListItemButton>

          <ListItemButton component={Link} to="/dat-phong">
            <ListItemIcon><BookIcon /></ListItemIcon>
            <ListItemText primary="Đặt phòng" />
          </ListItemButton>

          <ListItemButton component={Link} to="/quan-ly-dat-phong">
            <ListItemIcon><ManageAccountsIcon /></ListItemIcon>
            <ListItemText primary="Quản lý đặt phòng" />
          </ListItemButton>

          <ListItemButton component={Link} to="/nhan-phong">
            <ListItemIcon><CheckCircleIcon /></ListItemIcon>
            <ListItemText primary="Nhận phòng" />
          </ListItemButton>

          <ListItemButton onClick={() => handleToggle("quanLyPhong")}>
            <ListItemIcon><RoomPreferencesIcon /></ListItemIcon>
            <ListItemText primary="Quản lý phòng" />
            {openSubmenu["quanLyPhong"] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse
            in={openSubmenu["quanLyPhong"]}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              <ListItemButton
                component={Link}
                to="/quan-ly-phong"
                sx={{ pl: 4 }}>
                <ListItemText primary="Phòng" />
              </ListItemButton>
              <ListItemButton component={Link} to="/loai-phong" sx={{ pl: 4 }}>
                <ListItemText primary="Loại phòng" />
              </ListItemButton>
              <ListItemButton component={Link} to="/vat-tu" sx={{ pl: 4 }}>
                <ListItemText primary="Vật tư" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/kiem-tra-phong"
                sx={{ pl: 4 }}
              >
                <ListItemText primary="Kiểm tra phòng" />
              </ListItemButton>
            </List>
          </Collapse>
          <Divider />

          <ListItemButton component={Link} to="/dich-vu">
            <ListItemIcon><RoomServiceIcon /></ListItemIcon>
            <ListItemText primary="Dịch vụ" />
          </ListItemButton>

          <ListItemButton onClick={() => handleToggle("hoaDon")}>
            <ListItemIcon><ReceiptIcon /></ListItemIcon>
            <ListItemText primary="Hóa đơn" />
            {openSubmenu["hoaDon"] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openSubmenu["hoaDon"]} timeout="auto" unmountOnExit>
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


          <ListItemButton onClick={() => handleToggle('nguoiDung')}>
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="Người dùng" />
            {openSubmenu['nguoiDung'] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openSubmenu['nguoiDung']} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton component={Link} to="/nhan-vien" sx={{ pl: 4 }}>
                <ListItemText primary="Nhân viên" />
              </ListItemButton>
              <ListItemButton component={Link} to="/khach-hang" sx={{ pl: 4 }}>
                <ListItemText primary="Khách hàng" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Drawer>
    </>
  );
}

export default SlideBar;