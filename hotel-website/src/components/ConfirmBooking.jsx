import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { XacNhanDP } from "../services/DatPhong.js";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Alert,
  AlertTitle,
  Container,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export default function ConfirmBooking() {
  const { iddp } = useParams(); // Lấy iddp từ URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const confirmBooking = async () => {
      try {
        setLoading(true);
        const response = await XacNhanDP(parseInt(iddp)); // Gọi API XacNhanDP
        if (response.data != false) {
          setSuccess(true);
          console.log(response)
        }else{
          setSuccess(false);
        }
      } catch (error) {
        setSuccess(false);
        setErrorMessage(error.message || "Đã có lỗi xảy ra khi xác nhận đặt phòng.");
      } finally {
        setLoading(false);
      }
    };

    confirmBooking();
  }, [iddp]);

  const handleBackToHome = () => {
    navigate("/"); // Chuyển hướng về trang chủ
  };

  const handleRetry = () => {
    window.location.reload(); // Tải lại trang để thử lại
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Đang xác nhận đặt phòng...
          </Typography>
        </Box>
      ) : success ? (
        <Box sx={{ py: 4 }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Xác Nhận Đặt Phòng Thành Công
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Cảm ơn bạn đã lựa chọn BamBooking. Đặt phòng của bạn đã được xác nhận thành công. 
            Chúng tôi sẽ gửi thông tin chi tiết qua email.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBackToHome}
            sx={{ mt: 2 }}
          >
            Quay Về Trang Chủ
          </Button>
        </Box>
      ) : (
        <Box sx={{ py: 4 }}>
          <ErrorIcon sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Xác Nhận Đặt Phòng Thất Bại
          </Typography>
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Lỗi</AlertTitle>
            {errorMessage}
          </Alert>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRetry}
            sx={{ mt: 2 }}
          >
            Thử Lại
          </Button>
        </Box>
      )}
    </Container>
  );
}