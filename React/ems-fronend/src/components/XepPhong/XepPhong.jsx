import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getPhongKhaDung } from '../../services/PhongService';
import { addXepPhong } from '../../services/XepPhongService';

function XepPhong({ show, handleClose, selectedTTDPs }) {
  const [listPhong, setListPhong] = useState({});
  const [selectedPhong, setSelectedPhong] = useState({});
  const navigate = useNavigate();

  // Hàm định dạng chuỗi ngày thành LocalDateTime (ISO string)
  const formatToLocalDateTime = (dateString) => {
    const date = new Date(dateString);
    console.log(date);
    console.log(date.toISOString().slice(0, 19));
    return date.toISOString().slice(0, 19);
  };

  // Hàm lấy phòng khả dụng theo loại phòng và khoảng thời gian
  const phongKhaDung = (idLoaiPhong, ngayNhanPhong, ngayTraPhong, ttdpId) => {
    getPhongKhaDung(idLoaiPhong, ngayNhanPhong, ngayTraPhong)
      .then((response) => {
        console.log(response)
        setListPhong((prevList) => ({
          ...prevList,
          [ttdpId]: response.data,
        }));
      })
      .catch((error) => {
        console.error("Lỗi khi lấy phòng khả dụng:", error);
      });
  };

  // Khi modal được hiển thị và có danh sách đặt phòng được chọn
  useEffect(() => {
    if (show && selectedTTDPs.length > 0) {
      selectedTTDPs.forEach((ttdp) => {
        const formattedNgayNhanPhong = formatToLocalDateTime(ttdp.ngayNhanPhong);
        const formattedNgayTraPhong = formatToLocalDateTime(ttdp.ngayTraPhong);
        phongKhaDung(ttdp.loaiPhong.id, formattedNgayNhanPhong, formattedNgayTraPhong, ttdp.id);
      });
    }
  }, [show, selectedTTDPs]);

  // Xử lý thay đổi khi chọn phòng cho một đặt phòng cụ thể
  const handlePhongChange = (ttdpId, phongId) => {
    setSelectedPhong((prevSelected) => ({
      ...prevSelected,
      [ttdpId]: phongId,
    }));
  };

  // Xử lý khi nhấn nút "Save All"
  const handleSaveAll = () => {
    const requests = selectedTTDPs.map(async (ttdp) => {
      const xepPhongRequest = {
        phong: { id: selectedPhong[ttdp.id] },
        thongTinDatPhong: { id: ttdp.id },
        ngayNhanPhong: formatToLocalDateTime(ttdp.ngayNhanPhong),
        ngayTraPhong: formatToLocalDateTime(ttdp.ngayTraPhong),
        trangThai: true,
      };
      try {
        const ttt = await addXepPhong(xepPhongRequest);
        console.log(ttt);
      } catch (error) {
        console.error(`Lỗi khi xếp phòng cho ${ttdp.maTTDP}:`, error);
      }
    });
  
    Promise.all(requests)
      .then(() => {
        // Sau khi tất cả các request xếp phòng hoàn thành, load lại dữ liệu.
        // Nếu bạn có hàm reloadData được truyền vào component, gọi nó tại đây:
        if (typeof reloadData === "function") {
          reloadData();
        } else {
          // Nếu không có hàm reloadData, bạn có thể reload toàn bộ trang (cách này không tối ưu)
          window.location.reload();
        }
        alert('Xếp phòng thành công cho tất cả các đặt phòng đã chọn!');
        navigate('/quan-ly-dat-phong');
        handleClose();
      })
      .catch(() => {
        alert('Xảy ra lỗi trong quá trình xếp phòng.');
      });
  };
  

  return (
    <Dialog open={show} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Xếp phòng</DialogTitle>
      <DialogContent dividers>
        {selectedTTDPs.map((ttdp) => (
          <Box key={ttdp.id} mb={2}>
            <Typography variant="h6" gutterBottom>
              Đặt phòng: {ttdp.maThongTinDatPhong}
            </Typography>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id={`select-label-${ttdp.id}`}>Chọn phòng khả dụng</InputLabel>
              <Select
                labelId={`select-label-${ttdp.id}`}
                id={`phongSelect-${ttdp.id}`}
                value={selectedPhong[ttdp.id] || ''}
                onChange={(e) => handlePhongChange(ttdp.id, e.target.value)}
                label="Chọn phòng khả dụng"
              >
                <MenuItem value="">
                  <em>Chọn phòng</em>
                </MenuItem>
                {(listPhong[ttdp.id] || []).map((phong) => (
                  <MenuItem key={phong.id} value={phong.id}>
                    {phong.maPhong} - {phong.tenPhong}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
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