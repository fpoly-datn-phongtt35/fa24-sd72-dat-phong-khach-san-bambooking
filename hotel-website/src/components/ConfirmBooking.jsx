import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { XacNhanDP, EmailXacNhanDPThanhCong } from "../services/DatPhong.js";
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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const hasCalledAPI = useRef(false); // Ref để theo dõi trạng thái gọi API

  const confirmBooking = async () => {
    try {
      setLoading(true);
      console.log("Gọi API XacNhanDP với iddp:", parseInt(iddp));
      const response = await XacNhanDP(parseInt(iddp));
      console.log("Phản hồi API:", response);
      if (response.status === 200 && response.data.success === true) {
        setSuccess(true);
        console.log("Xác nhận thành công:", response.data);

        EmailXacNhanDPThanhCong(iddp);
      } else {
        setSuccess(false);
        setErrorMessage(
          response.data.message || "Xác nhận đặt phòng thất bại."
        );
        console.log("Phản hồi không mong muốn:", response.data);
      }
    } catch (error) {
      setSuccess(false);
      console.error("Lỗi khi gọi API:", error);
      if (error.response) {
        const { status, data } = error.response;
        setErrorMessage(
          status === 400
            ? data.message || "Dữ liệu không hợp lệ."
            : status === 404
            ? data.message || "Không tìm thấy đặt phòng."
            : status === 409
            ? data.message || "Đặt phòng đã được xác nhận trước đó."
            : "Lỗi server."
        );
        console.log("Lỗi server:", status, data);
      } else if (error.request) {
        setErrorMessage("Không thể kết nối đến server.");
        console.log("Không nhận được phản hồi:", error.request);
      } else {
        setErrorMessage("Đã có lỗi xảy ra khi xác nhận đặt phòng.");
        console.log("Lỗi:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (iddp && !isNaN(parseInt(iddp)) && !hasCalledAPI.current) {
      hasCalledAPI.current = true; // Đánh dấu đã gọi API
      confirmBooking();
    } else if (!iddp || isNaN(parseInt(iddp))) {
      setSuccess(false);
      setErrorMessage("ID đặt phòng không hợp lệ.");
      setLoading(false);
    }
  }, [iddp]);

  const handleBackToHome = () => {
    navigate("/"); // Chuyển hướng về trang chủ
  };

  const handleRetry = () => {
    if (!loading) {
      hasCalledAPI.current = false; // Cho phép gọi lại API
      confirmBooking(); // Gọi lại hàm confirmBooking thay vì reload
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Đang xác nhận đặt phòng...
          </Typography>
        </Box>
      ) : success ? (
        <Box sx={{ py: 4 }}>
          <CheckCircleIcon
            sx={{ fontSize: 60, color: "success.main", mb: 2 }}
          />
          <Typography variant="h4" gutterBottom>
            Xác Nhận Đặt Phòng Thành Công
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Cảm ơn bạn đã lựa chọn BamBooking. Đặt phòng của bạn đã được xác
            nhận thành công. Chúng tôi sẽ gửi thông tin chi tiết qua email.
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
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRetry}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              Thử Lại
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleBackToHome}
              sx={{ mt: 2 }}
            >
              Quay Về Trang Chủ
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}
