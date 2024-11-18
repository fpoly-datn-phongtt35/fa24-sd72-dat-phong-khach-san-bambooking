import React from 'react';
import './DetailHD.css';

const FormDetailHD = ({ hoaDon, handleClose }) => {
    return (
        <div className="modal_hd" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="detail_hd_modal-dialog">
                <div className="modal-content-hd">
                    <div className="modal-header-hd">
                        <h5 className="modal-title-hd">Chi tiết hóa đơn</h5>
                        <button type="button" className="detail_hd_close-button" onClick={handleClose}>×</button>
                    </div>
                    <div className="modal-body-hd">
                        <div className="form-row-hd">
                            <div className="form-column-hd">
                                <div className="form-group-hd">
                                    <label><strong>Mã hóa đơn:</strong></label>
                                    <p>{hoaDon.maHoaDon}</p>
                                </div>
                                <div className="form-group-hd">
                                    <label><strong>Tên nhân viên:</strong></label>
                                    <p>{hoaDon.hoTenNhanVien}</p>
                                </div>
                                <div className="form-group-hd">
                                    <label><strong>Mã đặt phòng:</strong></label>
                                    <p>{hoaDon.maDatPhong}</p>
                                </div>
                            </div>
                            <div className="form-column-hd">
                                <div className="form-group-hd">
                                    <label><strong>Ngày tạo:</strong></label>
                                    <p>{hoaDon.ngayTao}</p>
                                </div>
                                <div className="form-group-hd">
                                    <label><strong>Tổng tiền:</strong></label>
                                    <p>{hoaDon.tongTien}</p>
                                </div>
                                <div className="form-group-hd">
                                    <label><strong>Trạng thái:</strong></label>
                                    <p>{hoaDon.trangThai}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormDetailHD;
