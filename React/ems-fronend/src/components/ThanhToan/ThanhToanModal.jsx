import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Typography,
  Button,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Chip,
  Stack,
  Paper,
  DialogContent,
  FormControl,
  InputAdornment,
  Input,
} from "@mui/material";
import {
  getHoaDonById,
  createThanhToan,
  updateThanhToan,
} from "../../services/ThanhToanService";

const ThanhToanModal = ({ show, onClose, thanhToan, setHoaDon }) => {
  const [phuongThucThanhToan, setPhuongThucThanhToan] = useState(false);
  const [tienThanhToan, setTienThanhToan] = useState(0);
  const [hoaDon, setHoaDonLocal] = useState(null);
  const [noiDungThanhToan, setNoiDungThanhToan] = useState("");
  const [thanhToanId, setThanhToanId] = useState(thanhToan?.id || null);
  const [error, setError] = useState(null);

  const bankInfo = {
    bankName: "Ngân hàng TMCP Quân Đội",
    accountNumber: "0374135106",
    accountName: "BUI HOANG LONG",
    bankBin: "970422",
  };

  useEffect(() => {
    const fetchHoaDonAndCreateThanhToan = async () => {
      try {
        const hoaDonResponse = await getHoaDonById(thanhToan.hoaDon.id);
        if (hoaDonResponse.data.trangThai === "Đã thanh toán") {
          alert("Hóa đơn đã được thanh toán trước đó");
          onClose();
          return;
        }
        setHoaDonLocal(hoaDonResponse.data);
        setHoaDon(hoaDonResponse.data);
        setNoiDungThanhToan(`Thanh toan hoa don ${hoaDonResponse.data.id}`);

        // Nếu tongTien = 0, đặt tienThanhToan = 0
        if (hoaDonResponse.data.tongTien === 0) {
          setTienThanhToan(0);
        } else {
          setTienThanhToan(hoaDonResponse.data.tongTien);
        }

        // Gọi createThanhToan để tạo bản ghi tạm thời
        if (!thanhToanId) {
          const thanhToanData = {
            idHoaDon: thanhToan.hoaDon.id,
          };
          const newThanhToan = await createThanhToan(thanhToanData);
          setThanhToanId(newThanhToan.data.id);
        }
      } catch (error) {
        console.error("Lỗi khi lấy hóa đơn hoặc tạo thanh toán: ", error);
        setError(
          "Không thể tải thông tin hóa đơn hoặc tạo thanh toán. Vui lòng thử lại."
        );
      }
    };

    if (thanhToan?.hoaDon?.id && show) {
      fetchHoaDonAndCreateThanhToan();
    }
  }, [thanhToan, setHoaDon, show, thanhToanId]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return new Date(dateString).toLocaleString("vi-VN", options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleTienThanhToanChange = (event) => {
    const value = event.target.value;
    let numericValue = value.replace(/[^0-9]/g, "");
    setTienThanhToan(numericValue);
  };

  const handleNoiDungChange = (event) => {
    setNoiDungThanhToan(event.target.value);
  };

  const handleUpdateTienThanhToan = async () => {
    if (!thanhToanId) {
      alert("Không thể xác nhận thanh toán. Vui lòng thử lại.");
      return;
    }
    try {
      const data = {
        idHoaDon: thanhToan.hoaDon.id,
        tienThanhToan: Number(tienThanhToan),
        phuongThucThanhToan: phuongThucThanhToan,
      };

      await updateThanhToan(thanhToanId, data);
      const updatedHoaDon = await getHoaDonById(thanhToan.hoaDon.id);
      setHoaDonLocal(updatedHoaDon.data);
      setHoaDon(updatedHoaDon.data);

      alert("Thanh toán thành công");
      onClose();
    } catch (error) {
      console.error("Lỗi khi thực hiện thanh toán: ", error);
      alert(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi thanh toán, vui lòng thử lại."
      );
    }
  };

  return (
    <Dialog
      open={show}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ marginLeft: 18 }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Thanh Toán
        </Typography>
      </DialogTitle>
      <DialogContent>
        {error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : (
          <Stack spacing={4}>
            <ToggleButtonGroup
              value={phuongThucThanhToan}
              exclusive
              onChange={(e, value) =>
                value !== null && setPhuongThucThanhToan(value)
              }
              fullWidth
              color="primary"
            >
              <ToggleButton
                value={false}
                sx={{ textTransform: "none", fontSize: "1rem" }}
              >
                Tiền mặt
              </ToggleButton>
              <ToggleButton
                value={true}
                sx={{ textTransform: "none", fontSize: "1rem" }}
              >
                Chuyển khoản
              </ToggleButton>
            </ToggleButtonGroup>

            {phuongThucThanhToan === false ? (
              hoaDon ? (
                <Paper
                  elevation={2}
                  sx={{
                    paddingLeft: 13,
                    paddingTop: 5,
                    paddingBottom: 4,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Stack spacing={3}>
                    <Typography>
                      <b>Ngày thanh toán:</b>{" "}
                      {thanhToan.ngayThanhToan
                        ? formatDate(thanhToan.ngayThanhToan)
                        : "Chưa có"}
                    </Typography>
                    <Typography>
                      <b>Tổng tiền:</b>{" "}
                      <Chip
                        label={formatCurrency(hoaDon.tongTien)}
                        color="success"
                        variant="outlined"
                        sx={{ fontSize: "16px" }}
                      />
                    </Typography>
                    {hoaDon.tongTien === 0 ? (
                      <Typography color="primary">
                        Không cần thanh toán thêm do đã thanh toán trước.
                      </Typography>
                    ) : (
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography>
                          <b>Tiền thanh toán:</b>
                        </Typography>
                        <FormControl variant="standard" sx={{ width: "15ch" }}>
                          <Input
                            type="text"
                            value={tienThanhToan}
                            onChange={handleTienThanhToanChange}
                            endAdornment={
                              <InputAdornment position="end">
                                vnđ
                              </InputAdornment>
                            }
                            disabled={hoaDon.tongTien === 0}
                          />
                        </FormControl>
                      </Box>
                    )}
                    <Typography>
                      <b>Tiền thừa:</b>{" "}
                      <Chip
                        label={formatCurrency(tienThanhToan - hoaDon.tongTien)}
                        color={
                          tienThanhToan - hoaDon.tongTien >= 0
                            ? "warning"
                            : "error"
                        }
                        variant="outlined"
                        sx={{ fontSize: "16px" }}
                      />
                    </Typography>
                  </Stack>
                </Paper>
              ) : (
                <Typography align="center">
                  Không có thông tin thanh toán tiền mặt.
                </Typography>
              )
            ) : hoaDon ? (
              <Paper
                elevation={2}
                sx={{ padding: 2, backgroundColor: "#f9f9f9" }}
              >
                <Stack spacing={2} alignItems="center">
                  <Typography variant="h6" fontWeight="bold">
                    Thanh toán qua Banking
                  </Typography>
                  <Typography>
                    <b>Tổng tiền:</b> {formatCurrency(hoaDon.tongTien)}
                  </Typography>
                  {hoaDon.tongTien === 0 ? (
                    <Typography color="primary">
                      Không cần thanh toán thêm do đã thanh toán trước.
                    </Typography>
                  ) : (
                    <>
                      <img
                        src={`https://api.vietqr.io/image/${bankInfo.bankBin}-${
                          bankInfo.accountNumber
                        }-Q5S7ZXh.jpg?accountName=${encodeURIComponent(
                          bankInfo.accountName
                        )}&amount=${
                          hoaDon.tongTien
                        }&addInfo=${encodeURIComponent(noiDungThanhToan)}`}
                        style={{
                          width: "210px",
                          height: "auto",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                      <Stack spacing={1} alignItems="center">
                        <Typography>
                          <b>Ngân hàng:</b> {bankInfo.bankName}
                        </Typography>
                        <Typography>
                          <b>Số tài khoản:</b> {bankInfo.accountNumber}
                        </Typography>
                        <Typography>
                          <b>Chủ tài khoản:</b> {bankInfo.accountName}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography>
                            <b>Nội dung:</b>
                          </Typography>
                          <TextField
                            value={noiDungThanhToan}
                            onChange={handleNoiDungChange}
                            variant="outlined"
                            size="small"
                            sx={{ flexGrow: 1 }}
                            disabled={hoaDon.tongTien === 0}
                          />
                        </Box>
                      </Stack>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        align="center"
                      >
                        Quét mã QR bằng ứng dụng ngân hàng để thanh toán
                      </Typography>
                    </>
                  )}
                </Stack>
              </Paper>
            ) : (
              <Typography align="center">
                Không có thông tin thanh toán chuyển khoản.
              </Typography>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", p: 3, pt: 1 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleUpdateTienThanhToan}
          disabled={hoaDon && tienThanhToan < 0}
        >
          Xác Nhận Thanh Toán
        </Button>
        <Button variant="outlined" color="error" onClick={onClose}>
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ThanhToanModal;