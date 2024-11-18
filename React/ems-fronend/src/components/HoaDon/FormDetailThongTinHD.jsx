import React from 'react';
import './DetailHD.css';

const FormDetailThongTinHD = ({ thongTinHoaDon, handleClose }) => {
    // Tính tổng tiền từ các trường có sẵn, đảm bảo mỗi trường là số
    const tienDichVu = parseFloat(thongTinHoaDon.tienDichVu) || 0;
    const tienPhong = parseFloat(thongTinHoaDon.tienPhong) || 0;
    const tienPhuThu = parseFloat(thongTinHoaDon.tienPhuThu) || 0;

    const tongTien = tienDichVu + tienPhong + tienPhuThu;

    return (
        <div className="modal_hd" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="detail_hd_modal-dialog">
                <div className="modal-content-hd">
                    <div className="modal-header-hd">
                        <h5 className="modal-title-hd">Chi tiết thông tin hóa đơn</h5>
                        <button type="button" className="detail_hd_close-button" onClick={handleClose}>×</button>
                    </div>
                    <div className="modal-body-hd">
                        <div className="form-row-hd">
                            <div className="form-column-hd">
                                <div className="form-group-hd">
                                    <label><strong>ID Trả Phòng:</strong></label>
                                    <p>{thongTinHoaDon.idTraPhong}</p>
                                </div>
                                <div className="form-group-hd">
                                    <label><strong>ID Hóa Đơn:</strong></label>
                                    <p>{thongTinHoaDon.idHoaDon}</p>
                                </div>
                                <div className="form-group-hd">
                                    <label><strong>Tiền Dịch Vụ:</strong></label>
                                    <p>{thongTinHoaDon.tienDichVu}</p>
                                </div>
                            </div>
                            <div className="form-column-hd">
                                <div className="form-group-hd">
                                    <label><strong>Tiền Phòng:</strong></label>
                                    <p>{thongTinHoaDon.tienPhong}</p>
                                </div>
                                <div className="form-group-hd">
                                    <label><strong>Tiền Phụ Thu:</strong></label>
                                    <p>{thongTinHoaDon.tienPhuThu}</p>
                                </div>
                                <div className="form-group-hd">
                                    <label><strong>Tổng Tiền:</strong></label>
                                    <p>{tongTien.toFixed(2)}</p> {/* Hiển thị tổng tiền đã tính */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormDetailThongTinHD;
