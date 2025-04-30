import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HuyDP } from "../services/DatPhong.js";
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

export default function CancelDatPhong() {
  const { idDatPhong } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cancelBooking = async () => {
      if (!idDatPhong) {
        setError("Không tìm thấy ID đặt phòng");
        return;
      }

      setLoading(true);
      try {
        const response = await HuyDP(idDatPhong); 
        if (response) {
          setSuccess(true); 
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi hủy đặt phòng");
      } finally {
        setLoading(false);
      }
    };

    cancelBooking();
  }, [idDatPhong]);

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await HuyDP(idDatPhong);
      if (response) {
        setSuccess(true);
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi hủy đặt phòng");
    } finally {
      setLoading(false);
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
            Đang hủy đặt phòng...
          </Typography>
        </Box>
      ) : success ? (
        <Box sx={{ py: 4 }}>
          <CheckCircleIcon
            sx={{ fontSize: 60, color: "success.main", mb: 2 }}
          />
          <Typography variant="h4" gutterBottom>
            Hủy Đặt Phòng Thành Công
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Cảm ơn bạn đã sử dụng BamBooking. Đặt phòng của bạn đã được hủy thành công.
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
            Hủy Đặt Phòng Thất Bại
          </Typography>
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Lỗi</AlertTitle>
            {error}
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