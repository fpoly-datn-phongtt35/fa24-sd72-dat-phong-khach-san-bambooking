import React, { useState, useEffect } from 'react';
import { listVatTuLoaiPhong, addVatTuLoaiPhong } from '../../services/VatTuLoaiPhong';
import { DanhSachDichVu } from '../../services/DichVuDiKemService';
import { ThemDichVuDiKem } from '../../services/LoaiPhongService';
import Swal from 'sweetalert2';
import './Detail.css';

const AddServiceUtilityModal = ({ show, handleClose, loaiPhongId, onAddSuccess }) => {
    const [dichVuList, setDichVuList] = useState([]);
    const [allTienIch, setAllTienIch] = useState([]);
    const [selectedDichVu, setSelectedDichVu] = useState('');
    const [selectedVatTu, setSelectedVatTu] = useState('');
    const [soLuongDichVu, setSoLuongDichVu] = useState('');
    const [soLuongVatTu, setSoLuongVatTu] = useState('');

    useEffect(() => {
        listVatTuLoaiPhong().then(response => setAllTienIch(response.data)).catch(console.error);
        DanhSachDichVu().then(response => setDichVuList(response.data)).catch(console.error);
    }, []);

    const handleAddDichVuDiKem = () => {
        if (!selectedDichVu || !soLuongDichVu) {
            Swal.fire({ title: 'Lỗi!', text: 'Vui lòng chọn dịch vụ và nhập số lượng.', icon: 'error' });
            return;
        }
        const dichVuDiKemRequest = { loaiPhong: { id: loaiPhongId }, dichVu: { id: selectedDichVu }, soLuong: parseInt(soLuongDichVu), trangThai: true };
        ThemDichVuDiKem(dichVuDiKemRequest)
            .then(() => {
                Swal.fire({ title: 'Thành công!', text: 'Dịch vụ đã được thêm.', icon: 'success' });
                setSelectedDichVu('');
                setSoLuongDichVu('');
                onAddSuccess();
            })
            .catch(() => Swal.fire({ title: 'Lỗi!', text: 'Không thể thêm dịch vụ.', icon: 'error' }));
    };

    const handleAddTienIch = () => {
        if (!selectedVatTu || !soLuongVatTu) {
            Swal.fire({ title: 'Lỗi!', text: 'Vui lòng chọn vật tư và nhập số lượng.', icon: 'error' });
            return;
        }
        const vatTuPhongRequest = { loaiPhong: { id: loaiPhongId }, vatTu: { id: selectedVatTu }, soLuong: parseInt(soLuongVatTu) };
        addVatTuLoaiPhong(vatTuPhongRequest)
            .then(() => {
                Swal.fire({ title: 'Thành công!', text: 'Vật tư đã được thêm.', icon: 'success' });
                setSelectedVatTu('');
                setSoLuongVatTu('');
                onAddSuccess();
            })
            .catch(() => Swal.fire({ title: 'Lỗi!', text: 'Không thể thêm vật tư.', icon: 'error' }));
    };

    return (
        <div className={`modal ${show ? 'show fade-in' : 'fade-out'}`} style={{ display: show ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content shadow-lg">
                    <div className="modal-header  text-white">
                        <h5 className="modal-title">Thêm Dịch Vụ & Vật Tư</h5>
                        <button type="button" className="btn-close btn-close-black" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="row">
                            {/* Thêm dịch vụ đi kèm */}
                            <div className="col-md-6 mb-4">
                                <div className="mb-3">
                                    <label htmlFor="selectedDichVu" className="form-label">Chọn dịch vụ</label>
                                    <select
                                        id="selectedDichVu"
                                        className="form-select"
                                        value={selectedDichVu}
                                        onChange={(e) => setSelectedDichVu(e.target.value)}
                                    >
                                        <option value="">-- Chọn dịch vụ --</option>
                                        {dichVuList.map(dv => (
                                            <option key={dv.id} value={dv.id}>{dv.tenDichVu}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="soLuongDichVu" className="form-label">Số lượng</label>
                                    <input
                                        type="number"
                                        id="soLuongDichVu"
                                        className="form-control"
                                        value={soLuongDichVu}
                                        onChange={(e) => setSoLuongDichVu(e.target.value)}
                                        min="1"
                                        placeholder="Nhập số lượng"
                                    />
                                </div>
                                <button type="button" className="btn btn-primary w-100" onClick={handleAddDichVuDiKem}>
                                    Thêm Dịch Vụ
                                </button>
                            </div>

                            {/* Thêm vật tư loại phòng */}
                            <div className="col-md-6 mb-4">
                                <div className="mb-3">
                                    <label htmlFor="selectVatTu" className="form-label">Chọn vật tư</label>
                                    <select
                                        id="selectVatTu"
                                        className="form-select"
                                        value={selectedVatTu}
                                        onChange={(e) => setSelectedVatTu(e.target.value)}
                                    >
                                        <option value="">-- Chọn vật tư --</option>
                                        {allTienIch.map(ti => (
                                            <option key={ti.id} value={ti.id}>{ti.tenVatTu}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="soLuongVatTu" className="form-label">Số lượng</label>
                                    <input
                                        type="number"
                                        id="soLuongVatTu"
                                        className="form-control"
                                        value={soLuongVatTu}
                                        onChange={(e) => setSoLuongVatTu(e.target.value)}
                                        min="1"
                                        placeholder="Nhập số lượng"
                                    />
                                </div>
                                <button type="button" className="btn btn-primary w-100" onClick={handleAddTienIch}>
                                    Thêm Vật Tư
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddServiceUtilityModal;