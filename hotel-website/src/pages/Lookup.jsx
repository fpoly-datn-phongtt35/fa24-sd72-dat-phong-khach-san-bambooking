import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTracuuLSDP } from '../services/DatPhong.js';
import { Container, Typography, TextField, Button, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function Lookup() {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [showNotification, setShowNotification] = useState(false); // Trạng thái để quản lý thông báo
    const [showNotificationFalse, setShowNotificationFalse] = useState(false); 

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            alert('Vui lòng nhập mã đặt phòng để tìm kiếm');
            return;
        }

        try {
            setLoading(true);
            const response = await getTracuuLSDP(searchTerm);
            console.log(response);
            setShowNotification(true); 
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setShowNotificationFalse(true)
        } finally {
            setLoading(false);
        }
    };

    const handleCloseNotification = () => {
        setShowNotification(false); 
        setShowNotificationFalse(false);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Typography variant="h4" component="h2" gutterBottom align="center">
                Tìm kiếm đặt phòng
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 3,
                }}
            >
                <TextField
                    fullWidth
                    label="Nhập email hoặc số điện thoại"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ maxWidth: { xs: '100%', sm: 400 } }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    startIcon={<SearchIcon />}
                    disabled={loading}
                    sx={{ height: 56, minWidth: 120 }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Tìm kiếm'}
                </Button>
            </Box>

            {/* Thông báo Snackbar */}
            <Snackbar
                open={showNotification}
                autoHideDuration={6000} // Tự động đóng sau 6 giây
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Vị trí thông báo
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    Đã gửi email xác nhận về email của bạn!
                </Alert>
            </Snackbar>
            <Snackbar
                open={showNotificationFalse}
                autoHideDuration={6000} // Tự động đóng sau 6 giây
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Vị trí thông báo
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity="error"
                    sx={{ width: '100%' }}
                >
                    Không tìm thấy email hoặc số điện thoại của bạn!
                </Alert>
            </Snackbar>
        </Container>
    );
}