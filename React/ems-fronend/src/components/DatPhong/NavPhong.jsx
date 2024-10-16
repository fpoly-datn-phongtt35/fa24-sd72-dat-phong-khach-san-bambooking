import React, { useState, useEffect } from 'react';
import './NavPhong.css';
import ThemKhachHangMoi from './ThemKhachHangMoi';
import { listKhachHang } from '../../services/KhachHangService';
import { ThemMoiDatPhong } from '../../services/DatPhong';

const NavPhong = () => {
    const [showModal, setShowModal] = useState(false);
    const [khachHangList, setKhachHangList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedKhachHang, setSelectedKhachHang] = useState(null);
    const [datPhongSelected, setDatPhongSelected] = useState(null); // Quản lý trạng thái của đặt phòng đã chọn

    // State cho đặt phòng
    const [datPhong, setDatPhong] = useState({
        khachHang: null,
        maDatPhong: '',
        ngayDat: '',
        ghiChu: '',
        trangThai: '',
    });

    const itemsPerPage = 5;

    // Gọi API lấy danh sách khách hàng
    const getAllKhachHang = () => {
        listKhachHang({ page: currentPage, size: itemsPerPage }, searchQuery)
            .then((response) => {
                setKhachHangList(response.data.content);
                setTotalPages(response.data.totalPages);
            }).catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getAllKhachHang();
    }, [currentPage, searchQuery]);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handleSearchInput = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(0); // Reset lại trang khi tìm kiếm
    };

    const handleSelectChange = (e) => {
        const selectedId = e.target.value;
        const selected = khachHangList.find(khachHang => khachHang.id === parseInt(selectedId)); // Tìm khách hàng theo ID
        setDatPhong(prevState => ({
            ...prevState,
            khachHang: selected
        }));
        setSelectedKhachHang(selected); // Lưu toàn bộ thông tin khách hàng
    };

    const handleTaoDatPhong = (e) => {
        e.preventDefault();

        // Tạo payload cho việc đặt phòng
        const payload = {
            khachHang: datPhong.khachHang,
            ghiChu: datPhong.ghiChu || 'Không có ghi chú',
        };

        ThemMoiDatPhong(payload)
            .then(response => {
                alert('Đặt phòng thành công!');
                console.log(response.data);
                setDatPhongSelected(response.data); // Lưu thông tin đặt phòng đã tạo
            })
            .catch(error => {
                console.error(error);
                alert('Đặt phòng thất bại, vui lòng thử lại.');
            });
    };

    return (
        <div className="vertical-bar">
            <div className="customer-section">
                {/* Hiển thị danh sách khách hàng trong thẻ select */}
                <select className="select-customer" value={selectedKhachHang?.id || ''} onChange={handleSelectChange}>
                    <option value="">Chọn khách hàng</option>
                    {khachHangList.map((khachHang) => (
                        <option key={khachHang.id} value={khachHang.id}>
                            {khachHang.ten} {/* Hiển thị tên khách hàng */}
                        </option>
                    ))}
                </select>

                <button className="btn-add" onClick={handleOpenModal}>
                    Thêm mới
                </button>
                <br />
                <label htmlFor="khachHang" className="customer-label">
                    <span>Tên khách hàng:</span> 
                    <br/>
                    {/* Hiển thị tên khách hàng đã chọn hoặc thông báo nếu chưa chọn */}
                    <span>{selectedKhachHang ? selectedKhachHang.ten : 'Chưa chọn'}</span> 
                </label>
                <label htmlFor="datPhong" className="customer-label">
                    <span>Mã đặt phòng:</span> 
                    <br/>
                    {/* Hiển thị mã đặt phòng vừa tạo hoặc "Trống" */}
                    <span>{datPhongSelected ? datPhongSelected.maDatPhong : 'Trống'}</span> 
                </label>
            </div>

            <button className="btn-add" onClick={handleTaoDatPhong}>
                Tạo đặt phòng
            </button>

            <div className="filter-section">
                <h5 className="filter-title">Loại phòng</h5>
                <label className="filter-label">
                    <span>Loại phòng:</span>
                    <input type="checkbox" value="Confirmed" />
                </label>

                <h5 className="filter-title">Tiện ích</h5>
                <label className="filter-label">
                    <span>Tiện ích:</span>
                    <input type="checkbox" value="Confirmed" />
                </label>

                <h5 className="filter-title">Dịch vụ đi kèm</h5>
                <label className="filter-label">
                    <span>Dịch vụ đi kèm:</span>
                    <input type="checkbox" value="Confirmed" />
                </label>
            </div>

            {/* Modal Thêm khách hàng mới */}
            {showModal && (
                <div className="modal-backdrop-x">
                    <div className="modal-body">
                        <ThemKhachHangMoi handleCloseModal={handleCloseModal} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavPhong;
