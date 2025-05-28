import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createThanhToan,
  getHoaDonById,
} from "../../services/ThanhToanService";
import ThanhToanModal from "./ThanhToanModal";
import { Container, Box, Typography, Button, Card, Chip } from "@mui/joy";
import { IconButton } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";

const ThanhToanComponent = () => {
  const { idHoaDon } = useParams();
  const [hoaDon, setHoaDon] = useState(null);
  const [thanhToan, setThanhToan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const thanhToanRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (idHoaDon) {
      thanhToanRef.current = false;
      fetchHoaDon(idHoaDon);
    }
  }, [idHoaDon]);

  const fetchHoaDon = async (idHoaDon) => {
    try {
      const response = await getHoaDonById(idHoaDon);
      setHoaDon(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin hóa đơn:", error);
    }
  };

  const handleCreateThanhToan = async () => {
    if (!hoaDon || thanhToanRef.current) return;

    thanhToanRef.current = true;

    try {
      const thanhToanRequest = {
        idHoaDon: idHoaDon,
      };
      const response = await createThanhToan(thanhToanRequest);
      setThanhToan(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Lỗi khi tạo thanh toán mới:", error);
      alert("Có lỗi xảy ra khi tạo thanh toán!");
    } finally {
      thanhToanRef.current = false;
    }
  };

  const formatCurrency = (amount) => {
    if (amount == null) return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    thanhToanRef.current = false;
    fetchHoaDon(idHoaDon); // Cập nhật lại hóa đơn sau khi đóng modal
  };

  return (
    <Container sx={{ marginTop: 5 }}>
      {hoaDon ? (
        <Card
          variant="outlined"
          sx={{ maxWidth: 500, margin: "auto", padding: 3, boxShadow: "lg" }}
        >
          <Typography
            level="h4"
            textAlign="center"
            fontWeight="bold"
            sx={{ marginBottom: 3 }}
          >
            HÓA ĐƠN
          </Typography>

          <Box sx={{ marginBottom: 3, paddingLeft: 8 }}>
            <Typography sx={{ marginBottom: 1 }}>
              <b>Mã hóa đơn:</b> {hoaDon.maHoaDon}
            </Typography>
            <Typography sx={{ marginBottom: 1 }}>
              <b>Mã đặt phòng:</b> {hoaDon.maDatPhong}
            </Typography>
            <Typography sx={{ marginBottom: 1 }}>
              <b>Tên nhân viên:</b> {hoaDon.tenNhanVien}
            </Typography>
            <Typography sx={{ marginBottom: 1 }}>
              <b>Tên khách hàng:</b> {hoaDon.tenKhachHang}
            </Typography>
            <Typography sx={{ marginBottom: 1 }}>
              <b>Ngày tạo:</b> {hoaDon.ngayTao}
            </Typography>
            <Typography sx={{ marginBottom: 1 }}>
              <b>Tổng tiền:</b>
              <Chip color="success" size="lg" sx={{ marginLeft: 1 }}>
                {formatCurrency(hoaDon.tongTien)}
              </Chip>
            </Typography>
            <Typography title="Thanh toán" sx={{ marginBottom: 1 }}>
              <b>Thanh toán:</b>
              <IconButton
                variant="plain"
                color="primary"
                size="sm"
                disabled={hoaDon.trangThai === "Đã thanh toán"}
                sx={{ marginLeft: 1 }}
                onClick={handleCreateThanhToan}
              >
                <PaymentIcon />
              </IconButton>
            </Typography>
            <Typography>
              <b>Trạng thái:</b>
              <Chip
                color={
                  hoaDon.trangThai === "Đã thanh toán" ? "success" : "warning"
                }
                sx={{ marginLeft: 1 }}
              >
                {hoaDon.trangThai}
              </Chip>
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="soft"
              color="danger"
              onClick={() => navigate("/hoa-don")}
            >
              Đóng
            </Button>
          </Box>
        </Card>
      ) : (
        <Typography textAlign="center" color="danger">
          Lỗi hiển thị thông tin hóa đơn!
        </Typography>
      )}

      {showModal && (
        <ThanhToanModal
          show={showModal}
          onClose={handleCloseModal}
          thanhToan={thanhToan}
          setHoaDon={setHoaDon}
        />
      )}
    </Container>
  );
};

export default ThanhToanComponent;