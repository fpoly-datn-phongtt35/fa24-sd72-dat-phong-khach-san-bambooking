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
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  getPhongKhaDung,
  setPhongDangDat,
  huyPhongDangDat,
} from "../../services/PhongService";
import { addXepPhong, updateXepPhong } from "../../services/XepPhongService";
import Swal from "sweetalert2";

function XepPhong({ show, handleClose, selectedTTDPs, xepPhong, onSuccess }) {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isEditMode = !!xepPhong; // Kiểm tra xem đang sửa phòng hay xếp mới

  const formatToLocalDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19);
  };

  const fetchAvailableRooms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const unassignedTTDPs = isEditMode
        ? selectedTTDPs.filter(
            (ttdp) => ttdp.id === xepPhong.thongTinDatPhong.id
          )
        : selectedTTDPs.filter((ttdp) => ttdp.trangThai === "Chưa xếp");

      if (unassignedTTDPs.length === 0) {
        setAvailableRooms([]);
        return;
      }

      const minDate = new Date(
        Math.min(...unassignedTTDPs.map((ttdp) => new Date(ttdp.ngayNhanPhong)))
      );
      const maxDate = new Date(
        Math.max(...unassignedTTDPs.map((ttdp) => new Date(ttdp.ngayTraPhong)))
      );

      const setTime = (date, hours, minutes) => {
        const newDate = new Date(date);
        newDate.setHours(hours, minutes, 0, 0);
        return newDate;
      };

      const ngayNhanPhong = formatToLocalDateTime(setTime(minDate, 14, 0));
      const ngayTraPhong = formatToLocalDateTime(setTime(maxDate, 12, 0));

      const roomTypeCounts = unassignedTTDPs.reduce((acc, ttdp) => {
        const roomTypeId = ttdp.loaiPhong.id;
        acc[roomTypeId] = (acc[roomTypeId] || 0) + 1;
        return acc;
      }, {});

      const roomPromises = Object.keys(roomTypeCounts).map((roomTypeId) =>
        getPhongKhaDung(roomTypeId, ngayNhanPhong, ngayTraPhong)
      );

      const responses = await Promise.all(roomPromises);
      let allRooms = responses
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

      // Thêm phòng hiện tại (nếu sửa) vào danh sách
      if (isEditMode && xepPhong?.phong) {
        const currentRoom = allRooms.find(
          (room) => room.id === xepPhong.phong.id
        );
        if (!currentRoom) {
          allRooms = [
            {
              ...xepPhong.phong,
              roomTypeId: unassignedTTDPs[0].loaiPhong.id,
            },
            ...allRooms,
          ];
        }
      }

      // Thêm các phòng đã xếp của TTDP khác (nếu có)
      const preAssignedRooms = selectedTTDPs
        .filter(
          (ttdp) =>
            ttdp.phong &&
            ttdp.trangThai !== "Chưa xếp" &&
            (!isEditMode || ttdp.id !== xepPhong?.thongTinDatPhong?.id)
        )
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
      setError("Không thể tải danh sách phòng khả dụng. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (show && selectedTTDPs.length > 0) {
      fetchAvailableRooms();
      if (isEditMode && xepPhong?.phong?.id) {
        setSelectedRooms([xepPhong.phong.id]);
      } else {
        const initialSelected = selectedTTDPs
          .filter((ttdp) => ttdp.phong && ttdp.trangThai !== "Chưa xếp")
          .map((ttdp) => ttdp.phong.id);
        setSelectedRooms(initialSelected);
      }
    }
  }, [show, selectedTTDPs, xepPhong]);

  const handleRoomToggle = async (roomId) => {
    try {
      const room = availableRooms.find((r) => r.id === roomId);
      if (!room) return;

      const unassignedTTDPs = isEditMode
        ? selectedTTDPs.filter(
            (ttdp) => ttdp.id === xepPhong.thongTinDatPhong.id
          )
        : selectedTTDPs.filter((ttdp) => ttdp.trangThai === "Chưa xếp");

      const selectedRoomTypeCounts = selectedRooms.reduce((acc, id) => {
        const selectedRoom = availableRooms.find((r) => r.id === id);
        if (selectedRoom) {
          const roomTypeId = selectedRoom.roomTypeId;
          acc[roomTypeId] = (acc[roomTypeId] || 0) + 1;
        }
        return acc;
      }, {});

      const requiredRoomTypeCounts = unassignedTTDPs.reduce((acc, ttdp) => {
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

        if (isEditMode) {
          // Khi sửa, chỉ cho phép chọn 1 phòng
          if (selectedRooms.length > 0) {
            await huyPhongDangDat(selectedRooms[0]);
          }
          await setPhongDangDat(roomId);
          setSelectedRooms([roomId]);
        } else if (
          currentCount < requiredCount &&
          selectedRooms.length < unassignedTTDPs.length
        ) {
          await setPhongDangDat(roomId);
          setSelectedRooms([...selectedRooms, roomId]);
        } else {
          await Swal.fire({
            icon: "warning",
            title: "Cảnh báo",
            text: "Không thể chọn thêm phòng này vì đã đủ số phòng cho loại phòng này!",
            confirmButtonText: "Đóng",
          });
        }
      }
    } catch (error) {
      setError("Xảy ra lỗi khi chọn phòng. Vui lòng thử lại!");
    }
  };

  const handleSaveAll = async () => {
    const unassignedTTDPs = isEditMode
      ? selectedTTDPs.filter((ttdp) => ttdp.id === xepPhong.thongTinDatPhong.id)
      : selectedTTDPs.filter((ttdp) => ttdp.trangThai === "Chưa xếp");

    if (selectedRooms.length !== unassignedTTDPs.length) {
      await Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: `Vui lòng chọn đúng ${unassignedTTDPs.length} phòng!`,
        confirmButtonText: "Đóng",
      });
      return;
    }

    const confirmSave = await Swal.fire({
      icon: "question",
      title: "Xác nhận",
      text: `Bạn có chắc chắn muốn ${isEditMode ? "sửa" : "xếp"} ${
        selectedRooms.length
      } phòng không?`,
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (!confirmSave.isConfirmed) return;

    setIsLoading(true);
    setError(null);
    try {
      const requests = unassignedTTDPs.map(async (ttdp, index) => {
        const xepPhongRequest = {
          id: isEditMode ? xepPhong.id : undefined,
          phong: { id: selectedRooms[index] },
          thongTinDatPhong: { id: ttdp.id },
          ngayNhanPhong: formatToLocalDateTime(ttdp.ngayNhanPhong),
          ngayTraPhong: formatToLocalDateTime(ttdp.ngayTraPhong),
          trangThai: isEditMode ? xepPhong.trangThai : "Đã xếp",
        };

        await huyPhongDangDat(selectedRooms[index]);
        return isEditMode
          ? updateXepPhong(xepPhongRequest)
          : addXepPhong(xepPhongRequest);
      });

      await Promise.all(requests);
      await Swal.fire({
        icon: "success",
        title: "Thành công",
        text: `${isEditMode ? "Sửa" : "Xếp"} phòng thành công cho ${
          selectedRooms.length
        } đặt phòng!`,
        confirmButtonText: "Đóng",
      });
      if (onSuccess) onSuccess();
      handleClose();
    } catch (error) {
      setError(
        `Xảy ra lỗi trong quá trình ${isEditMode ? "sửa" : "xếp"} phòng.`
      );
      await Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Đã có lỗi xảy ra!",
        confirmButtonText: "Đóng",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      const cancelRequests = selectedRooms.map((roomId) =>
        huyPhongDangDat(roomId)
      );
      await Promise.all(cancelRequests);
    } catch (error) {
      setError("Lỗi khi hủy trạng thái phòng.");
    }
    setSelectedRooms([]);
    handleClose();
  };

  const groupPhongByFloor = (phongList) => {
    const floors = {};
    phongList.forEach((phong) => {
      const floor = parseInt(phong.maPhong.charAt(1), 10);
      floors[floor] = floors[floor] || [];
      floors[floor].push(phong);
    });
    return floors;
  };

  const isRoomSelectable = (room) => {
    const unassignedTTDPs = isEditMode
      ? selectedTTDPs.filter((ttdp) => ttdp.id === xepPhong.thongTinDatPhong.id)
      : selectedTTDPs.filter((ttdp) => ttdp.trangThai === "Chưa xếp");

    const selectedRoomTypeCounts = selectedRooms.reduce((acc, id) => {
      const selectedRoom = availableRooms.find((r) => r.id === id);
      if (selectedRoom) {
        acc[selectedRoom.roomTypeId] = (acc[selectedRoom.roomTypeId] || 0) + 1;
      }
      return acc;
    }, {});

    const requiredRoomTypeCounts = unassignedTTDPs.reduce((acc, ttdp) => {
      acc[ttdp.loaiPhong.id] = (acc[ttdp.loaiPhong.id] || 0) + 1;
      return acc;
    }, {});

    const currentCount = selectedRoomTypeCounts[room.roomTypeId] || 0;
    const requiredCount = requiredRoomTypeCounts[room.roomTypeId] || 0;

    return (
      room.tinhTrang !== "Đang đặt" ||
      selectedRooms.includes(room.id) ||
      (currentCount < requiredCount &&
        selectedRooms.length < unassignedTTDPs.length)
    );
  };

  return (
    <Dialog open={show} onClose={handleCancel} fullWidth maxWidth="md">
      <DialogTitle>{isEditMode ? "Sửa phòng" : "Xếp phòng"}</DialogTitle>
      <DialogContent dividers>
        {isLoading && (
          <CircularProgress
            sx={{ position: "absolute", top: "50%", left: "50%" }}
          />
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography variant="subtitle1" gutterBottom>
          Yêu cầu:{" "}
          {Object.entries(
            (isEditMode
              ? selectedTTDPs.filter(
                  (ttdp) => ttdp.id === xepPhong.thongTinDatPhong.id
                )
              : selectedTTDPs.filter((ttdp) => ttdp.trangThai === "Chưa xếp")
            ).reduce((acc, ttdp) => {
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
                        role="button"
                        aria-label={`Phòng ${room.maPhong}, trạng thái: ${room.tinhTrang}`}
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
          disabled={
            selectedRooms.length !==
              (isEditMode
                ? selectedTTDPs.filter(
                    (ttdp) => ttdp.id === xepPhong.thongTinDatPhong.id
                  ).length
                : selectedTTDPs.filter((ttdp) => ttdp.trangThai === "Chưa xếp")
                    .length) || isLoading
          }
        >
          Lưu ({selectedRooms.length} phòng)
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default XepPhong;