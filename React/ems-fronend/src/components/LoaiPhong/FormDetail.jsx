import React, { useState, useEffect } from 'react';
import { updateLoaiPhong, deleteLoaiPhong, DanhSachTienIchPhong } from '../../services/LoaiPhongService';
import { deleteTienNghiPhong, listTienIchPhong, addTienIchPhong } from '../../services/TienIchPhongService'; // Thêm import cho hàm lấy danh sách tiện ích


const FormDetail = ({ show, handleClose, data }) => {
    const [formData, setFormData] = useState({
        id: data?.id || '',
        tenLoaiPhong: data?.tenLoaiPhong || '',
        dienTich: data?.dienTich || '',
        soKhachToiDa: data?.soKhachToiDa || '',
        donGia: data?.donGia || '',
        moTa: data?.moTa || '',
        donGiaPhuThu: data?.donGiaPhuThu || '',
    });

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 3;
    const [ListTienIchPhong, setListTienIchPhong] = useState([]);

    // State cho danh sách tiện ích và tiện ích đã chọn
    const [allTienIch, setAllTienIch] = useState([]); // Danh sách tiện ích
    const [selectedTienIch, setSelectedTienIch] = useState(''); // Tiện ích đã chọn

    // Lấy danh sách tiện ích phòng theo idLoaiPhong và cập nhật khi trang thay đổi
    useEffect(() => {
        if (formData.id) {
            DanhSachTienIchPhong(formData.id, { page: currentPage, size: itemsPerPage })
                .then(response => {
                    setListTienIchPhong(response.data.content); // Hiển thị dữ liệu tiện ích phòng
                    setTotalPages(response.data.totalPages); // Lấy tổng số trang
                })
                .catch(error => {
                    console.error("Lỗi khi lấy danh sách tiện ích:", error);
                });
        }
    }, [formData.id, currentPage,totalPages,ListTienIchPhong]);

    // Lấy danh sách tất cả tiện ích
    useEffect(() => {
        listTienIchPhong()
            .then(response => {
                setAllTienIch(response.data); // Giả sử response.data chứa danh sách tiện ích
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách tiện ích:", error);
            });
    }, []);

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateLoaiPhong(formData)
            .then(response => {
                console.log("Cập nhật thành công:", response.data);
                handleClose();
            })
            .catch(error => {
                console.error("Lỗi khi cập nhật:", error);
            });
    };


    const handleDeleteTienIchPhong = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tiện ích phòng này không?")) {
            deleteTienNghiPhong(id)
                .then(response => {
                    console.log("Xóa tiện ích thành công:", response.data);
                    // Cập nhật lại danh sách sau khi xóa
                    DanhSachTienIchPhong(formData.id, { page: currentPage, size: itemsPerPage })
                        .then(response => {
                            setListTienIchPhong(response.data.content); // Cập nhật danh sách tiện ích
                        })
                        .catch(error => {
                            console.error("Lỗi khi cập nhật danh sách tiện ích:", error);
                        });
                })
                .catch(error => {
                    console.error("Lỗi khi xóa tiện ích:", error);
                });
        }
    };

    const handleAddTienIch = () => {
        if (!selectedTienIch || selectedTienIch === '') {
            alert("Vui lòng chọn tiện ích để thêm.");
            return;
        }

        // Kiểm tra xem formData.id có hợp lệ không
        if (!formData.id || formData.id === '') {
            alert("Không tìm thấy loại phòng. Vui lòng thử lại.");
            return;
        }

        // Tạo đối tượng yêu cầu theo cấu trúc mới
        const tienNghiPhongRequest = {
            loaiPhong: { id: formData.id }, // Gửi đối tượng LoaiPhong với id
            tienIch: { id: selectedTienIch } // Gửi đối tượng TienIch với id
        };

        console.log("Request gửi đi:", tienNghiPhongRequest); // Gỡ lỗi để kiểm tra request

        addTienIchPhong(tienNghiPhongRequest)
            .then(response => {
                console.log("Thêm tiện ích thành công:", response.data);
                // Cập nhật lại danh sách tiện ích sau khi thêm
                DanhSachTienIchPhong(formData.id, { page: currentPage, size: itemsPerPage })
                    .then(response => {
                        setListTienIchPhong(response.data.content);
                    })
                    .catch(error => {
                        console.error("Lỗi khi cập nhật danh sách tiện ích:", error);
                    });
            })
            .catch(error => {
                console.error("Lỗi khi thêm tiện ích:", error);
            });
    };




    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex={-1} role="dialog" style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Chi tiết loại phòng</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                        <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="id" className="form-label">ID</label>
                                        <input type="text" className="form-control" id="id" name="id" value={formData.id} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="tenLoaiPhong" className="form-label">Tên Loại Phòng</label>
                                        <input type="text" className="form-control" id="tenLoaiPhong" name="tenLoaiPhong" value={formData.tenLoaiPhong} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="dienTich" className="form-label">Diện tích</label>
                                        <input type="text" className="form-control" id="dienTich" name="dienTich" value={formData.dienTich} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="soKhachToiDa" className="form-label">Số khách tối đa</label>
                                        <input type="text" className="form-control" id="soKhachToiDa" name="soKhachToiDa" value={formData.soKhachToiDa} onChange={handleInputChange} required />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="donGia" className="form-label">Đơn giá</label>
                                        <input type="text" className="form-control" id="donGia" name="donGia" value={formData.donGia} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="donGiaPhuThu" className="form-label">Đơn giá phụ thu</label>
                                        <input type="text" className="form-control" id="donGiaPhuThu" name="donGiaPhuThu" value={formData.donGiaPhuThu} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="moTa" className="form-label">Mô tả</label>
                                        <input type="text" className="form-control" id="moTa" name="moTa" value={formData.moTa} onChange={handleInputChange} required />
                                    </div>
                                    <br />
                                    <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
                                </div>
                            </div>
                        </form>

                        <hr />
                        <h4>Danh sách tiện ích phòng</h4>


                        <ul className="amenities-list">
                            {ListTienIchPhong.length > 0 ? (
                                ListTienIchPhong.map(ti => (
                                    <li key={ti.id} className="amenity-item">
                                        {/* Icon or Image */}
                                        <span className="icon">
                                            <img src={ti.hinhAnh} width="24" alt="Icon tiện ích" />
                                        </span>

                                        {/* Amenity Name */}
                                        <span className="amenity-text">{ti.tenTienIch}</span>

                                        {/* Delete Button */}
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-delete"
                                            onClick={() => handleDeleteTienIchPhong(ti.id)}
                                        >
                                            Xóa tiện ích
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li>Không có tiện ích nào</li>
                            )}
                        </ul>

                        {/* Ô select để chọn tiện ích */}
                        <div className="mb-3">
                            <label htmlFor="selectTienIch" className="form-label">Chọn tiện ích</label>
                            <select
                                id="selectTienIch"

                                className="form-select"
                                value={selectedTienIch}
                                onChange={(e) => setSelectedTienIch(e.target.value)}
                            >
                                <option value="">-- Chọn tiện ích --</option>
                                {allTienIch.map(ti => (
                                    <option key={ti.id} value={ti.id}>{ti.tenTienIch}</option>
                                ))}
                            </select>
                        </div>

                        <div className="pagination d-flex justify-content-between align-items-center">
                            <div>
                                <button className="btn btn-success" onClick={handlePreviousPage}>
                                    Trang trước
                                </button>
                                <span>Trang {currentPage + 1} / {totalPages}</span>
                                <button className="btn btn-success" onClick={handleNextPage}>
                                    Trang sau
                                </button>
                            </div>
                            <button type="button" className="btn btn-primary" onClick={handleAddTienIch}>
                                Thêm tiện ích
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <style jsx>{`
  .amenities-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .amenity-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 10px 0;
    border-bottom: 1px solid #eaeaea;
  }

  .icon {
    margin-right: 10px;
  }

  .amenity-text {
    flex: 1;
    font-size: 16px;
    font-weight: 400;
  }

  .btn-delete {
    margin-left: 15px;
  }
`}</style>
        </div>

    );
};

export default FormDetail;