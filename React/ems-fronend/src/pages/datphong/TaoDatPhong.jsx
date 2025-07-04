import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Alert,
  AlertTitle,
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Swal from "sweetalert2";
import {
  XoaDatPhong,
  XoaKhachHangDatPhong,
  CapNhatDatPhong,
  SuaKhachHangDatPhong,
  EmailXacNhanDPThanhCong,
} from "../../services/DatPhong";
import {
  huyTTDP,
  getThongTinDatPhong,
  updateThongTinDatPhong,
  addThongTinDatPhong,
} from "../../services/TTDP";
import {
  getLPKDRL,
  getLoaiPhongKhaDungResponse,
} from "../../services/LoaiPhongService";

dayjs.extend(utc);
const TaoDatPhong = () => {
  // Hàm tiện ích: Tính số ngày đặt phòng
  const calculateBookingDays = (ngayNhanPhong, ngayTraPhong) => {
    const start = dayjs(ngayNhanPhong);
    const end = dayjs(ngayTraPhong);
    const diffDays = end.diff(start, "day");
    return diffDays > 0 ? diffDays : 1;
  };

  // Hàm tiện ích: Định dạng ngày giờ
  const formatDateTime = (dateTimeValue) => {
    return dayjs(dateTimeValue).format("DD/MM/YYYY HH:mm");
  };

  // Hàm tiện ích: Nhóm và đếm số phòng
  const groupAndNumberRooms = (rooms) => {
    const grouped = {};
    rooms.forEach((room) => {
      const key = `${room.loaiPhong.id}-${room.ngayNhanPhong}-${room.ngayTraPhong}-${room.soTre}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(room);
    });

    const result = [];
    Object.values(grouped).forEach((group) => {
      const representativeRoom = { ...group[0] };
      representativeRoom.soPhong = group.length;
      result.push(representativeRoom);
    });

    return result;
  };

  // Hàm tính tổng tiền
  const calculateTotalAmount = (ttdpData) => {
    return ttdpData.reduce((total, room) => {
      const days = calculateBookingDays(room.ngayNhanPhong, room.ngayTraPhong);
      return total + room.loaiPhong.donGia * days * room.soPhong;
    }, 0);
  };

  // State và hooks
  const location = useLocation();
  const navigate = useNavigate();
  const { datPhong, khachHang, thongTinDatPhong } = location.state || {};
  const [ttdpData, setTtdpData] = useState([]);
  const [TTDP, setTTDP] = useState([]);
  const [formData, setFormData] = useState({
    hoTen: "",
    email: "",
    sdt: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showError, setShowError] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newRoomCount, setNewRoomCount] = useState("");
  const [openSearchDialog, setOpenSearchDialog] = useState(false);

  // Khởi tạo ngày nhận và trả phòng
  const currentHour = dayjs().hour();
  const initNgayNhanPhong =
    currentHour >= 14
      ? dayjs().add(1, "day").set("hour", 14).set("minute", 0).set("second", 0)
      : dayjs().set("hour", 14).set("minute", 0).set("second", 0);
  const initNgayTraPhong = initNgayNhanPhong
    .add(1, "day")
    .set("hour", 12)
    .set("minute", 0)
    .set("second", 0);

  const [searchForm, setSearchForm] = useState({
    ngayNhanPhong: initNgayNhanPhong,
    ngayTraPhong: initNgayTraPhong,
    soNguoi: "",
    soTre: "",
    soPhong: "",
    idLoaiPhong: null,
  });
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loaiPhongs, setLoaiPhongs] = useState([]);
  const [searchErrors, setSearchErrors] = useState({});

  // Lấy danh sách loại phòng khi mở dialog tìm kiếm
  useEffect(() => {
    if (openSearchDialog) {
      const fetchLoaiPhongs = async () => {
        try {
          const n = searchForm.ngayNhanPhong.toISOString();
          const t = searchForm.ngayTraPhong.toISOString();
          const response = await getLoaiPhongKhaDungResponse(n, t);
          setLoaiPhongs(response.data);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách loại phòng:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Đã xảy ra lỗi khi lấy danh sách loại phòng. Vui lòng thử lại!",
            confirmButtonText: "Đóng",
          });
        }
      };
      fetchLoaiPhongs();
    }
  }, [openSearchDialog, searchForm.ngayNhanPhong, searchForm.ngayTraPhong]);

  // Lấy thông tin đặt phòng
  const fetchThongTinDatPhongById = async (datPhongId) => {
    try {
      const response = await getThongTinDatPhong(datPhongId);
      const numberedRooms = groupAndNumberRooms(response.data);
      setTtdpData(numberedRooms);
      setTTDP(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin đặt phòng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi lấy thông tin đặt phòng. Vui lòng thử lại!",
        confirmButtonText: "Đóng",
      });
    }
  };

  useEffect(() => {
    if (datPhong && datPhong.id) {
      fetchThongTinDatPhongById(datPhong.id);
    } else if (thongTinDatPhong) {
      const numberedRooms = groupAndNumberRooms(thongTinDatPhong);
      setTtdpData(numberedRooms);
      setTTDP(thongTinDatPhong);
    }
  }, [datPhong, thongTinDatPhong]);

  // Đóng dialog chỉnh sửa số phòng
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRoom(null);
    setNewRoomCount("");
  };

  // Cập nhật số phòng
  const handleUpdateRoomCount = async () => {
    if (!selectedRoom) return;

    const newCount = parseInt(newRoomCount, 10);
    const oldCount = selectedRoom.soPhong;

    if (isNaN(newCount) || newCount < 0 || newCount > oldCount) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: `Số phòng mới phải từ 0 đến ${oldCount}!`,
        confirmButtonText: "Đóng",
      });
      return;
    }

    if (newCount === oldCount) {
      handleCloseDialog();
      return;
    }

    try {
      const matchingRooms = TTDP.filter(
        (item) =>
          item.loaiPhong.id === selectedRoom.loaiPhong.id &&
          item.ngayNhanPhong === selectedRoom.ngayNhanPhong &&
          item.ngayTraPhong === selectedRoom.ngayTraPhong &&
          item.soNguoi === selectedRoom.soNguoi
      );

      const roomsToRemove = oldCount - newCount;
      for (let i = 0; i < roomsToRemove; i++) {
        const roomToRemove = matchingRooms[i];
        await huyTTDP(roomToRemove.maThongTinDatPhong);
      }

      const updatedResponse = await getThongTinDatPhong(datPhong.id);
      const numberedRooms = groupAndNumberRooms(updatedResponse.data);
      setTtdpData(numberedRooms);
      setTTDP(updatedResponse.data);
      handleCloseDialog();
    } catch (error) {
      console.error("Lỗi khi cập nhật số phòng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi cập nhật số phòng. Vui lòng thử lại!",
        confirmButtonText: "Đóng",
      });
    }
  };

  // Xóa một phòng
  const handleRemoveRoom = async (room) => {
    const confirmDelete = await Swal.fire({
      icon: "question",
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn xóa phòng này không?",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (!confirmDelete.isConfirmed) return;

    try {
      await huyTTDP(room.maThongTinDatPhong);
      const updatedResponse = await getThongTinDatPhong(datPhong.id);
      const numberedRooms = groupAndNumberRooms(updatedResponse.data);
      setTtdpData(numberedRooms);
      setTTDP(updatedResponse.data);
    } catch (error) {
      console.error("Lỗi khi xóa phòng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi xóa phòng. Vui lòng thử lại!",
        confirmButtonText: "Đóng",
      });
    }
  };

  // Xóa tất cả phòng giống nhau
  const handleRemoveAllRooms = async (room) => {
    const confirmDeleteAll = await Swal.fire({
      icon: "question",
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn hủy tất cả các phòng giống nhau không?",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (!confirmDeleteAll.isConfirmed) return;

    try {
      const matchingRooms = TTDP.filter(
        (item) =>
          item.loaiPhong.id === room.loaiPhong.id &&
          item.ngayNhanPhong === room.ngayNhanPhong &&
          item.ngayTraPhong === room.ngayTraPhong &&
          item.soNguoi === room.soNguoi
      );
      for (const matchingRoom of matchingRooms) {
        await huyTTDP(matchingRoom.maThongTinDatPhong);
      }
      const updatedResponse = await getThongTinDatPhong(datPhong.id);
      const numberedRooms = groupAndNumberRooms(updatedResponse.data);
      setTtdpData(numberedRooms);
      setTTDP(updatedResponse.data);
    } catch (error) {
      console.error("Lỗi khi hủy tất cả phòng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi hủy tất cả phòng. Vui lòng thử lại!",
        confirmButtonText: "Đóng",
      });
    }
  };

  // Tách họ và tên
  const splitHoTen = (hoTen) => {
    const trimmed = hoTen.trim();
    const parts = trimmed.split(" ");
    const ten = parts.pop() || "";
    const ho = parts.join(" ") || "";
    return { ho, ten };
  };

  // Xác nhận đặt phòng
  const handleConfirmBooking = async () => {
    if (ttdpData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Vui lòng chọn ít nhất một phòng trước khi xác nhận đặt phòng!",
        confirmButtonText: "Đóng",
      }).then(() => {
        navigate("/dat-phong");
      });
      return;
    }
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng điền đầy đủ và đúng thông tin trước khi xác nhận đặt phòng!",
        confirmButtonText: "Đóng",
      });
      return;
    }
    let khachHangResponse = null;
    let datPhongResponse = null;
    try {
      if (!khachHang || !datPhong) {
        throw new Error("Thiếu thông tin khách hàng hoặc đặt phòng.");
      }
      const { ho, ten } = splitHoTen(formData.hoTen);
      const khachHangRequest = {
        id: khachHang.id,
        ho,
        ten,
        email: formData.email || null,
        sdt: formData.sdt,
        trangThai: false,
      };
      khachHangResponse = await SuaKhachHangDatPhong(khachHangRequest);
      if (!khachHangResponse || !khachHangResponse.data) {
        throw new Error("Không thể cập nhật khách hàng.");
      }
      const datPhongRequest = {
        id: datPhong.id,
        khachHang: khachHangResponse.data,
        maDatPhong: datPhong.maDatPhong,
        soNguoi: datPhong.soNguoi,
        soTre: datPhong.soTre || 0,
        soPhong: ttdpData.reduce((total, room) => total + room.soPhong, 0),
        ngayDat: datPhong ? datPhong.ngayDat : new Date().toISOString(),
        tongTien: calculateTotalAmount(ttdpData),
        ghiChu: "Ghi chú thêm nếu cần",
        trangThai: "Đã xác nhận",
      };
      datPhongResponse = await CapNhatDatPhong(datPhongRequest);
      if (!datPhongResponse || !datPhongResponse.data) {
        throw new Error("Không thể cập nhật đặt phòng.");
      }
      for (const thongTinDatPhong of TTDP) {
        const updatedThongTinDatPhong = {
          id: thongTinDatPhong.id,
          datPhong: thongTinDatPhong.datPhong,
          idLoaiPhong: thongTinDatPhong.loaiPhong.id,
          maThongTinDatPhong: thongTinDatPhong.maThongTinDatPhong,
          ngayNhanPhong: thongTinDatPhong.ngayNhanPhong,
          ngayTraPhong: thongTinDatPhong.ngayTraPhong,
          soNguoi: thongTinDatPhong.soNguoi,
          soTre: thongTinDatPhong.soTre || 0,
          giaDat: thongTinDatPhong.giaDat,
          ghiChu: thongTinDatPhong.ghiChu,
          trangThai: "Chưa xếp",
        };
        const response = await updateThongTinDatPhong(updatedThongTinDatPhong);
        if (!response || !response.data) {
          throw new Error(
            `Không thể cập nhật thông tin đặt phòng: ${thongTinDatPhong.maThongTinDatPhong}`
          );
        }
      }
      EmailXacNhanDPThanhCong(datPhongRequest.id);
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đặt phòng thành công!",
        confirmButtonText: "Đóng",
      }).then(() => {
        navigate("/thong-tin-dat-phong-search");
      });
    } catch (error) {
      console.error("Lỗi khi đặt phòng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Đã xảy ra lỗi khi đặt phòng: ${error.message}`,
        confirmButtonText: "Đóng",
      });
      if (datPhongResponse && datPhongResponse.data) {
        try {
          await XoaDatPhong(datPhongResponse.data.id);
        } catch (err) {
          console.error("Lỗi khi rollback datPhong:", err);
        }
      }
      if (khachHangResponse && khachHangResponse.data) {
        try {
          await XoaKhachHangDatPhong(khachHangResponse.data);
        } catch (err) {
          console.error("Lỗi khi rollback khachHang:", err);
        }
      }
    }
  };

  // Tìm phòng khả dụng
  const handleSearchRooms = async () => {
    const errors = {};
    const now = dayjs();

    if (!searchForm.ngayNhanPhong || !searchForm.ngayNhanPhong.isValid()) {
      errors.ngayNhanPhong = "Vui lòng chọn ngày nhận phòng";
    } else if (searchForm.ngayNhanPhong.isBefore(now, "minute")) {
      errors.ngayNhanPhong =
        "Ngày nhận phòng không được trước thời điểm hiện tại";
    }
    if (!searchForm.ngayTraPhong || !searchForm.ngayTraPhong.isValid()) {
      errors.ngayTraPhong = "Vui lòng chọn ngày trả phòng";
    } else if (
      searchForm.ngayTraPhong.isBefore(searchForm.ngayNhanPhong.add(1, "hour"))
    ) {
      errors.ngayTraPhong =
        "Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 giờ";
    }
    if (
      !searchForm.soNguoi ||
      searchForm.soNguoi <= 0 ||
      !Number.isInteger(Number(searchForm.soNguoi))
    ) {
      errors.soNguoi = "Số người phải là số nguyên lớn hơn 0";
    }
    if (
      searchForm.soTre &&
      (searchForm.soTre < 0 || !Number.isInteger(Number(searchForm.soTre)))
    ) {
      errors.soTre = "Số trẻ em phải là số nguyên không âm";
    }
    if (
      !searchForm.soPhong ||
      searchForm.soPhong <= 0 ||
      !Number.isInteger(Number(searchForm.soPhong))
    ) {
      errors.soPhong = "Số phòng phải là số nguyên lớn hơn 0";
    }

    setSearchErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const n = searchForm.ngayNhanPhong.toISOString();
      const t = searchForm.ngayTraPhong.toISOString();
      const response = await getLPKDRL(
        n,
        t,
        Number(searchForm.soNguoi),
        Number(searchForm.soTre) || 0,
        Number(searchForm.soPhong),
        searchForm.idLoaiPhong
      );
      if (response.data.length === 0) {
        Swal.fire({
          icon: "info",
          title: "Thông báo",
          text: "Không có phòng khả dụng cho yêu cầu của bạn. Vui lòng thử lại với ngày hoặc số lượng khác!",
          confirmButtonText: "Đóng",
        });
      }
      setAvailableRooms(response.data);
    } catch (error) {
      console.error("Lỗi khi tìm phòng khả dụng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi tìm phòng. Vui lòng thử lại!",
        confirmButtonText: "Đóng",
      });
    }
  };

  // Thêm phòng
  const handleAddRoom = async (room) => {
    if (room.soPhongKhaDung < Number(searchForm.soPhong)) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Số phòng khả dụng không đủ!",
        confirmButtonText: "Đóng",
      });
      return;
    }

    try {
      if (!khachHang || !datPhong) {
        throw new Error("Thiếu thông tin khách hàng hoặc đặt phòng.");
      }

      const addedRooms = [];
      for (let i = 0; i < Number(searchForm.soPhong); i++) {
        const newRoom = {
          datPhong: datPhong,
          idLoaiPhong: room.id,
          maThongTinDatPhong: `TDP-${Date.now()}-${room.id}-${i}`,
          ngayNhanPhong: dayjs(searchForm.ngayNhanPhong).format(
            "YYYY-MM-DD[T]HH:mm:ss"
          ),
          ngayTraPhong: dayjs(searchForm.ngayTraPhong).format(
            "YYYY-MM-DD[T]HH:mm:ss"
          ),
          soNguoi: room.soKhachToiDa,
          soTre: Number(searchForm.soTre) || 0,
          giaDat: room.donGia,
          trangThai: "Đang đặt phòng",
        };
        const response = await addThongTinDatPhong(newRoom);
        if (!response || !response.data) {
          throw new Error(
            `Không thể thêm thông tin đặt phòng: ${newRoom.maThongTinDatPhong}`
          );
        }
        addedRooms.push(response.data);
      }

      const updatedResponse = await getThongTinDatPhong(datPhong.id);
      const numberedRooms = groupAndNumberRooms(updatedResponse.data);
      setTtdpData(numberedRooms);
      setTTDP(updatedResponse.data);

      setOpenSearchDialog(false);
      setAvailableRooms([]);
      setSearchForm({
        ngayNhanPhong: initNgayNhanPhong,
        ngayTraPhong: initNgayTraPhong,
        soNguoi: "",
        soTre: "",
        soPhong: "",
        idLoaiPhong: null,
      });
    } catch (error) {
      console.error("Lỗi khi thêm phòng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Đã xảy ra lỗi khi thêm phòng: ${error.message}`,
        confirmButtonText: "Đóng",
      });
    }
  };

  // Kiểm tra form thông tin khách hàng
  const validateForm = () => {
    const errors = {};
    if (!formData.hoTen.trim()) {
      errors.hoTen = "Vui lòng nhập họ và tên";
    }
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }
    if (!formData.sdt.trim()) {
      errors.sdt = "Vui lòng nhập số điện thoại";
    } else if (!/^\d{10}$/.test(formData.sdt)) {
      errors.sdt = "Số điện thoại phải có 10 chữ số";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Xử lý thay đổi input thông tin khách hàng
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setFormErrors({});
    setShowError(false);
  };

  // Xử lý thay đổi input tìm kiếm phòng
  const handleSearchInputChange = async (field, value) => {
    if (field === "soNguoi" || field === "soPhong" || field === "soTre") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setSearchForm({ ...searchForm, [field]: numericValue });
    } else if (field === "ngayNhanPhong" || field === "ngayTraPhong") {
      if (value && value.isValid()) {
        setSearchForm((prev) => {
          const newForm = { ...prev, [field]: value };
          if (field === "ngayNhanPhong" && value.isAfter(dayjs(), "minute")) {
            newForm.ngayTraPhong = value
              .add(1, "day")
              .set("hour", 12)
              .set("minute", 0)
              .set("second", 0);
          }
          return newForm;
        });
        // Cập nhật ngày trong ttdpData
        if (TTDP.length > 0) {
          try {
            const updatedTTDP = await Promise.all(
              TTDP.map(async (room) => {
                if (room.trangThai === "Đang đặt phòng") {
                  const updatedRoom = {
                    ...room,
                    ngayNhanPhong:
                      field === "ngayNhanPhong"
                        ? value.toISOString()
                        : room.ngayNhanPhong,
                    ngayTraPhong:
                      field === "ngayTraPhong"
                        ? value.toISOString()
                        : room.ngayTraPhong,
                  };
                  const response = await updateThongTinDatPhong(updatedRoom);
                  return response.data;
                }
                return room;
              })
            );
            const numberedRooms = groupAndNumberRooms(updatedTTDP);
            setTtdpData(numberedRooms);
            setTTDP(updatedTTDP);
          } catch (error) {
            console.error("Lỗi khi cập nhật ngày trong TTDP:", error);
            Swal.fire({
              icon: "error",
              title: "Lỗi",
              text: "Đã xảy ra lỗi khi cập nhật ngày phòng. Vui lòng thử lại!",
              confirmButtonText: "Đóng",
            });
          }
        }
      } else {
        setSearchForm({ ...searchForm, [field]: null });
      }
    } else {
      setSearchForm({ ...searchForm, [field]: value });
    }
    setSearchErrors({});
  };

  return (
    <Container sx={{ minWidth: "1300px", py: 4 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {showError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
              <AlertTitle>Lỗi</AlertTitle>
              Vui lòng điền đầy đủ và đúng thông tin trước khi xác nhận đặt
              phòng.
            </Alert>
          )}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Thông Tin Người Đặt
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Họ và Tên"
                      value={formData.hoTen}
                      onChange={(e) =>
                        handleInputChange("hoTen", e.target.value)
                      }
                      error={!!formErrors.hoTen}
                      helperText={formErrors.hoTen}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Số Điện Thoại"
                      value={formData.sdt}
                      onChange={(e) => handleInputChange("sdt", e.target.value)}
                      error={!!formErrors.sdt}
                      helperText={formErrors.sdt}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">
                    Chi Tiết Phòng Đã Chọn (
                    {ttdpData.reduce((total, room) => total + room.soPhong, 0)})
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenSearchDialog(true)}
                  >
                    Thêm Phòng
                  </Button>
                </Box>
                <TableContainer sx={{ mb: 2, borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Loại phòng</TableCell>
                        <TableCell>Ngày nhận phòng</TableCell>
                        <TableCell>Ngày trả phòng</TableCell>
                        <TableCell>Giá mỗi đêm</TableCell>
                        <TableCell>Số đêm</TableCell>
                        <TableCell>Số phòng</TableCell>
                        <TableCell>Thành tiền</TableCell>
                        <TableCell>Hành động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ttdpData.map((room, index) => (
                        <TableRow key={index}>
                          <TableCell>{room.loaiPhong.tenLoaiPhong}</TableCell>
                          <TableCell>
                            {formatDateTime(room.ngayNhanPhong)}
                          </TableCell>
                          <TableCell>
                            {formatDateTime(room.ngayTraPhong)}
                          </TableCell>
                          <TableCell>
                            {room.loaiPhong.donGia.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {calculateBookingDays(
                              room.ngayNhanPhong,
                              room.ngayTraPhong
                            )}
                          </TableCell>
                          <TableCell>{room.soPhong}</TableCell>
                          <TableCell>
                            {(
                              calculateBookingDays(
                                room.ngayNhanPhong,
                                room.ngayTraPhong
                              ) *
                              room.loaiPhong.donGia *
                              room.soPhong
                            ).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="warning"
                              onClick={() => handleRemoveRoom(room)}
                              title="Hủy phòng này"
                            >
                              <RemoveIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveAllRooms(room)}
                              title="Hủy tất cả phòng giống nhau"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ textAlign: "right", mb: 3 }}>
                  <strong>Tổng tiền:</strong>{" "}
                  {calculateTotalAmount(ttdpData).toLocaleString()} VND
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleConfirmBooking}
                >
                  Xác nhận đặt phòng
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        <Dialog
          open={openSearchDialog}
          onClose={() => setOpenSearchDialog(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Tìm Loại Phòng Khả Dụng</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={3}>
                <DateTimePicker
                  label="Ngày Nhận Phòng"
                  value={searchForm.ngayNhanPhong}
                  minDateTime={dayjs()}
                  onChange={(newValue) =>
                    handleSearchInputChange("ngayNhanPhong", newValue)
                  }
                  ampm={false}
                  format="DD/MM/YYYY HH:mm"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!searchErrors.ngayNhanPhong,
                      helperText: searchErrors.ngayNhanPhong,
                      sx: {
                        "& .MuiInputBase-root": {
                          borderRadius: 1,
                          backgroundColor: "#f5f5f5",
                        },
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DateTimePicker
                  label="Ngày Trả Phòng"
                  value={searchForm.ngayTraPhong}
                  minDateTime={
                    searchForm.ngayNhanPhong
                      ? searchForm.ngayNhanPhong.add(1, "hour")
                      : dayjs().add(1, "hour")
                  }
                  onChange={(newValue) =>
                    handleSearchInputChange("ngayTraPhong", newValue)
                  }
                  ampm={false}
                  format="DD/MM/YYYY HH:mm"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!searchErrors.ngayTraPhong,
                      helperText: searchErrors.ngayTraPhong,
                      sx: {
                        "& .MuiInputBase-root": {
                          borderRadius: 1,
                          backgroundColor: "#f5f5f5",
                        },
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Số Phòng"
                  type="number"
                  value={searchForm.soPhong}
                  onChange={(e) =>
                    handleSearchInputChange("soPhong", e.target.value)
                  }
                  error={!!searchErrors.soPhong}
                  helperText={searchErrors.soPhong}
                  InputProps={{ inputProps: { min: 1 } }}
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: 1,
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Số Người"
                  type="number"
                  value={searchForm.soNguoi}
                  onChange={(e) =>
                    handleSearchInputChange("soNguoi", e.target.value)
                  }
                  error={!!searchErrors.soNguoi}
                  helperText={searchErrors.soNguoi}
                  InputProps={{ inputProps: { min: 1 } }}
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: 1,
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Số Trẻ Em"
                  type="number"
                  value={searchForm.soTre}
                  onChange={(e) =>
                    handleSearchInputChange("soTre", e.target.value)
                  }
                  error={!!searchErrors.soTre}
                  helperText={searchErrors.soTre}
                  InputProps={{ inputProps: { min: 0 } }}
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: 1,
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Loại Phòng</InputLabel>
                  <Select
                    value={searchForm.idLoaiPhong || ""}
                    onChange={(e) =>
                      handleSearchInputChange("idLoaiPhong", e.target.value)
                    }
                    label="Loại Phòng"
                    sx={{
                      "& .MuiInputBase-root": {
                        borderRadius: 1,
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    {loaiPhongs.map((lp) => (
                      <MenuItem key={lp.id} value={lp.id}>
                        {lp.tenLoaiPhong}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSearchRooms}
                  sx={{
                    borderRadius: 1,
                    bgcolor: "#1976d2",
                    "&:hover": { bgcolor: "#115293" },
                  }}
                >
                  Tìm Phòng
                </Button>
              </Grid>
            </Grid>

            {availableRooms.length > 0 && (
              <TableContainer sx={{ mt: 3, borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Loại Phòng</TableCell>
                      <TableCell>Diện tích (m²)</TableCell>
                      <TableCell>Người lớn</TableCell>
                      <TableCell>Trẻ em</TableCell>
                      <TableCell>Giá Mỗi Đêm (VND)</TableCell>
                      <TableCell>Số Phòng Khả Dụng</TableCell>
                      <TableCell>Hành Động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {availableRooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell>{room.tenLoaiPhong}</TableCell>
                        <TableCell>
                          {room.dienTich ? room.dienTich : "N/A"}
                        </TableCell>
                        <TableCell>
                          {room.soKhachTieuChuan
                            ? room.soKhachTieuChuan
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {room.treEmTieuChuan}
                        </TableCell>
                        <TableCell>{room.donGia.toLocaleString()}</TableCell>
                        <TableCell>{room.soPhongKhaDung}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleAddRoom(room)}
                            disabled={
                              room.soPhongKhaDung < Number(searchForm.soPhong)
                            }
                            sx={{ borderRadius: 1 }}
                          >
                            Thêm
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenSearchDialog(false)}
              color="secondary"
              sx={{ borderRadius: 1 }}
            >
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
    </Container>
  );
};

export default TaoDatPhong;