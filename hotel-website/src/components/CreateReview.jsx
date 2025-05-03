import React, { useState, useEffect } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import { taoDanhGia, getKhachHang } from "../services/DanhGia.js";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Alert,
  AlertTitle,
  Container,
  TextField,
  Rating,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export default function CreateReview() {
  const { idKhachHang, idTTDP } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [khachHang, setKhachHang] = useState(null); 

 
  useEffect(() => {
    const fetchKhachHang = async () => {
      try {
        const response = await getKhachHang(idKhachHang);
        setKhachHang(response.data); 
      } catch (err) {
        setError("Không thể tải thông tin khách hàng!");
      }
    };

    fetchKhachHang();
  }, [idKhachHang]); 

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Vui lòng chọn số sao đánh giá!");
      return;
    }

    const danhGiaRequest = {
      idKhachHang,
      idThongTinDatPhong: idTTDP,
      stars: rating,
      nhanXet: comment,
    };

    try {
      setLoading(true);
      setError(null);
      await taoDanhGia(danhGiaRequest);
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError("Đã có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className="py-8">
      <Box className="flex flex-col gap-6">
        <Typography variant="h4" className="text-center font-bold">
          Đánh giá khách sạn
        </Typography>

        <Box className="flex flex-col gap-4">
          <Typography variant="body1">
            <strong>Chào {" "}
            {khachHang ? `${khachHang.ho} ${khachHang.ten}` : "Đang tải..."}</strong>
          </Typography>

          <Box>
            <Typography component="legend">Số sao đánh giá:</Typography>
            <Rating
              name="rating"
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              precision={1}
              disabled={loading || success}
            />
          </Box>

          <TextField
            label="Nhận xét"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            disabled={loading || success}
            placeholder="Viết nhận xét của bạn về khách sạn..."
          />

          {error && (
            <Alert severity="error" icon={<ErrorIcon />}>
              <AlertTitle>Lỗi</AlertTitle>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" icon={<CheckCircleIcon />}>
              <AlertTitle>Thành công</AlertTitle>
              Đánh giá của bạn đã được gửi thành công!
            </Alert>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || success}
            startIcon={loading && <CircularProgress size={20} />}
            className="mt-4"
          >
            {loading ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}