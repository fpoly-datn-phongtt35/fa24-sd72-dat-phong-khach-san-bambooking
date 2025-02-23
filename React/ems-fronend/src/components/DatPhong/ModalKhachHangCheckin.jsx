import React, { useState } from "react";
import "./ModalKhachHangCheckin.scss";
import ModalCreateKHC from "./ModalCreateKHC";
import UploadQR from "../UploadQR";

const ModalKhachHangCheckin = ({ isOpen, onClose, thongTinDatPhong }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isQRModalOpen, setQRModalOpen] = useState(false);
  const [qrData, setQRData] = useState(""); // Lưu dữ liệu quét được từ QR

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const openQRScanner = () => setQRModalOpen(true);
  const closeQRScanner = () => setQRModalOpen(false);

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? "open" : ""}`}>
      <div className="modal-container">
        <div className="modal-header">
          <h3>{thongTinDatPhong.maThongTinDatPhong} Search Profile</h3>
        </div>
        <div className="modal-body">
          <div className="search-bar">
            <input type="text" placeholder="Filter by Profile Name" className="search-input" />
            <button className="new-btn" onClick={handleOpenModal}>New</button>
            <button className="new-btn" onClick={openQRScanner}>QR</button>
          </div>

          {/* Hiển thị kết quả quét QR */}
          {qrData && (
            <div className="qr-result">
              <p><strong>Dữ liệu từ QR Code:</strong> {qrData}</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="link-btn">Link</button>
          <button className="link-btn" onClick={onClose}>Close</button>
        </div>
      </div>

      {/* Modal tạo hồ sơ khách hàng */}
      <ModalCreateKHC isOpen={isModalOpen} onClose={handleCloseModal} thongTinDatPhong={thongTinDatPhong} />

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
              <button className="close-btn" onClick={closeQRScanner}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalKhachHangCheckin;
