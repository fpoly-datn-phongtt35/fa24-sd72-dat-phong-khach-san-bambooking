import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import jsQR from "jsqr";
import Swal from "sweetalert2";
import ModalCreateKHC from "./ModalCreateKHC";
import ModalUpdateKHC from "./ModalUpdateKHC";
import {
  createKhachHang,
  getKhachHangByKey,
} from "../../services/KhachHangService";
import {
  them,
  DanhSachKHC,
  getKhachHangCheckinByThongTinId,
  qrCheckIn,
} from "../../services/KhachHangCheckin";
import {
  ThemPhuThu,
  CapNhatPhuThu,
  CheckPhuThuExists,
} from "../../services/PhuThuService";
import { getLoaiPhongById } from "../../services/LoaiPhongService";
import { getXepPhongByThongTinDatPhongId } from "../../services/XepPhongService.js";

const ModalKhachHangCheckin = ({
  isOpen,
  onClose,
  thongTinDatPhong,
  onCheckinSuccess,
}) => {
  const dialogRef = useRef(null); // Thêm ref cho Dialog
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editKhachHang, setEditKhachHang] = useState(null);
  const [isModalKHCOpen, setModalKHCOpen] = useState(false);
  const [isQRModalOpen, setQRModalOpen] = useState(false);
  const [qrData, setQRData] = useState("");
  const [initialQRData, setInitialQRData] = useState(null);
  const [selectedKhachHang, setSelectedKhachHang] = useState([]);
  const [khachHangList, setKhachHangList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState(null);
  const [trangThai, setTrangThai] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [checkedInKhachHangIds, setCheckedInKhachHangIds] = useState([]);
  const [cameraError, setCameraError] = useState(null);
  const navigate = useNavigate();
  const rowsPerPage = 5;
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);

  // Lấy danh sách khách hàng đã check-in
  const fetchCheckedInKhachHang = async () => {
    try {
      const response = await DanhSachKHC(thongTinDatPhong.maThongTinDatPhong);
      const ids = response.data.map((item) => item.khachHang.id);
      setCheckedInKhachHangIds(ids);
    } catch (error) {
      console.log("Lỗi khi lấy danh sách khách hàng check-in:", error);
      setCheckedInKhachHangIds([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedKhachHang([]);
      fetchCheckedInKhachHang();
      // Lấy thông tin loại phòng để kiểm tra số khách tối đa
      const checkMaxGuests = async () => {
        const loaiPhong = await getLoaiPhongById(thongTinDatPhong.loaiPhong.id);
        const daCheckin = await getKhachHangCheckinByThongTinId(
          thongTinDatPhong.id
        );
        if (daCheckin.data.length >= loaiPhong.data.soKhachToiDa) {
          Swal.fire({
            icon: "warning",
            title: "Cảnh báo",
            text: "Đã đạt số lượng khách tối đa cho phòng này.",
            confirmButtonText: "OK",
            confirmButtonColor: "#6a5acd",
          });
          // Có thể vô hiệu hóa nút check-in hoặc quét QR
        }
      };
      checkMaxGuests();
    }
  }, [isOpen, thongTinDatPhong]);

  // Khởi tạo và quét QR
  useEffect(() => {
    if (isQRModalOpen) {
      setCameraError(null);
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const videoDevices = devices.filter(
            (device) => device.kind === "videoinput"
          );
          console.log("Danh sách camera khả dụng:", videoDevices);
          if (videoDevices.length === 0) {
            setCameraError(
              "Không tìm thấy camera trên thiết bị. Vui lòng kiểm tra thiết bị hoặc kết nối camera."
            );
            return;
          }
          // Chọn USB2.0 HD UVC WebCam hoặc camera đầu tiên
          const preferredCamera =
            videoDevices.find((device) =>
              device.label.includes("USB2.0 HD UVC WebCam")
            ) || videoDevices[0];
          console.log(
            "Sử dụng camera:",
            preferredCamera.label,
            "với deviceId:",
            preferredCamera.deviceId
          );

          // Khởi tạo luồng video
          const constraints = {
            video: {
              deviceId: preferredCamera.deviceId
                ? { exact: preferredCamera.deviceId }
                : undefined,
              facingMode: "environment",
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          };
          navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
              videoRef.current.srcObject = stream;
              videoRef.current.play();
              // Chờ video tải metadata trước khi quét
              videoRef.current.onloadedmetadata = () => {
                scanQR();
              };
            })
            .catch((err) => {
              console.error("Lỗi truy cập camera:", {
                name: err.name,
                message: err.message,
                stack: err.stack,
              });
              if (err.name === "NotAllowedError") {
                setCameraError(
                  "Quyền truy cập camera bị từ chối. Vui lòng cấp quyền trong trình duyệt."
                );
              } else if (err.name === "NotFoundError") {
                setCameraError(
                  "Không tìm thấy camera USB2.0 HD UVC WebCam. Vui lòng kiểm tra thiết bị."
                );
              } else {
                setCameraError(
                  `Lỗi truy cập camera: ${err.name || "Lỗi không xác định"} - ${
                    err.message || "Không có thông tin chi tiết"
                  }`
                );
              }
            });
        })
        .catch((err) => {
          console.error("Lỗi liệt kê camera:", {
            name: err.name,
            message: err.message,
            stack: err.stack,
          });
          setCameraError(
            "Không thể liệt kê camera: " + (err.message || "Lỗi không xác định")
          );
        });
    }

    // Dọn dẹp
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isQRModalOpen]);

  // Hàm quét QR
  const scanQR = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.log("Video hoặc canvas không sẵn sàng");
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const scan = () => {
      if (!isQRModalOpen) return; // Dừng nếu modal đóng

      if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        // Đặt kích thước canvas
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        // Kiểm tra kích thước canvas
        if (canvas.width === 0 || canvas.height === 0) {
          console.log("Kích thước canvas không hợp lệ, bỏ qua quét");
          animationFrameId.current = requestAnimationFrame(scan);
          return;
        }

        console.log("Đang quét khung hình...");
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        try {
          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });
          if (code) {
            console.log("Dữ liệu QR đã quét:", code.data);
            setQRData(code.data);
            stopStream();
            // Dừng quét
            if (animationFrameId.current) {
              cancelAnimationFrame(animationFrameId.current);
            }
            return;
          }
        } catch (err) {
          console.error("Lỗi khi lấy dữ liệu hình ảnh:", err);
        }
      } else {
        console.log(
          "Video chưa sẵn sàng, readyState:",
          videoRef.current.readyState
        );
      }
      animationFrameId.current = requestAnimationFrame(scan);
    };

    // Bắt đầu quét sau timeout ngắn để đảm bảo video sẵn sàng
    setTimeout(scan, 500);
  };

  const stopStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      console.log("Đã dừng luồng video từ stopStream");
    }
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      console.log("Đã hủy animation frame từ stopStream");
    }
  };

  const handleOpenModalKHC = () => {
    setInitialQRData(null);
    setModalKHCOpen(true);
  };

  const handleCloseModalKHC = () => {
    setInitialQRData(null);
    setModalKHCOpen(false);
  };

  const handleCloseModalKC = () => {
    setSelectedKhachHang([]);
    onClose();
  };

  const openQRScanner = () => {
    setQRData("");
    setQRModalOpen(true);
  };


  const handleOpenEditModal = (khachHang) => {
    setEditKhachHang(khachHang);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditKhachHang(null);
    setEditModalOpen(false);
  };

  const closeQRScanner = () => {
    setQRData("");
    setQRModalOpen(false);
    // Đảm bảo dừng luồng video khi đóng modal
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      console.log("Đã dừng luồng video khi đóng modal");
    }
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      console.log("Đã hủy animation frame khi đóng modal");
    }
  };

  const parseQRData = (rawData) => {
    const fields = rawData.split("|");

    // Hàm chuyển đổi ngày sinh từ DDMMYYYY sang YYYY-MM-DD
    const parseDate = (dateStr) => {
      if (!dateStr || dateStr.length !== 8) {
        return ""; // Trả về rỗng nếu không hợp lệ
      }

      try {
        const day = dateStr.slice(0, 2); // Lấy 2 ký tự đầu (ngày)
        const month = dateStr.slice(2, 4); // Lấy 2 ký tự tiếp (tháng)
        const year = dateStr.slice(4, 8); // Lấy 4 ký tự cuối (năm)

        // Kiểm tra định dạng số hợp lệ
        if (!/^\d{8}$/.test(dateStr)) {
          return "";
        }

        // Tạo chuỗi định dạng YYYY-MM-DD
        const formattedDate = `${year}-${month}-${day}`;

        // Kiểm tra xem ngày có hợp lệ không
        const date = new Date(formattedDate);
        if (
          date.getFullYear() !== parseInt(year) ||
          date.getMonth() + 1 !== parseInt(month) ||
          date.getDate() !== parseInt(day)
        ) {
          return "";
        }

        return formattedDate;
      } catch (error) {
        console.error("Lỗi khi phân tích ngày sinh:", error);
        return "";
      }
    };

    return {
      cmnd: fields[0] || "",
      hoTen: fields[2] || "",
      ngaySinh: parseDate(fields[3]),
      gioiTinh: fields[4] || "",
      diaChi: fields[5] || "",
    };
  };

  const handleScanner = async (e, data) => {
    if (e && e.preventDefault) e.preventDefault();
    const rawData = data;
    const qrParsedData = parseQRData(rawData);

    // Lấy thông tin loại phòng và số khách đã check-in
    const loaiPhong = await getLoaiPhongById(thongTinDatPhong.loaiPhong.id);
    const daCheckin = await getKhachHangCheckinByThongTinId(
      thongTinDatPhong.id
    );
    const tongSoKhach = (daCheckin.data.length || 0) + 1; // Thêm 1 khách từ QR

    // Kiểm tra nếu vượt quá số khách tối đa
    if (tongSoKhach > loaiPhong.data.soKhachToiDa) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Số khách check-in (${tongSoKhach}) vượt quá số khách tối đa cho phép (${loaiPhong.data.soKhachToiDa}).`,
        confirmButtonText: "OK",
        confirmButtonColor: "#6a5acd",
      });
      closeQRScanner();
      return;
    }

    // Tiếp tục xử lý check-in QR
    const response = await qrCheckIn(qrParsedData, thongTinDatPhong.id);
    if (response.data === true) {
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Check-in thành công",
        confirmButtonText: "OK",
        confirmButtonColor: "#6a5acd",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Khách hàng này đã check-in",
        confirmButtonText: "OK",
        confirmButtonColor: "#6a5acd",
      });
    }

    fetchKhachHangList(trangThai, searchKeyword, page);
    fetchCheckedInKhachHang();
    setQRModalOpen(false);
    handleCloseModalKC();
  };
  const handleKhachHangUpdated = () => {
    fetchKhachHangList(trangThai, searchKeyword, page);
    fetchCheckedInKhachHang();
  };

  const handleCreate = async () => {
    try {
      if (!selectedKhachHang || selectedKhachHang.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Vui lòng chọn ít nhất một khách hàng để check-in.",
          confirmButtonText: "OK",
          confirmButtonColor: "#6a5acd",
        });
        return;
      }

      // Lấy thông tin loại phòng và số khách đã check-in
      const loaiPhong = await getLoaiPhongById(thongTinDatPhong.loaiPhong.id);
      const daCheckin = await getKhachHangCheckinByThongTinId(
        thongTinDatPhong.id
      );

      // Tính tổng số khách (đã check-in + mới chọn)
      const tongSoKhach =
        (daCheckin.data.length || 0) + (selectedKhachHang.length || 0);

      // Tiếp tục xử lý tạo khách hàng nếu chưa có ID
      const khachHangToCreate = [];
      for (let kh of selectedKhachHang) {
        if (!kh.id) {
          const response = await createKhachHang(kh);
          if (response) khachHangToCreate.push(response.data);
        } else {
          khachHangToCreate.push(kh);
        }
      }

      // Lấy ID xếp phòng
      let idXepPhong = null;
      try {
        const resXepPhong = await getXepPhongByThongTinDatPhongId(
          thongTinDatPhong.id
        );
        idXepPhong = resXepPhong?.data?.id || null;
        console.log("Lấy được idXepPhong:", idXepPhong);
      } catch (err) {
        console.error("Lỗi khi lấy idXepPhong từ API:", err);
      }

      // Xử lý phụ thu
      await handlePhuThu(idXepPhong, loaiPhong, tongSoKhach);
      // Kiểm tra nếu tổng số khách vượt quá số khách tối đa
      if (tongSoKhach > loaiPhong.data.soKhachToiDa) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: `Số khách check-in (${tongSoKhach}) vượt quá số khách tối đa cho phép (${loaiPhong.data.soKhachToiDa}).`,
          confirmButtonText: "OK",
          confirmButtonColor: "#6a5acd",
        });
        return;
      }
      // Tạo yêu cầu check-in
      const checkinRequests = khachHangToCreate.map((kh) => ({
        khachHang: kh,
        thongTinDatPhong: thongTinDatPhong,
        trangThai: false,
      }));

      // Gửi yêu cầu check-in
      const responses = await Promise.all(
        checkinRequests.map((req) => them(req))
      );
      console.log("Tạo nhiều khách hàng check-in thành công:", responses);

      // Điều hướng đến trang chi tiết
      const maThongTinDatPhong = thongTinDatPhong.maThongTinDatPhong;
      navigate("/chi-tiet-ttdp", { state: { maThongTinDatPhong } });

      // Gọi callback khi check-in thành công
      if (onCheckinSuccess) {
        onCheckinSuccess();
      }

      // Reset danh sách khách hàng được chọn
      setSelectedKhachHang([]);

      // Thông báo thành công
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Check-in khách hàng thành công!",
        confirmButtonText: "OK",
        confirmButtonColor: "#6a5acd",
      });
    } catch (error) {
      console.log("Lỗi khi thêm nhiều khách hàng check-in:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi thực hiện check-in. Vui lòng thử lại.",
        confirmButtonText: "OK",
        confirmButtonColor: "#6a5acd",
      });
    }
  };

  const handlePhuThu = async (idXepPhong, loaiPhong, tongSoKhach) => {
    const { soKhachTieuChuan = 0, phuThuNguoiLon = 0 } = loaiPhong.data;

    const tong = Number(tongSoKhach);
    const tieuChuan = Number(soKhachTieuChuan);

    const soNguoiVuot = Math.max(0, tong - tieuChuan);

    if (soNguoiVuot <= 0) {
      console.log("Không vượt số khách tiêu chuẩn, không cần phụ thu.");
      Swal.fire({
        icon: "info",
        title: "Thông báo",
        text: "Số khách không vượt quá tiêu chuẩn, không cần phụ thu.",
        confirmButtonText: "OK",
        confirmButtonColor: "#6a5acd",
      });
      return;
    }

    const tenPhuThu = `Phụ thu do vượt quá số khách người lớn`;
    const tienPhuThu = soNguoiVuot * Number(phuThuNguoiLon);

    const phuThuRequest = {
      xepPhong: { id: idXepPhong },
      tenPhuThu,
      tienPhuThu,
      soLuong: soNguoiVuot,
      trangThai: false,
    };

    try {
      const response = await CheckPhuThuExists(idXepPhong, tenPhuThu);
      console.log("CheckPhuThuExists response data:", response?.data);

      const existingPhuThu = response?.data;

      const isChanged =
        existingPhuThu &&
        (existingPhuThu.soLuong !== soNguoiVuot ||
          existingPhuThu.tienPhuThu !== tienPhuThu);

      if (existingPhuThu && isChanged) {
        console.log("Đang cập nhật phụ thu hiện tại:", existingPhuThu);
        await CapNhatPhuThu({ ...existingPhuThu, ...phuThuRequest });
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Đã cập nhật phụ thu.",
          confirmButtonText: "OK",
          confirmButtonColor: "#6a5acd",
        });
      } else if (existingPhuThu && !isChanged) {
        console.log("Phụ thu không thay đổi, không cần cập nhật.");
        Swal.fire({
          icon: "info",
          title: "Thông báo",
          text: "Phụ thu đã tồn tại và không có thay đổi.",
          confirmButtonText: "OK",
          confirmButtonColor: "#6a5acd",
        });
      } else {
        console.log("Không tìm thấy phụ thu hiện tại, tạo mới.");
        await ThemPhuThu(phuThuRequest);
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Đã tạo phụ thu mới.",
          confirmButtonText: "OK",
          confirmButtonColor: "#6a5acd",
        });
      }
    } catch (err) {
      if (err.response?.status === 404) {
        console.log("404 - Không tìm thấy phụ thu, tạo mới.");
        await ThemPhuThu(phuThuRequest);
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Đã tạo phụ thu mới.",
          confirmButtonText: "OK",
          confirmButtonColor: "#6a5acd",
        });
      } else {
        console.error("Lỗi khi xử lý phụ thu:", err);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Đã xảy ra lỗi khi xử lý phụ thu. Vui lòng thử lại.",
          confirmButtonText: "OK",
          confirmButtonColor: "#6a5acd",
        });
      }
    }
  };

  const fetchKhachHangList = async (trangThai, keyword, pageNumber) => {
    try {
      const response = await getKhachHangByKey(trangThai, keyword, {
        page: pageNumber - 1,
        size: rowsPerPage,
      });
      setKhachHangList(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.log("Lỗi khi lấy danh sách khách hàng:", error);
      setKhachHangList([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    if (qrData) {
      handleScanner(null, qrData);
    }
  }, [qrData]);

  useEffect(() => {
    fetchKhachHangList(trangThai, searchKeyword, page);
  }, [searchKeyword, trangThai, page]);

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    setPage(1);
  };

  const handleTrangThaiChange = (e) => {
    const value = e.target.value === "" ? null : e.target.value;
    setTrangThai(value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowSelection = (kh) => {
    if ( kh.trangThai && !checkedInKhachHangIds.includes(kh.id)) {
      setSelectedKhachHang((prev) => {
        const isSelected = prev.some((item) => item.id === kh.id);
        if (isSelected) {
          return prev.filter((item) => item.id !== kh.id);
        } else {
          return [...prev, kh];
        }
      });
    }
  };

  const isSelected = (id) => selectedKhachHang.some((kh) => kh.id === id);

  const handleKhachHangAdded = () => {
    fetchKhachHangList(trangThai, searchKeyword, page);
    fetchCheckedInKhachHang();
  };

  if (!isOpen) return null;

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 1200 },
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: "80vh",
    overflowY: "auto",
  };

  return (
    <>
      <Modal open={isOpen} onClose={onClose}  ref={dialogRef}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h3" gutterBottom>
            {thongTinDatPhong.maThongTinDatPhong} - Tìm Hồ Sơ Khách Hàng
          </Typography>

          <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Tìm kiếm (Họ, Tên, SĐT, Email, CMND)"
                variant="outlined"
                value={searchKeyword}
                onChange={handleSearchChange}
              />
              <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={trangThai === null ? "" : trangThai}
                  onChange={handleTrangThaiChange}
                  label="Trạng thái"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value={true}>Hoạt động</MenuItem>
                  <MenuItem value={false}>Không hoạt động</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={handleOpenModalKHC}>
                Tạo Mới
              </Button>
              <Button variant="contained" onClick={openQRScanner}>
                Quét QR
              </Button>
            </Stack>

            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: { xs: 300, sm: 1000 } }}
                aria-label="bảng khách hàng"
              >
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell>STT</TableCell>
                    <TableCell>CMND</TableCell>
                    <TableCell>Họ và Tên</TableCell>
                    <TableCell>Giới Tính</TableCell>
                    <TableCell>SĐT</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Địa Chỉ</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {khachHangList.length > 0 ? (
                    khachHangList.map((kh, index) => (
                      <TableRow
                        key={kh.id}
                        hover
                        onClick={() => handleRowSelection(kh)}
                        selected={isSelected(kh.id)}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSelected(kh.id)}
                            onChange={() => handleRowSelection(kh)}
                            disabled={checkedInKhachHangIds.includes(kh.id)}
                          />
                        </TableCell>
                        <TableCell>
                          {(page - 1) * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell>{kh.cmnd || "N/A"}</TableCell>
                        <TableCell>{`${kh.ho} ${kh.ten}`}</TableCell>
                        <TableCell>{kh.gioiTinh || "N/A"}</TableCell>
                        <TableCell>{kh.sdt || "N/A"}</TableCell>
                        <TableCell>{kh.email || "N/A"}</TableCell>
                        <TableCell>{kh.diaChi || "N/A"}</TableCell>
                        <TableCell>
                          {kh.trangThai ? "Hoạt động" : "Không hoạt động"}
                        </TableCell>
                        <TableCell>
                         
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditModal(kh);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        Không tìm thấy khách hàng
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {totalPages > 1 && (
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{ display: "flex", justifyContent: "center", mt: 2 }}
              />
            )}
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            {selectedKhachHang.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreate}
              >
                Tạo Check-in ({selectedKhachHang.length})
              </Button>
            )}
            <Button variant="outlined" onClick={handleCloseModalKC}>
              Đóng
            </Button>
          </Stack>
        </Box>
      </Modal>

      <ModalCreateKHC
        isOpen={isModalKHCOpen}
        onClose={handleCloseModalKHC}
        thongTinDatPhong={thongTinDatPhong}
        onKhachHangAdded={handleKhachHangAdded}
        initialData={initialQRData}
      />
      <ModalUpdateKHC
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        khachHang={editKhachHang}
        onKhachHangUpdated={handleKhachHangUpdated}
      />

      <Modal open={isQRModalOpen} onClose={closeQRScanner}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 600 },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h3" gutterBottom>
            Quét Mã QR
          </Typography>
          {cameraError ? (
            <Typography color="error" sx={{ mb: 2 }}>
              {cameraError}
            </Typography>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  border: "1px solid #ccc",
                }}
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </>
          )}
          <Button
            variant="outlined"
            onClick={closeQRScanner}
            sx={{ mt: 2 }}
            fullWidth
          >
            Đóng
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ModalKhachHangCheckin;
