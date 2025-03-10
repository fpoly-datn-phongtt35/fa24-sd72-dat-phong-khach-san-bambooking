import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
  IconButton
} from '@mui/material';
import { ExpandLess, ExpandMore, Menu, ChevronLeft } from '@mui/icons-material';

function Sidebar() {
  const [open, setOpen] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState({});

  const handleToggle = (menu) => {
    setOpenSubmenu((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <>
      {/* Nút mở Sidebar */}
      {!open && (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{ position: 'absolute', top: 10, left: 10 }}
        >
          <Menu />
        </IconButton>
      )}

      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: open ? 200 : 0,
          flexShrink: 0,
          transition: 'width 0.3s ease',
          '& .MuiDrawer-paper': {
            width: open ? 200 : 0,
            boxSizing: 'border-box',
            overflow: 'hidden',
            transition: 'width 0.3s ease',
          },
        }}
      >
        {/* Nút thu Sidebar */}
        <IconButton
          onClick={() => setOpen(false)}
          sx={{
            width: 40,
            height: 40,
            padding: 1,
            minWidth: "unset",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "auto" 
          }}
        >
          <ChevronLeft fontSize="small" />
        </IconButton>


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
    </>
  );
}

export default Sidebar;
