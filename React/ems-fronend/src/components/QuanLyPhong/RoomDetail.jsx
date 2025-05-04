import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRoomDetail, getDichVuSuDungByIDXepPhong, AddDichVuSuDung, AddDVDK, changeConditionRoom } from '../../services/ViewPhong';
import { CapNhatDichVuSuDung } from "../../services/DichVuSuDungService";
import DVSVDetail from './DVSDDetail';
import {
  Box,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from '@mui/material';
import { Alert, AlertTitle } from '@mui/material';
import { Switch } from '@mui/joy';

const RoomDetail = () => {
  const { roomId, date } = useParams();
  const [idXepPhong, setIdXepPhong] = useState(null);
  const [roomDetail, setRoomDetail] = useState(null);
  const [ListDVSD, setListDVSD] = useState([]);
  const [showFormDetail, setShowFormDetail] = useState(false);
  const [selectedDichVu, setSelectedDichVu] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const [newDichVu, setNewDichVu] = useState({
    dichVu: { id: "" },
    xepPhong: { id: "" },
    soLuongSuDung: "",
    ngayKetThuc: "",
    giaSuDung: "",
    trangThai: 1,
  });

  const [buttonStatus, setButtonStatus] = useState({
    text: "Đang ở",
    disabled: false,
  });

  const fetchData = async () => {
    try {
      const response = await getRoomDetail(roomId, date);
      setRoomDetail(response);
      setIdXepPhong(response.id);
      const newStatus = response?.phong?.tinhTrang || "Đang ở";
      setButtonStatus({
        text: newStatus,
        disabled: newStatus === "Cần kiểm tra",
      });

      const dichVuResponse = await getDichVuSuDungByIDXepPhong(response.id);
      const responseArray = Array.isArray(dichVuResponse)
        ? dichVuResponse
        : [dichVuResponse];
      setListDVSD(responseArray);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết phòng:", error);
      // Có thể thêm thông báo lỗi cho người dùng nếu cần
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRoomDetail(roomId, date);
        setRoomDetail(response);
        setIdXepPhong(response.id);
        const newStatus = response?.phong?.tinhTrang || "Đang ở";
        setButtonStatus({
          text: newStatus,
          disabled: newStatus === "Cần kiểm tra",
        });

        const dichVuResponse = await getDichVuSuDungByIDXepPhong(response.id);
        const responseArray = Array.isArray(dichVuResponse)
          ? dichVuResponse
          : [dichVuResponse];
        setListDVSD(responseArray);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết phòng:", error);
      }
    };

    fetchData();
  }, [roomId, date]); // Thêm date vào dependency

  useEffect(() => {
    if (roomDetail) {
      setNewDichVu((prev) => ({
        ...prev,
        xepPhong: { id: roomDetail.id },
      }));
    }
    if (idXepPhong != null) {
      handleAddDVDK(idXepPhong);
    }
    console.log("Dữ liệu phòng:", roomDetail);
  }, [roomDetail, idXepPhong]); // Thay ListDVSD bằng idXepPhong để tránh vòng lặp

  const handleAddDVDK = (idxp) => {
    AddDVDK(idXepPhong)
      .then(() => {
        return getDichVuSuDungByIDXepPhong(idxp);
      })
      .then((updatedList) => {
        setListDVSD(updatedList);
      })
      .catch((error) => {
        console.error("Lỗi khi thêm dịch vụ đi kèm:", error);
      });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formattedData = {
      ...newDichVu,
      ngayKetThuc: `${newDichVu.ngayKetThuc}:00`,
    };
    AddDichVuSuDung(formattedData)
      .then(() => {
        console.log("Dữ liệu thêm dịch vụ:", formattedData);
        setShowFormDetail(false);
      })
      .catch((error) => {
        console.error("Error adding service:", error);
      });
  };

  const handleCloseFormDetail = () => {
    setShowFormDetail(false);
    setSelectedDichVu(null);
    fetchData();
  };

  useEffect(() => {
    if (alert.open) {
      const timer = setTimeout(() => {
        setAlert({ ...alert, open: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert.open]);

  const handleChangeConditionRoom = async () => {
    try {
      await changeConditionRoom(roomId);
      const updatedRoom = await getRoomDetail(roomId,date);
      console.log("Dữ liệu phòng sau khi thay đổi:", updatedRoom);
      setRoomDetail(updatedRoom);

      const newStatus = updatedRoom?.phong?.tinhTrang || "Cần kiểm tra";
      setButtonStatus({
        text: newStatus,
        disabled: newStatus === "Cần kiểm tra",
      });

      setAlert({
        open: true,
        severity: "success",
        message:
          "Cập nhật tình trạng phòng thành công. Vui lòng tiến hành kiểm tra phòng!",
      });
    } catch (error) {
      console.error("Lỗi khi thay đổi tình trạng phòng:", error);
      setAlert({
        open: true,
        severity: "error",
        message: "Có lỗi xảy ra khi cập nhật tình trạng phòng!",
      });
    }
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {/* Thông tin khách hàng */}
      <Grid item xs={12} sm={3.5}>
        <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom color="primary">
              Thông tin khách hàng
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Họ tên:</strong>{" "}
              {roomDetail?.thongTinDatPhong?.datPhong?.khachHang
                ? `${roomDetail.thongTinDatPhong.datPhong.khachHang.ho} ${roomDetail.thongTinDatPhong.datPhong.khachHang.ten}`
                : "Chưa có thông tin"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Số điện thoại:</strong>{" "}
              {roomDetail?.thongTinDatPhong?.datPhong?.khachHang?.sdt || "N/A"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Ngày nhận phòng:</strong>{" "}
              {roomDetail?.thongTinDatPhong?.ngayNhanPhong || "N/A"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Ngày trả phòng:</strong>{" "}
              {roomDetail?.thongTinDatPhong?.ngayTraPhong || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Giá đặt:</strong> {roomDetail?.thongTinDatPhong?.giaDat}{" "}
              VND
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Thông tin dịch vụ sử dụng */}
      <Grid item xs={12} sm={8.5}>
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Tên dịch vụ</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Hình ảnh</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Giá sử dụng (VND)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Số lượng sử dụng
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Tổng chi phí (VND)
                </TableCell>
                {roomDetail?.trangThai != "Đã trả phòng"  && roomDetail?.trangThai != "Đã kiểm tra" && (
                  <TableCell sx={{ fontWeight: "bold" }}>Hành động</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(ListDVSD) && ListDVSD.length > 0 ? (
                ListDVSD.map((dv) => (
                  <TableRow
                    key={dv.id}
                    sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                  >
                    <TableCell>{dv.dichVu?.tenDichVu}</TableCell>
                    <TableCell>
                      <img
                        src={dv.dichVu?.hinhAnh}
                        style={{
                          width: "130px",
                          height: "86px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </TableCell>
                    <TableCell>{dv.giaSuDung}</TableCell>
                    <TableCell>{dv.soLuongSuDung}</TableCell>
                    <TableCell>{dv.giaSuDung * dv.soLuongSuDung}</TableCell>
                    {roomDetail?.trangThai != "Đã trả phòng" && roomDetail?.trangThai != "Đã kiểm tra" &&(
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            setSelectedDichVu(dv);
                            setShowFormDetail(true);
                          }}
                          sx={{
                            backgroundColor: "#1976d2",
                            "&:hover": { backgroundColor: "#1565c0" },
                            textTransform: "none",
                          }}
                        >
                          Chi tiết
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ fontSize: "1.2rem" }}
                  >
                    Không tìm thấy thông tin dịch vụ nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {roomDetail && roomDetail.trangThai == "Đang ở" && (
          <>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, textTransform: "none" }}
              onClick={() => {
                setShowFormDetail(true);
                setSelectedDichVu(null);
              }}
            >
              Thêm dịch vụ
            </Button>
            <Button
              variant="contained"
              color="success"
              sx={{ mt: 2, mx: 2, textTransform: "none" }}
              onClick={handleChangeConditionRoom}
              disabled={buttonStatus.disabled}
            >
              {buttonStatus.text}
            </Button>
          </>
        )}

        {alert.open && (
          <Box
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
              zIndex: 1300,
              maxWidth: "400px",
            }}
          >
            <Alert
              severity={alert.severity}
              onClose={() => setAlert({ ...alert, open: false })}
              sx={{
                fontSize: "0.9rem",
                padding: "8px 12px",
                "& .MuiAlert-message": { padding: "0" },
              }}
            >
              {alert.severity === "success" && (
                <AlertTitle sx={{ fontSize: "1rem" }}>Thành công</AlertTitle>
              )}
              {alert.severity === "error" && (
                <AlertTitle sx={{ fontSize: "1rem" }}>Lỗi</AlertTitle>
              )}
              {alert.message}
            </Alert>
          </Box>
        )}
      </Grid>

      {/* Form chi tiết dịch vụ */}
      {showFormDetail && (
        <DVSVDetail
          show={showFormDetail}
          handleClose={handleCloseFormDetail}
          data={selectedDichVu}
          idxp={roomDetail?.id}
        />
      )}
    </Grid>
  );
};

export default RoomDetail;