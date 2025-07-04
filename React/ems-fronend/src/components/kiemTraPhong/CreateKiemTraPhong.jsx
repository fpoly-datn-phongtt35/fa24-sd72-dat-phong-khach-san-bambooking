import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  hienThiVatTu,
  performRoomCheck,
} from "../../services/KiemTraPhongService";
import {
  Container,
  Box,
  Typography,
  Sheet,
  Table,
  Input,
  Button,
  Modal,
  ModalDialog,
  ModalClose,
} from "@mui/joy";
import { useTheme, useMediaQuery } from "@mui/material";
import { ThemPhuThu } from "../../services/PhuThuService";
import Swal from "sweetalert2";

// Hàm giải mã JWT token để lấy userId
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Lỗi khi giải mã token: ", error);
    return null;
  }
};

const CreateKiemTraPhong = () => {
  const { idXepPhong } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [materials, setMaterials] = useState([]);
  const [checkData, setCheckData] = useState([]);
  const [nhanVienId, setNhanVienId] = useState(null);
  const [errors, setErrors] = useState({});
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  // Lấy id nhân viên từ accessToken
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const tokenPayload = parseJwt(accessToken);
      if (tokenPayload && tokenPayload.userId) {
        setNhanVienId(tokenPayload.userId); // Lấy userId từ token
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể lấy ID nhân viên từ token.",
          confirmButtonText: "Đóng",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không tìm thấy accessToken trong localStorage.",
        confirmButtonText: "Đóng",
      });
    }
  }, []);

  // Lấy danh sách vật tư
  useEffect(() => {
    if (idXepPhong) {
      hienThiVatTu(idXepPhong)
        .then((response) => {
          const fetchedMaterials = response.data.data || [];
          setMaterials(fetchedMaterials);
          if (fetchedMaterials.length === 0) {
            Swal.fire({
              icon: "info",
              title: "Thông báo",
              text: "Không có vật tư nào để kiểm tra.",
              confirmButtonText: "Đóng",
            });
          }
          const initialData = fetchedMaterials.map((mat) => ({
            idVatTu: mat.id,
            soLuongThucTe: mat.soLuongTieuChuan,
            ghiChu: "",
          }));
          setCheckData(initialData);
        })
        .catch((error) => {
          console.error("Lỗi khi tải danh sách vật tư: ", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Không thể tải danh sách vật tư.",
            confirmButtonText: "Đóng",
          });
        });
    }
  }, [idXepPhong]);

  const handleInputChange = (index, field, value) => {
    const updatedData = [...checkData];
    const updatedErrors = { ...errors };
    const soLuongTieuChuan = materials[index]?.soLuongTieuChuan || 0;

    if (field === "soLuongThucTe") {
      const numericValue = Number(value);
      if (numericValue < 0) {
        updatedErrors[index] = "Số lượng thực tế không được nhỏ hơn 0!";
        updatedData[index] = { ...updatedData[index], [field]: 0 };
      } else if (numericValue > soLuongTieuChuan) {
        updatedErrors[
          index
        ] = `Số lượng thực tế không được lớn hơn số lượng tiêu chuẩn (${soLuongTieuChuan})!`;
        updatedData[index] = {
          ...updatedData[index],
          [field]: soLuongTieuChuan,
        };
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
    if (!nhanVienId) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không tìm thấy ID nhân viên đăng nhập!",
        confirmButtonText: "Đóng",
      });
      return;
    }

    const request = {
      idXepPhong: idXepPhong,
      idNhanVien: nhanVienId, // Sử dụng ID từ token
      danhSachVatTu: checkData,
    };

    try {
      const response = await performRoomCheck(request);
      console.log("Kiểm tra phòng thành công: ", response);

      if (!response || response.error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Lỗi khi kiểm tra phòng!",
          confirmButtonText: "Đóng",
        });
        return;
      }

      // Tìm các vật tư có số lượng thực tế < số lượng tiêu chuẩn
      const phuThuItems = checkData.filter((item) => {
        const material = materials.find((m) => m.id === item.idVatTu);
        return material && item.soLuongThucTe < material.soLuongTieuChuan;
      });

      // Nếu có vật tư thiếu, tạo phụ thu
      for (const item of phuThuItems) {
        const material = materials.find((m) => m.id === item.idVatTu);
        if (!material || !material.donGia) {
          console.log(`Vật tư ${material?.tenVatTu || item.idVatTu} không hợp lệ, bỏ qua.`);
          continue;
        }

        const ghiChu = item.ghiChu ? item.ghiChu.trim() : "";
        const tenPhuThu = ghiChu ? `${ghiChu} - ${material.tenVatTu}` : material.tenVatTu;
        const soLuongThieu = material.soLuongTieuChuan - item.soLuongThucTe;
        const tienPhuThu = material.donGia * soLuongThieu;

        const phuThuRequest = {
          xepPhong: { id: idXepPhong },
          tenPhuThu: tenPhuThu,
          tienPhuThu: tienPhuThu,
          soLuong: soLuongThieu,
          trangThai: false,
        };

        try {
          await ThemPhuThu(phuThuRequest);
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: `Đã thêm phụ thu: ${tenPhuThu}, Tổng tiền: ${formatCurrency(tienPhuThu)}`,
            confirmButtonText: "Đóng",
          });
        } catch (error) {
          console.error("Lỗi khi tạo phụ thu:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Lỗi khi tạo phụ thu!",
            confirmButtonText: "Đóng",
          });
        }
      }

      setOpenConfirmModal(false);
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã gửi kiểm tra phòng thành công. Đang chuyển hướng...",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate("/kiem-tra-phong");
      });
    } catch (error) {
      console.error("Lỗi khi thực hiện kiểm tra phòng: ", error);
      const message =
        error.response && error.response.data
          ? error.response.data.message
          : "Đã có lỗi xảy ra, vui lòng thử lại!";
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: message,
        confirmButtonText: "Đóng",
      });
      setOpenConfirmModal(false);
    }
  };

  const handleSubmit = () => {
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Vui lòng sửa các lỗi trước khi gửi!",
        confirmButtonText: "Đóng",
      });
      return;
    }
    if (!nhanVienId) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không tìm thấy ID nhân viên đăng nhập!",
        confirmButtonText: "Đóng",
      });
      return;
    }
    setOpenConfirmModal(true);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: isMobile ? 4 : 7,
          px: isMobile ? 2 : 0,
        }}
      >
        <Typography
          level="h4"
          sx={{
            mb: 3,
            fontWeight: "bold",
            fontSize: isMobile ? "1.2rem" : "1.5rem",
          }}
        >
          Kiểm tra phòng - Danh sách vật tư
        </Typography>
      </Box>

      {/* Bảng danh sách vật tư */}
      <Box sx={{ width: "100%", overflowX: "auto", mt: 2 }}>
        {materials.length > 0 ? (
          <Sheet
            sx={{
              minWidth: 600,
              padding: isMobile ? 1 : 2,
              borderRadius: 2,
            }}
          >
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
                            handleInputChange(
                              index,
                              "soLuongThucTe",
                              e.target.value
                            )
                          }
                          error={!!errors[index]}
                        />
                        {errors[index] && (
                          <Typography
                            level="body2"
                            color="danger"
                            sx={{ mt: 0.5 }}
                          >
                            {errors[index]}
                          </Typography>
                        )}
                      </Box>
                    </td>
                    <td>
                      <Input
                        value={checkData[index]?.ghiChu || ""}
                        onChange={(e) =>
                          handleInputChange(index, "ghiChu", e.target.value)
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
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography>Không có vật tư để hiển thị.</Typography>
          </Box>
        )}
      </Box>

      {/* Nút gửi kiểm tra phòng */}
      <Box
        sx={{
          textAlign: "center",
          mt: 3,
          px: isMobile ? 2 : 0,
        }}
      >
        <Button
          variant="soft"
          color="primary"
          onClick={handleSubmit}
          disabled={!nhanVienId}
          sx={{
            width: isMobile ? "100%" : "auto",
            fontSize: isMobile ? "1rem" : "1.1rem",
            padding: isMobile ? "10px" : "8px 16px",
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
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
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
    </Container>
  );
};

export default CreateKiemTraPhong;