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
const HotelBookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dialogRef = useRef(null);
  const { combination, datPhong, khachHang, thongTinDatPhong } =
    location.state ||
    JSON.parse(
      localStorage.getItem(`booking_data_${datPhong?.id || Date.now()}`)
    ) ||
    {};

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
  const [timeLeft, setTimeLeft] = useState(300);
  const timeoutRef = useRef(null);
  const timerRef = useRef(null);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
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
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [orderCodePayment, setOrderCodePayment] = useState(null);

  const TIMEOUT_DURATION = 300000; // 5 phút
  const STORAGE_KEY = `booking_timeout_${datPhong?.id || Date.now()}`;
  const DATA_STORAGE_KEY = `booking_data_${datPhong?.id || Date.now()}`;

  const [paymentMethod, setPaymentMethod] = useState("Đặt cọc");

  const groupAndNumberRooms = (rooms) => {
    const grouped = {};
    rooms.forEach((room) => {
      const key = `${room.loaiPhong.id}-${room.ngayNhanPhong}-${room.ngayTraPhong}`;
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
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(DATA_STORAGE_KEY);
      return;
    }

    try {
      await HuyDP(datPhong.id);




      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(DATA_STORAGE_KEY);
      Swal.fire({
        icon: "info",
        title: "Thông báo",
        text: "Đã hết thời gian xác nhận. Đặt phòng đã bị hủy.",
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

  const initializeTimeout = () => {
    if (!datPhong?.id) {
      setTimeLeft(300);
      return () => {};
    }

    const storedData = localStorage.getItem(STORAGE_KEY);
    let startTime;
    let remainingTime;

    if (storedData) {
      startTime = parseInt(storedData, 10);
      const elapsedTime = Date.now() - startTime;
      remainingTime = Math.max(
        0,
        Math.floor((TIMEOUT_DURATION - elapsedTime) / 1000)
      );
    } else {
      startTime = Date.now();
      localStorage.setItem(STORAGE_KEY, startTime.toString());
      remainingTime = 300;
    }

    if (remainingTime <= 0) {
      cancelBooking();
      return () => {};
    }

    setTimeLeft(remainingTime);

    timeoutRef.current = setTimeout(
      () => cancelBooking(),
      remainingTime * 1000
    );

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) =>
        prev <= 1 ? (clearInterval(timerRef.current), 0) : prev - 1
      );
    }, 1000);

    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(timerRef.current);
    };
  };

  const saveBookingData = () => {
    if (combination && datPhong && khachHang && thongTinDatPhong) {
      localStorage.setItem(
        DATA_STORAGE_KEY,
        JSON.stringify({ combination, datPhong, khachHang, thongTinDatPhong })
      );
    }
  };

  useEffect(() => {
    // Lưu dữ liệu ngay khi component mount nếu có location.state
    if (location.state) {
      saveBookingData();
    }
  }, []); // Chạy một lần khi component mount

  useEffect(() => {
    // Lưu dữ liệu mỗi khi combination, datPhong, khachHang, hoặc thongTinDatPhong thay đổi
    saveBookingData();
  }, [combination, datPhong, khachHang, thongTinDatPhong]);

  useEffect(() => {
    if (openPaymentDialog && orderCodePayment) {
      const intervalId = setInterval(async () => {
        try {
          const status = await checkPaymentStatus(orderCodePayment);
          setPaymentStatus(status);
          if (status === "PAID") {
            clearInterval(intervalId);
            setOpenPaymentDialog(false);
            clearTimeout(timeoutRef.current);
            clearInterval(timerRef.current);
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(`orderCode_${orderCodePayment}`);
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
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(DATA_STORAGE_KEY);
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
          console.log(
            "Checking payment status for orderCode:",
            orderCodeFromUrl
          );
          const status = await checkPaymentStatus(orderCodeFromUrl);
          setPaymentStatus(status);
          if (status === "PAID") {
            setOpenPaymentDialog(false);
            clearTimeout(timeoutRef.current);
            clearInterval(timerRef.current);
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(`orderCode_${orderCodeFromUrl}`);
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
            alert("Thanh toán thành công! Đặt phòng của bạn đã được xác nhận.");
            navigate("/information");
          } else if (status === "CANCELLED" || cancelled === "true") {
            alert(
              "Thanh toán đã bị hủy. Vui lòng chọn lại phương thức thanh toán hoặc cập nhật đặt phòng."
            );
            setOpenPaymentDialog(true);
          } else {
            alert(
              `Thanh toán đang ở trạng thái: ${status}. Vui lòng kiểm tra lại.`
            );
          }
        } catch (error) {
          console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
          alert("Lỗi khi kiểm tra trạng thái thanh toán. Vui lòng thử lại.");
        }
      };
      checkStatus();
    }
  }, [location.search, navigate, datPhong]);

  useEffect(() => {
    if (datPhong && thongTinDatPhong) return initializeTimeout();
  }, [datPhong, thongTinDatPhong]);

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
          const n = dayjs(searchForm.ngayNhanPhong).format(
            "YYYY-MM-DD[T]HH:mm:ss.SSSZ"
          );
          const t = dayjs(searchForm.ngayTraPhong).format(
            "YYYY-MM-DD[T]HH:mm:ss.SSSZ"
          );
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

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveBookingData();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [combination, datPhong, khachHang, thongTinDatPhong]);

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
    const start = dayjs(ngayNhanPhong);
    const end = dayjs(ngayTraPhong);
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
    const today = dayjs();

    // Chuyển đổi chuỗi ngày thành đối tượng dayjs
    const ngayNhanPhong = dayjs(searchForm.ngayNhanPhong);
    const ngayTraPhong = dayjs(searchForm.ngayTraPhong);

    // Kiểm tra ngày nhận phòng
    if (!searchForm.ngayNhanPhong || !ngayNhanPhong.isValid()) {
      errors.ngayNhanPhong = "Vui lòng chọn ngày nhận phòng hợp lệ";
    }

    // Kiểm tra ngày trả phòng
    if (!searchForm.ngayTraPhong || !ngayTraPhong.isValid()) {
      errors.ngayTraPhong = "Vui lòng chọn ngày trả phòng hợp lệ";
    }

    // Kiểm tra số người
    const soNguoi = Number(searchForm.soNguoi);
    if (!soNguoi || soNguoi < 0 || isNaN(soNguoi)) {
      errors.soNguoi = "Số người lớn phải là số nguyên dương";
    }

    // Kiểm tra số trẻ em
    const soTre = Number(searchForm.soTre);
    if (isNaN(soTre) || soTre < 0) {
      errors.soTre = "Số trẻ em không được âm";
    }

    // Kiểm tra số phòng
    const soPhong = Number(searchForm.soPhong);
    if (!soPhong || isNaN(soPhong) || soPhong < 1) {
      errors.soPhong = "Số phòng phải là số nguyên dương";
    }

    setSearchErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setIsSubmitting(true);
      const n = searchForm.ngayNhanPhong.toISOString();
      const t = searchForm.ngayTraPhong.toISOString();

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
          target: dialogRef.current, // Gắn vào dialog
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
        target: dialogRef.current, // Gắn vào dialog
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
            .set("hour", 14)
            .set("minute", 0)
            .format("YYYY-MM-DDTHH:mm:ss"),
          ngayTraPhong: dayjs(searchForm.ngayTraPhong)
            .set("hour", 12)
            .set("minute", 0)
            .format("YYYY-MM-DDTHH:mm:ss"),
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

      // Lấy danh sách thông tin đặt phòng mới
      const updatedResponse = await getThongTinDatPhong(datPhong.id);
      const numberedRooms = groupAndNumberRooms(updatedResponse.data);
      setTtdpData(numberedRooms);

      // Cập nhật thông tin đặt phòng
      const newTotalPrice = calculateTotalAmount();
      const updatedDatPhong = {
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
      };
      datPhong = await CapNhatDatPhong(updatedDatPhong);

      // Reset form tìm kiếm
      setOpenSearchDialog(false);
      setAvailableRooms([]);
      setSearchForm({
        ngayNhanPhong: dayjs(),
        ngayTraPhong: dayjs().add(1, "day"),
        soNguoi: 1,
        soTre: 0,
        soPhong: 1,
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
      alert("Không tìm thấy mã thanh toán. Vui lòng thử lại.");
      return;
    }
    const confirmCancel = window.confirm(
      "Bạn có chắc chắn muốn hủy thanh toán?"
    );
    if (!confirmCancel) return;
    try {
      await cancelPayment(orderCode);
      const status = await checkPaymentStatus(orderCode);
      setPaymentStatus(status);
      if (status === "CANCELLED") {
        alert(
          "Thanh toán đã bị hủy. Vui lòng chọn lại phương thức thanh toán hoặc cập nhật đặt phòng."
        );
        setOpenPaymentDialog(false);
        localStorage.removeItem(`orderCode_${orderCode}`);
      } else {
        alert(`Hủy thanh toán không thành công. Trạng thái: ${status}`);
      }
    } catch (error) {
      console.error("Lỗi khi hủy thanh toán:", error);
      alert("Lỗi khi hủy thanh toán. Vui lòng thử lại.");
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
          giaDat: room.giaDat,
          trangThai: "Chưa xếp",
        });
      }

      await GuiEmailXacNhanDP(datPhong.id);
      if (orderCodePayment) {
        const status = await checkPaymentStatus(orderCodePayment);
        if (status === "PENDING") {
          alert(
            "Vui lòng hoàn tất hoặc hủy thanh toán trước khi tạo thanh toán mới!"
          );
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
      console.log("Payment request:", paymentRequest);

      const paymentResponse = await createPaymentQR(paymentRequest);
      console.log("Payment response:", paymentResponse);

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

  const formatTimeLeft = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const formatDateTime = (dateTimeValue) => {
    return dayjs(dateTimeValue).format("DD/MM/YYYY");
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
          {datPhong?.id && (
            <Typography variant="h5" className="countdown-timer">
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
                  <strong>Mã đặt phòng:</strong> {datPhong.maDatPhong}
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
                  {ttdpData.reduce((total, room) => total + room.soPhong, 0)}
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
                  <strong>Ngày đặt:</strong>{" "}
                  {dayjs(datPhong.ngayDat).format("DD/MM/YYYY HH:mm")}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" className="info-text">
                  <strong>Ngày đặt:</strong> {formatDateTime(datPhong.ngayDat)}
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
                <FormControl
                  fullWidth
                  variant="outlined"
                  className="text-field"





















































































                >
                  <InputLabel>Phương thức thanh toán *</InputLabel>
                  <Select
                    label="Phương thức thanh toán *"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <MenuItem value="Đặt cọc">Đặt cọc (30%)</MenuItem>
                    <MenuItem value="Thanh toán trước">
                      Thanh toán trước (100%)
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>











            </Grid>
          </CardContent>
        </Card>

        <Card className="confirmation-card">
          <CardContent>
            <Typography variant="h5" className="section-title">
              Chi Tiết Phòng Đã Chọn
            </Typography>
            <TableContainer className="table-container">
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
                    <TableRow key={index} className="table-row">
                      <TableCell>{room.loaiPhong.tenLoaiPhong}</TableCell>
                      <TableCell>
                        {formatDateTime(room.ngayNhanPhong)}
                      </TableCell>
                      <TableCell>{formatDateTime(room.ngayTraPhong)}</TableCell>
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
                          color="error"
                          onClick={() => handleRemoveRoom(room)}
                          title="Hủy phòng này"
                        >
                          <RemoveIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Card className="confirmation-card">
          <CardContent>
            <Typography variant="h5" className="section-title">
              Thông Tin Khách Hàng





























            </Typography>
            {showError && (
              <Typography variant="body2" className="error-message">
                Vui lòng điền đầy đủ và đúng thông tin trước khi xác nhận.
              </Typography>
            )}
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Họ *"
                    name="ho"
                    value={formData.ho}
                    onChange={handleInputChange}
                    error={!!formErrors.ho}
                    helperText={formErrors.ho}
                    variant="outlined"
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tên *"
                    name="ten"
                    value={formData.ten}
                    onChange={handleInputChange}
                    error={!!formErrors.ten}
                    helperText={formErrors.ten}
                    variant="outlined"
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại *"
                    name="soDienThoai"
                    value={formData.soDienThoai}
                    onChange={handleInputChange}
                    error={!!formErrors.soDienThoai}
                    helperText={formErrors.soDienThoai}
                    variant="outlined"
                    inputProps={{ pattern: "[0-9]{10}" }}
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email *"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    variant="outlined"
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    className="confirm-button"
                  >
                    {isSubmitting ? "Đang xử lý..." : "Đặt phòng"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>

        <Dialog
          open={openSearchDialog}
          onClose={() => setOpenSearchDialog(false)}
          fullWidth
          maxWidth="md"
          className="search-dialog"
          ref={dialogRef}
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
                  disabled={isSubmitting}
                  sx={{
                    borderRadius: 1,
                    bgcolor: "#1976d2",
                    "&:hover": { bgcolor: "#115293" },
                  }}
                >
                  {isSubmitting ? "Đang tìm..." : "Tìm Phòng"}
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
                        <TableCell>{room.dienTich || "N/A"}</TableCell>
                        <TableCell>{room.soKhachTieuChuan || "N/A"}</TableCell>
                        <TableCell>{room.treEmTieuChuan || "0"}</TableCell>
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

        <Dialog
          open={openPaymentDialog}
          onClose={() => setOpenPaymentDialog(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Thanh Toán Đặt Phòng</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Vui lòng quét mã QR để{" "}
              {paymentMethod === "Đặt cọc" ? "đặt cọc" : "thanh toán"}:
            </Typography>
            {checkoutUrl ? (
              <iframe
                src={checkoutUrl}
                title="PayOS Payment"
                width="100%"
                height="400px"
                style={{ border: "none" }}
              />
            ) : (
              <Typography color="error">
                Không thể tải mã QR. Vui lòng thử lại.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleCancelPayment(orderCodePayment)}
              color="error"
            >
              Hủy Thanh Toán
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};
export default HotelBookingConfirmation;