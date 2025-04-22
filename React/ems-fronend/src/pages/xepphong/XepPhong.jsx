import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  getPhongKhaDung,
  setPhongDangDat,
  huyPhongDangDat,
} from "../../services/PhongService";
import { addXepPhong } from "../../services/XepPhongService";

function XepPhong({ show, handleClose, selectedTTDPs, onSuccess }) {
  const [listPhong, setListPhong] = useState({});
  const [selectedPhong, setSelectedPhong] = useState({});
  const navigate = useNavigate();

  const formatToLocalDateTime = (dateString, type) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19);
  };

  const phongKhaDung = (
    idLoaiPhong,
    ngayNhanPhong,
    ngayTraPhong,
    ttdpId,
    ttdp
  ) => {
    getPhongKhaDung(idLoaiPhong, ngayNhanPhong, ngayTraPhong)
      .then((response) => {
        let rooms = response.data;
        if (ttdp.phong && !rooms.some((p) => p.id === ttdp.phong.id)) {
          rooms = [ttdp.phong, ...rooms];
        }
        setListPhong((prevList) => ({
          ...prevList,
          [ttdpId]: rooms,
        }));
      })
      .catch((error) => {
        console.error("Lỗi khi lấy phòng khả dụng:", error);
      });
  };

  const reloadPhongKhaDung = () => {
    selectedTTDPs.forEach((ttdp) => {
      phongKhaDung(
        ttdp.loaiPhong.id,
        ttdp.ngayNhanPhong,
        ttdp.ngayTraPhong,
        ttdp.id,
        ttdp
      );
    });
  };

  useEffect(() => {
    if (show && selectedTTDPs.length > 0) {
      const initialSelected = {};
      selectedTTDPs.forEach((ttdp) => {
        if (ttdp.phong) {
          initialSelected[ttdp.id] = ttdp.phong.id;
        }
      });
      setSelectedPhong(initialSelected);
      reloadPhongKhaDung();
    }
  }, [show, selectedTTDPs]);

  const handlePhongChange = async (ttdpId, phongId) => {
    const previousPhongId = selectedPhong[ttdpId];

    setSelectedPhong((prevSelected) => ({
      ...prevSelected,
      [ttdpId]: phongId,
    }));

    try {
      if (previousPhongId) {
        await huyPhongDangDat(previousPhongId);
      }
      await setPhongDangDat(phongId);
      reloadPhongKhaDung();
    } catch (error) {
      console.error("Lỗi khi thay đổi phòng:", error);
      setSelectedPhong((prevSelected) => ({
        ...prevSelected,
        [ttdpId]: previousPhongId,
      }));
    }
  };

  const handleSaveAll = async () => {
    const requests = selectedTTDPs.map(async (ttdp) => {
      const xepPhongRequest = {
        phong: { id: selectedPhong[ttdp.id] },
        thongTinDatPhong: { id: ttdp.id },
        ngayNhanPhong: formatToLocalDateTime(ttdp.ngayNhanPhong, "checkin"),
        ngayTraPhong: formatToLocalDateTime(ttdp.ngayTraPhong, "checkout"),
        trangThai: "Đã xếp",
      };

      await huyPhongDangDat(selectedPhong[ttdp.id]);
      return addXepPhong(xepPhongRequest);
    });

    try {
      await Promise.all(requests);
      alert("Xếp phòng thành công cho tất cả các đặt phòng đã chọn!");
      if (onSuccess) onSuccess();
      handleClose();
    } catch (error) {
      console.error("Lỗi khi xếp phòng:", error);
      alert("Xảy ra lỗi trong quá trình xếp phòng.");
    }
  };

  const handleCancel = async () => {
    try {
      const cancelRequests = Object.values(selectedPhong).map((phongId) =>
        huyPhongDangDat(phongId)
      );
      await Promise.all(cancelRequests);
    } catch (error) {
      console.error("Lỗi khi hủy trạng thái phòng:", error);
    }
    setSelectedPhong({});
    handleClose();
  };

  // Hàm phân loại phòng theo tầng dựa trên maPhong
  const groupPhongByFloor = (phongList) => {
    const floors = {};
    phongList.forEach((phong) => {
      const floor = parseInt(phong.maPhong.charAt(1), 10); // Lấy số tầng từ ký tự thứ 2 (P101 -> 1)
      if (!floors[floor]) {
        floors[floor] = [];
      }
      floors[floor].push(phong);
    });
    return floors;
  };

  // Hàm kiểm tra phòng có thể chọn được không
  const isPhongSelectable = (phong, ttdpId) => {
    return phong.tinhTrang !== "Đang đặt" || selectedPhong[ttdpId] === phong.id;
  };

  return (
    <Dialog open={show} onClose={handleCancel} fullWidth maxWidth="md">
      <DialogTitle>Xếp phòng</DialogTitle>
      <DialogContent dividers>
        {selectedTTDPs.map((ttdp) => {
          const floors = groupPhongByFloor(listPhong[ttdp.id] || []);
          return (
            <Box key={ttdp.id} mb={4}>
              <Typography variant="h6" gutterBottom>
                Đặt phòng: {ttdp.maThongTinDatPhong}
              </Typography>
              {Object.keys(floors).length > 0 ? (
                Object.entries(floors).map(([floor, rooms]) => (
                  <Box key={floor} mb={2}>
                    <Typography variant="subtitle1" gutterBottom>
                      Tầng {floor}
                    </Typography>
                    <Grid container spacing={2}>
                      {rooms.map((phong) => {
                        const isSelectable = isPhongSelectable(phong, ttdp.id);
                        return (
                          <Grid item xs={3} key={phong.id}>
                            <Box
                              sx={{
                                width: "100%",
                                height: 80,
                                border: "1px solid #ccc",
                                borderRadius: 2,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: isSelectable
                                  ? "pointer"
                                  : "not-allowed",
                                backgroundColor:
                                  selectedPhong[ttdp.id] === phong.id
                                    ? "#1976d2"
                                    : phong.tinhTrang === "Đang đặt"
                                    ? "#e0e0e0"
                                    : "#fff",
                                color:
                                  selectedPhong[ttdp.id] === phong.id
                                    ? "#fff"
                                    : phong.tinhTrang === "Đang đặt"
                                    ? "#757575"
                                    : "#000",
                                "&:hover": {
                                  backgroundColor: isSelectable
                                    ? selectedPhong[ttdp.id] === phong.id
                                      ? "#1565c0"
                                      : "#f5f5f5"
                                    : phong.tinhTrang === "Đang đặt"
                                    ? "#e0e0e0"
                                    : "#fff",
                                },
                              }}
                              onClick={() =>
                                isSelectable &&
                                handlePhongChange(ttdp.id, phong.id)
                              }
                            >
                              <Typography variant="body2">
                                {phong.maPhong}
                              </Typography>
                              <Typography variant="caption">
                                {phong.tenPhong}
                              </Typography>
                              <Typography variant="caption">
                                {phong.tinhTrang}
                              </Typography>
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Không có phòng khả dụng
                </Typography>
              )}
            </Box>
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Hủy
        </Button>
        <Button
          onClick={handleSaveAll}
          color="primary"
          variant="contained"
          disabled={selectedTTDPs.some((ttdp) => !selectedPhong[ttdp.id])}
        >
          Lưu tất cả
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default XepPhong;
