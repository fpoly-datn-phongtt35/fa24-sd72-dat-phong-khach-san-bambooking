import React, { useState, useEffect } from "react";
import "./ModalKhachHangCheckin.scss";
import ModalCreateKHC from "./ModalCreateKHC";
import UploadQR from "../UploadQR";
import { createKhachHang } from "../../services/KhachHangService";
import { them } from "../../services/KhachHangCheckin";
import { useNavigate } from "react-router-dom";

const ModalKhachHangCheckin = ({ isOpen, onClose, thongTinDatPhong }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isQRModalOpen, setQRModalOpen] = useState(false);
  const [qrData, setQRData] = useState(""); // Lưu dữ liệu quét được từ QR
  const [khachHang, setKhachHang] = useState({}); // Lưu thông tin khách hàng
  const navigate = useNavigate();

  const handleOpenModal = () => {
    setQRData(""); // Xoá dữ liệu qrData trước khi mở modal
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setQRData("");
    setModalOpen(false);
  };

  const openQRScanner = () => {
    setQRData("");
    setQRModalOpen(true);
  };

  const closeQRScanner = () => {
    setQRData("");
    setQRModalOpen(false);
  };

  const handleScanner = async (e, data) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const rawData = data; // Dữ liệu đến từ QR
    // Tách chuỗi thành mảng theo dấu "|"
    const fields = rawData.split("|");

    // Tách họ và tên từ trường thứ 3 (ví dụ: "Lương Tuấn Đạt")
    const nameParts = fields[2].split(" ");

    // Xây dựng đối tượng khData với các trường cần thiết
    const newKhData = {
      cccd: fields[0],
      ho: nameParts[0],
      ten: nameParts.slice(1).join(" "),
      diaChi: fields[5],
      trangThai: true,
    };

    setKhachHang(newKhData);
    console.log("Dữ liệu khách hàng từ QR:", newKhData);
  };

  const handleCreate = async () => {
    try {
      // Kiểm tra xem có dữ liệu khách hàng không
      if (!khachHang || Object.keys(khachHang).length === 0) {
        console.log("Chưa có dữ liệu khách hàng từ QR");
        return;
      }
      const response = await createKhachHang(khachHang);
      if (response != null) {
        const KHCRequest = {
          khachHang: response.data,
          thongTinDatPhong: thongTinDatPhong,
          trangThai: true,
        };
        const response2 = await them(KHCRequest);
        console.log("Tạo khách hàng thành công:", response2);
        // Ví dụ: chuyển hướng hoặc cập nhật giao diện sau khi tạo thành công
        const maThongTinDatPhong = thongTinDatPhong.maThongTinDatPhong;
        navigate("/chi-tiet-ttdp", { state: { maThongTinDatPhong } });
      }
    } catch (error) {
      console.log("Lỗi khi thêm khách hàng", error);
    }
  };

  // useEffect lắng nghe qrData; khi qrData thay đổi và không rỗng, gọi handleScanner
  useEffect(() => {
    if (qrData) {
      handleScanner(null, qrData);
      setQRModalOpen(false);
    }
  }, [qrData]);

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? "open" : ""}`}>
      <div className="modal-container">
        <div className="modal-header">
          <h3>{thongTinDatPhong.maThongTinDatPhong} Search Profile</h3>
        </div>
        <div className="modal-body">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Filter by Profile Name"
              className="search-input"
            />
            <button className="new-btn" onClick={handleOpenModal}>
              New
            </button>
            <button className="new-btn" onClick={openQRScanner}>
              QR
            </button>
          </div>

          {qrData && (
            <div className="qr-result">
              <p>
                <strong>Dữ liệu từ QR Code:</strong> {qrData}
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {/* Nút "Tạo khách hàng" sẽ hiển thị nếu đã có dữ liệu khách hàng từ QR */}
          {qrData !== "" && (
            <button className="link-btn" onClick={handleCreate}>
              Tạo khách hàng
            </button>
          )}
          <button className="link-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      {/* Modal tạo hồ sơ khách hàng */}
      <ModalCreateKHC
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        thongTinDatPhong={thongTinDatPhong}
      />

      {/* Modal quét QR Code */}
      {isQRModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Quét QR Code</h3>
            </div>
            <div className="modal-body">
              <UploadQR setQRData={setQRData} />
            </div>
            <div className="modal-footer">
              <button className="close-btn" onClick={closeQRScanner}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalKhachHangCheckin;
