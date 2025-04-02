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
  import { phongDaXep } from "../../services/XepPhongService";
  import { hienThi } from "../../services/KhachHangCheckin";
  import XepPhong from "../xepphong/XepPhong";
  import ModalKhachHangCheckin from "../../components/DatPhong/ModalKhachHangCheckin";
  import ArrowBackIcon from "@mui/icons-material/ArrowBack";
  import EditIcon from "@mui/icons-material/Edit";
  import HotelIcon from "@mui/icons-material/Hotel";
  import PersonIcon from "@mui/icons-material/Person";
  import CheckCircleIcon from "@mui/icons-material/CheckCircle";
  import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

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

    // Fetch dữ liệu
    const getDetailTTDP = (maThongTinDatPhong) => {
      getTTDPByMaTTDP(maThongTinDatPhong)
        .then((response) => setThongTinDatPhong(response.data))
        .catch((error) =>
          console.error("Lỗi khi lấy thông tin đặt phòng:", error)
        );
    };

    const fetchKhachHangCheckin = (maThongTinDatPhong) => {
      hienThi(maThongTinDatPhong)
        .then((response) => {
          console.log("Khách hàng check-in:", response.data);
          setKhachHangCheckin(response.data);
        })
        .catch((error) =>
          console.error("Lỗi khi lấy thông tin khách hàng:", error)
        );
    };

    const fetchPhongDaXep = (maThongTinDatPhong) => {
      phongDaXep(maThongTinDatPhong)
        .then((response) => setXepPhong(response.data))
        .catch((error) =>
          console.error("Lỗi khi lấy thông tin phòng đã xếp:", error)
        );
    };

    const capNhatTTDP = () => {
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
        .then(() => navigate("/chi-tiet-ttdp", { state: { maThongTinDatPhong } }))
        .catch((error) =>
          console.error("Lỗi khi cập nhật thông tin đặt phòng:", error)
        );
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
    const handleClose = () => setModalOpen(false);

    const openXepPhongModal = (thongTinDatPhong) => {
      setSelectedTTDPs([thongTinDatPhong]);
      setShowXepPhongModal(true);
    };

    const closeXepPhongModal = () => {
      setShowXepPhongModal(false);
      fetchPhongDaXep(maThongTinDatPhong); // Cập nhật lại sau khi xếp phòng
    };

    const getStatusColor = (status) => {
      switch (status) {
        case "Đang ở":
          return "success";
        case "Đã xếp":
          return "info";
        case "Đã hủy":
          return "error";
        case "Chưa xếp":
          return "warning";
        case "Đang đặt phòng":
          return "info";
        default:
          return "default";
      }
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
                      label={thongTinDatPhong?.soNguoi || "N/A"}
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
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<HotelIcon />}
                  onClick={() => openXepPhongModal(thongTinDatPhong)}
                  disabled={
                    !!xepPhong?.phong || thongTinDatPhong?.trangThai === "Đang ở"
                  }
                  sx={{ mb: 2 }}
                >
                  {xepPhong?.phong ? "Đã xếp phòng" : "Xếp phòng"}
                </Button>
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
                                  khc?.khachHang?.trangThai === true
                                    ? "Verified"
                                    : "Unverified"
                                }
                                color={
                                  khc?.khachHang?.trangThai === true
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
                              <Typography variant="body2">
                                <strong>Email:</strong>{" "}
                                {khc.khachHang.email || "N/A"}
                              </Typography>
                            </Typography>
                          </CardContent>
                          <CardActions
                            sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
                          >
                            <Button size="small" variant="outlined">
                              Chỉnh sửa
                            </Button>
                            <Button size="small" variant="outlined" color="error">
                              Xóa
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                            >
                              Xác nhận
                            </Button>
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
                <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleModalKHC}
                  >
                    + Thêm khách Verified
                  </Button>
                  <Button variant="contained" color="secondary">
                    + Thêm khách Unverified
                  </Button>
                </Box>
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
          >
            Check-in
          </Button>
        </Box>

        {/* Modal */}
        <ModalKhachHangCheckin
          isOpen={isModalOpen}
          onClose={handleClose}
          thongTinDatPhong={thongTinDatPhong}
        />
        <XepPhong
          show={showXepPhongModal}
          handleClose={closeXepPhongModal}
          selectedTTDPs={selectedTTDPs}
        />
      </Box>
    );
  };

  export default ChiTietTTDP;
