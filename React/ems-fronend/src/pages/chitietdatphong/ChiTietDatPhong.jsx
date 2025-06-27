import React, { useEffect, useState, useMemo, useRef } from "react";
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
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useLocation, useNavigate } from "react-router-dom";
import {
  findTTDPByMaDatPhong,
  changeAllConditionRoom,
  huyTTDP,
  addThongTinDatPhong,
  updateThongTinDatPhong,
  findDatCoc
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
import EditIcon from "@mui/icons-material/Edit";
import { SuaTTKH } from "../../services/KhachHangService";
import dayjs from "dayjs";
import Swal from "sweetalert2";



const CustomerInfo = ({ datPhong, onEdit, disabled }) => (
  <Card elevation={3} sx={{ height: "100%" }}>
    <CardContent>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PersonIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" color="primary">
            Thông tin khách hàng
          </Typography>
        </Box>
        {!disabled && (
          <Tooltip title="Sửa thông tin khách hàng">
            <IconButton color="primary" onClick={onEdit}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography sx={{ fontWeight: "medium", mr: 1 }}>Họ tên:</Typography>
        <Typography>
          {datPhong?.khachHang?.ho} {datPhong?.khachHang?.ten || "N/A"}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <EmailIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
        <Typography>{datPhong?.khachHang?.email || "N/A"}</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <PhoneIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
        <Typography>{datPhong?.khachHang?.sdt || "N/A"}</Typography>
      </Box>
    </CardContent>
  </Card>
);

const BookingInfo = ({ datPhong, thongTinDatPhong, formatDate }) => {
  const [tienDatCoc, setTienDatCoc] = useState(0);

  useEffect(() => {
    const fetchDatCoc = async () => {
      if (datPhong?.id) {
        try {
          const response = await findDatCoc(datPhong.id);
          setTienDatCoc(response?.data.tienThanhToan || 0);
        } catch (error) {
          console.error("Error fetching deposit:", error);
          setTienDatCoc(0);
        }
      }
    };
    fetchDatCoc();
  }, [datPhong?.id]);

  return (
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
          <Typography sx={{ fontWeight: "medium", mr: 1 }}>Ngày đặt:</Typography>
          <Typography>
            {datPhong?.ngayDat ? formatDate(datPhong.ngayDat) : "N/A"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography sx={{ fontWeight: "medium", mr: 1 }}>
            Số người lớn:
          </Typography>
          <Typography>{datPhong?.soNguoi}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography sx={{ fontWeight: "medium", mr: 1 }}>Số trẻ em:</Typography>
          <Typography>{datPhong?.soTre || 0}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography sx={{ fontWeight: "medium", mr: 1 }}>Số phòng:</Typography>
          <Typography>
            {Array.isArray(thongTinDatPhong)
              ? thongTinDatPhong.filter((ttdp) => ttdp.trangThai !== "Đã hủy")
                .length
              : 0}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography sx={{ fontWeight: "medium", mr: 1 }}>Tổng tiền:</Typography>
          <Typography sx={{ fontWeight: "bold", color: "success.main" }}>
            {datPhong?.tongTien?.toLocaleString() || "0"} VNĐ
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ fontWeight: "medium", mr: 1 }}>
            Số tiền đã đặt cọc:
          </Typography>
          <Typography sx={{ fontWeight: "bold", color: "success.main" }}>
            {tienDatCoc.toLocaleString()} VNĐ
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
const NoteSection = ({
  datPhong,
  setDatPhong,
  isUpdateAllNotesChecked,
  setIsUpdateAllNotesChecked,
}) => (
  <Card elevation={3} sx={{ height: "100%" }}>
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <NotesIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" color="primary">
          Ghi chú
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Checkbox
          checked={isUpdateAllNotesChecked}
          onChange={(e) => setIsUpdateAllNotesChecked(e.target.checked)}
          disabled={!datPhong}
        />
        <Typography variant="body2">
          Cập nhật ghi chú cho tất cả thông tin đặt phòng
        </Typography>
      </Box>
      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder="Nhập ghi chú ở đây..."
        value={datPhong?.ghiChu || ""}
        onChange={(e) => setDatPhong({ ...datPhong, ghiChu: e.target.value })}
        variant="outlined"
        size="small"
        disabled={!datPhong}
      />
    </CardContent>
  </Card>
);

const ChiTietDatPhong = () => {
  const dialogRef = useRef(null); // Thêm ref cho Dialog
  const [datPhong, setDatPhong] = useState(null);
  const [thongTinDatPhong, setThongTinDatPhong] = useState([]);
  const [selectedTTDPs, setSelectedTTDPs] = useState([]);
  const [phongData, setPhongData] = useState({});
  const [isChangeButtonDisabled, setIsChangeButtonDisabled] = useState(false);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [searchForm, setSearchForm] = useState({
    ngayNhanPhong: dayjs(),
    ngayTraPhong: dayjs().add(1, 'day'),
    soNguoi: 1,
    soTre: 0,
    soPhong: 1,
    idLoaiPhong: null,
  });
  const [searchErrors, setSearchErrors] = useState({});
  const [showXepPhong, setShowXepPhong] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loaiPhongs, setLoaiPhongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUpdateAllNotesChecked, setIsUpdateAllNotesChecked] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    ho: "",
    ten: "",
    sdt: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    ho: "",
    ten: "",
    sdt: "",
    email: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const location = useLocation();
  const { maDatPhong } = location.state || {};
  const navigate = useNavigate();

  const calculateTotalPrice = (thongTinDatPhong) => {
    if (!Array.isArray(thongTinDatPhong)) return 0;
    return thongTinDatPhong
      .filter((ttdp) => ttdp.trangThai !== "Đã hủy")
      .reduce((total, ttdp) => {
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

  const grTTDP = useMemo(() => {
    if (!Array.isArray(thongTinDatPhong)) return [];

    const keepIndividual = thongTinDatPhong.filter((ttdp) =>
      ["Đã xếp", "Đang ở", "Đã kiểm tra phòng", "Đã trả phòng"].includes(
        ttdp.trangThai
      )
    );
    const chuaXep = thongTinDatPhong.filter(
      (ttdp) =>
        !["Đã xếp", "Đang ở", "Đã kiểm tra phòng", "Đã trả phòng"].includes(
          ttdp.trangThai
        )
    );

    const keepIndividualGrouped = keepIndividual.map((ttdp) => ({
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
    }));

    const chuaXepGrouped = Object.values(
      chuaXep.reduce((acc, ttdp) => {
        const key = `${ttdp.loaiPhong.id}_${ttdp.ngayNhanPhong}_${ttdp.ngayTraPhong}_${ttdp.trangThai}`;
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
            quantity: 1,
            originalTTDPs: [ttdp],
          };
        } else {
          acc[key].quantity += 1;
          acc[key].originalTTDPs.push(ttdp);
        }
        return acc;
      }, {})
    );

    return [...keepIndividualGrouped, ...chuaXepGrouped];
  }, [thongTinDatPhong]);

  const getDetailDatPhong = async () => {
    try {
      const [datPhongRes, ttdpRes] = await Promise.all([
        findDatPhongByMaDatPhong(maDatPhong),
        findTTDPByMaDatPhong(maDatPhong),
      ]);

      if (!datPhongRes?.data) {
        throw new Error("Không nhận được dữ liệu đặt phòng");
      }
      setDatPhong(datPhongRes.data);

      if (!Array.isArray(ttdpRes?.data)) {
        console.warn("Dữ liệu TTDP không phải mảng:", ttdpRes?.data);
        setThongTinDatPhong([]);
        return;
      }
      setThongTinDatPhong(ttdpRes.data);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết đặt phòng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Lỗi: ${error.message}`,
        confirmButtonText: "Đóng",
        target: dialogRef.current, // Gắn vào dialog
        backdrop: true,
      });
      setThongTinDatPhong([]);
    }
  };

  const fetchPhongDaXep = async (maThongTinDatPhong) => {
    try {
      const response = await phongDaXep(maThongTinDatPhong);
      if (response?.data) {
        setPhongData((prev) => ({
          ...prev,
          [maThongTinDatPhong]: response.data,
        }));
      }
    } catch (error) {
      console.error(`Lỗi khi lấy phòng đã xếp ${maThongTinDatPhong}:`, error);
    }
  };

  const openXepPhongModal = (ttdp) => {
    setSelectedTTDPs(ttdp.originalTTDPs.map((item) => item.maThongTinDatPhong));
    setShowXepPhong(true);
  };

  const closeXepPhongModal = () => {
    setShowXepPhong(false);
    setSelectedTTDPs([]);
    getDetailDatPhong();
    thongTinDatPhong.forEach((ttdp) =>
      fetchPhongDaXep(ttdp.maThongTinDatPhong)
    );
  };

  const updateDatPhong = async () => {
    if (!datPhong) return;

    const confirmUpdate = await Swal.fire({
      icon: "question",
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn lưu thông tin đặt phòng này không?",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      target: dialogRef.current,
      backdrop: true,
    });

    if (!confirmUpdate.isConfirmed) return;

    setIsUpdating(true);
    try {
      await CapNhatDatPhong(datPhong);

      if (isUpdateAllNotesChecked) {
        const confirmUpdateNotes = await Swal.fire({
          icon: "question",
          title: "Xác nhận",
          text: "Bạn có chắc chắn muốn cập nhật ghi chú này cho tất cả thông tin đặt phòng không?",
          showCancelButton: true,
          confirmButtonText: "Xác nhận",
          cancelButtonText: "Hủy",
          target: dialogRef.current,
          backdrop: true,
        });
        if (!confirmUpdateNotes.isConfirmed) {
          setIsUpdating(false);
          return;
        }

        const ttdpsToUpdate = thongTinDatPhong.filter(
          (ttdp) => ttdp.trangThai !== "Đã hủy"
        );
        await Promise.all(
          ttdpsToUpdate.map((ttdp) => {
            if (!ttdp.id || !ttdp.datPhong || !ttdp.loaiPhong)
              return Promise.resolve();
            return updateThongTinDatPhong({
              id: ttdp.id,
              datPhong: ttdp.datPhong,
              idLoaiPhong: ttdp.loaiPhong.id,
              maThongTinDatPhong: ttdp.maThongTinDatPhong,
              ngayNhanPhong: ttdp.ngayNhanPhong,
              ngayTraPhong: ttdp.ngayTraPhong,
              soNguoi: ttdp.soNguoi,
              giaDat: ttdp.giaDat,
              ghiChu: datPhong.ghiChu || "",
              trangThai: ttdp.trangThai,
            });
          })
        );
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Cập nhật ghi chú cho tất cả thông tin đặt phòng thành công",
          confirmButtonText: "Đóng",
          target: dialogRef.current,
          backdrop: true,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Lưu thông tin thành công",
          confirmButtonText: "Đóng",
          target: dialogRef.current,
          backdrop: true,
        });
        getDetailDatPhong();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Lỗi không xác định";
      console.error("Lỗi cập nhật đặt phòng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Không thể cập nhật thông tin: ${errorMessage}`,
        confirmButtonText: "Đóng",
        target: dialogRef.current,
        backdrop: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleHuyTTDP = async (ttdp) => {
    const confirmDelete = await Swal.fire({
      icon: "question",
      title: "Xác nhận",
      text: `Bạn có chắc chắn muốn hủy thông tin đặt phòng không?`,
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      target: dialogRef.current,
      backdrop: true,
    });
    if (!confirmDelete.isConfirmed) return;

    try {
      await Promise.all(
        ttdp.originalTTDPs.map((item) => huyTTDP(item.maThongTinDatPhong))
      );
      const updatedResponse = await findTTDPByMaDatPhong(maDatPhong);
      const updatedTTDPs = updatedResponse.data || [];
      setThongTinDatPhong(updatedTTDPs);

      const newTotalPrice = calculateTotalPrice(updatedTTDPs);

      const updatedDatPhong = {
        ...datPhong,
        soPhong: updatedTTDPs.filter((ttdp) => ttdp.trangThai !== "Đã hủy").length,
        tongTien: newTotalPrice,
      };
      await CapNhatDatPhong(updatedDatPhong);
      setDatPhong(updatedDatPhong);

      setSelectedTTDPs([]);
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Hủy thành công",
        confirmButtonText: "Đóng",
        target: dialogRef.current,
        backdrop: true,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Lỗi không xác định";
      console.error("Lỗi hủy TTDP:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Không thể hủy thông tin đặt phòng: ${errorMessage}`,
        confirmButtonText: "Đóng",
        target: dialogRef.current,
        backdrop: true,
      });
    }
  };

  const handleChangeAllConditionRoom = async () => {
    if (!datPhong?.id) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không tìm thấy thông tin đặt phòng.",
        confirmButtonText: "Đóng",
        target: dialogRef.current,
        backdrop: true,
      });
      return;
    }

    const confirmAction = await Swal.fire({
      icon: "question",
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn đổi tình trạng tất cả phòng sang 'Cần kiểm tra' không?",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      target: dialogRef.current,
      backdrop: true,
    });
    if (!confirmAction.isConfirmed) return;

    try {
      await changeAllConditionRoom(datPhong.id);
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đổi tình trạng cho toàn bộ phòng thành công!",
        confirmButtonText: "Đóng",
        target: dialogRef.current,
        backdrop: true,
      });
      getDetailDatPhong();
      thongTinDatPhong.forEach((ttdp) =>
        fetchPhongDaXep(ttdp.maThongTinDatPhong)
      );
      setIsChangeButtonDisabled(true);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Lỗi không xác định";
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Có lỗi xảy ra khi cập nhật tình trạng phòng: ${errorMessage}`,
        confirmButtonText: "Đóng",
        target: dialogRef.current,
        backdrop: true,
      });
    }
  };

  const handleSearchInputChange = (field, value) => {
    setSearchForm({ ...searchForm, [field]: value });
    setSearchErrors({});
  };

  const handleSearchRooms = async () => {
    const errors = {};
    const today = dayjs();

    if (!searchForm.ngayNhanPhong) {
      errors.ngayNhanPhong = "Vui lòng chọn ngày giờ nhận phòng";
    } else if (searchForm.ngayNhanPhong.isBefore(today)) {
      errors.ngayNhanPhong = "Ngày giờ nhận phòng không được trước hiện tại";
    }

    if (!searchForm.ngayTraPhong) {
      errors.ngayTraPhong = "Vui lòng chọn ngày giờ trả phòng";
    } else if (
      searchForm.ngayTraPhong.isSame(searchForm.ngayNhanPhong) ||
      searchForm.ngayTraPhong.isBefore(searchForm.ngayNhanPhong)
    ) {
      errors.ngayTraPhong = "Ngày giờ trả phòng phải sau ngày nhận phòng";
    }

    if (searchForm.soNguoi < 1) {
      errors.soNguoi = "Số người lớn phải lớn hơn 0";
    }

    if (searchForm.soTre < 0) {
      errors.soTre = "Số trẻ em không được âm";
    }

    if (searchForm.soPhong < 1) {
      errors.soPhong = "Số phòng phải lớn hơn 0";
    }

    setSearchErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const n = searchForm.ngayNhanPhong.format("YYYY-MM-DD[T]HH:mm:ss.SSSZ");
      const t = searchForm.ngayTraPhong.format("YYYY-MM-DD[T]HH:mm:ss.SSSZ");
      const response = await getLPKDRL(
        n,
        t,
        searchForm.soNguoi,
        searchForm.soTre,
        searchForm.soPhong,
        searchForm.idLoaiPhong
      );
      if (!response?.data?.length) {
        Swal.fire({
          icon: "warning",
          title: "Cảnh báo",
          text: "Không có phòng khả dụng cho yêu cầu của bạn. Vui lòng thử lại với ngày hoặc số lượng khác.",
          confirmButtonText: "Đóng",
          target: dialogRef.current,
          backdrop: true,
        });
      }
      setAvailableRooms(response.data || []);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Lỗi không xác định";
      console.error("Lỗi khi tìm phòng khả dụng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Có lỗi xảy ra khi tìm phòng: ${errorMessage}`,
        confirmButtonText: "Đóng",
        target: dialogRef.current,
        backdrop: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (room) => {
    if (room.soPhongKhaDung < searchForm.soPhong) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Số phòng khả dụng không đủ!",
        confirmButtonText: "Đóng",
        target: dialogRef.current,
        backdrop: true,
      });
      return;
    }

    try {
      const addedRooms = [];
      for (let i = 0; i < searchForm.soPhong; i++) {
        const newRoom = {
          datPhong: datPhong,
          idLoaiPhong: room.id,
          maThongTinDatPhong: `TDP-${Date.now()}-${room.id}-${i}`,
          ngayNhanPhong: searchForm.ngayNhanPhong.format(
            "YYYY-MM-DD[T]HH:mm:ss"
          ),
          ngayTraPhong: searchForm.ngayTraPhong.format("YYYY-MM-DD[T]HH:mm:ss"),
          soNguoi: searchForm.soNguoi,
          soTre: searchForm.soTre,
          giaDat: room.donGia,
          trangThai: "Chưa xếp",
        };
        const response = await addThongTinDatPhong(newRoom);
        if (!response?.data) {
          throw new Error(
            `Không thể thêm thông tin đặt phòng: ${newRoom.maThongTinDatPhong}`
          );
        }
        addedRooms.push(response.data);
      }

      const updatedResponse = await findTTDPByMaDatPhong(maDatPhong);
      const updatedTTDPs = updatedResponse.data || [];
      setThongTinDatPhong(updatedTTDPs);

      const newTotalPrice = calculateTotalPrice(updatedTTDPs);

      const updatedDatPhong = {
        ...datPhong,
        soPhong: updatedTTDPs.filter((ttdp) => ttdp.trangThai !== "Đã hủy").length,
        soNguoi: searchForm.soNguoi,
        soTre: searchForm.soTre,
        tongTien: newTotalPrice,
      };
      await CapNhatDatPhong(updatedDatPhong);
      setDatPhong(updatedDatPhong);

      setOpenSearchDialog(false);
      setAvailableRooms([]);
      setSearchForm({
        ngayNhanPhong: dayjs(),
        ngayTraPhong: dayjs().add(1, 'day'),
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
        target: dialogRef.current,
        backdrop: true,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Lỗi không xác định";
      console.error("Lỗi khi thêm phòng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Có lỗi xảy ra khi thêm phòng: ${errorMessage}`,
        confirmButtonText: "Đóng",
        target: dialogRef.current,
        backdrop: true,
      });
    }
  };

  const handleOpenEditModal = () => {
    setEditForm({
      ho: datPhong?.khachHang?.ho || "",
      ten: datPhong?.khachHang?.ten || "",
      sdt: datPhong?.khachHang?.sdt || "",
      email: datPhong?.khachHang?.email || "",
    });
    setErrors({ ho: "", ten: "", sdt: "", email: "" });
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setErrors({ ho: "", ten: "", sdt: "", email: "" });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ho: "", ten: "", sdt: "", email: "" };

    if (!editForm.ho.trim()) {
      newErrors.ho = "Họ không được để trống";
      isValid = false;
    }
    if (!editForm.ten.trim()) {
      newErrors.ten = "Tên không được để trống";
      isValid = false;
    }
    if (!editForm.sdt.trim()) {
      newErrors.sdt = "Số điện thoại không được để trống";
      isValid = false;
    } else if (!/^\d{10}$/.test(editForm.sdt.trim())) {
      newErrors.sdt = "Số điện thoại phải gồm 10 chữ số";
      isValid = false;
    }
    if (!editForm.email.trim()) {
      newErrors.email = "Email không được để trống";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email.trim())) {
      newErrors.email = "Email không đúng định dạng";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmitEdit = async () => {
    if (!validateForm()) return;

    try {
      const khachHangData = {
        id: datPhong.khachHang.id,
        ho: editForm.ho,
        ten: editForm.ten,
        sdt: editForm.sdt,
        email: editForm.email,
      };
      await SuaTTKH(khachHangData);
      setDatPhong((prev) => ({
        ...prev,
        khachHang: { ...prev.khachHang, ...khachHangData },
      }));
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Cập nhật thông tin khách hàng thành công",
        confirmButtonText: "Đóng",
        target: dialogRef.current,
        backdrop: true,
      });
      handleCloseEditModal();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Lỗi không xác định";
      console.error("Lỗi cập nhật khách hàng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Không thể cập nhật thông tin khách hàng: ${errorMessage}`,
        confirmButtonText: "Đóng",
        target: dialogRef.current,
        backdrop: true,
      });
    }
  };

  useEffect(() => {
    if (openSearchDialog) {
      const fetchLoaiPhongs = async () => {
        try {
          const n = searchForm.ngayNhanPhong.format("YYYY-MM-DD[T]HH:mm:ss.SSSZ");
          const t = searchForm.ngayTraPhong.format("YYYY-MM-DD[T]HH:mm:ss.SSSZ");
          const response = await getLoaiPhongKhaDungResponse(n, t);
          setLoaiPhongs(response.data || []);
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Lỗi không xác định";
          console.error("Lỗi khi lấy danh sách loại phòng:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: `Lỗi khi lấy danh sách loại phòng: ${errorMessage}`,
            confirmButtonText: "Đóng",
            target: dialogRef.current,
            backdrop: true,
          });
        }
      };
      fetchLoaiPhongs();
    }
  }, [openSearchDialog, searchForm.ngayNhanPhong, searchForm.ngayTraPhong]);

  useEffect(() => {
    if (Array.isArray(thongTinDatPhong) && thongTinDatPhong.length > 0) {
      const promises = thongTinDatPhong
        .filter((ttdp) =>
          ["Đã xếp", "Đang ở", "Đã kiểm tra phòng", "Đã trả phòng"].includes(
            ttdp.trangThai
          )
        )
        .map((ttdp) => fetchPhongDaXep(ttdp.maThongTinDatPhong));
      Promise.all(promises).catch((error) =>
        console.error("Lỗi khi lấy phòng đã xếp:", error)
      );
    }
  }, [thongTinDatPhong]);

  useEffect(() => {
    if (maDatPhong) {
      getDetailDatPhong();
    }
  }, [maDatPhong]);

  const calculateSingleRoomPrice = (donGia, start, end, quantity) => {
    const days = Math.max(
      Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)),
      1
    );
    return donGia * days * quantity;
  };

  const handleCheckboxChange = (ttdp) => {
    const ids = ttdp.originalTTDPs.map((item) => item.maThongTinDatPhong);
    setSelectedTTDPs((prev) =>
      prev.includes(ids[0])
        ? prev.filter((id) => !ids.includes(id))
        : [...prev, ...ids]
    );
  };

  const handleTTDPClick = (maThongTinDatPhong) => {
    navigate("/chi-tiet-ttdp", { state: { maThongTinDatPhong } });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const handleCheckin = async (ttdp) => {
    try {
      for (const item of ttdp.originalTTDPs) {
        const xepPhong = (await phongDaXep(item.maThongTinDatPhong)).data;
        if (!xepPhong) {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Không tìm thấy phòng đã xếp.",
            confirmButtonText: "Đóng",
            target: dialogRef.current,
            backdrop: true,
          });
          continue;
        }

        const loaiPhong = xepPhong.phong.loaiPhong;
        const checkInTime = new Date(item.ngayNhanPhong);
        checkInTime.setHours(14, 0, 0, 0);
        const checkOutTime = new Date(item.ngayTraPhong);
        checkOutTime.setHours(12, 0, 0, 0);

        const xepPhongRequest = {
          id: xepPhong.id,
          phong: xepPhong.phong,
          thongTinDatPhong: xepPhong.thongTinDatPhong,
          ngayNhanPhong: checkInTime,
          ngayTraPhong: checkOutTime,
          trangThai: "Đang ở",
        };

        await checkIn(xepPhongRequest);
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Check-in thành công!",
          confirmButtonText: "Đóng",
          target: dialogRef.current,
          backdrop: true,
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Lỗi không xác định";
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Đã xảy ra lỗi khi thực hiện check-in: ${errorMessage}`,
        confirmButtonText: "Đóng",
        target: dialogRef.current,
        backdrop: true,
      });
    }
    getDetailDatPhong();
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            <CustomerInfo
              datPhong={datPhong}
              onEdit={handleOpenEditModal}
              disabled={grTTDP.some(
                (ttdp) =>
                  ttdp.trangThai === "Đang ở" ||
                  ttdp.trangThai === "Đã trả phòng" ||
                  ttdp.trangThai === "Đã kiểm tra phòng" ||
                  ttdp.trangThai === "Đã hủy"
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <BookingInfo
              datPhong={datPhong}
              thongTinDatPhong={thongTinDatPhong}
              formatDate={formatDate}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <NoteSection
              datPhong={datPhong}
              setDatPhong={setDatPhong}
              isUpdateAllNotesChecked={isUpdateAllNotesChecked}
              setIsUpdateAllNotesChecked={setIsUpdateAllNotesChecked}
            />
          </Grid>
        </Grid>

        <Dialog open={openEditModal} onClose={handleCloseEditModal}>
          <DialogTitle>Sửa thông tin khách hàng</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Họ"
              name="ho"
              value={editForm.ho}
              onChange={handleEditFormChange}
              margin="normal"
              variant="outlined"
              error={!!errors.ho}
              helperText={errors.ho}
              required
            />
            <TextField
              fullWidth
              label="Tên"
              name="ten"
              value={editForm.ten}
              onChange={handleEditFormChange}
              margin="normal"
              variant="outlined"
              error={!!errors.ten}
              helperText={errors.ten}
              required
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              name="sdt"
              value={editForm.sdt}
              onChange={handleEditFormChange}
              margin="normal"
              variant="outlined"
              error={!!errors.sdt}
              helperText={errors.sdt}
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={editForm.email}
              onChange={handleEditFormChange}
              margin="normal"
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditModal} color="secondary">
              Hủy
            </Button>
            <Button
              onClick={handleSubmitEdit}
              color="primary"
              variant="contained"
            >
              Lưu
            </Button>
          </DialogActions>
        </Dialog>

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
                          thongTinDatPhong
                            .filter((ttdp) => ttdp.trangThai !== "Đã hủy")
                            .map((ttdp) => ttdp.maThongTinDatPhong)
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
              {grTTDP.length > 0 ? (
                grTTDP
                  .filter((ttdp) => ttdp.trangThai !== "Đã hủy")
                  .map((ttdp) => (
                    <TableRow
                      key={`${ttdp.maThongTinDatPhong}_${ttdp.ngayNhanPhong}_${ttdp.ngayTraPhong}_${ttdp.trangThai}`}
                      hover
                      sx={{
                        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={ttdp.originalTTDPs.every((item) =>
                            selectedTTDPs.includes(item.maThongTinDatPhong)
                          )}
                          onChange={() => handleCheckboxChange(ttdp)}
                          disabled={ttdp.trangThai === "Đang đặt phòng"}
                        />
                      </TableCell>
                      <TableCell>
                        {[
                          "Đã xếp",
                          "Đang ở",
                          "Đã kiểm tra phòng",
                          "Đã trả phòng",
                        ].includes(ttdp.trangThai) &&
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
                          {[
                            "Đã xếp",
                            "Đang ở",
                            "Đã kiểm tra phòng",
                            "Đã trả phòng",
                          ].includes(ttdp.trangThai) && (
                            <Tooltip title="Chi tiết thông tin đặt phòng">
                              <IconButton
                                color="success"
                                onClick={() =>
                                  handleTTDPClick(ttdp.maThongTinDatPhong)
                                }
                                size="small"
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
          {!["Đã trả phòng", "Đã thanh toán"].includes(datPhong?.trangThai) && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={() => setOpenSearchDialog(true)}
            >
              Thêm phòng
            </Button>
          )}
          {datPhong && (
            <Button
              variant="contained"
              color="primary"
              onClick={updateDatPhong}
              startIcon={
                isUpdating ? <CircularProgress size={20} /> : <AssignmentIcon />
              }
              disabled={isUpdating}
            >
              {isUpdating ? "Đang lưu..." : "Lưu thông tin"}
            </Button>
          )}
          {selectedTTDPs.length > 0 &&
            !isDangDatPhong &&
            thongTinDatPhong
              .filter((ttdp) => selectedTTDPs.includes(ttdp.maThongTinDatPhong))
              .some((ttdp) => ["Đã xếp"].includes(ttdp.trangThai)) && (
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() =>
                  thongTinDatPhong
                    .filter((ttdp) =>
                      selectedTTDPs.includes(ttdp.maThongTinDatPhong)
                    )
                    .forEach((ttdp) => handleCheckin({ originalTTDPs: [ttdp] }))
                }
              >
                Check-in {`(${selectedTTDPs.length})`}
              </Button>
            )}
          {selectedTTDPs.length > 0 &&
            !isDangDatPhong &&
            thongTinDatPhong
              .filter((ttdp) => selectedTTDPs.includes(ttdp.maThongTinDatPhong))
              .some((ttdp) => ["Chưa xếp"].includes(ttdp.trangThai)) && (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<MeetingRoomIcon />}
                onClick={() => setShowXepPhong(true)}
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
          show={showXepPhong}
          handleClose={closeXepPhongModal}
          selectedTTDPs={thongTinDatPhong.filter((ttdp) => selectedTTDPs.includes(ttdp.maThongTinDatPhong))}
        />
        <Dialog
          open={openSearchDialog}
          onClose={() => setOpenSearchDialog(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Tìm Loại Phòng Khả Dụng</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={3}>
                <DateTimePicker
                  label="Ngày Nhận Phòng"
                  value={searchForm.ngayNhanPhong}
                  minDateTime={dayjs()}
                  onChange={(newValue) =>
                    handleSearchInputChange("ngayNhanPhong", newValue)}
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
                        }
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
                    handleSearchInputChange("ngayTraPhong", newValue)}
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
                      handleSearchInputChange("idLoaiPhong", e.target.value)}
                    label="Loại Phòng"
                    sx={{
                      "& .MuiInputBase-root": {
                        borderRadius: 1,
                        backgroundColor: "#f5f5f5f5",
                      }}}
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
                  sx={{
                    borderRadius: 1,
                    bgcolor: "#1976d2",
                    "&:hover": { bgcolor: "#115293" },
                  }}
                >
                    {loading ? "Đang tìm..." : "Tìm Phòng"}
                </Button>
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
                      <TableCell>Giá Mỗi Đêm (VNĐ)</TableCell>
                      <TableCell>Số Phòng Khả Dụng</TableCell>
                      <TableCell>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {availableRooms.map((room) => (
                      <TableRow key={room.id} >
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
                            disabled={room.soPhongKhaDung < Number(searchForm.soPhong)}
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
            </Grid>
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
      </Container>
    </LocalizationProvider>
  );
};

export default ChiTietDatPhong;