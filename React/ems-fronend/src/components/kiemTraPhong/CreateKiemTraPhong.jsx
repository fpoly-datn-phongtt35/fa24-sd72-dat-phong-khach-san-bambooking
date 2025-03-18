import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllNhanVien, hienThiVatTu, performRoomCheck } from '../../services/KiemTraPhongService';
import { Container, Box, Typography, Sheet, Table, Input, Button, Select, Option } from '@mui/joy';
import { useTheme, useMediaQuery } from '@mui/material';

const CreateKiemTraPhong = () => {
  const { idXepPhong } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [materials, setMaterials] = useState([]);
  const [checkData, setCheckData] = useState([]);
  const [nhanvien, setNhanVien] = useState([]);
  const [selectedNhanVien, setSelectedNhanVien] = useState(null);

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
    updatedData[index] = { ...updatedData[index], [field]: value };
    setCheckData(updatedData);
  };

  const handleSubmit = async () => {
    const request = {
      idXepPhong: idXepPhong,
      idNhanVien: selectedNhanVien,
      danhSachVatTu: checkData
    };
    try {
      const response = await performRoomCheck(request);
      console.log("Kiểm tra phòng thành công: ", response);
      navigate('/kiem-tra-phong');
    } catch (error) {
      console.error("Lỗi khi thực hiện kiểm tra phòng: ", error);
    }
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
                minWidth: isMobile ? "700px" : "100%", // Giữ bảng có thể cuộn ngang trên mobile
              }}
            >
              <thead>
                <tr>
                  <th>Tên vật tư</th>
                  {/* <th>Đơn giá</th> */}
                  <th>Số lượng tiêu chuẩn</th>
                  <th>Số lượng thực tế</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((item, index) => (
                  <tr key={item.id}>
                    <td>{item.tenVatTu}</td>
                    {/* <td>{formatCurrency(item.donGia)}</td> */}
                    <td>{item.soLuongTieuChuan}</td>
                    <td>
                      <Input
                        type="number"
                        value={checkData[index]?.soLuongThucTe ?? 0}
                        onChange={(e) =>
                          handleInputChange(index, 'soLuongThucTe', Number(e.target.value)) }
                        size="small"
                        min={0}
                      />
                    </td>
                    <td>
                      <Input
                        value={checkData[index]?.ghiChu || ""}
                        onChange={(e) =>
                          handleInputChange(index, 'ghiChu', e.target.value) }
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
    </Container>
  );
};

export default CreateKiemTraPhong;
