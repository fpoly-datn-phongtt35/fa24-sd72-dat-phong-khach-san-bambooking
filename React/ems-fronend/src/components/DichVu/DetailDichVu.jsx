import React from 'react';

const DetailDichVu = ({ dichVu, handleClose }) => {
    console.log("Dữ liệu chi tiết:", dichVu); // Kiểm tra dữ liệu
    if (!dichVu) return null;

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex={-1} role="dialog" style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Chi Tiết Dịch Vụ</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="tenDichVu" className="form-label">Tên Dịch Vụ</label>
                                <input type="text" className="form-control" id="tenDichVu" name="tenDichVu" value={dichVu.tenDichVu} readOnly />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="donGia" className="form-label">Giá</label>
                                <input type="text" className="form-control" id="donGia" name="donGia" value={dichVu.donGia} readOnly />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="moTa" className="form-label">Mô Tả</label>
                                <textarea className="form-control" id="moTa" name="moTa" value={dichVu.moTa} readOnly />
                            </div>

                            {dichVu.hinhAnh && (
                                <div className="mb-3">
                                    <strong>Hình Ảnh:</strong>
                                    <img src={dichVu.hinhAnh} alt={dichVu.tenDichVu} style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                </div>
                            )}

                            <div className="mb-3">
                                <label htmlFor="trangThai" className="form-label">Trạng Thái</label>
                                <input type="text" className="form-control" id="trangThai" name="trangThai" value={dichVu.trangThai ? 'Hoạt động' : 'Ngừng hoạt động'} readOnly />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailDichVu;
