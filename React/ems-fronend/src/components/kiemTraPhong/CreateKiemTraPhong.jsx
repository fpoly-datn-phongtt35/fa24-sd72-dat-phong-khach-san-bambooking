import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllNhanVien, hienThiVatTu, performRoomCheck } from '../../services/KiemTraPhongService';
import { Container, Box, Typography, Sheet, Table, Input, Button, Select, Option } from '@mui/joy';

const CreateKiemTraPhong = () => {
  const { idXepPhong } = useParams();
  const navigate = useNavigate();

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
          // Khởi tạo checkData với số lượng thực tế mặc định bằng số lượng tiêu chuẩn, tình trạng mặc định "Đủ"
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
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 7 }}>
        <Typography level="h4" sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}>
          Kiểm tra phòng - Danh sách vật tư
        </Typography>

        <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1, pr: 3 }}>
          <Typography level="h6" sx={{ fontSize: "1.1rem" }}>
            Chọn nhân viên:
          </Typography>
          <Select
            sx={{ width: 180, bgcolor: "background.paper", borderRadius: 1 }}
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

      <Box>
        {materials.length > 0 ? (
          <Sheet sx={{ marginTop: 2, padding: '2px', borderRadius: '5px' }}>
            <Table borderAxis="x" size="lg" stickyHeader variant="outlined">
              <thead>
                <tr>
                  <th>Tên vật tư</th>
                  <th>Đơn giá</th>
                  <th>Số lượng tiêu chuẩn</th>
                  <th>Số lượng thực tế</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((item, index) => (
                  <tr key={item.id}>
                    <td>{item.tenVatTu}</td>
                    <td>{formatCurrency(item.donGia)}</td>
                    <td>{item.soLuongTieuChuan}</td>
                    <td>
                      <Input
                        type="number"
                        value={checkData[index]?.soLuongThucTe ?? 0}
                        onChange={(e) =>
                          handleInputChange(index, 'soLuongThucTe', Number(e.target.value))}
                        size="small"
                        min={0}
                      />
                    </td>
                    <td>
                      <Input
                        value={checkData[index]?.ghiChu || ""}
                        onChange={(e) =>
                          handleInputChange(index, 'ghiChu', e.target.value)
                        }
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

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button variant="plain" color="primary" onClick={handleSubmit}>
          Gửi Kiểm Tra Phòng
        </Button>
      </Box>
    </Container>
  );
};

export default CreateKiemTraPhong;
