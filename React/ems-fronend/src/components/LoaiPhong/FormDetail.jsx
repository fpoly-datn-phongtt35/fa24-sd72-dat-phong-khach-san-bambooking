import React, { useState, useEffect } from 'react';
import { updateLoaiPhong, deleteLoaiPhong, DanhSachTienIchPhong } from '../../services/LoaiPhongService';
import { deleteTienNghiPhong, listTienIchPhong, addTienIchPhong } from '../../services/TienIchPhongService'; // Thêm import cho hàm lấy danh sách tiện ích
import { DanhSachDichVu, XoaDichVuDiKem } from '../../services/DichVuDiKemService';
import { ThemDichVuDiKem, DanhSachDichVuDiKem } from '../../services/LoaiPhongService';
import './Detail.css';

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
    const [ListDichVuDiKem, setListDichVuDiKem] = useState([]);
    const [dichVuList, setDichVuList] = useState([]);
    const [selectedDichVu, setSelectedDichVu] = useState('');
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
    }, [formData.id, currentPage, totalPages, ListTienIchPhong]);

    // Lấy danh sách tất cả tiện ích
    useEffect(() => {
        listTienIchPhong()
            .then(response => {
                setAllTienIch(response.data); // Giả sử response.data chứa danh sách tiện ích
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách tiện ích:", error);
            });

        DanhSachDichVu()
            .then(response => {
                setDichVuList(response.data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách dịch vụ:", error);
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

    const handleAddDichVuDiKem = (selectedDichVuId) => {
        // Kiểm tra xem có chọn dịch vụ hay không
        if (!selectedDichVuId || selectedDichVuId === '') {
            alert("Vui lòng chọn dịch vụ để thêm.");
            return;
        }

        // Kiểm tra xem formData.id có hợp lệ không
        if (!formData.id || formData.id === '') {
            alert("Không tìm thấy loại phòng. Vui lòng thử lại.");
            return;
        }

        // Tạo đối tượng yêu cầu theo cấu trúc mới
        const dichVuDiKemRequest = {
            loaiPhong: { id: formData.id }, // Gửi đối tượng LoaiPhong với id
            dichVu: { id: selectedDichVuId }, // Gửi đối tượng DichVu với id
            trangThai: true
        };

        console.log("Request gửi đi:", dichVuDiKemRequest); // Gỡ lỗi để kiểm tra request

        ThemDichVuDiKem(dichVuDiKemRequest)
            .then(response => {
                console.log("Thêm dịch vụ thành công:", response.data);
                // Cập nhật lại danh sách dịch vụ đi kèm sau khi thêm
                DanhSachDichVuDiKem(formData.id, { page: currentPage, size: itemsPerPage })
                    .then(response => {
                        setListDichVuDiKem(response.data.content);
                        setTotalPages(response.data.totalPages);
                    })
                    .catch(error => {
                        console.error("Lỗi khi cập nhật danh sách dịch vụ đi kèm:", error);
                    });
            })
            .catch(error => {
                console.error("Lỗi khi thêm dịch vụ:", error);
            });
    };
    //xóa dvdk
    const handleDeleteDichVuDiKem = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ đi kèm này không?")) {
            XoaDichVuDiKem(id)
                .then(response => {
                    console.log("Xóa dịch vụ đi kèm thành công:", response.data);
                    // Cập nhật lại danh sách dịch vụ đi kèm sau khi xóa
                    DanhSachDichVuDiKem(formData.id, { page: currentPage, size: itemsPerPage })
                        .then(response => {
                            setListDichVuDiKem(response.data.content); // Cập nhật danh sách dịch vụ đi kèm
                            setTotalPages(response.data.totalPages);
                        })
                        .catch(error => {
                            console.error("Lỗi khi cập nhật danh sách dịch vụ đi kèm:", error);
                        });
                })
                .catch(error => {
                    console.error("Lỗi khi xóa dịch vụ đi kèm:", error);
                });
        }
    };

    // Lấy danh sách dịch vụ đi kèm theo idLoaiPhong
    useEffect(() => {
        if (formData.id) {
            DanhSachDichVuDiKem(formData.id, { page: currentPage, size: itemsPerPage })
                .then(response => {
                    setListDichVuDiKem(response.data.content);
                    setTotalPages(response.data.totalPages);
                })
                .catch(error => {
                    console.error("Lỗi khi lấy danh sách dịch vụ đi kèm:", error);
                });
        }
    }, [formData.id, currentPage, totalPages, ListTienIchPhong]);

    return (
        <div className={`modal ${show ? 'show' : ''}`} style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Chi tiết loại phòng</h5>
                        <button type="button" className="close-button" onClick={handleClose}>×</button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-column">
                                    <div className="form-group">
                                        <label htmlFor="id">ID</label>
                                        <input type="text" id="id" name="id" value={formData.id} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="tenLoaiPhong">Tên Loại Phòng</label>
                                        <input type="text" id="tenLoaiPhong" name="tenLoaiPhong" value={formData.tenLoaiPhong} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="dienTich">Diện tích</label>
                                        <input type="text" id="dienTich" name="dienTich" value={formData.dienTich} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="soKhachToiDa">Số khách tối đa</label>
                                        <input type="text" id="soKhachToiDa" name="soKhachToiDa" value={formData.soKhachToiDa} onChange={handleInputChange} required />
                                    </div>
                                </div>
                                <div className="form-column">
                                    <div className="form-group">
                                        <label htmlFor="donGia">Đơn giá</label>
                                        <input type="text" id="donGia" name="donGia" value={formData.donGia} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="donGiaPhuThu">Đơn giá phụ thu</label>
                                        <input type="text" id="donGiaPhuThu" name="donGiaPhuThu" value={formData.donGiaPhuThu} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="moTa">Mô tả</label>
                                        <input type="text" id="moTa" name="moTa" value={formData.moTa} onChange={handleInputChange} required />
                                    </div>
                                    <button type="submit" className="submit-button">Lưu thay đổi</button>
                                </div>
                            </div>
                        </form>
                        <hr />

                        <div className="form-container">
                            <div className="service-container">
                                <h4>Thêm dịch vụ đi kèm</h4>
                                <div className="form-group">
                                    <label htmlFor="selectedDichVu">Chọn dịch vụ</label>
                                    <select
                                        id="selectedDichVu"
                                        value={selectedDichVu}
                                        onChange={(e) => {
                                            const selectedValue = e.target.value;
                                            setSelectedDichVu(selectedValue);
                                            handleAddDichVuDiKem(selectedValue);
                                        }}
                                    >
                                        <option value="">-- Chọn dịch vụ --</option>
                                        {dichVuList.map(dv => (
                                            <option key={dv.id} value={dv.id}>{dv.tenDichVu}</option>
                                        ))}
                                    </select>
                                </div>
                                <h4>Danh sách dịch vụ đi kèm</h4>
                                <ul className="list-group">
                                    {ListDichVuDiKem.length > 0 ? (
                                        ListDichVuDiKem.map(dv => (
                                            <li key={dv.id} className="list-group-item" onClick={() => handleDeleteDichVuDiKem(dv.id)}>
                                                {dv.tenDichVu}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="list-group-item">Chưa có dịch vụ đi kèm.</li>
                                    )}
                                </ul>
                            </div>

                            <div className="utility-container">
                                <h4>Danh sách tiện ích phòng</h4>
                                <ul className="list-group">
                                    {ListTienIchPhong.length > 0 ? (
                                        ListTienIchPhong.map(ti => (
                                            <li key={ti.id} className="list-group-item">
                                                <span className="icon">
                                                    <img src={ti.hinhAnh} width="24" alt="Icon tiện ích" />
                                                </span>
                                                <span className="amenity-text">{ti.tenTienIch}</span>
                                                <button type="button" className="delete-button" onClick={() => handleDeleteTienIchPhong(ti.id)}>Xóa tiện ích</button>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="list-group-item">Không có tiện ích nào</li>
                                    )}
                                </ul>
                                <div className="form-group">
                                    <label htmlFor="selectTienIch">Chọn tiện ích</label>
                                    <select
                                        id="selectTienIch"
                                        value={selectedTienIch}
                                        onChange={(e) => setSelectedTienIch(e.target.value)}
                                    >
                                        <option value="">-- Chọn tiện ích --</option>
                                        {allTienIch.map(ti => (
                                            <option key={ti.id} value={ti.id}>{ti.tenTienIch}</option>
                                        ))}
                                    </select>
                                </div>
                                <button type="button" className="add-button" onClick={handleAddTienIch}>Thêm tiện ích</button>
                            </div>
                        </div>


                        <div className="pagination">
                            <button className="pagination-button" onClick={handlePreviousPage}>Trang trước</button>
                            <span>Trang {currentPage + 1} / {totalPages}</span>
                            <button className="pagination-button" onClick={handleNextPage}>Trang sau</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormDetail;