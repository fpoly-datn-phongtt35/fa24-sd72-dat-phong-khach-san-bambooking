import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

function Sidebar() {
  const [openSubmenu, setOpenSubmenu] = useState({});

  const handleToggle = (menu) => {
    setOpenSubmenu((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 200,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 200,
          boxSizing: 'border-box',
          overflow: 'hidden', // Ẩn thanh cuộn
        },
      }}
    >
      <List>
        {/* Các mục menu chính */}
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

        {/* Submenu: Quản lý phòng */}
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
            <ListItemButton component={Link} to="/TienIch" sx={{ pl: 4 }}>
              <ListItemText primary="Tiện ích" />
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

        {/* Submenu: Hóa đơn */}
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
          <ListItemText primary="Tài Khoản" />
        </ListItemButton>
        <ListItemButton component={Link} to="/VaiTro">
          <ListItemText primary="Vai Trò" />
        </ListItemButton>
        <ListItemButton component={Link} to="/khach-hang">
          <ListItemText primary="Khách hàng" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}

export default Sidebar;
