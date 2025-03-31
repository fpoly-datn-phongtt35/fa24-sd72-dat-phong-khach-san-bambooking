import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  getPhongKhaDung,
  setPhongDangDat,
  huyPhongDangDat,
} from "../../services/PhongService"; // Thêm API huyPhongDangDat
import { addXepPhong } from "../../services/XepPhongService";

function XepPhong({ show, handleClose, selectedTTDPs }) {
  const [listPhong, setListPhong] = useState({});
  const [selectedPhong, setSelectedPhong] = useState({});
  const navigate = useNavigate();

  const formatToLocalDateTime = (dateString) => {
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
      const formattedNgayNhanPhong = formatToLocalDateTime(ttdp.ngayNhanPhong);
      const formattedNgayTraPhong = formatToLocalDateTime(ttdp.ngayTraPhong);
      phongKhaDung(
        ttdp.loaiPhong.id,
        formattedNgayNhanPhong,
        formattedNgayTraPhong,
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

    // Cập nhật phòng đã chọn trước
    setSelectedPhong((prevSelected) => ({
      ...prevSelected,
      [ttdpId]: phongId,
    }));

    try {
      // Nếu đã chọn phòng trước đó, hủy trạng thái "đang đặt" của phòng cũ
      if (previousPhongId) {
        await huyPhongDangDat(previousPhongId);
      }
      // Đánh dấu phòng mới được chọn
      await setPhongDangDat(phongId);
      reloadPhongKhaDung();
    } catch (error) {
      console.error("Lỗi khi thay đổi phòng:", error);
      // Khôi phục trạng thái trước đó nếu lỗi
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
        ngayNhanPhong: formatToLocalDateTime(ttdp.ngayNhanPhong),
        ngayTraPhong: formatToLocalDateTime(ttdp.ngayTraPhong),
        trangThai: "Đã xếp",
      };

      await huyPhongDangDat(selectedPhong[ttdp.id]);
      return addXepPhong(xepPhongRequest);
    });

    try {
      const responses = await Promise.all(requests);
      console.log("Kết quả xếp phòng:", responses);
      alert("Xếp phòng thành công cho tất cả các đặt phòng đã chọn!");
      handleClose();
    } catch (error) {
      console.error("Lỗi khi xếp phòng:", error);
      alert("Xảy ra lỗi trong quá trình xếp phòng.");
    }
  };

  // Xử lý khi đóng dialog mà không save
  const handleCancel = async () => {
    try {
      // Hủy trạng thái "đang đặt" cho tất cả các phòng đã chọn
      const cancelRequests = Object.values(selectedPhong).map((phongId) =>
        huyPhongDangDat(phongId)
      );
      await Promise.all(cancelRequests);
    } catch (error) {
      console.error("Lỗi khi hủy trạng thái phòng:", error);
    }
    setSelectedPhong({}); // Reset lựa chọn phòng
    handleClose();
  };

  return (
    <Dialog open={show} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>Xếp phòng</DialogTitle>
      <DialogContent dividers>
        {selectedTTDPs.map((ttdp) => (
          <Box key={ttdp.id} mb={2}>
            <Typography variant="h6" gutterBottom>
              Đặt phòng: {ttdp.maThongTinDatPhong}
            </Typography>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id={`select-label-${ttdp.id}`}>
                Chọn phòng khả dụng
              </InputLabel>
              <Select
                labelId={`select-label-${ttdp.id}`}
                id={`phongSelect-${ttdp.id}`}
                value={selectedPhong[ttdp.id] || ""}
                onChange={(e) => handlePhongChange(ttdp.id, e.target.value)}
                label="Chọn phòng khả dụng"
              >
                <MenuItem value="">
                  <em>Chọn phòng</em>
                </MenuItem>
                {(listPhong[ttdp.id] || []).map((phong) => (
                  <MenuItem key={phong.id} value={phong.id}>
                    {phong.maPhong} - {phong.tenPhong} - {phong.tinhTrang}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSaveAll}
          color="primary"
          variant="contained"
          disabled={selectedTTDPs.some((ttdp) => !selectedPhong[ttdp.id])}
        >
          Save All
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default XepPhong;
