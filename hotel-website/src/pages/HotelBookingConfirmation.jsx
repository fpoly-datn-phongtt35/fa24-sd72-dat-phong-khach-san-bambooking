import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/HotelBookingConfirmation.css";
import {
  SuaKhachHangDatPhong,
  CapNhatDatPhong,
  getThongTinDatPhong,
  updateThongTinDatPhong,
  huyTTDP,
  XoaDatPhong,
  XoaKhachHangDatPhong,
  GuiEmailXacNhanDP,
  getLPKDR,
  addThongTinDatPhong,
  getLPKDRL,
  HuyDP,
} from "../services/DatPhong";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  createPaymentQR,
  checkPaymentStatus,
  cancelPayment,
} from "../services/Payment";
import Swal from "sweetalert2";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Ho_Chi_Minh");

const TIMEOUT_DURATION = 300; // 5 phút (300 giây)

const HotelBookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dialogRef = useRef(null);
  const { combination, datPhong, khachHang, thongTinDatPhong } =
    location.state || {};
  const [formData, setFormData] = useState({
    ho: khachHang?.ho || "",
    ten: khachHang?.ten || "",
    soDienThoai: khachHang?.sdt || "",
    email: khachHang?.email || "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showError, setShowError] = useState(false);
  const [ttdpData, setTtdpData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null); // Thời gian còn lại (giây)
  const currentHour = dayjs().tz("Asia/Ho_Chi_Minh").hour();
  const initNgayNhanPhong =
    currentHour >= 14
      ? dayjs()
          .tz("Asia/Ho_Chi_Minh")
          .add(1, "day")
          .set("hour", 14)
          .set("minute", 0)
          .set("second", 0)
      : dayjs()
          .tz("Asia/Ho_Chi_Minh")
          .set("hour", 14)
          .set("minute", 0)
          .set("second", 0);
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
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [orderCodePayment, setOrderCodePayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Đặt cọc");

  const groupAndNumberRooms = (rooms) => {
    const grouped = {};
    rooms.forEach((room) => {
      const key = `${room.loaiPhong.id}-${room.ngayNhanPhong}-${room.ngayTraPhong}-${room.giaDat}`;
      if (!grouped[key]) grouped[key] = [];
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

  const fetchThongTinDatPhongById = async (datPhongId) => {
    try {
      const response = await getThongTinDatPhong(datPhongId);
      const numberedRooms = groupAndNumberRooms(response.data);
      setTtdpData(numberedRooms);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Lỗi khi lấy thông tin đặt phòng",
        confirmButtonText: "Đóng",
      });
    }
  };

  const cancelBooking = async () => {
    if (!datPhong?.id) {
      navigate("/information");
      return;
    }

    try {
      await HuyDP(datPhong.id);
      Swal.fire({
        icon: "info",
        title: "Thông báo",
        text: "Đặt phòng đã bị hủy.",
        confirmButtonText: "Đóng",
      }).then(() => {
        navigate("/information");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Lỗi khi hủy đặt phòng. Vui lòng thử lại.",
        confirmButtonText: "Đóng",
      }).then(() => {
        navigate("/information");
      });
    }
  };

  const handleRemoveRoom = async (room) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn xóa phòng này không?",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await huyTTDP(room.maThongTinDatPhong);
        const updatedResponse = await getThongTinDatPhong(datPhong.id);
        const numberedRooms = groupAndNumberRooms(updatedResponse.data);
        setTtdpData(numberedRooms);
      } catch (error) {
        console.error("Lỗi khi xóa phòng:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra khi xóa phòng. Vui lòng thử lại.",
          confirmButtonText: "Đóng",
        });
      }
    }
  };

  // Logic timeout 5 phút
  useEffect(() => {
    if (!datPhong?.ngayDat) return;

    const calculateTimeLeft = () => {
      const ngayDat = dayjs.tz(datPhong.ngayDat, "Asia/Ho_Chi_Minh");
      const now = dayjs().tz("Asia/Ho_Chi_Minh");
      const diffSeconds = now.diff(ngayDat, "second");
      const remaining = TIMEOUT_DURATION - diffSeconds;
      return remaining > 0 ? remaining : 0;
    };

    const initialTimeLeft = calculateTimeLeft();
    setTimeLeft(initialTimeLeft);

    if (initialTimeLeft <= 0) {
      cancelBooking();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          cancelBooking();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [datPhong?.ngayDat]);

  // Dừng timeout khi thanh toán thành công hoặc hủy thanh toán
  useEffect(() => {
    if (openPaymentDialog && orderCodePayment) {
      const intervalId = setInterval(async () => {
        try {
          const status = await checkPaymentStatus(orderCodePayment);
          setPaymentStatus(status);
          if (status === "PAID") {
            clearInterval(intervalId);
            setOpenPaymentDialog(false);
            setTimeLeft(null); // Dừng bộ đếm thời gian
            await CapNhatDatPhong({
              id: datPhong.id,
              trangThai: "Đã xác nhận",
              khachHang: datPhong.khachHang,
              maDatPhong: datPhong.maDatPhong,
              soNguoi: datPhong.soNguoi,
              soTre: datPhong.soTre || 0,
              soPhong: datPhong.soPhong,
              ngayDat: datPhong.ngayDat,
              tongTien: datPhong.tongTien,
              ghiChu: datPhong.ghiChu,
            });
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Đặt phòng thành công!",
              confirmButtonText: "Tiếp tục",
            }).then(() => {
              Swal.fire({
                icon: "info",
                title: "Thông báo",
                text: "Có thể xác nhận đặt phòng qua email của bạn!",
                confirmButtonText: "Đóng",
              }).then(() => {
                navigate("/information");
              });
            });
          }
        } catch (error) {
          console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
        }
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [openPaymentDialog, orderCodePayment, navigate, datPhong]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderCodeFromUrl = queryParams.get("orderCode");
    const cancelled = queryParams.get("cancelled");

    if (orderCodeFromUrl) {
      const checkStatus = async () => {
        try {
          const status = await checkPaymentStatus(orderCodeFromUrl);
          setPaymentStatus(status);
          if (status === "PAID") {
            setOpenPaymentDialog(false);
            setTimeLeft(null); // Dừng bộ đếm thời gian
            await CapNhatDatPhong({
              id: datPhong.id,
              trangThai: "Đã xác nhận",
              khachHang: datPhong.khachHang,
              maDatPhong: datPhong.maDatPhong,
              soNguoi: datPhong.soNguoi,
              soTre: datPhong.soTre || 0,
              soPhong: datPhong.soPhong,
              ngayDat: datPhong.ngayDat,
              tongTien: datPhong.tongTien,
              ghiChu: datPhong.ghiChu,
            });
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Thanh toán thành công! Đặt phòng của bạn đã được xác nhận.",
              confirmButtonText: "Đóng",
            }).then(() => {
              navigate("/information");
            });
          } else if (status === "CANCELLED" || cancelled === "true") {
            Swal.fire({
              icon: "info",
              title: "Thông báo",
              text: "Thanh toán đã bị hủy. Vui lòng chọn lại phương thức thanh toán hoặc cập nhật đặt chỗ.",
              confirmButtonText: "Đóng",
            });
            setOpenPaymentDialog(true);
          } else {
            Swal.fire({
              icon: "info",
              title: "Thông báo",
              text: `Thanh toán đang ở trạng thái: ${status}. Vui lòng kiểm tra lại.`,
              confirmButtonText: "Đóng",
            });
          }
        } catch (error) {
          console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Lỗi khi kiểm tra trạng thái thanh toán. Vui lòng thử lại.",
            confirmButtonText: "Đóng",
          });
        }
      };
      checkStatus();
    }
  }, [location.search, navigate, datPhong]);

  useEffect(() => {
    if (datPhong && datPhong.id) fetchThongTinDatPhongById(datPhong.id);
    else if (thongTinDatPhong) {
      const numberedRooms = groupAndNumberRooms(thongTinDatPhong);
      setTtdpData(numberedRooms);
    }
  }, [datPhong, thongTinDatPhong]);

  useEffect(() => {
    if (openSearchDialog) {
      const fetchLoaiPhongs = async () => {
        try {
          const n = dayjs(searchForm.ngayNhanPhong)
            .tz("Asia/Ho_Chi_Minh")
            .format("YYYY-MM-DD[T]HH:mm:ss.SSSZ");
          const t = dayjs(searchForm.ngayTraPhong)
            .tz("Asia/Ho_Chi_Minh")
            .format("YYYY-MM-DD[T]HH:mm:ss.SSSZ");
          const response = await getLPKDR(n, t);
          setLoaiPhongs(response.data);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách loại phòng:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Lỗi khi lấy danh sách loại phòng",
            confirmButtonText: "Đóng",
          });
        }
      };
      fetchLoaiPhongs();
    }
  }, [openSearchDialog, searchForm.ngayNhanPhong, searchForm.ngayTraPhong]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
    setShowError(false);
  };

  const handleSearchInputChange = (field, value) => {
    if (field === "soNguoi" || field === "soPhong") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setSearchForm({ ...searchForm, [field]: numericValue });
    } else setSearchForm({ ...searchForm, [field]: value });
    setSearchErrors({});
  };

  const calculateBookingDays = (ngayNhanPhong, ngayTraPhong) => {
    const start = dayjs.tz(ngayNhanPhong, "Asia/Ho_Chi_Minh");
    const end = dayjs.tz(ngayTraPhong, "Asia/Ho_Chi_Minh");
    const diffDays = end.diff(start, "day");
    return diffDays > 0 ? diffDays : 1;
  };

  const calculateTotalAmount = () => {
    return ttdpData.reduce((total, room) => {
      const days = calculateBookingDays(room.ngayNhanPhong, room.ngayTraPhong);
      return total + room.loaiPhong.donGia * days * room.soPhong;
    }, 0);
  };

  const handleSearchRooms = async () => {
    const errors = {};
    const today = dayjs().tz("Asia/Ho_Chi_Minh");

    const ngayNhanPhong = dayjs.tz(
      searchForm.ngayNhanPhong,
      "Asia/Ho_Chi_Minh"
    );
    const ngayTraPhong = dayjs.tz(searchForm.ngayTraPhong, "Asia/Ho_Chi_Minh");

    if (!searchForm.ngayNhanPhong || !ngayNhanPhong.isValid()) {
      errors.ngayNhanPhong = "Vui lòng chọn ngày nhận phòng hợp lệ";
    }

    if (!searchForm.ngayTraPhong || !ngayTraPhong.isValid()) {
      errors.ngayTraPhong = "Vui lòng chọn ngày trả phòng hợp lệ";
    }

    const soNguoi = Number(searchForm.soNguoi);
    if (!soNguoi || soNguoi < 0 || isNaN(soNguoi)) {
      errors.soNguoi = "Số người lớn phải là số nguyên dương";
    }

    const soTre = Number(searchForm.soTre);
    if (isNaN(soTre) || soTre < 0) {
      errors.soTre = "Số trẻ em không được âm";
    }

    const soPhong = Number(searchForm.soPhong);
    if (!soPhong || isNaN(soPhong) || soPhong < 1) {
      errors.soPhong = "Số phòng phải là số nguyên dương";
    }

    setSearchErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setIsSubmitting(true);
      const n = ngayNhanPhong.toISOString();
      const t = ngayTraPhong.toISOString();

      const response = await getLPKDRL(
        n,
        t,
        soNguoi,
        soTre,
        soPhong,
        searchForm.idLoaiPhong || null
      );

      if (!response.data || response.data.length === 0) {
        Swal.fire({
          icon: "info",
          title: "Thông báo",
          text: "Không có phòng khả dụng cho yêu cầu của bạn. Vui lòng thử lại với ngày hoặc số lượng khác.",
          confirmButtonText: "Đóng",
          target: dialogRef.current,
          backdrop: true,
        });
        setAvailableRooms([]);
      } else {
        setAvailableRooms(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm phòng khả dụng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Lỗi khi tìm kiếm phòng. Vui lòng thử lại.",
        confirmButtonText: "Đóng",
        target: dialogRef.current,
        backdrop: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddRoom = async (room) => {
    const soPhong = Number(searchForm.soPhong);
    if (room.soPhongKhaDung < soPhong) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Số phòng khả dụng không đủ!",
        confirmButtonText: "Đóng",
      });
      return;
    }

    try {
      const soNguoi = Number(searchForm.soNguoi);
      const soTre = Number(searchForm.soTre);

      if (isNaN(soNguoi) || soNguoi < 1) {
        throw new Error("Số người lớn không hợp lệ");
      }
      if (isNaN(soTre) || soTre < 0) {
        throw new Error("Số trẻ em không hợp lệ");
      }

      const addedRooms = [];
      for (let i = 0; i < soPhong; i++) {
        const newRoom = {
          datPhong: datPhong,
          idLoaiPhong: room.id,
          maThongTinDatPhong: `TDP-${Date.now()}-${room.id}-${i}`,
          ngayNhanPhong: dayjs(searchForm.ngayNhanPhong)
            .tz("Asia/Ho_Chi_Minh")
            .set("hour", 14)
            .set("minute", 0)
            .format("YYYY-MM-DDTHH:mm"),
          ngayTraPhong: dayjs(searchForm.ngayTraPhong)
            .tz("Asia/Ho_Chi_Minh")
            .set("hour", 12)
            .set("minute", 0)
            .format("YYYY-MM-DDTHH:mm"),
          soNguoi: soNguoi,
          soTre: soTre,
          giaDat: room.donGia,
          trangThai: "Đang đặt phòng",
        };
        const response = await addThongTinDatPhong(newRoom);
        if (!response?.data) {
          throw new Error(
            `Không thể thêm thông tin đặt phòng: ${newRoom.maThongTinDatPhong}`
          );
        }
        addedRooms.push(response.data);
      }

      const updatedResponse = await getThongTinDatPhong(datPhong.id);
      const numberedRooms = groupAndNumberRooms(updatedResponse.data);
      setTtdpData(numberedRooms);

      const newTotalPrice = calculateTotalAmount();
      await CapNhatDatPhong({
        id: datPhong.id,
        khachHang: datPhong.khachHang,
        maDatPhong: datPhong.maDatPhong,
        soNguoi: numberedRooms.reduce(
          (total, room) => total + room.soNguoi * room.soPhong,
          0
        ),
        soTre: numberedRooms.reduce(
          (total, room) => total + (room.soTre || 0) * room.soPhong,
          0
        ),
        soPhong: numberedRooms.reduce((total, room) => total + room.soPhong, 0),
        ngayDat: datPhong.ngayDat,
        tongTien: newTotalPrice,
        ghiChu: datPhong.ghiChu,
        trangThai: "Chưa xác nhận",
      });

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

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Thêm phòng thành công!",
        confirmButtonText: "Đóng",
      });
    } catch (error) {
      console.error("Lỗi khi thêm phòng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Có lỗi xảy ra khi thêm phòng: ${error.message}`,
        confirmButtonText: "Đóng",
      });
    }
  };

  const handleCancelPayment = async (orderCode) => {
    if (!orderCode) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không tìm thấy mã thanh toán. Vui lòng thử lại.",
        confirmButtonText: "Đóng",
      });
      return;
    }
    const confirmCancel = await Swal.fire({
      icon: "warning",
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn hủy thanh toán?",
      showCancelButton: true,
      confirmButtonText: "Hủy",
      cancelButtonText: "Không",
    });
    if (!confirmCancel.isConfirmed) return;
    try {
      await cancelPayment(orderCode);
      const status = await checkPaymentStatus(orderCode);
      setPaymentStatus(status);
      if (status === "CANCELLED") {
        Swal.fire({
          icon: "info",
          title: "Thông báo",
          text: "Thanh toán đã bị hủy. Vui lòng chọn lại phương thức thanh toán hoặc cập nhật đặt phòng.",
          confirmButtonText: "Đóng",
        });
        setOpenPaymentDialog(false);
        setTimeLeft(null); // Dừng bộ đếm thời gian
        localStorage.removeItem(`orderCode_${orderCode}`);
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: `Hủy thanh toán không thành công. Trạng thái: ${status}`,
          confirmButtonText: "Đóng",
        });
      }
    } catch (error) {
      console.error("Lỗi khi hủy thanh toán:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Lỗi khi hủy thanh toán. Vui lòng thử lại.",
        confirmButtonText: "Đóng",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (ttdpData.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng chọn ít nhất một phòng trước khi xác nhận đặt phòng.",
        confirmButtonText: "Đóng",
      }).then(() => {
        navigate("/dat-phong");
      });
      setIsSubmitting(false);
      return;
    }

    const errors = {};
    if (!formData.ho.trim()) errors.ho = "Vui lòng nhập họ";
    if (!formData.ten.trim()) errors.ten = "Vui lòng nhập tên";
    if (!formData.email.trim()) errors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email không hợp lệ";
    if (!formData.soDienThoai.trim())
      errors.soDienThoai = "Vui lòng nhập số điện thoại";
    else if (!/^\d{10}$/.test(formData.soDienThoai))
      errors.soDienThoai = "Số điện thoại phải có 10 chữ số";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setShowError(true);
      setIsSubmitting(false);
      return;
    }

    setShowError(false);
    let khachHangResponse = null;
    let datPhongResponse = null;

    try {
      khachHangResponse = await SuaKhachHangDatPhong({
        id: khachHang ? khachHang.id : null,
        ho: formData.ho,
        ten: formData.ten,
        sdt: formData.soDienThoai,
        email: formData.email,
        trangThai: false,
      });
      if (!khachHangResponse || !khachHangResponse.data) throw new Error();

      datPhongResponse = await CapNhatDatPhong({
        id: datPhong?.id,
        khachHang: khachHangResponse.data,
        maDatPhong: datPhong?.maDatPhong || "",
        soNguoi: ttdpData.reduce(
          (total, room) => total + room.soNguoi * room.soPhong,
          0
        ),
        soTre: ttdpData.reduce(
          (total, room) => total + (room.soTre || 0) * room.soPhong,
          0
        ),
        soPhong: ttdpData.reduce((total, room) => total + room.soPhong, 0),
        ngayDat: datPhong?.ngayDat,
        tongTien: calculateTotalAmount(),
        ghiChu: "Ghi chú thêm nếu cần",
        trangThai: "Chưa xác nhận",
      });
      if (!datPhongResponse || !datPhongResponse.data) throw new Error();

      const updatedResponse = await getThongTinDatPhong(datPhong.id);
      const updatedThongTinDatPhong = updatedResponse.data;

      for (const room of updatedThongTinDatPhong) {
        await updateThongTinDatPhong({
          id: room.id,
          datPhong: room.datPhong,
          idLoaiPhong: room.loaiPhong.id,
          maThongTinDatPhong: room.maThongTinDatPhong,
          ngayNhanPhong: room.ngayNhanPhong,
          ngayTraPhong: room.ngayTraPhong,
          soNguoi: room.soNguoi,
          soTre: room.soTre || 0,
          giaDat: room.giaDat,
          trangThai: "Chưa xếp",
        });
      }

      await GuiEmailXacNhanDP(datPhong.id);
      if (orderCodePayment) {
        const status = await checkPaymentStatus(orderCodePayment);
        if (status === "PENDING") {
          Swal.fire({
            icon: "warning",
            title: "Cảnh báo",
            text: "Vui lòng hoàn tất hoặc hủy thanh toán trước khi tạo thanh toán mới!",
            confirmButtonText: "Đóng",
          });
          setIsSubmitting(false);
          return;
        }
      }

      const paymentRequest = {
        idDatPhong: datPhong.id,
        loaiThanhToan: paymentMethod,
        soTien:
          paymentMethod === "Đặt cọc"
            ? calculateTotalAmount() * 0.3
            : calculateTotalAmount(),
      };

      const paymentResponse = await createPaymentQR(paymentRequest);
      if (!paymentResponse.checkoutUrl) {
        throw new Error("Không nhận được URL thanh toán từ server.");
      }

      setCheckoutUrl(paymentResponse.checkoutUrl);
      setOrderCodePayment(paymentResponse.orderCodePayment);
      localStorage.setItem(
        `orderCode_${paymentResponse.orderCodePayment}`,
        paymentResponse.orderCodePayment
      );
      setOpenPaymentDialog(true);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Lỗi khi xác nhận đặt phòng:", error);
      setIsSubmitting(false);
      if (datPhongResponse?.data) await XoaDatPhong(datPhongResponse.data.id);
      if (khachHangResponse?.data)
        await XoaKhachHangDatPhong(khachHangResponse.data);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi xác nhận đặt phòng, vui lòng thử lại.",
        confirmButtonText: "Đóng",
      });
    }
  };

  const formatDateTime = (dateTimeValue) => {
    return dayjs
      .tz(dateTimeValue, "Asia/Ho_Chi_Minh")
      .format("DD/MM/YYYY HH:mm");
  };

  const formatTimeLeft = (seconds) => {
    if (seconds === null) return "";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" className="confirmation-container">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
        >
          <Typography variant="h4" className="confirmation-title">
            Xác Nhận Đặt Phòng
          </Typography>
          <Typography variant="body1" className="confirmation-subtitle">
            Vui lòng kiểm tra thông tin và cập nhật chi tiết khách hàng
          </Typography>
          {timeLeft !== null && timeLeft > 0 && (
            <Typography
              variant="h6"
              color="error"
              sx={{ mt: 1, fontSize: "1.8rem", fontWeight: "medium" }}
            >
              ⏳ {formatTimeLeft(timeLeft)} còn lại để xác nhận
            </Typography>
          )}
        </Box>

        <Card className="confirmation-card">
          <CardContent>
            <Typography variant="h5" className="section-title">
              Thông Tin Đặt Phòng
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" className="info-text">
                  <strong>Mã đặt phòng:</strong> {datPhong?.maDatPhong}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" className="info-text">
                  <strong>Tổng chi phí:</strong>{" "}
                  {calculateTotalAmount().toLocaleString()} VND
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" className="info-text">
                  <strong>Tổng số phòng:</strong>{" "}
                  {ttdpData.reduce((sum, item) => sum + item.soPhong, 0)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" className="info-text">
                  <strong>Số tiền cần thanh toán:</strong>{" "}
                  {(paymentMethod === "Đặt cọc"
                    ? calculateTotalAmount() * 0.3
                    : calculateTotalAmount()
                  ).toLocaleString()}{" "}
                  VND
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" className="info-text">
                  <strong>Ngày đặt:</strong> {formatDateTime(datPhong?.ngayDat)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenSearchDialog(true)}
                  className="add-room-button"
                >
                  Thêm Phòng
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Phương thức thanh toán</InputLabel>
                  <Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    label="Phương thức thanh toán"
                  >
                    <MenuItem value="Đặt cọc">Đặt cọc (30%)</MenuItem>
                    <MenuItem value="Thanh toán toàn bộ">
                      Thanh toán toàn bộ
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Typography variant="h6" className="section-title" sx={{ mt: 3 }}>
              Danh Sách Phòng Đặt
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Loại Phòng</TableCell>
                    <TableCell>Ngày Nhận Phòng</TableCell>
                    <TableCell>Ngày Trả Phòng</TableCell>
                    <TableCell>Số Người</TableCell>
                    <TableCell>Số Trẻ Em</TableCell>
                    <TableCell>Đơn Giá</TableCell>
                    <TableCell>Số Phòng</TableCell>
                    <TableCell>Thành Tiền</TableCell>
                    <TableCell>Hành Động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ttdpData.map((room, index) => (
                    <TableRow key={index}>
                      <TableCell>{room.loaiPhong.tenLoaiPhong}</TableCell>
                      <TableCell>
                        {formatDateTime(room.ngayNhanPhong)}
                      </TableCell>
                      <TableCell>{formatDateTime(room.ngayTraPhong)}</TableCell>
                      <TableCell>{room.soNguoi}</TableCell>
                      <TableCell>{room.soTre || 0}</TableCell>
                      <TableCell>{room.giaDat.toLocaleString()} VND</TableCell>
                      <TableCell>{room.soPhong}</TableCell>
                      <TableCell>
                        {(
                          room.giaDat *
                          room.soPhong *
                          calculateBookingDays(
                            room.ngayNhanPhong,
                            room.ngayTraPhong
                          )
                        ).toLocaleString()}{" "}
                        VND
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveRoom(room)}
                          disabled={isSubmitting}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" className="section-title" sx={{ mt: 3 }}>
              Thông Tin Khách Hàng
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Họ"
                    name="ho"
                    value={formData.ho}
                    onChange={handleInputChange}
                    fullWidth
                    error={showError && !!formErrors.ho}
                    helperText={showError && formErrors.ho}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Tên"
                    name="ten"
                    value={formData.ten}
                    onChange={handleInputChange}
                    fullWidth
                    error={showError && !!formErrors.ten}
                    helperText={showError && formErrors.ten}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Số điện thoại"
                    name="soDienThoai"
                    value={formData.soDienThoai}
                    onChange={handleInputChange}
                    fullWidth
                    error={showError && !!formErrors.soDienThoai}
                    helperText={showError && formErrors.soDienThoai}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    fullWidth
                    error={showError && !!formErrors.email}
                    helperText={showError && formErrors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                  >
                    {isSubmitting ? "Đang xử lý..." : "Xác Nhận Đặt Phòng"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>

        <Dialog
          open={openSearchDialog}
          onClose={() => setOpenSearchDialog(false)}
          maxWidth="md"
          fullWidth
          ref={dialogRef}
        >
          <DialogTitle>Tìm Kiếm Phòng Khả Dụng</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Ngày nhận phòng"
                  value={searchForm.ngayNhanPhong}
                  minDateTime={dayjs()
                    .tz("Asia/Ho_Chi_Minh")
                    .set("hour", 14)
                    .set("minute", 0)}
                  onChange={(value) =>
                    handleSearchInputChange(
                      "ngayNhanPhong",
                      value
                        ? dayjs(value)
                            .tz("Asia/Ho_Chi_Minh")
                            .set("hour", 14)
                            .set("minute", 0)
                        : null
                    )
                  }
                  ampm={false}
                  format="DD/MM/YYYY HH:mm"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!searchErrors.ngayNhanPhong,
                      helperText: searchErrors.ngayNhanPhong,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Ngày trả phòng"
                  value={searchForm.ngayTraPhong}
                  minDateTime={
                    searchForm.ngayNhanPhong
                      ? dayjs(searchForm.ngayNhanPhong)
                          .tz("Asia/Ho_Chi_Minh")
                          .add(1, "hour")
                      : dayjs().tz("Asia/Ho_Chi_Minh").add(1, "hour")
                  }
                  onChange={(value) =>
                    handleSearchInputChange(
                      "ngayTraPhong",
                      value
                        ? dayjs(value)
                            .tz("Asia/Ho_Chi_Minh")
                            .set("hour", 12)
                            .set("minute", 0)
                        : null
                    )
                  }
                  ampm={false}
                  format="DD/MM/YYYY HH:mm"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!searchErrors.ngayTraPhong,
                      helperText: searchErrors.ngayTraPhong,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Số người lớn"
                  value={searchForm.soNguoi}
                  onChange={(e) =>
                    handleSearchInputChange("soNguoi", e.target.value)
                  }
                  fullWidth
                  error={!!searchErrors.soNguoi}
                  helperText={searchErrors.soNguoi}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Số trẻ em"
                  value={searchForm.soTre}
                  onChange={(e) =>
                    handleSearchInputChange("soTre", e.target.value)
                  }
                  fullWidth
                  error={!!searchErrors.soTre}
                  helperText={searchErrors.soTre}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Số phòng"
                  value={searchForm.soPhong}
                  onChange={(e) =>
                    handleSearchInputChange("soPhong", e.target.value)
                  }
                  fullWidth
                  error={!!searchErrors.soPhong}
                  helperText={searchErrors.soPhong}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Loại phòng</InputLabel>
                  <Select
                    value={searchForm.idLoaiPhong || ""}
                    onChange={(e) =>
                      handleSearchInputChange(
                        "idLoaiPhong",
                        e.target.value || null
                      )
                    }
                    label="Loại phòng"
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
                  onClick={handleSearchRooms}
                  disabled={isSubmitting}
                  fullWidth
                >
                  Tìm kiếm
                </Button>
              </Grid>
            </Grid>

            {availableRooms.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Phòng Khả Dụng</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Loại Phòng</TableCell>
                        <TableCell>Số Phòng Khả Dụng</TableCell>
                        <TableCell>Đơn Giá</TableCell>
                        <TableCell>Hành Động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {availableRooms.map((room) => (
                        <TableRow key={room.id}>
                          <TableCell>{room.tenLoaiPhong}</TableCell>
                          <TableCell>{room.soPhongKhaDung}</TableCell>
                          <TableCell>
                            {room.donGia.toLocaleString()} VND
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => handleAddRoom(room)}
                              disabled={isSubmitting}
                            >
                              Thêm
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSearchDialog(false)}>Đóng</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openPaymentDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Thanh Toán Đặt Phòng</DialogTitle>
          <DialogContent>
            {checkoutUrl ? (
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant="body1" gutterBottom>
                  Vui lòng quét mã QR để thanh toán{" "}
                  {(paymentMethod === "Đặt cọc"
                    ? calculateTotalAmount() * 0.3
                    : calculateTotalAmount()
                  ).toLocaleString()}{" "}
                  VND
                </Typography>
                <img
                  src={checkoutUrl}
                  alt="QR Code"
                  style={{ maxWidth: "100%" }}
                />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 2 }}
                >
                  Trạng thái thanh toán: {paymentStatus || "Đang chờ"}
                </Typography>
              </Box>
            ) : (
              <Typography>Đang tạo mã thanh toán...</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleCancelPayment(orderCodePayment)}
              color="error"
              disabled={!orderCodePayment}
            >
              Hủy Thanh Toán
            </Button>
            <Button onClick={() => setOpenPaymentDialog(false)}>Đóng</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default HotelBookingConfirmation;