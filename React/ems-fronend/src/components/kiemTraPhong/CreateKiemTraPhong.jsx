import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllNhanVien, hienThiVatTu, performRoomCheck } from '../../services/KiemTraPhongService';
import { Container, Box, Typography, Sheet, Table, Input, Button, Select, Option, Modal, ModalDialog, ModalClose, Alert } from '@mui/joy';
import { useTheme, useMediaQuery } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; 

const CreateKiemTraPhong = () => {
  const { idXepPhong } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [materials, setMaterials] = useState([]);
  const [checkData, setCheckData] = useState([]);
  const [nhanvien, setNhanVien] = useState([]);
  const [selectedNhanVien, setSelectedNhanVien] = useState(null);
  const [errors, setErrors] = useState({});
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    getAllNhanVien()
      .then((response) => {
        if (response && Array.isArray(response.data)) {
          setNhanVien(response.data);
          const firstNhanVien = response.data.length > 0 ? response.data[0].id : null;
          setSelectedNhanVien(firstNhanVien);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải danh sách nhân viên: ", error);
      });
  }, []);

  useEffect(() => {
    if (idXepPhong) {
      hienThiVatTu(idXepPhong)
        .then((response) => {
          const fetchedMaterials = response.data.data;
          setMaterials(fetchedMaterials);
          const initialData = fetchedMaterials.map(mat => ({
            idVatTu: mat.id,
            soLuongThucTe: mat.soLuongTieuChuan,
            ghiChu: ""
          }));
          setCheckData(initialData);
        })
        .catch((error) => {
          console.error("Lỗi khi tải danh sách vật tư: ", error);
        });
    }
  }, [idXepPhong]);

  const handleInputChange = (index, field, value) => {
    const updatedData = [...checkData];
    const updatedErrors = { ...errors };
    const soLuongTieuChuan = materials[index]?.soLuongTieuChuan || 0;

    if (field === 'soLuongThucTe') {
      const numericValue = Number(value);
      if (numericValue < 0) {
        updatedErrors[index] = "Số lượng thực tế không được nhỏ hơn 0!";
        updatedData[index] = { ...updatedData[index], [field]: 0 };
      } else if (numericValue > soLuongTieuChuan) {
        updatedErrors[index] = `Số lượng thực tế không được lớn hơn số lượng tiêu chuẩn (${soLuongTieuChuan})!`;
        updatedData[index] = { ...updatedData[index], [field]: soLuongTieuChuan };
      } else {
        updatedData[index] = { ...updatedData[index], [field]: numericValue };
        delete updatedErrors[index];
      }
    } else {
      updatedData[index] = { ...updatedData[index], [field]: value };
    }

    setCheckData(updatedData);
    setErrors(updatedErrors);
  };

  const handleConfirmSubmit = async () => {
    const request = {
      idXepPhong: idXepPhong,
      idNhanVien: selectedNhanVien,
      danhSachVatTu: checkData
    };
    try {
      const response = await performRoomCheck(request);
      console.log("Kiểm tra phòng thành công: ", response);
      setOpenConfirmModal(false);
      setShowSuccessAlert(true);
      setTimeout(() => {
        navigate('/kiem-tra-phong');
      }, 2000);
    } catch (error) {
      console.error("Lỗi khi thực hiện kiểm tra phòng: ", error);
      if (error.response && error.response.data) {
        alert(`Lỗi: ${error.response.data.message}`);
      } else {
        alert("Đã có lỗi xảy ra, vui lòng thử lại!");
      }
      setOpenConfirmModal(false);
    }
  };

  const handleSubmit = () => {
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      alert("Vui lòng sửa các lỗi trước khi gửi!");
      return;
    }
    setOpenConfirmModal(true);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <Container>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: isMobile ? 4 : 7,
        px: isMobile ? 2 : 0
      }}>
        <Typography level="h4" sx={{ mb: 3, fontWeight: "bold", fontSize: isMobile ? "1.2rem" : "1.5rem" }}>
          Kiểm tra phòng - Danh sách vật tư
        </Typography>

        {/* Chọn nhân viên */}
        <Box sx={{
          width: "100%",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: isMobile ? "center" : "flex-end",
          alignItems: "center",
          gap: 1,
          px: isMobile ? 0 : 3
        }}>
          <Typography level="h6" sx={{ fontSize: isMobile ? "1rem" : "1.1rem" }}>
            Chọn nhân viên:
          </Typography>
          <Select
            sx={{
              width: isMobile ? "100%" : 180,
              bgcolor: "background.paper",
              borderRadius: 1
            }}
            value={selectedNhanVien}
            onChange={(event, newValue) => setSelectedNhanVien(newValue)}
          >
            {nhanvien.map((nv) => (
              <Option key={nv.id} value={nv.id}>
                {nv.hoTen}
              </Option>
            ))}
          </Select>
        </Box>
      </Box>

      {/* Bảng danh sách vật tư */}
      <Box sx={{ width: "100%", overflowX: "auto", mt: 2 }}>
        {materials.length > 0 ? (
          <Sheet sx={{
            minWidth: 600,
            padding: isMobile ? 1 : 2,
            borderRadius: 2
          }}>
            <Table
              borderAxis="x"
              size="md"
              stickyHeader
              variant="outlined"
              sx={{
                minWidth: isMobile ? "700px" : "100%",
              }}
            >
              <thead>
                <tr>
                  <th>Tên vật tư</th>
                  <th>Số lượng tiêu chuẩn</th>
                  <th>Số lượng thực tế</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((item, index) => (
                  <tr key={item.id}>
                    <td>{item.tenVatTu}</td>
                    <td>{item.soLuongTieuChuan}</td>
                    <td>
                      <Box>
                        <Input
                          type="number"
                          size="small"
                          min={0}
                          step="1"
                          value={checkData[index]?.soLuongThucTe ?? 0}
                          onChange={(e) =>
                            handleInputChange(index, 'soLuongThucTe', e.target.value)}
                          error={!!errors[index]}
                        />
                        {errors[index] && (
                          <Typography level="body2" color="danger" sx={{ mt: 0.5 }}>
                            {errors[index]}
                          </Typography>
                        )}
                      </Box>
                    </td>
                    <td>
                      <Input
                        value={checkData[index]?.ghiChu || ""}
                        onChange={(e) =>
                          handleInputChange(index, 'ghiChu', e.target.value)}
                        size="small"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Sheet>
        ) : (
          <Typography level="body1" sx={{ textAlign: 'center', marginTop: 2 }}>
            Đang tải danh sách vật tư...
          </Typography>
        )}
      </Box>

      {/* Nút gửi kiểm tra phòng */}
      <Box sx={{
        textAlign: 'center',
        mt: 3,
        px: isMobile ? 2 : 0
      }}>
        <Button
          variant="soft"
          color="primary"
          onClick={handleSubmit}
          sx={{
            width: isMobile ? "100%" : "auto",
            fontSize: isMobile ? "1rem" : "1.1rem",
            padding: isMobile ? "10px" : "8px 16px"
          }}
        >
          Gửi Kiểm Tra Phòng
        </Button>
      </Box>

      {/* Modal xác nhận */}
      <Modal open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h6" sx={{ mb: 2 }}>
            Xác nhận gửi kiểm tra phòng
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Bạn có chắc chắn muốn gửi bản kiểm tra phòng này không?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setOpenConfirmModal(false)}
            >
              Hủy
            </Button>
            <Button
              variant="solid"
              color="primary"
              onClick={handleConfirmSubmit}
            >
              Xác nhận
            </Button>
          </Box>
        </ModalDialog>
      </Modal>

      {/* Alert thành công */}
      {showSuccessAlert && (
        <Box sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1300,
          maxWidth: '400px',
        }}>
          <Alert
            variant="soft"
            color="success"
            startDecorator={<CheckCircleOutlineIcon />}
            onClose={() => setShowSuccessAlert(false)}
            sx={{
              fontSize: '0.9rem',
              padding: '8px 12px',
            }}
          >
            <Typography level="body1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              Thành công
            </Typography>
            Đã gửi kiểm tra phòng thành công. Vui lòng trả phòng!
          </Alert>
        </Box>
      )}
    </Container>
  );
};

export default CreateKiemTraPhong;