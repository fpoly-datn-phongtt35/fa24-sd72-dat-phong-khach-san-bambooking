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
import Swal from 'sweetalert2';
import ModalCreateKHC from "./ModalCreateKHC";
import ModalUpdateKHC from "./ModalUpdateKHC";
import {
  createKhachHang,
  getKhachHangByKey,
} from "../../services/KhachHangService";
import { them, DanhSachKHC, getKhachHangCheckinByThongTinId, qrCheckIn } from "../../services/KhachHangCheckin";
import { ThemPhuThu, CapNhatPhuThu, CheckPhuThuExists } from '../../services/PhuThuService';
import { getLoaiPhongById } from '../../services/LoaiPhongService';
import { getXepPhongByThongTinDatPhongId } from '../../services/XepPhongService.js';

const ModalKhachHangCheckin = ({
  isOpen,
  onClose,
  thongTinDatPhong,
  onCheckinSuccess,
}) => {
  const [isModalKHCOpen, setModalKHCOpen] = useState(false);
  const [isQRModalOpen, setQRModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
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
  const [editKhachHang, setEditKhachHang] = useState(null);
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

  // Reset selectedKhachHang và lấy danh sách check-in khi modal mở
  useEffect(() => {
    if (isOpen) {
      setSelectedKhachHang([]);
      fetchCheckedInKhachHang();
    }
  }, [isOpen, thongTinDatPhong]);

  // Khởi tạo và quét QR
  useEffect(() => {
    if (isQRModalOpen) {
      setCameraError(null);
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const videoDevices = devices.filter(device => device.kind === "videoinput");
          if (videoDevices.length === 0) {
            setCameraError("Không tìm thấy camera trên thiết bị.");
            return;
          }
          const preferredCamera = videoDevices.find(device => device.label.includes('USB2.0 HD UVC WebCam')) || videoDevices[0];
          const constraints = {
            video: {
              deviceId: preferredCamera.deviceId ? { exact: preferredCamera.deviceId } : undefined,
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
              videoRef.current.onloadedmetadata = () => {
                scanQR();
              };
            })
            .catch((err) => {
              console.error("Lỗi truy cập camera:", err);
              setCameraError(`Lỗi truy cập camera: ${err.message}`);
            });
        })
        .catch((err) => {
          console.error("Lỗi liệt kê camera:", err);
          setCameraError("Không thể liệt kê camera.");
        });
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isQRModalOpen]);

  // Hàm quét QR
  const scanQR = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const scan = () => {
      if (!isQRModalOpen) return;

      if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        if (canvas.width === 0 || canvas.height === 0) {
          animationFrameId.current = requestAnimationFrame(scan);
          return;
        }

        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        try {
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });
          if (code) {
            setQRData(code.data);
            stopStream();
            return;
          }
        } catch (err) {
          console.error("Lỗi khi lấy dữ liệu hình ảnh:", err);
        }
      }
      animationFrameId.current = requestAnimationFrame(scan);
    };

    setTimeout(scan, 500);
  };

  const stopStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
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

  const closeQRScanner = () => {
    setQRData("");
    setQRModalOpen(false);
    stopStream();
  };

  const handleOpenEditModal = (khachHang) => {
    setEditKhachHang(khachHang);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditKhachHang(null);
    setEditModalOpen(false);
  };

  const parseQRData = (rawData) => {
    const fields = rawData.split("|");
    return {
      cmnd: fields[0] || "",
      hoTen: fields[2] || "",
      ngaySinh: fields[3] || "",
      gioiTinh: fields[4] || "",
      diaChi: fields[5] || "",
    };
  };

  const handleScanner = async (e, data) => {
    if (e && e.preventDefault) e.preventDefault();
    const qrParsedData = parseQRData(data);
    try {
      const response = await qrCheckIn(qrParsedData, thongTinDatPhong.id);
      if (response.data) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Checkin thành công',
          confirmButtonText: 'OK',
          confirmButtonColor: '#6a5acd'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Khách hàng này đã Checkin',
          confirmButtonText: 'OK'
        });
      }
      fetchKhachHangList(trangThai, searchKeyword, page);
      fetchCheckedInKhachHang();
      setQRModalOpen(false);
      handleCloseModalKC();
    } catch (error) {
      console.error("Lỗi khi check-in QR:", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Đã có lỗi xảy ra khi check-in',
        confirmButtonText: 'OK'
      });
    }
    
  };

  const handleKhachHangUpdated = () => {
    fetchKhachHangList(trangThai, searchKeyword, page);
    fetchCheckedInKhachHang();
  };

  const handleCreate = async () => {
    try {
      if (!selectedKhachHang || selectedKhachHang.length === 0) {
        console.log("Chưa chọn khách hàng nào để check-in");
        return;
      }

      const khachHangToCreate = [];
      for (let kh of selectedKhachHang) {
        if (!kh.id) {
          const response = await createKhachHang(kh);
          if (response) khachHangToCreate.push(response.data);
        } else {
          khachHangToCreate.push(kh);
        }
      }

      let idXepPhong = null;
      try {
        const resXepPhong = await getXepPhongByThongTinDatPhongId(thongTinDatPhong.id);
        idXepPhong = resXepPhong?.data?.id || null;
      } catch (err) {
        console.error("Lỗi khi lấy idXepPhong:", err);
      }

      const daCheckin = await getKhachHangCheckinByThongTinId(thongTinDatPhong.id);
      const tongSoKhach = (daCheckin.data.length || 0) + (khachHangToCreate.length || 0);
      const loaiPhong = await getLoaiPhongById(thongTinDatPhong.loaiPhong.id);
      const soKhachVuot = tongSoKhach - (loaiPhong.data.soKhachToiDa || 0);

      if (soKhachVuot > 0) {
        const tienPhuThu = (loaiPhong.data.donGiaPhuThu || 0) * soKhachVuot;
        const phuThuRequest = {
          xepPhong: { id: idXepPhong },
          tenPhuThu: `Phụ thu do vượt quá số khách (${soKhachVuot} người)`,
          tienPhuThu: tienPhuThu,
          soLuong: soKhachVuot,
          trangThai: false,
        };

        try {
          let existingPhuThu = null;
          try {
            const response = await CheckPhuThuExists(idXepPhong);
            existingPhuThu = response?.data;
          } catch (err) {
            if (err.response?.status !== 404) {
              console.error("Lỗi khi kiểm tra phụ thu:", err);
            }
          }

          if (existingPhuThu) {
            if (
              existingPhuThu.soLuong !== soKhachVuot ||
              existingPhuThu.tienPhuThu !== tienPhuThu
            ) {
              const updatedPhuThu = {
                ...existingPhuThu,
                soLuong: soKhachVuot,
                tienPhuThu: tienPhuThu,
                tenPhuThu: `Phụ thu do vượt quá số khách (${soKhachVuot} người)`,
              };
              await CapNhatPhuThu(updatedPhuThu);
            }
          } else {
            await ThemPhuThu(phuThuRequest);
            Swal.fire("Thành công", "Đã tạo phụ thu vượt quá số khách", "success");
          }
        } catch (err) {
          console.error("Lỗi khi xử lý phụ thu:", err);
        }
      }

      const checkinRequests = khachHangToCreate.map((kh) => ({
        khachHang: kh,
        thongTinDatPhong: thongTinDatPhong,
        trangThai: false,
      }));

      await Promise.all(checkinRequests.map((req) => them(req)));
      navigate("/chi-tiet-ttdp", { state: { maThongTinDatPhong: thongTinDatPhong.maThongTinDatPhong } });

      if (onCheckinSuccess) {
        onCheckinSuccess();
      }

      setSelectedKhachHang([]);
    } catch (error) {
      console.log("Lỗi khi thêm nhiều khách hàng check-in:", error);
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
    if (!checkedInKhachHangIds.includes(kh.id)) {
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
      <Modal open={isOpen} onClose={onClose}>
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
              {/* <Button variant="contained" onClick={handleOpenModalKHC}>
                Tạo Mới
              </Button> */}
              <Button variant="contained" onClick={openQRScanner}>
                Quét QR
              </Button>
            </Stack>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: { xs: 300, sm: 1000 } }} aria-label="bảng khách hàng">
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
                        <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{kh.cmnd || "N/A"}</TableCell>
                        <TableCell>{`${kh.ho} ${kh.ten}`}</TableCell>
                        <TableCell>{kh.gioiTinh || "N/A"}</TableCell>
                        <TableCell>{kh.sdt || "N/A"}</TableCell>
                        <TableCell>{kh.email || "N/A"}</TableCell>
                        <TableCell>{kh.diaChi || "N/A"}</TableCell>
                        <TableCell>{kh.trangThai ? "Hoạt động" : "Không hoạt động"}</TableCell>
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
                      <TableCell colSpan={10} align="center">
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
              <Button variant="contained" color="primary" onClick={handleCreate}>
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
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 600 },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
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
                style={{ width: "100%", maxHeight: "400px", border: "1px solid #ccc" }}
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