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
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const navigate = useNavigate();

  const formatToLocalDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19);
  };

  const fetchAvailableRooms = async () => {
    try {
      const minDate = new Date(
        Math.min(...selectedTTDPs.map((ttdp) => new Date(ttdp.ngayNhanPhong)))
      );
      const maxDate = new Date(
        Math.max(...selectedTTDPs.map((ttdp) => new Date(ttdp.ngayTraPhong)))
      );
      const formatDate = (date) => date.toISOString().split("T")[0];

      const ngayNhanPhong = formatDate(minDate);
      const ngayTraPhong = formatDate(maxDate);

      // Đếm số lượng phòng cần cho từng loại phòng
      const roomTypeCounts = selectedTTDPs.reduce((acc, ttdp) => {
        const roomTypeId = ttdp.loaiPhong.id;
        acc[roomTypeId] = (acc[roomTypeId] || 0) + 1;
        return acc;
      }, {});

      const roomPromises = Object.keys(roomTypeCounts).map((roomTypeId) =>
        getPhongKhaDung(roomTypeId, ngayNhanPhong, ngayTraPhong)
      );

      const responses = await Promise.all(roomPromises);
      const allRooms = responses
        .flatMap((response, index) => {
          const roomTypeId = Object.keys(roomTypeCounts)[index];
          return response.data.map((room) => ({
            ...room,
            roomTypeId,
          }));
        })
        .filter(
          (room, index, self) =>
            index === self.findIndex((r) => r.id === room.id)
        );

      const preAssignedRooms = selectedTTDPs
        .filter((ttdp) => ttdp.phong)
        .map((ttdp) => ({
          ...ttdp.phong,
          roomTypeId: ttdp.loaiPhong.id,
        }));

      const uniqueRooms = [
        ...preAssignedRooms,
        ...allRooms.filter(
          (room) => !preAssignedRooms.some((pr) => pr.id === room.id)
        ),
      ];

      setAvailableRooms(uniqueRooms);
    } catch (error) {
      console.error("Lỗi khi lấy phòng khả dụng:", error);
      alert("Không thể tải danh sách phòng khả dụng. Vui lòng thử lại!");
    }
  };

  useEffect(() => {
    if (show && selectedTTDPs.length > 0) {
      fetchAvailableRooms();
      const initialSelected = selectedTTDPs
        .filter((ttdp) => ttdp.phong)
        .map((ttdp) => ttdp.phong.id);
      setSelectedRooms(initialSelected);
    }
  }, [show, selectedTTDPs]);

  const handleRoomToggle = async (roomId) => {
    try {
      const room = availableRooms.find((r) => r.id === roomId);
      if (!room) return;

      const selectedRoomTypeCounts = selectedRooms.reduce((acc, id) => {
        const selectedRoom = availableRooms.find((r) => r.id === id);
        if (selectedRoom) {
          const roomTypeId = selectedRoom.roomTypeId;
          acc[roomTypeId] = (acc[roomTypeId] || 0) + 1;
        }
        return acc;
      }, {});

      const requiredRoomTypeCounts = selectedTTDPs.reduce((acc, ttdp) => {
        const roomTypeId = ttdp.loaiPhong.id;
        acc[roomTypeId] = (acc[roomTypeId] || 0) + 1;
        return acc;
      }, {});

      if (selectedRooms.includes(roomId)) {
        await huyPhongDangDat(roomId);
        setSelectedRooms(selectedRooms.filter((id) => id !== roomId));
      } else {
        const currentCount = selectedRoomTypeCounts[room.roomTypeId] || 0;
        const requiredCount = requiredRoomTypeCounts[room.roomTypeId] || 0;

        if (currentCount < requiredCount && selectedRooms.length < selectedTTDPs.length) {
          await setPhongDangDat(roomId);
          setSelectedRooms([...selectedRooms, roomId]);
        } else {
          alert("Không thể chọn thêm phòng này vì đã đủ số phòng cho loại phòng này!");
        }
      }
      fetchAvailableRooms();
    } catch (error) {
      console.error("Lỗi khi thay đổi phòng:", error);
      alert("Xảy ra lỗi khi chọn phòng. Vui lòng thử lại!");
    }
  };

  const handleSaveAll = async () => {
    try {
      const requests = selectedTTDPs
        .slice(0, selectedRooms.length)
        .map(async (ttdp, index) => {
          const xepPhongRequest = {
            phong: { id: selectedRooms[index] },
            thongTinDatPhong: { id: ttdp.id },
            ngayNhanPhong: formatToLocalDateTime(ttdp.ngayNhanPhong),
            ngayTraPhong: formatToLocalDateTime(ttdp.ngayTraPhong),
            trangThai: "Đã xếp",
          };

          await huyPhongDangDat(selectedRooms[index]);
          return addXepPhong(xepPhongRequest);
        });

      await Promise.all(requests);
      alert(`Xếp phòng thành công cho ${selectedRooms.length} đặt phòng!`);
      if (onSuccess) onSuccess();
      handleClose();
    } catch (error) {
      console.error("Lỗi khi xếp phòng:", error);
      alert("Xảy ra lỗi trong quá trình xếp phòng.");
    }
  };

  const handleCancel = async () => {
    try {
      const cancelRequests = selectedRooms.map((roomId) =>
        huyPhongDangDat(roomId)
      );
      await Promise.all(cancelRequests);
    } catch (error) {
      console.error("Lỗi khi hủy trạng thái phòng:", error);
    }
    setSelectedRooms([]);
    handleClose();
  };

  const groupPhongByFloor = (phongList) => {
    const floors = {};
    phongList.forEach((phong) => {
      const floor = parseInt(phong.maPhong.charAt(1), 10);
      if (!floors[floor]) {
        floors[floor] = [];
      }
      floors[floor].push(phong);
    });
    return floors;
  };

  const isRoomSelectable = (room) => {
    const selectedCount = selectedRooms.filter((id) => {
      const r = availableRooms.find((ar) => ar.id === id);
      return r && r.roomTypeId === room.roomTypeId;
    }).length;
    const requiredCount = selectedTTDPs.filter(
      (ttdp) => ttdp.loaiPhong.id === room.roomTypeId
    ).length;
    return (
      room.tinhTrang !== "Đang đặt" ||
      selectedRooms.includes(room.id) ||
      (selectedCount < requiredCount && selectedRooms.length < selectedTTDPs.length)
    );
  };

  return (
    <Dialog open={show} onClose={handleCancel} fullWidth maxWidth="md">
      <DialogTitle>Xếp phòng</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" gutterBottom>
          Yêu cầu:{" "}
          {Object.entries(
            selectedTTDPs.reduce((acc, ttdp) => {
              const roomTypeName = ttdp.loaiPhong.tenLoaiPhong;
              acc[roomTypeName] = (acc[roomTypeName] || 0) + 1;
              return acc;
            }, {})
          ).map(([name, count]) => `${name}: ${count} phòng. `)}
        </Typography>
        {Object.entries(groupPhongByFloor(availableRooms)).map(
          ([floor, rooms]) => (
            <Box key={floor} mb={2}>
              <Typography variant="subtitle1" gutterBottom>
                Tầng {floor}
              </Typography>
              <Grid container spacing={2}>
                {rooms.map((room) => {
                  const isSelectable = isRoomSelectable(room);
                  return (
                    <Grid item xs={3} key={room.id}>
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
                          cursor: isSelectable ? "pointer" : "not-allowed",
                          backgroundColor: selectedRooms.includes(room.id)
                            ? "#1976d2"
                            : room.tinhTrang === "Đang đặt"
                            ? "#e0e0e0"
                            : "#fff",
                          color: selectedRooms.includes(room.id)
                            ? "#fff"
                            : room.tinhTrang === "Đang đặt"
                            ? "#757575"
                            : "#000",
                          "&:hover": {
                            backgroundColor: isSelectable
                              ? selectedRooms.includes(room.id)
                                ? "#1565c0"
                                : "#f5f5f5"
                              : room.tinhTrang === "Đang đặt"
                              ? "#e0e0e0"
                              : "#fff",
                          },
                        }}
                        onClick={() =>
                          isSelectable && handleRoomToggle(room.id)
                        }
                      >
                        <Typography variant="body2">{room.maPhong}</Typography>
                        <Typography variant="caption">
                          {room.tenPhong}
                        </Typography>
                        <Typography variant="caption">
                          {room.tinhTrang}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Hủy
        </Button>
        <Button
          onClick={handleSaveAll}
          color="primary"
          variant="contained"
          disabled={selectedRooms.length === 0}
        >
          Lưu ({selectedRooms.length} phòng)
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default XepPhong;