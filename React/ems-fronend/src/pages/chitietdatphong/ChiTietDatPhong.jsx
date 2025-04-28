import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  IconButton,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Alert,
  Snackbar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  findTTDPByMaDatPhong,
  changeAllConditionRoom,
  huyTTDP,
  addThongTinDatPhong,
} from "../../services/TTDP";
import {
  findDatPhongByMaDatPhong,
  CapNhatDatPhong,
} from "../../services/DatPhong";
import { checkIn, phongDaXep } from "../../services/XepPhongService";
import {
  getLPKDRL,
  getLoaiPhongKhaDungResponse,
} from "../../services/LoaiPhongService";
import { ThemPhuThu } from "../../services/PhuThuService";
import XepPhong from "../xepphong/XepPhong";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import NotesIcon from "@mui/icons-material/Notes";
import HotelIcon from "@mui/icons-material/Hotel";
import InfoIcon from "@mui/icons-material/Info";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";

const ChiTietDatPhong = () => {
  const [datPhong, setDatPhong] = useState(null);
  const [thongTinDatPhong, setThongTinDatPhong] = useState([]);
  const [grTTDP, setGrTTDP] = useState([]);
  const [showXepPhongModal, setShowXepPhongModal] = useState(false);
  const [selectedTTDPs, setSelectedTTDPs] = useState([]);
  const [phongData, setPhongData] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isChangeButtonDisabled, setIsChangeButtonDisabled] = useState(false);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [searchForm, setSearchForm] = useState({
    ngayNhanPhong: dayjs().format("YYYY-MM-DD"),
    ngayTraPhong: dayjs().add(1, "day").format("YYYY-MM-DD"),
    soNguoi: 1,
    soPhong: 1,
    idLoaiPhong: null,
  });
  const [searchErrors, setSearchErrors] = useState({});
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loaiPhongs, setLoaiPhongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const { maDatPhong } = location.state || {};
  const navigate = useNavigate();

  const getDetailDatPhong = (maDatPhong) => {
    findDatPhongByMaDatPhong(maDatPhong)
      .then((response) => setDatPhong(response.data))
      .catch((error) => {
        console.error(error);
        showSnackbar("Không thể tải thông tin đặt phòng", "error");
      });

    findTTDPByMaDatPhong(maDatPhong)
      .then((response) => {
        if (response && Array.isArray(response.data)) {
          setThongTinDatPhong(response.data);
          grTTDPs(response.data);
        } else {
          setThongTinDatPhong([]);
          setGrTTDP([]);
          console.warn("Dữ liệu TTDP không phải mảng:", response?.data);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
        showSnackbar("Không thể tải chi tiết đặt phòng", "error");
        setThongTinDatPhong([]);
        setGrTTDP([]);
      });
  };

  const grTTDPs = (ttdps) => {
    const grouped = ttdps.reduce((acc, ttdp) => {
      if (ttdp.trangThai === "Đã xếp") {
        const key = `da_xep_${ttdp.id}`;
        acc[key] = {
          loaiPhong: ttdp.loaiPhong,
          soNguoi: ttdp.soNguoi,
          ngayNhanPhong: ttdp.ngayNhanPhong,
          ngayTraPhong: ttdp.ngayTraPhong,
          giaDat: ttdp.giaDat,
          trangThai: ttdp.trangThai,
          maThongTinDatPhong: ttdp.maThongTinDatPhong,
          id: ttdp.id,
          quantity: 1,
          originalTTDPs: [ttdp],
        };
      } else {
        const key = `${ttdp.loaiPhong.id}_${ttdp.ngayNhanPhong}_${ttdp.ngayTraPhong}`;
        if (!acc[key]) {
          acc[key] = {
            loaiPhong: ttdp.loaiPhong,
            soNguoi: ttdp.soNguoi,
            ngayNhanPhong: ttdp.ngayNhanPhong,
            ngayTraPhong: ttdp.ngayTraPhong,
            giaDat: ttdp.giaDat,
            trangThai: ttdp.trangThai,
            maThongTinDatPhong: ttdp.maThongTinDatPhong,
            id: ttdp.id,
            quantity: 0,
            originalTTDPs: [],
          };
        }
        acc[key].quantity += 1;
        acc[key].originalTTDPs.push(ttdp);
      }
      return acc;
    }, {});
    setGrTTDP(Object.values(grouped));
  };

  const fetchPhongDaXep = (maThongTinDatPhong) => {
    phongDaXep(maThongTinDatPhong)
      .then((response) => {
        setPhongData((prevData) => ({
          ...prevData,
          [maThongTinDatPhong]: response.data,
        }));
      })
      .catch((error) => console.error(error));
  };

  const openXepPhongModal = (ttdp) => {
    setSelectedTTDPs(ttdp.originalTTDPs);
    setShowXepPhongModal(true);
  };

  const closeXepPhongModal = () => {
    setShowXepPhongModal(false);
    setSelectedTTDPs([]);
    getDetailDatPhong(maDatPhong);
    thongTinDatPhong.forEach((ttdp) =>
      fetchPhongDaXep(ttdp.maThongTinDatPhong)
    );
  };

  const updateDatPhong = () => {
    if (!datPhong) return;
    CapNhatDatPhong(datPhong)
      .then(() => showSnackbar("Lưu thành công", "success"))
      .catch((error) => {
        console.error(error);
        showSnackbar("Không thể cập nhật đặt phòng", "error");
      });
  };

  const handleHuyTTDP = (ttdp) => {
    const confirmCancel = window.confirm(
      `Bạn có chắc chắn muốn hủy thông tin đặt phòng không?`
    );
    if (confirmCancel) {
      Promise.all(
        ttdp.originalTTDPs.map((item) => huyTTDP(item.maThongTinDatPhong))
      )
        .then(() => {
          showSnackbar("Hủy thành công", "success");
          getDetailDatPhong(maDatPhong);
          setSelectedTTDPs([]);
        })
        .catch((error) => {
          console.error(error);
          showSnackbar("Không thể hủy thông tin đặt phòng", "error");
        });
    }
  };

  const handleChangeAllConditionRoom = async () => {
    if (!datPhong?.id) {
      showSnackbar("Không tìm thấy đơn đặt phòng.", "error");
      return;
    }
    const confirm = window.confirm(
      "Bạn có chắc chắn muốn đổi tình trạng tất cả phòng sang 'Cần kiểm tra' không?"
    );
    if (!confirm) return;
    try {
      await changeAllConditionRoom(datPhong.id);
      showSnackbar("Đổi tình trạng cho toàn bộ phòng thành công!", "success");
      getDetailDatPhong(maDatPhong);
      thongTinDatPhong.forEach((ttdp) =>
        fetchPhongDaXep(ttdp.maThongTinDatPhong)
      );
    } catch (error) {
      showSnackbar(
        error.response?.data?.data ||
          "Có lỗi xảy ra khi cập nhật tình trạng phòng!",
        "error"
      );
    } finally {
      setIsChangeButtonDisabled(true);
    }
  };

  const handleSearchInputChange = (field, value) => {
    setSearchForm({ ...searchForm, [field]: value });
    setSearchErrors({});
  };

  const handleSearchRooms = async () => {
    const errors = {};
    const today = dayjs().format("YYYY-MM-DD");
    if (!searchForm.ngayNhanPhong)
      errors.ngayNhanPhong = "Vui lòng chọn ngày nhận phòng";
    else if (searchForm.ngayNhanPhong < today)
      errors.ngayNhanPhong = "Ngày nhận phòng không được trước ngày hiện tại";
    if (!searchForm.ngayTraPhong)
      errors.ngayTraPhong = "Vui lòng chọn ngày trả phòng";
    else if (
      dayjs(searchForm.ngayTraPhong).isBefore(
        dayjs(searchForm.ngayNhanPhong)
      ) ||
      dayjs(searchForm.ngayTraPhong).isSame(dayjs(searchForm.ngayNhanPhong))
    )
      errors.ngayTraPhong = "Ngày trả phòng phải sau ngày nhận phòng";
    if (searchForm.soNguoi < 1) errors.soNguoi = "Số người phải lớn hơn 0";
    if (searchForm.soPhong < 1) errors.soPhong = "Số phòng phải lớn hơn 0";

    setSearchErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const n = dayjs(searchForm.ngayNhanPhong).format("YYYY-MM-DD");
      const t = dayjs(searchForm.ngayTraPhong).format("YYYY-MM-DD");
      const response = await getLPKDRL(
        n,
        t,
        searchForm.soNguoi,
        searchForm.soPhong,
        searchForm.idLoaiPhong
      );
      if (response.data.length === 0) {
        showSnackbar(
          "Không có phòng khả dụng cho yêu cầu của bạn. Vui lòng thử lại với ngày hoặc số lượng khác.",
          "warning"
        );
      }
      setAvailableRooms(response.data);
    } catch (error) {
      console.error("Lỗi khi tìm phòng khả dụng:", error);
      showSnackbar("Có lỗi xảy ra khi tìm phòng. Vui lòng thử lại.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (room) => {
    if (room.soPhongKhaDung < searchForm.soPhong) {
      showSnackbar("Số phòng khả dụng không đủ!", "error");
      return;
    }

    try {
      if (!datPhong) {
        throw new Error("Không tồn tại đặt phòng");
      }

      const addedRooms = [];
      for (let i = 0; i < searchForm.soPhong; i++) {
        const newRoom = {
          datPhong: datPhong,
          idLoaiPhong: room.id,
          maThongTinDatPhong: `TDP-${Date.now()}-${room.id}-${i}`,
          ngayNhanPhong: searchForm.ngayNhanPhong,
          ngayTraPhong: searchForm.ngayTraPhong,
          soNguoi: room.soKhachToiDa,
          giaDat: room.donGia,
          trangThai: "Chưa xếp",
        };
        const response = await addThongTinDatPhong(newRoom);
        if (!response || !response.data) {
          throw new Error(
            `Không thể thêm thông tin đặt phòng: ${newRoom.maThongTinDatPhong}`
          );
        }
        addedRooms.push(response.data);
      }

      const allTTDPs = [...(thongTinDatPhong || []), ...addedRooms];
      const newTotalPrice = calculateTotalPrice(allTTDPs);

      const updatedDatPhong = {
        ...datPhong,
        soPhong: (datPhong.soPhong || 0) + searchForm.soPhong,
        tongTien: newTotalPrice,
      };
      await CapNhatDatPhong(updatedDatPhong);
      setDatPhong(updatedDatPhong);

      const updatedResponse = await findTTDPByMaDatPhong(maDatPhong);
      setThongTinDatPhong(updatedResponse.data || []);
      grTTDPs(updatedResponse.data || []);

      setOpenSearchDialog(false);
      setAvailableRooms([]);
      setSearchForm({
        ngayNhanPhong: dayjs().format("YYYY-MM-DD"),
        ngayTraPhong: dayjs().add(1, "day").format("YYYY-MM-DD"),
        soNguoi: 1,
        soPhong: 1,
        idLoaiPhong: null,
      });
      showSnackbar("Thêm phòng thành công!", "success");
    } catch (error) {
      console.error("Lỗi khi thêm phòng:", error);
      showSnackbar(`Có lỗi xảy ra khi thêm phòng: ${error.message}`, "error");
    }
  };

  useEffect(() => {
    if (openSearchDialog) {
      const fetchLoaiPhongs = async () => {
        try {
          const n = dayjs(searchForm.ngayNhanPhong).format("YYYY-MM-DD");
          const t = dayjs(searchForm.ngayTraPhong).format("YYYY-MM-DD");
          const response = await getLoaiPhongKhaDungResponse(n, t);
          setLoaiPhongs(response.data || []);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách loại phòng:", error);
          showSnackbar("Lỗi khi lấy danh sách loại phòng", "error");
        }
      };
      fetchLoaiPhongs();
    }
  }, [openSearchDialog, searchForm.ngayNhanPhong, searchForm.ngayTraPhong]);

  useEffect(() => {
    if (Array.isArray(thongTinDatPhong) && thongTinDatPhong.length > 0) {
      thongTinDatPhong.forEach((ttdp) => {
        if (ttdp.trangThai === "Đã xếp") {
          fetchPhongDaXep(ttdp.maThongTinDatPhong);
        }
      });
    }
  }, [thongTinDatPhong]);

  useEffect(() => {
    if (maDatPhong) {
      getDetailDatPhong(maDatPhong);
    }
  }, [maDatPhong]);

  const calculateTotalGuests = () =>
    Array.isArray(thongTinDatPhong)
      ? thongTinDatPhong.reduce((total, ttdp) => total + ttdp.soNguoi, 0)
      : 0;

  const calculateTotalPrice = (ttdps) => {
    if (!Array.isArray(ttdps)) return 0;
    return ttdps.reduce((total, ttdp) => {
      const days = Math.max(
        Math.ceil(
          (new Date(ttdp.ngayTraPhong) - new Date(ttdp.ngayNhanPhong)) /
            (1000 * 60 * 60 * 24)
        ),
        1
      );
      return total + ttdp.giaDat * days;
    }, 0);
  };

  const calculateSingleRoomPrice = (donGia, start, end, quantity) => {
    const days = Math.max(
      Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)),
      1
    );
    return donGia * days * quantity;
  };

  const handleCheckboxChange = (ttdp) => {
    setSelectedTTDPs((prevSelected) => {
      const allOriginalTTDPs = ttdp.originalTTDPs;
      const isSelected = allOriginalTTDPs.every((item) =>
        prevSelected.includes(item)
      );
      if (isSelected) {
        return prevSelected.filter((item) => !allOriginalTTDPs.includes(item));
      } else {
        return [...prevSelected, ...allOriginalTTDPs];
      }
    });
  };

  const handleTTDPClick = (maThongTinDatPhong) => {
    navigate("/chi-tiet-ttdp", { state: { maThongTinDatPhong } });
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const handleCheckin = async (ttdp) => {
    try {
      for (const item of ttdp.originalTTDPs) {
        let xepPhong = (await phongDaXep(item.maThongTinDatPhong)).data;
        if (!xepPhong) {
          showSnackbar("Không tìm thấy phòng đã xếp.", "error");
          continue;
        }

        const loaiPhong = xepPhong.phong.loaiPhong;
        const xepPhongRequest = {
          id: xepPhong.id,
          phong: xepPhong.phong,
          thongTinDatPhong: xepPhong.thongTinDatPhong,
          ngayNhanPhong: new Date(
            new Date(item.ngayNhanPhong).setHours(14, 0, 0, 0)
          ),
          ngayTraPhong: new Date(
            new Date(item.ngayTraPhong).setHours(12, 0, 0, 0)
          ),
          trangThai: "Đang ở",
        };

        await checkIn(xepPhongRequest);
        showSnackbar("Check-in thành công!", "success");

        if (item.soNguoi > loaiPhong.soKhachToiDa) {
          const soNguoiVuot = item.soNguoi - loaiPhong.soKhachToiDa;
          const tienPhuThuThem = soNguoiVuot * loaiPhong.donGiaPhuThu;
          const phuThuThemRequest = {
            xepPhong: { id: xepPhong.id },
            tenPhuThu: `Phụ thu do vượt số khách tối đa (${soNguoiVuot} người)`,
            tienPhuThu: tienPhuThuThem,
            soLuong: 1,
            trangThai: true,
          };
          await ThemPhuThu(phuThuThemRequest);
          showSnackbar(
            `Phụ thu do vượt số khách tối đa (${soNguoiVuot} người) đã được thêm.`,
            "success"
          );
        }
      }
    } catch (error) {
      let errorMessage = "Đã xảy ra lỗi khi thực hiện check-in.";
      if (error.response) {
        const { status, data } = error.response;
        errorMessage =
          status === 400
            ? data.message || "Dữ liệu không hợp lệ."
            : status === 404
            ? "Không tìm thấy thông tin cần thiết."
            : status === 500
            ? "Lỗi server."
            : data.message || `Lỗi không xác định (status: ${status}).`;
      } else if (error.request) {
        errorMessage = "Không thể kết nối đến server.";
      }
      showSnackbar(errorMessage, "error");
    }
    getDetailDatPhong(maDatPhong);
    ttdp.originalTTDPs.forEach((item) =>
      fetchPhongDaXep(item.maThongTinDatPhong)
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Đang ở":
        return "success";
      case "Đã xếp":
        return "info";
      case "Đã hủy":
        return "error";
      case "Chưa xếp":
        return "warning";
      case "Đang đặt phòng":
        return "info";
      default:
        return "default";
    }
  };

  const isDangDatPhong = Array.isArray(thongTinDatPhong)
    ? thongTinDatPhong.some((ttdp) => ttdp.trangThai === "Đang đặt phòng")
    : false;

  const hasDangO = Array.isArray(thongTinDatPhong)
    ? thongTinDatPhong.some((ttdp) => ttdp.trangThai === "Đang ở")
    : false;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <AssignmentIcon sx={{ fontSize: 32, color: "primary.main", mr: 2 }} />
        <Typography variant="h4" color="primary" sx={{ fontWeight: "bold" }}>
          Chi Tiết Đặt Phòng
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary">
                  Thông tin khách hàng
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography sx={{ fontWeight: "medium", mr: 1 }}>
                  Họ tên:
                </Typography>
                <Typography>
                  {datPhong?.khachHang?.ho} {datPhong?.khachHang?.ten || "N/A"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <EmailIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "text.secondary" }}
                />
                <Typography>{datPhong?.khachHang?.email || "N/A"}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PhoneIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "text.secondary" }}
                />
                <Typography>{datPhong?.khachHang?.sdt || "N/A"}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CalendarMonthIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary">
                  Thông tin đặt phòng
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography sx={{ fontWeight: "medium", mr: 1 }}>
                  Ngày đặt:
                </Typography>
                <Typography>
                  {datPhong?.ngayDat ? formatDate(datPhong.ngayDat) : "N/A"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography sx={{ fontWeight: "medium", mr: 1 }}>
                  Số phòng:
                </Typography>
                <Typography>
                  {Array.isArray(thongTinDatPhong)
                    ? thongTinDatPhong.length
                    : 0}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography sx={{ fontWeight: "medium", mr: 1 }}>
                  Số người:
                </Typography>
                <Typography>{datPhong?.soNguoi}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ fontWeight: "medium", mr: 1 }}>
                  Tổng tiền:
                </Typography>
                <Typography sx={{ fontWeight: "bold", color: "success.main" }}>
                  {datPhong?.tongTien?.toLocaleString() || "0"} VNĐ
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <NotesIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary">
                  Ghi chú
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Nhập ghi chú ở đây..."
                value={datPhong?.ghiChu || ""}
                onChange={(e) =>
                  setDatPhong({ ...datPhong, ghiChu: e.target.value })
                }
                variant="outlined"
                size="small"
                disabled={!datPhong}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <HotelIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" color="primary">
            Danh sách phòng đặt
          </Typography>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedTTDPs.length > 0 &&
                    selectedTTDPs.length <
                      thongTinDatPhong.filter(
                        (ttdp) => ttdp.trangThai !== "Đã hủy"
                      ).length
                  }
                  checked={
                    thongTinDatPhong.length > 0 &&
                    selectedTTDPs.length ===
                      thongTinDatPhong.filter(
                        (ttdp) => ttdp.trangThai !== "Đã hủy"
                      ).length
                  }
                  onChange={() => {
                    if (
                      selectedTTDPs.length ===
                      thongTinDatPhong.filter(
                        (ttdp) => ttdp.trangThai !== "Đã hủy"
                      ).length
                    ) {
                      setSelectedTTDPs([]);
                    } else {
                      setSelectedTTDPs(
                        thongTinDatPhong.filter(
                          (ttdp) => ttdp.trangThai !== "Đã hủy"
                        )
                      );
                    }
                  }}
                  disabled={isDangDatPhong}
                />
              </TableCell>
              <TableCell>
                <Typography
                  sx={{ fontWeight: "bold", color: "primary.contrastText" }}
                >
                  Phòng
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  sx={{ fontWeight: "bold", color: "primary.contrastText" }}
                >
                  Số lượng
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  sx={{ fontWeight: "bold", color: "primary.contrastText" }}
                >
                  Ngày nhận
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  sx={{ fontWeight: "bold", color: "primary.contrastText" }}
                >
                  Ngày trả
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  sx={{ fontWeight: "bold", color: "primary.contrastText" }}
                >
                  Tiền phòng
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  sx={{ fontWeight: "bold", color: "primary.contrastText" }}
                >
                  Trạng thái
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  sx={{ fontWeight: "bold", color: "primary.contrastText" }}
                >
                  Hành động
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(grTTDP) && grTTDP.length > 0 ? (
              grTTDP
                .filter((ttdp) => ttdp.trangThai !== "Đã hủy")
                .map((ttdp) => (
                  <TableRow
                    key={ttdp.loaiPhong.id}
                    hover
                    sx={{
                      "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={ttdp.originalTTDPs.every((item) =>
                          selectedTTDPs.includes(item)
                        )}
                        onChange={() => handleCheckboxChange(ttdp)}
                        disabled={ttdp.trangThai === "Đang đặt phòng"}
                      />
                    </TableCell>
                    <TableCell>
                      {ttdp.trangThai === "Đã xếp" &&
                      phongData[ttdp.maThongTinDatPhong]?.phong?.maPhong ? (
                        <Typography>
                          {phongData[ttdp.maThongTinDatPhong]?.phong?.maPhong}
                        </Typography>
                      ) : (
                        <Chip
                          size="small"
                          label={ttdp.loaiPhong.tenLoaiPhong}
                          color="info"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell>{ttdp.quantity}</TableCell>
                    <TableCell>{formatDate(ttdp.ngayNhanPhong)}</TableCell>
                    <TableCell>{formatDate(ttdp.ngayTraPhong)}</TableCell>
                    <TableCell
                      sx={{ fontWeight: "medium", color: "success.main" }}
                    >
                      {calculateSingleRoomPrice(
                        ttdp.giaDat,
                        ttdp.ngayNhanPhong,
                        ttdp.ngayTraPhong,
                        ttdp.quantity
                      ).toLocaleString()}{" "}
                      VNĐ
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ttdp.trangThai}
                        color={getStatusColor(ttdp.trangThai)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {ttdp.trangThai === "Chưa xếp" && (
                          <Tooltip title="Xếp phòng">
                            <IconButton
                              variant="outlined"
                              size="small"
                              color="primary"
                              onClick={() => openXepPhongModal(ttdp)}
                              disabled={ttdp.trangThai === "Đang đặt phòng"}
                            >
                              <MeetingRoomIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {ttdp.trangThai === "Đã xếp" && (
                          <Tooltip title="Check-in">
                            <IconButton
                              color="success"
                              onClick={() => handleCheckin(ttdp)}
                              size="small"
                              disabled={
                                !phongData[ttdp.maThongTinDatPhong]?.phong
                                  ?.tenPhong ||
                                ttdp.trangThai === "Đang đặt phòng"
                              }
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {ttdp.trangThai === "Đã xếp" && (
                          <Tooltip title="Chi tiết thông tin đặt phòng">
                            <IconButton
                              color="success"
                              onClick={() =>
                                handleTTDPClick(ttdp.maThongTinDatPhong)
                              }
                              size="small"
                              disabled={
                                !phongData[ttdp.maThongTinDatPhong]?.phong
                                  ?.tenPhong ||
                                ttdp.trangThai === "Đang đặt phòng"
                              }
                            >
                              <InfoIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {(ttdp.trangThai === "Đang đặt phòng" ||
                          ttdp.trangThai === "Chưa xếp" ||
                          ttdp.trangThai === "Đã xếp") && (
                          <Tooltip title="Hủy thông tin đặt phòng">
                            <IconButton
                              color="error"
                              onClick={() => handleHuyTTDP(ttdp)}
                              size="small"
                            >
                              <RemoveCircleOutlineIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">
                    Không có dữ liệu
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => setOpenSearchDialog(true)}
        >
          Thêm phòng
        </Button>
        {datPhong && (
          <Button
            variant="contained"
            color="primary"
            onClick={updateDatPhong}
            startIcon={<AssignmentIcon />}
          >
            Lưu thông tin
          </Button>
        )}
        {selectedTTDPs.length > 0 &&
          !isDangDatPhong &&
          !selectedTTDPs.some((ttdp) => ttdp.trangThai === "Đang ở") && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() =>
                selectedTTDPs.forEach((ttdp) =>
                  handleCheckin({ originalTTDPs: [ttdp] })
                )
              }
            >
              Check-in {`(${selectedTTDPs.length})`}
            </Button>
          )}
        {selectedTTDPs.length > 0 &&
          !isDangDatPhong &&
          !selectedTTDPs.some((ttdp) =>
            ["Đã xếp", "Đang ở"].includes(ttdp.trangThai)
          ) && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<MeetingRoomIcon />}
              onClick={() => setShowXepPhongModal(true)}
            >
              Xếp phòng {`(${selectedTTDPs.length})`}
            </Button>
          )}
        {!isChangeButtonDisabled && datPhong && hasDangO && (
          <Button
            variant="contained"
            color="warning"
            startIcon={<PublishedWithChangesIcon />}
            onClick={handleChangeAllConditionRoom}
          >
            Kiểm tra tất cả phòng
          </Button>
        )}
      </Box>

      <XepPhong
        show={showXepPhongModal}
        handleClose={closeXepPhongModal}
        selectedTTDPs={selectedTTDPs}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={openSearchDialog}
        onClose={() => setOpenSearchDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Tìm Loại Phòng Khả Dụng</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày Nhận Phòng"
                type="date"
                value={searchForm.ngayNhanPhong}
                onChange={(e) =>
                  handleSearchInputChange("ngayNhanPhong", e.target.value)
                }
                error={!!searchErrors.ngayNhanPhong}
                helperText={searchErrors.ngayNhanPhong}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: dayjs().format("YYYY-MM-DD") }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày Trả Phòng"
                type="date"
                value={searchForm.ngayTraPhong}
                onChange={(e) =>
                  handleSearchInputChange("ngayTraPhong", e.target.value)
                }
                error={!!searchErrors.ngayTraPhong}
                helperText={searchErrors.ngayTraPhong}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: dayjs(searchForm.ngayNhanPhong)
                    .add(1, "day")
                    .format("YYYY-MM-DD"),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
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
              />
            </Grid>
            <Grid item xs={12} md={6}>
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
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Loại Phòng</InputLabel>
                <Select
                  value={searchForm.idLoaiPhong || ""}
                  onChange={(e) =>
                    handleSearchInputChange("idLoaiPhong", e.target.value)
                  }
                  label="Loại Phòng"
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
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? "Đang tìm..." : "Tìm Phòng"}
              </Button>
            </Grid>
          </Grid>

          {availableRooms.length > 0 ? (
            <TableContainer sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Loại Phòng</TableCell>
                    <TableCell>Giá Mỗi Đêm</TableCell>
                    <TableCell>Số Phòng Khả Dụng</TableCell>
                    <TableCell>Hành Động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availableRooms.map((room) => (
                    <TableRow key={room.id} hover>
                      <TableCell>{room.tenLoaiPhong}</TableCell>
                      <TableCell>{room.donGia.toLocaleString()} VNĐ</TableCell>
                      <TableCell>{room.soPhongKhaDung}</TableCell>
                      <TableCell>
                        {room.soPhongKhaDung >= searchForm.soPhong && (
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleAddRoom(room)}
                          >
                            Thêm
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            availableRooms.length === 0 &&
            !loading && (
              <Typography
                sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}
              >
                Không tìm thấy phòng khả dụng
              </Typography>
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSearchDialog(false)} color="secondary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ChiTietDatPhong;
