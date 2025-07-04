import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Divider,
  FormControlLabel,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  updateLoaiPhong,
  deleteLoaiPhong,
  DanhSachVatTuLoaiPhong,
  DanhSachDichVuDiKem,
} from "../../services/LoaiPhongService";
import { deleteVatTuLoaiPhong } from "../../services/VatTuLoaiPhong";
import { XoaDichVuDiKem } from "../../services/DichVuDiKemService";
import AddServiceModal from "../../components/LoaiPhong/AddServiceModal";
import AddUtilityModal from "../../components/LoaiPhong/AddUtilityModal";
import Swal from "sweetalert2";

const FormDetail = ({ show, handleClose, data }) => {
  const dialogRef = useRef(null); // Ref để tham chiếu container của dialog

  const [formData, setFormData] = useState({
    id: data?.id || "",
    tenLoaiPhong: data?.tenLoaiPhong || "",
    maLoaiPhong: data?.maLoaiPhong || "",
    dienTich: data?.dienTich || "",
    soKhachTieuChuan: data?.soKhachTieuChuan || "",
    soKhachToiDa: data?.soKhachToiDa || "",
    treEmTieuChuan: data?.treEmTieuChuan || "",
    treEmToiDa: data?.treEmToiDa || "",
    donGia: data?.donGia || "",
    phuThuNguoiLon: data?.phuThuNguoiLon || "",
    phuThuTreEm: data?.phuThuTreEm || "",
    moTa: data?.moTa || "",
    trangThai: data?.trangThai || false,
  });

  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showAddUtilityModal, setShowAddUtilityModal] = useState(false);
  const [listVatTuLoaiPhong, setListVatTuLoaiPhong] = useState([]);
  const [listDichVuDiKem, setListDichVuDiKem] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    if (formData.id) {
      fetchDanhSachVatTu();
      fetchDanhSachDichVu();
    }
  }, [formData.id, currentPage]);

  const fetchDanhSachVatTu = useCallback(async () => {
    try {
      const response = await DanhSachVatTuLoaiPhong(formData.id);
      setListVatTuLoaiPhong(response.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách vật tư:", error);
      Swal.fire({
        title: "Lỗi!",
        text: "Không thể tải danh sách vật tư.",
        icon: "error",
        confirmButtonText: "OK",
        target: dialogRef.current || document.body, // Hiển thị trong dialog
        toast: false,
      });
    }
  }, [formData.id]);

  const fetchDanhSachDichVu = useCallback(async () => {
    try {
      const response = await DanhSachDichVuDiKem(formData.id, {
        page: currentPage,
        size: itemsPerPage,
      });
      setListDichVuDiKem(response.data.content || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách dịch vụ đi kèm:", error);
      Swal.fire({
        title: "Lỗi!",
        text: "Không thể tải danh sách dịch vụ đi kèm.",
        icon: "error",
        confirmButtonText: "OK",
        target: dialogRef.current || document.body,
        toast: false,
      });
    }
  }, [formData.id, currentPage]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    if (name === "id") return; // Không cho phép thay đổi id
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : [
              "dienTich",
              "soKhachTieuChuan",
              "soKhachToiDa",
              "treEmTieuChuan",
              "treEmToiDa",
              "donGia",
              "phuThuNguoiLon",
              "phuThuTreEm",
            ].includes(name)
          ? value >= 0 || value === ""
            ? value
            : prev[name]
          : value,
    }));
  }, []);

  const validateForm = useCallback(() => {
    const requiredFields = [
      { name: "tenLoaiPhong", label: "Tên Loại Phòng" },
      { name: "maLoaiPhong", label: "Mã Loại Phòng" },
      { name: "dienTich", label: "Diện tích" },
      { name: "soKhachTieuChuan", label: "Số Khách Tiêu Chuẩn" },
      { name: "soKhachToiDa", label: "Số Khách Tối Đa" },
      { name: "treEmTieuChuan", label: "Số Trẻ Em Tiêu Chuẩn" },
      { name: "treEmToiDa", label: "Số Trẻ Em Tối Đa" },
      { name: "donGia", label: "Đơn Giá" },
      { name: "phuThuNguoiLon", label: "Phụ Thu Người Lớn" },
      { name: "phuThuTreEm", label: "Phụ Thu Trẻ Em" },
    ];

    for (const field of requiredFields) {
      if (formData[field.name] === "" || formData[field.name] === null) {
        Swal.fire({
          title: "Lỗi!",
          text: `${field.label} không được để trống!`,
          icon: "error",
          confirmButtonText: "OK",
          target: dialogRef.current || document.body,
          toast: false,
        });
        return false;
      }
      if (
        [
          "dienTich",
          "soKhachTieuChuan",
          "soKhachToiDa",
          "treEmTieuChuan",
          "treEmToiDa",
          "donGia",
          "phuThuNguoiLon",
          "phuThuTreEm",
        ].includes(field.name) &&
        formData[field.name] < 0
      ) {
        Swal.fire({
          title: "Lỗi!",
          text: `${field.label} phải là số không âm!`,
          icon: "error",
          confirmButtonText: "OK",
          target: dialogRef.current || document.body,
          toast: false,
        });
        return false;
      }
    }
    return true;
  }, [formData]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Thông tin loại phòng sẽ được cập nhật!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Cập nhật",
        cancelButtonText: "Hủy",
        target: dialogRef.current || document.body,
        toast: false,
      }).then((result) => {
        if (result.isConfirmed) {
          updateLoaiPhong(formData)
            .then(() => {
              Swal.fire({
                title: "Thành công!",
                text: "Thông tin loại phòng đã được cập nhật.",
                icon: "success",
                confirmButtonText: "OK",
                target: dialogRef.current || document.body,
                toast: false,
              });
              handleClose();
            })
            .catch((error) => {
              Swal.fire({
                title: "Lỗi!",
                text:
                  error.response?.data?.message ||
                  "Không thể cập nhật loại phòng.",
                icon: "error",
                confirmButtonText: "OK",
                target: dialogRef.current || document.body,
                toast: false,
              });
            });
        }
      });
    },
    [formData, validateForm, handleClose]
  );

  const handleDeleteLoaiPhong = useCallback(() => {
    Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Loại phòng này sẽ bị xóa vĩnh viễn!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      target: dialogRef.current || document.body,
      toast: false,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteLoaiPhong(formData.id)
          .then(() => {
            Swal.fire({
              title: "Thành công!",
              text: "Loại phòng đã được xóa.",
              icon: "success",
              confirmButtonText: "OK",
              target: dialogRef.current || document.body,
              toast: false,
            });
            handleClose();
          })
          .catch((error) => {
            Swal.fire({
              title: "Lỗi!",
              text:
                error.response?.data?.message || "Không thể xóa loại phòng.",
              icon: "error",
              confirmButtonText: "OK",
              target: dialogRef.current || document.body,
              toast: false,
            });
          });
      }
    });
  }, [formData.id, handleClose]);

  const handleDeleteDichVuDiKem = useCallback(
    (id) => {
      Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Dịch vụ đi kèm này sẽ bị xóa!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        target: dialogRef.current || document.body,
        toast: false,
      }).then((result) => {
        if (result.isConfirmed) {
          XoaDichVuDiKem(id)
            .then(() => {
              Swal.fire({
                title: "Thành công!",
                text: "Dịch vụ đi kèm đã được xóa.",
                icon: "success",
                confirmButtonText: "OK",
                target: dialogRef.current || document.body,
                toast: false,
              });
              fetchDanhSachDichVu();
            })
            .catch((error) => {
              Swal.fire({
                title: "Lỗi!",
                text: error.response?.data?.message || "Không thể xóa dịch vụ.",
                icon: "error",
                confirmButtonText: "OK",
                target: dialogRef.current || document.body,
                toast: false,
              });
            });
        }
      });
    },
    [fetchDanhSachDichVu]
  );

  const handleDeleteVatTuLoaiPhong = useCallback(
    (id) => {
      Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Vật tư này sẽ bị xóa!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        target: dialogRef.current || document.body,
        toast: false,
      }).then((result) => {
        if (result.isConfirmed) {
          deleteVatTuLoaiPhong(id)
            .then(() => {
              Swal.fire({
                title: "Thành công!",
                text: "Vật tư đã được xóa.",
                icon: "success",
                confirmButtonText: "OK",
                target: dialogRef.current || document.body,
                toast: false,
              });
              fetchDanhSachVatTu();
            })
            .catch((error) => {
              Swal.fire({
                title: "Lỗi!",
                text: error.response?.data?.message || "Không thể xóa vật tư.",
                icon: "error",
                confirmButtonText: "OK",
                target: dialogRef.current || document.body,
                toast: false,
              });
            });
        }
      });
    },
    [fetchDanhSachVatTu]
  );

  // Kiểm tra dữ liệu đầu vào
  if (!data || !formData.id) {
    return null; // Không render nếu dữ liệu không hợp lệ
  }

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: "linear-gradient(to right, #1e3c72, #2a5298)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Chi Tiết Loại Phòng
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 4, bgcolor: "#fafafa" }} ref={dialogRef}>
        <form onSubmit={handleSubmit}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              "&:hover": { boxShadow: "0 6px 25px rgba(0,0,0,0.15)" },
              transition: "box-shadow 0.3s ease-in-out",
            }}
          >
            <Typography
              variant="h6"
              color="primary"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Thông Tin Loại Phòng
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ID"
                  name="id"
                  value={formData.id}
                  disabled
                  margin="normal"
                  sx={{ "& .MuiInputBase-root": { bgcolor: "#f5f5f5" } }}
                />
                <TextField
                  fullWidth
                  label="Tên Loại Phòng"
                  name="tenLoaiPhong"
                  value={formData.tenLoaiPhong}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                  sx={{ "& .MuiInputBase-root": { bgcolor: "#fff" } }}
                />
                <TextField
                  fullWidth
                  label="Mã Loại Phòng"
                  name="maLoaiPhong"
                  value={formData.maLoaiPhong}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                  sx={{ "& .MuiInputBase-root": { bgcolor: "#fff" } }}
                />
                <TextField
                  fullWidth
                  label="Diện Tích (m²)"
                  name="dienTich"
                  value={formData.dienTich}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                  type="number"
                  inputProps={{ min: 0 }}
                  sx={{ "& .MuiInputBase-root": { bgcolor: "#fff" } }}
                />
                <TextField
                  fullWidth
                  label="Số Khách Tiêu Chuẩn"
                  name="soKhachTieuChuan"
                  value={formData.soKhachTieuChuan}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                  type="number"
                  inputProps={{ min: 0 }}
                  sx={{ "& .MuiInputBase-root": { bgcolor: "#fff" } }}
                />
                <TextField
                  fullWidth
                  label="Số Khách Tối Đa"
                  name="soKhachToiDa"
                  value={formData.soKhachToiDa}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                  type="number"
                  inputProps={{ min: 0 }}
                  sx={{ "& .MuiInputBase-root": { bgcolor: "#fff" } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Số Trẻ Em Tiêu Chuẩn"
                  name="treEmTieuChuan"
                  value={formData.treEmTieuChuan}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                  type="number"
                  inputProps={{ min: 0 }}
                  sx={{ "& .MuiInputBase-root": { bgcolor: "#fff" } }}
                />
                <TextField
                  fullWidth
                  label="Số Trẻ Em Tối Đa"
                  name="treEmToiDa"
                  value={formData.treEmToiDa}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                  type="number"
                  inputProps={{ min: 0 }}
                  sx={{ "& .MuiInputBase-root": { bgcolor: "#fff" } }}
                />
                <TextField
                  fullWidth
                  label="Đơn Giá (VND)"
                  name="donGia"
                  value={formData.donGia}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                  type="number"
                  inputProps={{ min: 0 }}
                  sx={{ "& .MuiInputBase-root": { bgcolor: "#fff" } }}
                />
                <TextField
                  fullWidth
                  label="Phụ Thu Người Lớn (VND)"
                  name="phuThuNguoiLon"
                  value={formData.phuThuNguoiLon}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                  type="number"
                  inputProps={{ min: 0 }}
                  sx={{ "& .MuiInputBase-root": { bgcolor: "#fff" } }}
                />
                <TextField
                  fullWidth
                  label="Phụ Thu Trẻ Em (VND)"
                  name="phuThuTreEm"
                  value={formData.phuThuTreEm}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                  type="number"
                  inputProps={{ min: 0 }}
                  sx={{ "& .MuiInputBase-root": { bgcolor: "#fff" } }}
                />
                <TextField
                  fullWidth
                  label="Mô Tả"
                  name="moTa"
                  value={formData.moTa}
                  onChange={handleInputChange}
                  margin="normal"
                  multiline
                  rows={2}
                  sx={{ "& .MuiInputBase-root": { bgcolor: "#fff" } }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.trangThai}
                      onChange={handleInputChange}
                      name="trangThai"
                      color="primary"
                    />
                  }
                  label="Kích Hoạt"
                  sx={{ mt: 2 }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Divider sx={{ my: 4 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                <Typography
                  variant="h6"
                  color="primary"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Danh Sách Dịch Vụ Đi Kèm
                </Typography>
                <TableContainer>
                  <Table
                    sx={{ "& .MuiTableCell-head": { bgcolor: "#f5f5f5" } }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên Dịch Vụ</TableCell>
                        <TableCell>Số Lượng</TableCell>
                        <TableCell>Hành Động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listDichVuDiKem.length > 0 ? (
                        listDichVuDiKem.map((dv) => (
                          <TableRow
                            key={dv.id}
                            hover
                            sx={{
                              "&:hover": {
                                bgcolor: "#f8f9fa",
                                transition: "background-color 0.2s",
                              },
                            }}
                          >
                            <TableCell>{dv.tenDichVu || "N/A"}</TableCell>
                            <TableCell>{dv.soLuong || "N/A"}</TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleDeleteDichVuDiKem(dv.id)}
                                sx={{ borderRadius: 1 }}
                              >
                                Xóa
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            <Typography color="text.secondary">
                              Chưa có dịch vụ đi kèm.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                <Typography
                  variant="h6"
                  color="primary"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Danh Sách Vật Tư Loại Phòng
                </Typography>
                <TableContainer>
                  <Table
                    sx={{ "& .MuiTableCell-head": { bgcolor: "#f5f5f5" } }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên Vật Tư</TableCell>
                        <TableCell>Số Lượng</TableCell>
                        <TableCell>Hành Động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listVatTuLoaiPhong.length > 0 ? (
                        listVatTuLoaiPhong.map((vt) => (
                          <TableRow
                            key={vt.id}
                            hover
                            sx={{
                              "&:hover": {
                                bgcolor: "#f8f9fa",
                                transition: "background-color 0.2s",
                              },
                            }}
                          >
                            <TableCell>{vt.tenVatTu || "N/A"}</TableCell>
                            <TableCell>{vt.soLuong || "N/A"}</TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() =>
                                  handleDeleteVatTuLoaiPhong(vt.id)
                                }
                                sx={{ borderRadius: 1 }}
                              >
                                Xóa
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            <Typography color="text.secondary">
                              Chưa có vật tư.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: "#f5f5f5" }}>
        {/* <Button
          variant="contained"
          color="error"
          onClick={handleDeleteLoaiPhong}
          sx={{
            borderRadius: 1,
            fontWeight: "bold",
            bgcolor: "#d32f2f",
            "&:hover": { bgcolor: "#b71c1c" },
          }}
        >
          Xóa Loại Phòng
        </Button> */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowAddServiceModal(true)}
          sx={{
            borderRadius: 1,
            fontWeight: "bold",
            bgcolor: "#1976d2",
            "&:hover": { bgcolor: "#115293" },
          }}
        >
          Thêm Dịch Vụ
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowAddUtilityModal(true)}
          sx={{
            borderRadius: 1,
            fontWeight: "bold",
            bgcolor: "#1976d2",
            "&:hover": { bgcolor: "#115293" },
          }}
        >
          Thêm Vật Tư
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{
            borderRadius: 1,
            fontWeight: "bold",
            bgcolor: "#1976d2",
            "&:hover": { bgcolor: "#115293" },
          }}
        >
          Lưu Thay Đổi
        </Button>
      </DialogActions>

      <AddServiceModal
        show={showAddServiceModal}
        handleClose={() => setShowAddServiceModal(false)}
        loaiPhongId={formData.id}
        onAddSuccess={() => fetchDanhSachDichVu()}
      />
      <AddUtilityModal
        show={showAddUtilityModal}
        handleClose={() => setShowAddUtilityModal(false)}
        loaiPhongId={formData.id}
        onAddSuccess={() => fetchDanhSachVatTu()}
      />
    </Dialog>
  );
};

export default FormDetail;