import React, { useState, useEffect } from 'react';
import { updateLoaiPhong, deleteLoaiPhong, DanhSachVatTuLoaiPhong } from '../../services/LoaiPhongService';
import { deleteVatTuLoaiPhong, listVatTuLoaiPhong, addVatTuLoaiPhong } from '../../services/VatTuLoaiPhong'; // Thêm import cho hàm lấy danh sách tiện ích
import { DanhSachDichVu, XoaDichVuDiKem } from '../../services/DichVuDiKemService';
import { ThemDichVuDiKem, DanhSachDichVuDiKem } from '../../services/LoaiPhongService';
import './Detail.css';
import AddServiceUtilityModal from './AddServiceUtilityModal';
import Swal from 'sweetalert2';

const FormDetail = ({ show, handleClose, data }) => {
    const [formData, setFormData] = useState({
        id: data?.id || '',
        tenLoaiPhong: data?.tenLoaiPhong || '',
        maLoaiPhong: data?.maLoaiPhong || '',
        dienTich: data?.dienTich || '',
        soKhachToiDa: data?.soKhachToiDa || '',
        donGia: data?.donGia || '',
        moTa: data?.moTa || '',
        donGiaPhuThu: data?.donGiaPhuThu || '',
    });

    const [showAddModal, setShowAddModal] = useState(false);
    const [ListVatTuLoaiPhong, setListVatTuLoaiPhong] = useState([]);
    const [ListDichVuDiKem, setListDichVuDiKem] = useState([]);
    const itemsPerPage = 3;
    const [currentPage] = useState(0);

    useEffect(() => {
        if (formData.id) {
            fetchDanhSachVatTu();
            fetchDanhSachDichVu();
        }
    }, [formData.id]);

    const fetchDanhSachVatTu = () => {
        DanhSachVatTuLoaiPhong(formData.id)
            .then(response => {
                setListVatTuLoaiPhong(response.data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách vật tư:", error);
            });
    };

    const fetchDanhSachDichVu = () => {
        DanhSachDichVuDiKem(formData.id, { page: currentPage, size: itemsPerPage })
            .then(response => {
                setListDichVuDiKem(response.data.content);
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách dịch vụ đi kèm:", error);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: 'Thông tin loại phòng sẽ được cập nhật!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Cập nhật',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                updateLoaiPhong(formData)
                    .then(() => {
                        Swal.fire({
                            title: 'Thành công!',
                            text: 'Thông tin loại phòng đã được cập nhật.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });
                        handleClose();
                    })
                    .catch(error => {
                        Swal.fire({
                            title: 'Lỗi!',
                            text: 'Không thể cập nhật loại phòng, vui lòng thử lại.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    });
            }
        });
    };

    const handleDeleteDichVuDiKem = (id) => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: 'Dịch vụ đi kèm này sẽ bị xóa và không thể khôi phục!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                XoaDichVuDiKem(id)
                    .then(() => {
                        Swal.fire({
                            title: 'Thành công!',
                            text: 'Dịch vụ đi kèm đã được xóa.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });
                        fetchDanhSachDichVu();
                    })
                    .catch(error => {
                        Swal.fire({
                            title: 'Lỗi!',
                            text: 'Không thể xóa dịch vụ, vui lòng thử lại.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    });
            }
        });
    };

    const handleDeleteVatTuLoaiPhong = (id) => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: 'Vật tư này sẽ bị xóa và không thể khôi phục!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteVatTuLoaiPhong(id)
                    .then(() => {
                        Swal.fire({
                            title: 'Thành công!',
                            text: 'Vật tư đã được xóa.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });
                        fetchDanhSachVatTu();
                    })
                    .catch(error => {
                        Swal.fire({
                            title: 'Lỗi!',
                            text: 'Không thể xóa vật tư, vui lòng thử lại.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    });
            }
        });
    };

    const openAddModal = () => setShowAddModal(true);
    const closeAddModal = () => setShowAddModal(false);

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content shadow-lg">
                    <div className="modal-header  text-white">
                        <h5 className="modal-title">Chi tiết loại phòng</h5>
                        <button type="button" className="btn-close btn-close-blac" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="id" className="form-label fw-bold">ID</label>
                                        <input
                                            type="text"
                                            id="id"
                                            name="id"
                                            className="form-control"
                                            value={formData.id}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="tenLoaiPhong" className="form-label fw-bold">Tên Loại Phòng</label>
                                        <input
                                            type="text"
                                            id="tenLoaiPhong"
                                            name="tenLoaiPhong"
                                            className="form-control"
                                            value={formData.tenLoaiPhong}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="dienTich" className="form-label fw-bold">Diện tích</label>
                                        <input
                                            type="text"
                                            id="dienTich"
                                            name="dienTich"
                                            className="form-control"
                                            value={formData.dienTich}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="soKhachToiDa" className="form-label fw-bold">Số khách tối đa</label>
                                        <input
                                            type="text"
                                            id="soKhachToiDa"
                                            name="soKhachToiDa"
                                            className="form-control"
                                            value={formData.soKhachToiDa}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="maLoaiPhong" className="form-label fw-bold">Mã Loại Phòng</label>
                                        <input
                                            type="text"
                                            id="maLoaiPhong"
                                            name="maLoaiPhong"
                                            className="form-control"
                                            value={formData.maLoaiPhong}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="donGia" className="form-label fw-bold">Đơn giá</label>
                                        <input
                                            type="text"
                                            id="donGia"
                                            name="donGia"
                                            className="form-control"
                                            value={formData.donGia}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="donGiaPhuThu" className="form-label fw-bold">Đơn giá phụ thu</label>
                                        <input
                                            type="text"
                                            id="donGiaPhuThu"
                                            name="donGiaPhuThu"
                                            className="form-control"
                                            value={formData.donGiaPhuThu}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="moTa" className="form-label fw-bold">Mô tả</label>
                                        <input
                                            type="text"
                                            id="moTa"
                                            name="moTa"
                                            className="form-control"
                                            value={formData.moTa}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary ms-auto d-block" onClick={handleSubmit}>
                                        Lưu thay đổi
                                    </button>
                                </div>
                            </div>
                            <hr className="my-4" />

                            <div className="row">
                                {/* Danh sách dịch vụ đi kèm  */}
                                <div className="col-md-6">
                                    <h5 className="mb-3 text-primary">Danh sách dịch vụ đi kèm</h5>
                                    <ul className="list-group" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {ListDichVuDiKem.length > 0 ? (
                                            ListDichVuDiKem.map(dv => (
                                                <li
                                                    key={dv.id}
                                                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                                    onClick={() => handleDeleteDichVuDiKem(dv.id)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <span>{dv.tenDichVu}</span>
                                                    <span className="badge bg-secondary rounded-pill">
                                                        {dv.soLuong || 'Chưa có số lượng'}
                                                    </span>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="list-group-item text-muted">Chưa có dịch vụ đi kèm.</li>
                                        )}
                                    </ul>
                                </div>

                                {/* Danh sách vật tư loại phòng  */}
                                <div className="col-md-6">
                                    <h5 className="mb-3 text-primary">Danh sách vật tư loại phòng</h5>
                                    <ul className="list-group" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {ListVatTuLoaiPhong.length > 0 ? (
                                            ListVatTuLoaiPhong.map(ti => (
                                                <li
                                                    key={ti.id}
                                                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                                    onClick={() => handleDeleteVatTuLoaiPhong(ti.id)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <span className="amenity-text">{ti.tenVatTu} - Số lượng: {ti.soLuong || 'Chưa có số lượng'}</span>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="list-group-item text-muted">Không có vật tư nào</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={openAddModal}>
                            Thêm dịch vụ/vật tư
                        </button>

                    </div>
                </div>
            </div>

            {showAddModal && (
                <AddServiceUtilityModal
                    show={showAddModal}
                    handleClose={closeAddModal}
                    loaiPhongId={formData.id}
                    onAddSuccess={() => {
                        fetchDanhSachVatTu();
                        fetchDanhSachDichVu();
                    }}
                />
            )}
        </div>
    );
};

export default FormDetail;