import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import BookIcon from "@mui/icons-material/Book";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PeopleIcon from "@mui/icons-material/People";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CategoryIcon from "@mui/icons-material/Category";
import BuildIcon from "@mui/icons-material/Build";
import SearchIcon from "@mui/icons-material/Search";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import WorkIcon from "@mui/icons-material/Work";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
  IconButton,
  ListItemIcon,
  Box,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore, Menu, ChevronLeft } from "@mui/icons-material";
import { usePermission } from "../hooks/userPermisstion";
import Cookies from "js-cookie";
import { permissions } from "../config/rbacConfig";

function SlideBar({ isSidebarOpen, setIsSidebarOpen }) {
  const [openSubmenu, setOpenSubmenu] = useState({});
  const location = useLocation();

  const { hasPermission } = usePermission(Cookies.get("role"));
  // console.log(hasPermission(permissions.VIEW_EMPLOYEE));


  const handleToggle = (menu) => {
    setOpenSubmenu((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleOpenSidebar = () => {
    console.log("Nút Menu được nhấp! isSidebarOpen hiện tại:", isSidebarOpen);
    if (typeof setIsSidebarOpen === "function") {
      setIsSidebarOpen(true);
    }
  };

  const handleCloseSidebar = () => {
    console.log("Nút đóng được nhấp! isSidebarOpen hiện tại:", isSidebarOpen);
    if (typeof setIsSidebarOpen === "function") {
      setIsSidebarOpen(false);
    }
  };

  const isLoginRoute = location.pathname === "/login";

  return (
    <>
      {!isSidebarOpen && !isLoginRoute && (
        <IconButton
          onClick={handleOpenSidebar}
          sx={{
            position: "fixed",
            top: 20,
            left: 20,
            zIndex: 1300,
            color: "#fff",
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#1565c0",
              transform: "scale(1.1)",
            },
            padding: "10px",
            borderRadius: "50%",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            transition: "all 0.2s ease",
          }}
        >
          <Menu />
        </IconButton>
      )}

      <Drawer
        variant="persistent"
        open={isSidebarOpen && !isLoginRoute}
        onClose={handleCloseSidebar}
        sx={{
          width: isSidebarOpen ? 240 : 0,
          flexShrink: 0,
          transition: "width 0.3s ease",
          "& .MuiDrawer-paper": {
            width: isSidebarOpen ? 240 : 0,
            boxSizing: "border-box",
            backgroundColor: "#1a237e",
            color: "#fff",
            transition: "width 0.3s ease",
            display: isSidebarOpen ? "block" : "none",
            boxShadow: "2px 0 8px rgba(0,0,0,0.2)",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            backgroundColor: "#0d1a4d",
          }}
        >
          {isSidebarOpen && (
            <IconButton
              onClick={handleCloseSidebar}
              sx={{
                color: "#fff",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <ChevronLeft />
            </IconButton>
          )}
        </Box>
        <Box sx={{ height: 36 }} />
        <List sx={{ padding: "0 8px" }}>
          <ListItemButton
            component={Link}
            to="/trang-chu"
            sx={{
              borderRadius: "8px",
              margin: "4px 0",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
              backgroundColor:
                location.pathname === "/trang-chu"
                  ? "rgba(255,255,255,0.2)"
                  : "transparent",
            }}
          >
            <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Trang chủ" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/dat-phong"
            sx={{
              borderRadius: "8px",
              margin: "4px 0",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
              backgroundColor:
                location.pathname === "/dat-phong"
                  ? "rgba(255,255,255,0.2)"
                  : "transparent",
            }}
          >
            <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
              <BookIcon />
            </ListItemIcon>
            <ListItemText primary="Đặt phòng" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/quan-ly-dat-phong"
            sx={{
              borderRadius: "8px",
              margin: "4px 0",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
              backgroundColor:
                location.pathname === "/quan-ly-dat-phong"
                  ? "rgba(255,255,255,0.2)"
                  : "transparent",
            }}
          >
            <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
              <ManageAccountsIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý đặt phòng" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/nhan-phong"
            sx={{
              borderRadius: "8px",
              margin: "4px 0",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
              backgroundColor:
                location.pathname === "/nhan-phong"
                  ? "rgba(255,255,255,0.2)"
                  : "transparent",
            }}
          >
            <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
              <CheckCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Nhận phòng" />
          </ListItemButton>

          <ListItemButton
            onClick={() => handleToggle("quanLyPhong")}
            sx={{
              borderRadius: "8px",
              margin: "4px 0",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
              <RoomPreferencesIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý phòng" />
            {openSubmenu["quanLyPhong"] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse
            in={openSubmenu["quanLyPhong"]}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              {hasPermission(permissions.VIEW_ROOM) &&
                <ListItemButton
                  component={Link}
                  to="/quan-ly-phong"
                  sx={{
                    pl: 6,
                    borderRadius: "8px",
                    margin: "4px 0",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                    backgroundColor:
                      location.pathname === "/quan-ly-phong"
                        ? "rgba(255,255,255,0.2)"
                        : "transparent",
                  }}
                >
                  <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                    <MeetingRoomIcon />
                  </ListItemIcon>
                  <ListItemText primary="Phòng" />
                </ListItemButton>
              }
              {hasPermission(permissions.VIEW_TYPE_ROOM) &&
                <ListItemButton
                  component={Link}
                  to="/loai-phong"
                  sx={{
                    pl: 6,
                    borderRadius: "8px",
                    margin: "4px 0",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                    backgroundColor:
                      location.pathname === "/loai-phong"
                        ? "rgba(255,255,255,0.2)"
                        : "transparent",
                  }}
                >
                  <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Loại phòng" />
                </ListItemButton>
              }
              {hasPermission(permissions.VIEW_MATERIALS) &&
                <ListItemButton
                  component={Link}
                  to="/vat-tu"
                  sx={{
                    pl: 6,
                    borderRadius: "8px",
                    margin: "4px 0",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                    backgroundColor:
                      location.pathname === "/vat-tu"
                        ? "rgba(255,255,255,0.2)"
                        : "transparent",
                  }}
                >
                  <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                    <BuildIcon />
                  </ListItemIcon>
                  <ListItemText primary="Vật tư" />
                </ListItemButton>
              }
              <ListItemButton
                component={Link}
                to="/kiem-tra-phong"
                sx={{
                  pl: 6,
                  borderRadius: "8px",
                  margin: "4px 0",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                  backgroundColor:
                    location.pathname === "/kiem-tra-phong"
                      ? "rgba(255,255,255,0.2)"
                      : "transparent",
                }}
              >
                <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                  <SearchIcon />
                </ListItemIcon>
                <ListItemText primary="Kiểm tra phòng" />
              </ListItemButton>
            </List>
          </Collapse>
          <Divider sx={{ backgroundColor: "rgba(255,255,255,0.2)", my: 1 }} />

          <ListItemButton
            component={Link}
            to="/dich-vu"
            sx={{
              borderRadius: "8px",
              margin: "4px 0",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
              backgroundColor:
                location.pathname === "/dich-vu"
                  ? "rgba(255,255,255,0.2)"
                  : "transparent",
            }}
          >
            <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
              <RoomServiceIcon />
            </ListItemIcon>
            <ListItemText primary="Dịch vụ" />
          </ListItemButton>

          <ListItemButton
            onClick={() => handleToggle("hoaDon")}
            sx={{
              borderRadius: "8px",
              margin: "4px 0",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary="Hóa đơn" />
            {openSubmenu["hoaDon"] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openSubmenu["hoaDon"]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                component={Link}
                to="/tra-phong"
                sx={{
                  pl: 6,
                  borderRadius: "8px",
                  margin: "4px 0",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                  backgroundColor:
                    location.pathname === "/tra-phong"
                      ? "rgba(255,255,255,0.2)"
                      : "transparent",
                }}
              >
                <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Trả phòng" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/hoa-don"
                sx={{
                  pl: 6,
                  borderRadius: "8px",
                  margin: "4px 0",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                  backgroundColor:
                    location.pathname === "/hoa-don"
                      ? "rgba(255,255,255,0.2)"
                      : "transparent",
                }}
              >
                <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                  <ReceiptLongIcon />
                </ListItemIcon>
                <ListItemText primary="Quản lý hóa đơn" />
              </ListItemButton>
            </List>
          </Collapse>
          <Divider sx={{ backgroundColor: "rgba(255,255,255,0.2)", my: 1 }} />

          <ListItemButton
            onClick={() => handleToggle("nguoiDung")}
            sx={{
              borderRadius: "8px",
              margin: "4px 0",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Người dùng" />
            {openSubmenu["nguoiDung"] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openSubmenu["nguoiDung"]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {hasPermission(permissions.VIEW_EMPLOYEE) &&
                <ListItemButton
                  component={Link}
                  to="/nhan-vien"
                  sx={{
                    pl: 6,
                    borderRadius: "8px",
                    margin: "4px 0",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                    backgroundColor:
                      location.pathname === "/nhan-vien"
                        ? "rgba(255,255,255,0.2)"
                        : "transparent",
                  }}
                >
                  <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                    <WorkIcon />
                  </ListItemIcon>
                  <ListItemText primary="Nhân viên" />
                </ListItemButton>
              }
              <ListItemButton
                component={Link}
                to="/khach-hang"
                sx={{
                  pl: 6,
                  borderRadius: "8 dissipativepx",
                  margin: "4px 0",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                  backgroundColor:
                    location.pathname === "/khach-hang"
                      ? "rgba(255,255,255,0.2)"
                      : "transparent",
                }}
              >
                <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                  <PersonOutlineIcon />
                </ListItemIcon>
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