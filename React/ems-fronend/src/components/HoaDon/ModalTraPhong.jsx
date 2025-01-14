import React from 'react';

const ModalTraPhong = ({ showModal, selectedTraPhong, closeModal }) => {
    if (!showModal || !selectedTraPhong) return null;

    return (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Thông Tin Trả Phòng</h5>
                        <button type="button" className="close" onClick={closeModal}>&times;</button>
                    </div>
                    <div className="modal-body">
                        <p><strong>Ngày nhận phòng:</strong> {selectedTraPhong.ngayNhanPhong}</p>
                        <p><strong>Ngày trả phòng:</strong> {selectedTraPhong.ngayTraPhong}</p>
                        <p><strong>Ngày trả thực tế:</strong> {selectedTraPhong.ngayTraThucTe}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalTraPhong;
