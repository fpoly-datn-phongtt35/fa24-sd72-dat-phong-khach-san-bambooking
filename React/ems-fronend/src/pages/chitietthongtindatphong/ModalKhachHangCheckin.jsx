import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import ModalCreateKHC from "./ModalCreateKHC";
import ModalCreateKHCU from "./ModalCreateKHCU";
import UploadQR from "../../components/UploadQR";
import {
  createKhachHang,
  getKhachHangByKey,
  updateKhachHang,
} from "../../services/KhachHangService";
import { them } from "../../services/KhachHangCheckin";

const ModalKhachHangCheckin = ({
  isOpen,
  onClose,
  thongTinDatPhong,
  onCheckinSuccess,
}) => {
  const [isModalKHCOpen, setModalKHCOpen] = useState(false);
  const [isModalKHCUOpen, setModalKHCUOpen] = useState(false);
  const [isQRModalOpen, setQRModalOpen] = useState(false);
  const [qrData, setQRData] = useState("");
  const [initialQRData, setInitialQRData] = useState(null); // Dữ liệu QR để truyền vào form tạo mới
  const [selectedKhachHang, setSelectedKhachHang] = useState([]);
  const [khachHangList, setKhachHangList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const rowsPerPage = 5;

  const handleOpenModalKHC = () => {
    setInitialQRData(null); // Reset dữ liệu QR khi mở form thủ công
    setModalKHCOpen(true);
  };

  const handleCloseModalKHC = () => {
    setInitialQRData(null);
    setModalKHCOpen(false);
  };

  const handleOpenModalKHCU = () => {
    setModalKHCUOpen(true);
  };

  const handleCloseModalKHCU = () => {
    setModalKHCUOpen(false);
  };

  const openQRScanner = () => {
    setQRData("");
    setQRModalOpen(true);
  };

  const closeQRScanner = () => {
    setQRData("");
    setQRModalOpen(false);
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
    const rawData = data;
    const qrParsedData = parseQRData(rawData);
    const cmnd = qrParsedData.cmnd;
    setSearchKeyword(cmnd);

    try {
      const response = await getKhachHangByKey(cmnd, {
        page: 0,
        size: rowsPerPage,
      });

      if (response.data.content && response.data.content.length > 0) {
        // Nếu tìm thấy khách hàng
        setKhachHangList(response.data.content);
        setTotalPages(response.data.totalPages || 1);
      } else {
        // Nếu không tìm thấy, mở form tạo mới với dữ liệu QR
        setInitialQRData(qrParsedData);
        setModalKHCOpen(true);
      }
    } catch (error) {
      console.log("Lỗi khi tìm khách hàng:", error);
      // Nếu có lỗi, cũng mở form tạo mới với dữ liệu QR
      setInitialQRData(qrParsedData);
      setModalKHCOpen(true);
    }
    setQRModalOpen(false);
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

      const checkinRequests = khachHangToCreate.map((kh) => ({
        khachHang: kh,
        thongTinDatPhong: thongTinDatPhong,
        trangThai: true,
      }));

      const responses = await Promise.all(
        checkinRequests.map((req) => them(req))
      );
      console.log("Tạo nhiều khách hàng check-in thành công:", responses);

      const maThongTinDatPhong = thongTinDatPhong.maThongTinDatPhong;
      navigate("/chi-tiet-ttdp", { state: { maThongTinDatPhong } });

      if (onCheckinSuccess) {
        onCheckinSuccess();
      }
    } catch (error) {
      console.log("Lỗi khi thêm nhiều khách hàng check-in:", error);
    }
  };

  const fetchKhachHangList = async (keyword, pageNumber) => {
    try {
      const response = await getKhachHangByKey(keyword, {
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
    fetchKhachHangList(searchKeyword, page);
  }, [searchKeyword, page]);

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowSelection = (kh) => {
    setSelectedKhachHang((prev) => {
      const isSelected = prev.some((item) => item.id === kh.id);
      if (isSelected) {
        return prev.filter((item) => item.id !== kh.id);
      } else {
        return [...prev, kh];
      }
    });
  };

  const isSelected = (id) => selectedKhachHang.some((kh) => kh.id === id);

  const handleKhachHangAdded = () => {
    fetchKhachHangList(searchKeyword, page);
  };

  if (!isOpen) return null;

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1200,
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
            <TextField
              fullWidth
              label="Tìm kiếm (Họ, Tên, SĐT, Email, CMND)"
              variant="outlined"
              value={searchKeyword}
              onChange={handleSearchChange}
            />
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={handleOpenModalKHC}>
                Tạo Mới
              </Button>
              <Button variant="contained" onClick={openQRScanner}>
                Quét QR
              </Button>
            </Stack>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 1000 }} aria-label="bảng khách hàng">
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
            <Button variant="outlined" onClick={onClose}>
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
        initialData={initialQRData} // Truyền dữ liệu QR vào form
      />

      <ModalCreateKHCU
        isOpen={isModalKHCUOpen}
        onClose={handleCloseModalKHCU}
        thongTinDatPhong={thongTinDatPhong}
        onKhachHangAdded={handleKhachHangAdded}
      />

      <Modal open={isQRModalOpen} onClose={closeQRScanner}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h3" gutterBottom>
            Quét Mã QR
          </Typography>
          <UploadQR setQRData={setQRData} />
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
