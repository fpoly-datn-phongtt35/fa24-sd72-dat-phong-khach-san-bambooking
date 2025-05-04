import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTTDPbyidDPandidLP, getXPbymaTTDP, GuiEmailXacNhanHuyTTDP } from "../services/TTDP.js";
import {
  getDichVuSuDung,
  getHoaDonById,
  getThongTinHoaDonByHoaDonId,
  getPhuThuByHoaDonId,
  getHDByidDatPhong,
  getListVatTuHongThieu,
} from "../services/InfoHoaDon";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Collapse,
  IconButton,
  Container,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

export default function DetailTTDP() {
  const [bookings, setBookings] = useState([]);
  const [hoaDons, setHoaDons] = useState([]);
  const [thongTinHoaDon, setThongTinHoaDon] = useState([]);
  const [dichVuSuDung, setDichVuSuDung] = useState([]);
  const [phuThu, setPhuThu] = useState([]);
  const [danhSachVatTu, setDanhSachVatTu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const { idDatPhong, idLoaiPhong } = useParams();
  const navigate = useNavigate();

  const statusChipProps = {
    "Chờ xác nhận": { bgcolor: "warning.main", color: "white", label: "Chờ xác nhận" },
    "Chưa thanh toán": { bgcolor: "error.main", color: "white", label: "Chưa thanh toán" },
    "Đã thanh toán": { bgcolor: "success.main", color: "white", label: "Đã thanh toán" },
  };

  const hoaDonStatusChipProps = {
    "Chưa thanh toán": { bgcolor: "error.main", color: "white", label: "Chưa thanh toán" },
    "Đã thanh toán": { bgcolor: "success.main", color: "white", label: "Đã thanh toán" },
    "Chờ xác nhận": { bgcolor: "warning.main", color: "white", label: "Chờ xác nhận" },
  };

  useEffect(() => {
    fetchData();
  }, [idDatPhong, idLoaiPhong]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Lấy dữ liệu booking
      const bookingResponse = await getTTDPbyidDPandidLP(idDatPhong, idLoaiPhong);
      const bookingData = Array.isArray(bookingResponse.data)
        ? bookingResponse.data
        : [bookingResponse.data];

      const bookingsWithMaPhong = await Promise.all(
        bookingData.map(async (booking) => {
          try {
            const xepPhongResponse = await getXPbymaTTDP(booking.maThongTinDatPhong);
            const maPhong = xepPhongResponse?.data?.phong?.maPhong || booking.loaiPhong.tenLoaiPhong;
            const tenPhong = xepPhongResponse?.data?.phong?.tenPhong || "N/A";
            return { ...booking, maPhong, tenPhong };
          } catch (error) {
            console.error(`Error fetching maPhong for maThongTinDatPhong ${booking.maThongTinDatPhong}:`, error);
            return { ...booking, maPhong: "N/A", tenPhong: "N/A" };
          }
        })
      );
      setBookings(bookingsWithMaPhong);

      // Lấy dữ liệu hóa đơn
      const hoaDonResponse = await getHDByidDatPhong(idDatPhong);
      let hoaDonList = Array.isArray(hoaDonResponse.data) ? hoaDonResponse.data : [hoaDonResponse.data].filter(Boolean);
      setHoaDons(hoaDonList);

      // Lấy dữ liệu liên quan cho từng hóa đơn
      const allThongTinHoaDon = [];
      const allDichVuSuDung = [];
      const allPhuThu = [];
      const allDanhSachVatTu = [];
      const updatedHoaDons = [];

      for (const hoaDonData of hoaDonList) {
        if (hoaDonData && hoaDonData.id) {
          const [
            thongTinHoaDonResponse,
            dichVuSuDungResponse,
            phuThuResponse,
            hoaDonByIdResponse,
            vatTuResponse,
          ] = await Promise.all([
            getThongTinHoaDonByHoaDonId(hoaDonData.id),
            getDichVuSuDung(hoaDonData.id),
            getPhuThuByHoaDonId(hoaDonData.id),
            getHoaDonById(hoaDonData.id),
            getListVatTuHongThieu(hoaDonData.id),
          ]);

          allThongTinHoaDon.push(...(thongTinHoaDonResponse?.data || []));
          allDichVuSuDung.push(...(dichVuSuDungResponse?.data || []));
          allPhuThu.push(...(phuThuResponse?.data || []));
          allDanhSachVatTu.push(...(vatTuResponse?.data || []));
          updatedHoaDons.push(hoaDonByIdResponse?.data || hoaDonData);
        }
      }

      setThongTinHoaDon(allThongTinHoaDon);
      setDichVuSuDung(allDichVuSuDung);
      setPhuThu(allPhuThu);
      setDanhSachVatTu(allDanhSachVatTu);
      setHoaDons(updatedHoaDons);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const handleRowClick = (tenPhong) => {
    const newExpandedRow = expandedRow === tenPhong ? null : tenPhong;
    setExpandedRow(newExpandedRow);
  };

  const calculateDays = (ngayNhanPhong, ngayTraPhong) => {
    const [day, month, year, time] = ngayNhanPhong.split(/\/| /);
    const start = new Date(`${year}-${month}-${day}`);

    const [dayEnd, monthEnd, yearEnd, timeEnd] = ngayTraPhong.split(/\/| /);
    const end = new Date(`${yearEnd}-${monthEnd}-${dayEnd}`);

    const diffTime = end - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays, 1);
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      alert("Email xác nhận hủy đặt phòng đã được gửi đến email của bạn")
      await GuiEmailXacNhanHuyTTDP(bookingId);
      fetchData(); // Tải lại dữ liệu để cập nhật trạng thái
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Có lỗi xảy ra khi hủy đặt phòng.");
    }
  };

  // Kiểm tra xem có booking nào không thuộc trạng thái "Đã hủy", "Đang ở", "Đã trả phòng"
  const showActionColumn = bookings.some(
    (booking) => !["Đã hủy", "Đang ở", "Đã trả phòng"].includes(booking.trangThai)
  );

  return (
    <Container
      sx={{
        minHeight: "66vh", 
      }}
    >
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Chi Tiết Đặt Phòng
        </Typography>
        <Button
          variant="contained"
          sx={{ bgcolor: "#1976d2", "&:hover": { bgcolor: "#1565c0" } }}
          onClick={() => navigate(-1)}
        >
          ← Quay Lại
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <Typography>Đang tải dữ liệu...</Typography>
        </Box>
      ) : (
        <Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Phòng</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Diện tích</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Số khách tối đa</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Đơn giá</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Ngày Nhận</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Ngày Trả</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Mô tả</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>Trạng Thái</TableCell>
                  {showActionColumn && (
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>Hành động</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <React.Fragment key={booking.maThongTinDatPhong}>
                    <TableRow
                      onClick={() => handleRowClick(booking.tenPhong)}
                      sx={{ cursor: "pointer", "&:hover": { bgcolor: "grey.100" } }}
                    >
                      <TableCell align="center">{booking.maPhong}</TableCell>
                      <TableCell align="center">{booking.loaiPhong.dienTich}</TableCell>
                      <TableCell align="center">{booking.loaiPhong.soKhachToiDa}</TableCell>
                      <TableCell align="center">{formatCurrency(booking.loaiPhong.donGia)}</TableCell>
                      <TableCell align="center">{new Date(booking.ngayNhanPhong).toLocaleDateString()}</TableCell>
                      <TableCell align="center">{new Date(booking.ngayTraPhong).toLocaleDateString()}</TableCell>
                      <TableCell align="center">{booking.loaiPhong.moTa}</TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            ...statusChipProps[booking.trangThai],
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            display: "inline-block",
                          }}
                        >
                          {booking.trangThai}
                        </Box>
                      </TableCell>
                      {showActionColumn && (
                        <TableCell align="center">
                          {["Đã hủy", "Đang ở", "Đã trả phòng"].includes(booking.trangThai) ? (
                            <Typography>-</Typography>
                          ) : (
                            <IconButton
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation(); // Ngăn sự kiện click lan ra hàng
                                handleCancelBooking(booking.id);
                              }}
                              title="Hủy Đặt Phòng"
                            >
                              <CancelIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={showActionColumn ? 9 : 8} sx={{ p: 0 }}>
                        <Collapse in={expandedRow === booking.tenPhong}>
                          <Box sx={{ p: 2, bgcolor: "grey.50" }}>
                            {thongTinHoaDon.some((item) => item.tenPhong === booking.tenPhong) ? (
                              <>
                                {(() => {
                                  const validIdHoaDons = thongTinHoaDon
                                    .filter((item) => item.tenPhong === booking.tenPhong)
                                    .map((item) => item.idHoaDon)
                                    .filter(Boolean);

                                  if (validIdHoaDons.length === 0) {
                                    return (
                                      <Typography>
                                        Không có thông tin hóa đơn hợp lệ cho phòng này
                                      </Typography>
                                    );
                                  }

                                  return hoaDons
                                    .filter((hoaDon) => validIdHoaDons.includes(hoaDon.id))
                                    .map((hoaDon, index) => (
                                      <Box key={index} sx={{ mb: 2 }}>
                                        <Typography variant="h6" fontWeight="bold" color="primary">
                                          Thông Tin Hóa Đơn {hoaDon.maHoaDon}
                                        </Typography>
                                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                                          <Typography>
                                            <strong>Mã Hóa Đơn:</strong> {hoaDon.maHoaDon}
                                          </Typography>
                                          <Typography>
                                            <strong>Mã Đặt Phòng:</strong> {hoaDon.maDatPhong}
                                          </Typography>
                                          <Typography>
                                            <strong>Tổng Tiền:</strong>{" "}
                                            <Typography component="span" color="primary">
                                              {formatCurrency(hoaDon.tongTien)}
                                            </Typography>
                                          </Typography>
                                          <Typography>
                                            <strong>Trạng Thái:</strong>{" "}
                                            <Box
                                              sx={{
                                                ...hoaDonStatusChipProps[hoaDon.trangThai],
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                display: "inline-block",
                                              }}
                                            >
                                              {hoaDon.trangThai}
                                            </Box>
                                          </Typography>
                                        </Box>
                                      </Box>
                                    ));
                                })()}

                                {thongTinHoaDon
                                  .filter((item) => item.tenPhong === booking.tenPhong)
                                  .map((item, index) => (
                                    <Box key={index} sx={{ mb: 2 }}>
                                      <Typography variant="h6" fontWeight="bold" color="primary">
                                        Chi Tiết Hóa Đơn - Phòng {item.tenPhong}
                                      </Typography>
                                      <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                          Tiền Phòng
                                        </Typography>
                                        <Typography>
                                          Số Ngày Ở: {calculateDays(item.ngayNhanPhong, item.ngayTraPhong)}
                                        </Typography>
                                        <Typography>Giá Phòng: {formatCurrency(item.giaPhong)}</Typography>
                                        <Typography>Tiền Phòng: {formatCurrency(item.tienPhong)}</Typography>
                                      </Box>

                                      {dichVuSuDung.some((dv) => dv.tenPhong === item.tenPhong) && (
                                        <Box sx={{ mb: 2 }}>
                                          <Typography variant="subtitle1" fontWeight="bold">
                                            Dịch Vụ Sử Dụng
                                          </Typography>
                                          {dichVuSuDung
                                            .filter((dv) => dv.tenPhong === item.tenPhong)
                                            .map((dv, i) => (
                                              <Typography key={i}>
                                                {dv.tenDichVu} - SL: {dv.soLuongSuDung} - Tổng:{" "}
                                                {formatCurrency(dv.giaDichVu * dv.soLuongSuDung)}
                                              </Typography>
                                            ))}
                                        </Box>
                                      )}

                                      {phuThu.some((pt) => pt.tenPhong === item.tenPhong) && (
                                        <Box sx={{ mb: 2 }}>
                                          <Typography variant="subtitle1" fontWeight="bold">
                                            Phụ Thu
                                          </Typography>
                                          {phuThu
                                            .filter((pt) => pt.tenPhong === item.tenPhong)
                                            .map((pt, i) => (
                                              <Typography key={i}>
                                                {pt.tenPhuThu} - SL: {pt.soLuong} - Số Tiền:{" "}
                                                {formatCurrency(pt.tienPhuThu)}
                                              </Typography>
                                            ))}
                                        </Box>
                                      )}


                                      {item.tienKhauTru > 0 && (
                                        <Typography variant="subtitle1" sx={{ mt: 2 }}>
                                          <strong>Tiền khấu trừ của phòng:</strong>{" "}
                                          {formatCurrency(item.tienKhauTru)}
                                        </Typography>
                                      )}
                                    </Box>
                                  ))}
                              </>
                            ) : (
                              <Typography>Không có thông tin hóa đơn cho phòng này</Typography>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
    </Container>
  );
}