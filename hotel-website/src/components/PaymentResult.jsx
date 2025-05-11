import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Container, Button } from '@mui/material';

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const status = query.get('status'); // PayOS gửi status qua query
    if (status === 'PAID') {
      alert('Thanh toán thành công!');
    } else if (status === 'CANCELLED') {
      alert('Thanh toán bị hủy. Vui lòng thử lại.');
    } else {
      alert('Lỗi thanh toán. Vui lòng liên hệ hỗ trợ.');
    }
  }, [location]);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Kết Quả Thanh Toán
      </Typography>
      <Typography variant="body1" align="center">
        Đang xử lý kết quả thanh toán...
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/thong-tin-dat-phong-search')}
        fullWidth
        sx={{ mt: 2 }}
      >
        Quay lại
      </Button>
    </Container>
  );
};

export default PaymentResult;