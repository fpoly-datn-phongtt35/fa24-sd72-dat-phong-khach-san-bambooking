import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Divider,
  TextField,
  Chip,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { getTTDPByMaTTDP, updateThongTinDatPhong } from "../../services/TTDP";
import {
  phongDaXep,
  checkIn,
  updateXepPhong,
} from "../../services/XepPhongService";
import { hienThi, sua, xoa } from "../../services/KhachHangCheckin";
import XepPhong from "../xepphong/XepPhong";
import ModalKhachHangCheckin from "./ModalKhachHangCheckin";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import HotelIcon from "@mui/icons-material/Hotel";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { updateKhachHang } from "../../services/KhachHangService";
import {
  ThemPhuThu,
  CapNhatPhuThu,
  CheckPhuThuExists,
  XoaPhuThu,
} from "../../services/PhuThuService";
import { getLoaiPhongById } from "../../services/LoaiPhongService";
import { getXepPhongByThongTinDatPhongId } from "../../services/XepPhongService.js";
import { getKhachHangCheckinByThongTinId } from "../../services/KhachHangCheckin.js";
import Swal from "sweetalert2";

const ChiTietTTDP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { maThongTinDatPhong } = location.state || {};
  const [thongTinDatPhong, setThongTinDatPhong] = useState(null);
  const [xepPhong, setXepPhong] = useState(null);
  const [khachHangCheckin, setKhachHangCheckin] = useState([]);
  const [showXepPhongModal, setShowXepPhongModal] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTTDPs, setSelectedTTDPs] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch dữ liệu
  const getDetailTTDP = (maThongTinDatPhong) => {
    getTTDPByMaTTDP(maThongTinDatPhong)
      .then((response) => setThongTinDatPhong(response.data))
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin đặt phòng:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: `Không thể lấy thông tin đặt phòng: ${error.message}`,
          confirmButtonText: "Đóng",
        });
      });
  };

  const fetchKhachHangCheckin = (maThongTinDatPhong) => {
    hienThi(maThongTinDatPhong)
      .then((response) => {
        console.log("Khách hàng check-in:", response.data);
        setKhachHangCheckin(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin khách hàng:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: `Không thể lấy thông tin khách hàng: ${error.message}`,
          confirmButtonText: "Đóng",
        });
      });
  };

  const fetchPhongDaXep = (maThongTinDatPhong) => {
    phongDaXep(maThongTinDatPhong)
      .then((response) => {
        setXepPhong(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin phòng đã xếp:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: `Không thể lấy thông tin phòng đã xếp: ${error.message}`,
          confirmButtonText: "Đóng",
        });
      });
  };

  const capNhatTTDP = async () => {
    const confirmUpdate = await Swal.fire({
      icon: "question",
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn cập nhật thông tin đặt phòng này không?",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (!confirmUpdate.isConfirmed) return;

    const TTDPRequest = {
      id: thongTinDatPhong.id,
      datPhong: thongTinDatPhong.datPhong,
      idLoaiPhong: thongTinDatPhong.loaiPhong.id,
      maThongTinDatPhong: thongTinDatPhong.maThongTinDatPhong,
      ngayNhanPhong: thongTinDatPhong.ngayNhanPhong,
      ngayTraPhong: thongTinDatPhong.ngayTraPhong,
      soNguoi: thongTinDatPhong.soNguoi,
      giaDat: thongTinDatPhong.giaDat,
      ghiChu: thongTinDatPhong.ghiChu,
      trangThai: thongTinDatPhong.trangThai,
    };
    updateThongTinDatPhong(TTDPRequest)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Cập nhật thông tin đặt phòng thành công",
          confirmButtonText: "Đóng",
        });
        navigate("/chi-tiet-ttdp", { state: { maThongTinDatPhong } });
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật thông tin đặt phòng:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: `Không thể cập nhật thông tin đặt phòng: ${error.message}`,
          confirmButtonText: "Đóng",
        });
      });
  };

  // Hàm xử lý check-in
  const handleCheckin = async () => {
    const confirmCheckin = await Swal.fire({
      icon: "question",
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn check-in không?",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (!confirmCheckin.isConfirmed) return;

    try {
      // Kiểm tra xem phòng đã được xếp chưa
      const xepPhongResponse = await phongDaXep(maThongTinDatPhong);
      const xepPhongData = xepPhongResponse.data;

      if (!xepPhongData) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không tìm thấy phòng đã xếp.",
          confirmButtonText: "Đóng",
        });
        return;
      }

      // Kiểm tra trạng thái xepPhong
      if (xepPhongData.trangThai === "Đang ở") {
        Swal.fire({
          icon: "warning",
          title: "Cảnh báo",
          text: "Phòng đã ở trạng thái Đang ở.",
          confirmButtonText: "Đóng",
        });
        return;
      }

      // Chuẩn bị thời gian check-in và check-out
      const checkInTime = new Date(thongTinDatPhong.ngayNhanPhong);
      checkInTime.setHours(14, 0, 0, 0);
      const checkOutTime = new Date(thongTinDatPhong.ngayTraPhong);
      checkOutTime.setHours(12, 0, 0, 0);

      // Chuẩn bị yêu cầu check-in
      const xepPhongRequest = {
        id: xepPhongData.id,
        phong: xepPhongData.phong,
        thongTinDatPhong: xepPhongData.thongTinDatPhong,
        ngayNhanPhong: checkInTime,
        ngayTraPhong: checkOutTime,
        trangThai: "Đang ở",
      };

      // Gọi API checkIn để cập nhật trạng thái xếp phòng
      await checkIn(xepPhongRequest);

      // Cập nhật giao diện
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Check-in thành công",
        confirmButtonText: "Đóng",
      });
      getDetailTTDP(maThongTinDatPhong);
      fetchPhongDaXep(maThongTinDatPhong);
      fetchKhachHangCheckin(maThongTinDatPhong);
    } catch (error) {
      console.error("Lỗi khi check-in:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Không thể check-in: ${error.response?.data?.message || error.message
          }`,
        confirmButtonText: "Đóng",
      });
    }
  };

  // Hàm xóa khách hàng check-in
  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      icon: "question",
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn xóa khách hàng check-in này không?",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      // Xóa khách hàng
      await xoa(id);
      console.log("Xóa khách hàng check-in thành công");

      // Gọi lại danh sách khách đã check-in
      const resDaCheckin = await getKhachHangCheckinByThongTinId(
        thongTinDatPhong.id
      );
      const daCheckinList = resDaCheckin.data || [];

      const tongSoKhach = daCheckinList.length;

      // Lấy id xếp phòng
      let idXepPhong = null;
      try {
        const resXepPhong = await getXepPhongByThongTinDatPhongId(
          thongTinDatPhong.id
        );
        idXepPhong = resXepPhong?.data?.id || null;
        console.log("Lấy được idXepPhong:", idXepPhong);
      } catch (err) {
        console.error("Lỗi khi lấy idXepPhong từ API:", err);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: `Không thể lấy thông tin xếp phòng: ${err.message}`,
          confirmButtonText: "Đóng",
        });
        return;
      }

      // Lấy loại phòng để biết giới hạn khách
      const resLoaiPhong = await getLoaiPhongById(thongTinDatPhong.loaiPhong.id);
      const loaiPhong = resLoaiPhong.data;
      const soKhachToiDa = Number(loaiPhong.soKhachToiDa) || 0;
      const donGiaPhuThu = Number(loaiPhong.phuThuNguoiLon) || 0;

      // Tính số khách vượt quá số tiêu chuẩn
      const soKhachVuot = Math.max(0, tongSoKhach - soKhachToiDa);
      const tenPhuThu = `Phụ thu do vượt quá số khách người lớn`;

      try {
        // Kiểm tra phụ thu hiện tại theo id xếp phòng và tên phụ thu
        let existingPhuThu = null;
        try {
          const response = await CheckPhuThuExists(idXepPhong, tenPhuThu);
          existingPhuThu = response?.data;
        } catch (err) {
          if (err.response?.status !== 404) throw err;
        }

        if (soKhachVuot > 0) {
          // Nếu vượt số khách
          const tienPhuThu = soKhachVuot * donGiaPhuThu;
          const phuThuRequest = {
            xepPhong: { id: idXepPhong },
            tenPhuThu,
            tienPhuThu,
            soLuong: soKhachVuot,
            trangThai: false,
          };

          if (existingPhuThu) {
            // Cập nhật phụ thu nếu thông tin thay đổi
            if (
              existingPhuThu.soLuong !== soKhachVuot ||
              existingPhuThu.tienPhuThu !== tienPhuThu
            ) {
              const updatedPhuThu = { ...existingPhuThu, ...phuThuRequest };
              const updatedResponse = await CapNhatPhuThu(updatedPhuThu);
              console.log("Cập nhật phụ thu thành công", updatedResponse.data);
            } else {
              console.log("Phụ thu hiện tại không thay đổi, không cần cập nhật.");
            }
          } else {
            // Tạo mới phụ thu
            await ThemPhuThu(phuThuRequest);
            console.log("Tạo mới phụ thu thành công");
          }
        } else {
          // Không vượt số khách: nếu có phụ thu thì xóa
          if (existingPhuThu) {
            await XoaPhuThu(existingPhuThu.id);
            console.log("Đã xóa phụ thu do không còn vượt quá số khách");
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Đã xóa phụ thu vì không còn vượt quá số khách",
              confirmButtonText: "Đóng",
            });
          } else {
            console.log("Không có phụ thu nào để xóa.");
          }
        }
      } catch (err) {
        console.error("Lỗi khi xử lý phụ thu:", err);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: `Không thể xử lý phụ thu: ${err.message}`,
          confirmButtonText: "Đóng",
        });
      }

      // Cuối cùng: cập nhật danh sách hiển thị
      fetchKhachHangCheckin(maThongTinDatPhong);
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Xóa khách hàng check-in thành công",
        confirmButtonText: "Đóng",
      });
    } catch (error) {
      console.error("Lỗi khi xóa khách hàng check-in:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Không thể xóa khách hàng check-in: ${error.message}`,
        confirmButtonText: "Đóng",
      });
    }
  };

  // Hàm xác nhận khách hàng check-in
  const handleXacNhan = async (khc) => {
    const confirmAction = await Swal.fire({
      icon: "question",
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn xác nhận khách hàng này không?",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (!confirmAction.isConfirmed) return;

    try {
      const khachHangRequest = {
        ...khc,
        trangThai: true,
      };
      const response = await sua(khachHangRequest);
      console.log("Xác nhận khách hàng thành công:", response);
      fetchKhachHangCheckin(maThongTinDatPhong);
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Xác nhận khách hàng thành công",
        confirmButtonText: "Đóng",
      });
    } catch (error) {
      console.error("Lỗi khi xác nhận khách hàng check-in:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Không thể xác nhận khách hàng: ${error.message}`,
        confirmButtonText: "Đóng",
      });
    }
  };

  // Hàm sửa trạng thái khách hàng check-in
  const handleUpdate = async (khc) => {
    const confirmAction = await Swal.fire({
      icon: "question",
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn hủy xác nhận khách hàng này không?",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (!confirmAction.isConfirmed) return;

    try {
      const khachHangRequest = {
        ...khc,
        trangThai: false,
      };
      const response = await sua(khachHangRequest);
      console.log("Hủy xác nhận khách hàng thành công:", response);
      fetchKhachHangCheckin(maThongTinDatPhong);
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Hủy xác nhận khách hàng thành công",
        confirmButtonText: "Đóng",
      });
    } catch (error) {
      console.error("Lỗi khi hủy xác nhận khách hàng check-in:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Không thể hủy xác nhận khách hàng: ${error.message}`,
        confirmButtonText: "Đóng",
      });
    }
  };

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  const calculateTotalPrice = (donGia, start, end) => {
    const days = calculateDays(start, end);
    return donGia * days;
  };

  useEffect(() => {
    if (maThongTinDatPhong) {
      getDetailTTDP(maThongTinDatPhong);
      fetchPhongDaXep(maThongTinDatPhong);
      fetchKhachHangCheckin(maThongTinDatPhong);
    }
  }, [maThongTinDatPhong]);

  const handleModalKHC = () => setModalOpen(true);
  const handleClose = () => {
    setModalOpen(false);
    fetchKhachHangCheckin(maThongTinDatPhong);
  };

  const openXepPhongModal = (thongTinDatPhong, editMode = false) => {
    setSelectedTTDPs([thongTinDatPhong]);
    setIsEditMode(editMode);
    setShowXepPhongModal(true);
  };

  const closeXepPhongModal = () => {
    setShowXepPhongModal(false);
    setIsEditMode(false);
    fetchPhongDaXep(maThongTinDatPhong);
  };

  const handleCheckinSuccess = () => {
    fetchKhachHangCheckin(maThongTinDatPhong);
    handleClose();
  };

  return (
    <Box sx={{ p: 4, maxWidth: "1400px", margin: "0 auto" }}>
      {/* Tiêu đề */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          color="primary"
        >
          Quay lại
        </Button>
        <Typography
          variant="h4"
          color="primary.main"
          sx={{ fontWeight: "bold" }}
        >
          Chi Tiết Thông Tin Đặt Phòng
        </Typography>
      </Box>

      {/* Grid thông tin */}
      <Grid container spacing={3}>
        {/* Thông tin đặt phòng */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <HotelIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary.main">
                  Thông Tin Đặt Phòng
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Mã TTDP:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                    {thongTinDatPhong?.maThongTinDatPhong || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Số người:
                  </Typography>
                  <Chip
                    label={khachHangCheckin.length}
                    color="primary"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Giá đặt:
                  </Typography>
                  <Typography variant="body1">
                    {thongTinDatPhong?.giaDat?.toLocaleString("vi-VN") || "0"}{" "}
                    VND
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Tổng tiền:
                  </Typography>
                  <Typography
                    variant="body1"
                    color="success.main"
                    sx={{ fontWeight: "bold" }}
                  >
                    {calculateTotalPrice(
                      thongTinDatPhong?.giaDat || 0,
                      thongTinDatPhong?.ngayNhanPhong,
                      thongTinDatPhong?.ngayTraPhong
                    ).toLocaleString("vi-VN")}{" "}
                    VND
                  </Typography>
                </Grid>
              </Grid>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Ghi chú:
                </Typography>
                <TextField
                  multiline
                  fullWidth
                  rows={3}
                  placeholder="Nhập ghi chú ở đây..."
                  value={thongTinDatPhong?.ghiChu || ""}
                  onChange={(e) =>
                    setThongTinDatPhong({
                      ...thongTinDatPhong,
                      ghiChu: e.target.value,
                    })
                  }
                  variant="outlined"
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Ngày và phòng */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary.main">
                  Ngày & Phòng
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Nhận phòng
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                    {xepPhong?.ngayNhanPhong
                      ? new Date(xepPhong.ngayNhanPhong).toLocaleDateString(
                        "vi-VN"
                      )
                      : new Date(
                        thongTinDatPhong?.ngayNhanPhong
                      ).toLocaleDateString("vi-VN") || "N/A"}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h5" color="primary.main">
                    🌙{" "}
                    {calculateDays(
                      thongTinDatPhong?.ngayNhanPhong,
                      thongTinDatPhong?.ngayTraPhong
                    )}
                  </Typography>
                  <Typography variant="caption">Đêm</Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Trả phòng
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                    {xepPhong?.ngayTraPhong
                      ? new Date(xepPhong.ngayTraPhong).toLocaleDateString(
                        "vi-VN"
                      )
                      : new Date(
                        thongTinDatPhong?.ngayTraPhong
                      ).toLocaleDateString("vi-VN") || "N/A"}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Phòng:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {xepPhong?.phong?.tenPhong || (
                    <Chip label="Chưa xếp phòng" color="warning" size="small" />
                  )}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<HotelIcon />}
                  onClick={() => openXepPhongModal(thongTinDatPhong, false)}
                  disabled={
                    !!xepPhong?.phong ||
                    thongTinDatPhong?.trangThai === "Đang ở"
                  }
                  sx={{ mb: 2 }}
                >
                  {xepPhong?.phong ? "Đã xếp phòng" : "Xếp phòng"}
                </Button>
                {xepPhong?.phong && thongTinDatPhong.trangThai ==="Đã xếp" &&(
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => openXepPhongModal(thongTinDatPhong, true)}
                    sx={{ mb: 2 }}
                  >
                    Sửa phòng
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Thông tin khách hàng */}
        <Grid item xs={12}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary.main">
                  Thông Tin Khách Hàng
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                {khachHangCheckin.length > 0 ? (
                  khachHangCheckin.map((khc, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card
                        elevation={1}
                        sx={{ height: "100%", borderRadius: 2 }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 2,
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: "medium" }}
                            >
                              {khc?.khachHang?.ho + " " + khc?.khachHang?.ten ||
                                "Khách chưa xác định"}
                            </Typography>
                            <Chip
                              label={
                                khc?.khachHang.trangThai === true
                                  ? "Active"
                                  : "Inactive"
                              }
                              color={
                                khc?.khachHang.trangThai === true
                                  ? "success"
                                  : "error"
                              }
                              size="small"
                            />
                          </Box>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="body2">
                            <strong>Số CCCD/CMND:</strong>{" "}
                            {khc.khachHang.cmnd || "N/A"}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Giới tính:</strong>{" "}
                            {khc.khachHang.gioiTinh || "N/A"}
                          </Typography>
                          <Typography variant="body2">
                            <strong>SĐT:</strong> {khc.khachHang.sdt || "N/A"}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Địa chỉ:</strong>{" "}
                            {khc.khachHang.diaChi || "N/A"}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Email:</strong>{" "}
                            {khc.khachHang.email || "N/A"}
                          </Typography>
                        </CardContent>
                        <CardActions
                          sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
                        >
                          {(xepPhong?.trangThai === "Đang ở" ||
                            xepPhong?.trangThai === "Đã xếp") && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleDelete(khc.id)}
                            >
                              Xóa
                            </Button>
                          )}
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ textAlign: "center", py: 4 }}
                    >
                      Không có dữ liệu khách hàng
                    </Typography>
                  </Grid>
                )}
              </Grid>
              {xepPhong?.trangThai === "Đang ở" && (
                <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleModalKHC}
                  >
                    + Thêm khách
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Nút hành động */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={capNhatTTDP}
        >
          Cập nhật
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<CheckCircleIcon />}
          onClick={handleCheckin}
          disabled={thongTinDatPhong?.trangThai !== "Đã xếp"}
        >
          Check-in
        </Button>
      </Box>

      {/* Modal */}
      <ModalKhachHangCheckin
        isOpen={isModalOpen}
        onClose={handleClose}
        thongTinDatPhong={thongTinDatPhong}
        onCheckinSuccess={handleCheckinSuccess}
      />
      <XepPhong
        show={showXepPhongModal}
        handleClose={closeXepPhongModal}
        selectedTTDPs={selectedTTDPs}
        isEditMode={isEditMode}
        xepPhong={isEditMode ? xepPhong : null}
      />
    </Box>
  );
};

export default ChiTietTTDP;