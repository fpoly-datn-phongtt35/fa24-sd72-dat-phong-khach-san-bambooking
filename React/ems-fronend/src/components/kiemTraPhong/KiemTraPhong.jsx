import React, { useState, useEffect } from 'react';
import { getListRoomByCondition } from '../../services/KiemTraPhongService'; // Import hàm mới
import { Box, Button, Container, IconButton, Sheet, Stack, Table, Tooltip, Typography, Modal, ModalDialog } from '@mui/joy';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';

const KiemTraPhong = () => {
  const [kiemTraPhong, setKiemTraPhong] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Dưới 600px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600px - 900px
  const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // Từ 900px trở lên

  useEffect(() => {
    const fetchRoomList = async () => {
      try {
        setLoading(true);
        const response = await getListRoomByCondition();
        setKiemTraPhong(response.data || []);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải danh sách phòng cần kiểm tra.');
        setLoading(false);
      }
    };

    fetchRoomList();
  }, []);

  const handleCheckRoom = (idXepPhong) => {
    navigate(`/tao-kiem-tra-phong/${idXepPhong}`);
  };

  const handleViewDetails = (row) => {
    setSelectedRow(row);
    setOpenModal(true);
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        width: '100%',
        padding: isMobile ? '8px' : isTablet ? '16px' : '24px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: isMobile ? '100%' : isTablet ? '400px' : '600px',
          textAlign: 'center',
          mb: isMobile ? 2 : isTablet ? 3 : 4,
          mt: isMobile ? 2 : isTablet ? 3 : 4,
          px: isMobile ? 0 : isTablet ? 1 : 2,
        }}
      >
        <Typography
          level="h4"
          sx={{
            mb: 2,
            fontSize: isMobile ? '1.1rem' : isTablet ? '1.3rem' : '1.5rem',
            fontWeight: 'bold',
          }}
        >
          Danh sách phòng cần kiểm tra
        </Typography>
      </Box>

      <Box
        sx={{
          width: '100%',
          maxWidth: isMobile ? '100%' : isTablet ? '800px' : '1200px',
          flexGrow: 1,
        }}
      >
        {loading ? (
          <Typography sx={{ textAlign: 'center', mt: 2 }}>Đang tải...</Typography>
        ) : error ? (
          <Typography sx={{ textAlign: 'center', mt: 2, color: 'red' }}>{error}</Typography>
        ) : kiemTraPhong.length > 0 ? (
          <Sheet
            sx={{
              mt: isMobile ? 1 : 2,
              p: isMobile ? 1 : isTablet ? 2 : 3,
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              width: '100%',
            }}
          >
            <Table
              borderAxis="x"
              size={isMobile ? 'sm' : 'lg'}
              stickyHeader
              variant="outlined"
              sx={{
                width: '100%',
                '& th, & td': {
                  fontSize: isMobile ? '0.9rem' : isTablet ? '0.9rem' : '1rem',
                  padding: isMobile ? '8px' : isTablet ? '6px 10px' : '8px 16px',
                  whiteSpace: isMobile ? 'normal' : 'nowrap',
                  textAlign: 'left',
                },
                '& th': {
                  backgroundColor: '#f5f5f5',
                  minWidth: isMobile ? '80px' : '120px',
                },
                '& th:last-child, & td:last-child': {
                  minWidth: '60px',
                },
                ...(isMobile && {
                  '&': {
                    minWidth: '300px',
                  },
                  '& thead': {
                    display: 'block',
                  },
                  '& tbody': {
                    display: 'block',
                    overflowX: 'auto',
                  },
                  '& tr': {
                    display: 'table',
                    width: '100%',
                    tableLayout: 'fixed',
                  },
                }),
              }}
            >
              <thead>
                <tr>
                  <th>Tên khách hàng</th>
                  <th>Ngày nhận</th>
                  {!isMobile && <th>Ngày trả</th>}
                  {!isMobile && <th>Loại phòng</th>}
                  {!isMobile && <th>Phòng</th>}
                  {!isMobile && <th>Trạng thái</th>}
                  <th>{isMobile ? 'Hành động' : 'Chức năng'}</th>
                </tr>
              </thead>
              <tbody>
                {kiemTraPhong.map((value) => (
                  <tr key={value.idXepPhong}>
                    <td>{value.hoTenKhachHang}</td>
                    <td>{value.ngayNhanPhong}</td>
                    {!isMobile && <td>{value.ngayTraPhong}</td>}
                    {!isMobile && <td>{value.tenLoaiPhong}</td>}
                    {!isMobile && <td>{value.tenPhong}</td>}
                    {!isMobile && <td>{value.trangThaiXepPhong}</td>}
                    <td>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Kiểm tra phòng" variant="plain">
                          <IconButton
                            onClick={() => handleCheckRoom(value.idXepPhong)}
                            sx={{ '& svg': { fontSize: isMobile ? 18 : isTablet ? 22 : 30 } }}
                          >
                            <FactCheckIcon sx={{ color: '#ff9900' }} />
                          </IconButton>
                        </Tooltip>
                        {isMobile && (
                          <Tooltip title="Xem chi tiết" variant="plain">
                            <IconButton
                              onClick={() => handleViewDetails(value)}
                              sx={{ '& svg': { fontSize: isMobile ? 18 : isTablet ? 22 : 30 } }}
                            >
                              <VisibilityIcon sx={{ color: '#1976d2' }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Sheet>
        ) : (
          <Box sx={{ textAlign: 'center', mt: isMobile ? 1 : 2, width: '100%' }}>
            <Typography level="body1" sx={{ mb: 1, fontSize: isMobile ? '0.9rem' : '1rem' }}>
              Không có phòng nào cần kiểm tra.
            </Typography>
            <Typography
              level="body2"
              color="neutral"
              sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}
            >
              Vui lòng kiểm tra lại sau.
            </Typography>
          </Box>
        )}
      </Box>

      {selectedRow && (
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <ModalDialog>
            <Typography level="h6" sx={{ mb: 2 }}>
              Chi tiết kiểm tra phòng
            </Typography>
            <Stack spacing={1}>
              <Typography>
                <strong>Tên khách hàng:</strong> {selectedRow.hoTenKhachHang}
              </Typography>
              <Typography>
                <strong>Ngày nhận:</strong> {selectedRow.ngayNhanPhong}
              </Typography>
              <Typography>
                <strong>Ngày trả:</strong> {selectedRow.ngayTraPhong}
              </Typography>
              <Typography>
                <strong>Loại phòng:</strong> {selectedRow.tenLoaiPhong}
              </Typography>
              <Typography>
                <strong>Phòng:</strong> {selectedRow.tenPhong}
              </Typography>
              <Typography>
                <strong>Trạng thái:</strong> {selectedRow.trangThaiXepPhong}
              </Typography>
            </Stack>
            <Button
              variant="solid"
              color="primary"
              onClick={() => setOpenModal(false)}
              sx={{ mt: 2 }}
            >
              Đóng
            </Button>
          </ModalDialog>
        </Modal>
      )}
    </Container>
  );
};

export default KiemTraPhong;