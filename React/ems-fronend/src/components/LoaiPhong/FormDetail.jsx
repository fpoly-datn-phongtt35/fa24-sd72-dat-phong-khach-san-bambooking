import React, { useState, useEffect } from 'react';
import { updateLoaiPhong, DanhSachTienIchPhong, TienIchPhongByIDLoaiPhong } from '../../services/LoaiPhongService';
import { deleteTienNghiPhong, listTienIchPhong, addTienIchPhong, } from '../../services/TienIchPhongService'; // Thêm import cho hàm lấy danh sách tiện ích

const FormDetail = ({ show, handleClose, data }) => {
    const [formData, setFormData] = useState({
        id: data?.id || '',
        tenLoaiPhong: data?.tenLoaiPhong || '',
        dienTich: data?.dienTich || '',
        sucChuaLon: data?.sucChuaLon || '',
        sucChuaNho: data?.sucChuaNho || '',
        moTa: data?.moTa || '',
        trangThai: data?.trangThai || '',

    });

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 3;
    // const [ListTienIchPhong, setListTienIchPhong] = useState([]);
    const [ListIDTienIchByIDLoaiPhong, setListIDTienIchByIDLoaiPhong] = useState([]);
    const [tienIchCount, setTienIchCount] = useState({}); // State để theo dõi số lượng tiện ích

    // State cho danh sách tiện ích và tiện ích đã chọn
    const [allTienIch, setAllTienIch] = useState([]); // Danh sách tiện ích
    const [selectedTienIch, setSelectedTienIch] = useState(''); // Tiện ích đã chọn

    // Lấy danh sách tiện ích phòng theo idLoaiPhong và cập nhật khi trang thay đổi
    useEffect(() => {
        if (formData.id) {
            TienIchPhongByIDLoaiPhong(formData.id, { page: currentPage, size: itemsPerPage })   
                .then(response => {
                    setListIDTienIchByIDLoaiPhong(response.data.content);
                    (prevList => {
                        // Gộp danh sách cũ và danh sách mới, loại bỏ các phần tử trùng lặp
                        const combinedList = [...prevList, ...response.data.content];
                        const uniqueList = combinedList.filter((item, index, self) =>
                            index === self.findIndex(t => t.id === item.id)
                        );
                        setListIDTienIchByIDLoaiPhong(uniqueList)

                    });
                    
                    setTotalPages(response.data.totalPages); // Lấy tổng số trang
                    // const amenities = response.data.content.map(item => item.tienIch);
                    // setAllTienIch(amenities); // Cập nhật danh sách tiện ích
                    //   console.log(ListIDTienIchByIDLoaiPhong)

                })
                .catch(error => {
                    console.error("Lỗi khi lấy danh sách tiện ích:", error);
                });
        }
    }, [formData.id, currentPage, ListIDTienIchByIDLoaiPhong]);




    // Lấy danh sách tất cả tiện ích
    useEffect(() => {
        listTienIchPhong() // Không cần truyền vào []
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
                            setListIDTienIchByIDLoaiPhong(response.data.content); // Cập nhật danh sách tiện ích
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
        if (!selectedTienIch) {
            alert("Vui lòng chọn tiện ích để thêm.");
            return;
        }
        console.log(ListIDTienIchByIDLoaiPhong)
        console.log(selectedTienIch)
        const existingTienIch = ListIDTienIchByIDLoaiPhong.find(item => item.tienIch.id === Number(selectedTienIch));

        if (existingTienIch) {
            console.log("da ton tai")
            setTienIchCount(prevCount => ({
                ...prevCount,
                [selectedTienIch]: (prevCount[selectedTienIch] || 0) + 1
            }));
            console.log(tienIchCount);
        } else {
            console.log("chua ton tai")
            const newTienIch = allTienIch.find(item => item.id === Number(selectedTienIch));
            if (newTienIch) {
                setListIDTienIchByIDLoaiPhong(prevList => [...prevList, newTienIch]);
                setTienIchCount(prevCount => ({
                    ...prevCount,
                    [selectedTienIch]: 1
                }));
            } else {
                console.error("Không tìm thấy tiện ích mới.");
                return;
            }
        }

        // Gọi hàm thêm tiện ích và xử lý kết quả
        addTienIch(selectedTienIch)
            .then(response => {
                console.log("Thêm tiện ích thành công:", response.data);
                // Cập nhật danh sách sau khi thêm thành công
                DanhSachTienIchPhong(formData.id, { page: currentPage, size: itemsPerPage })
                    .then(response => {
                        setListIDTienIchByIDLoaiPhong(response.data.content); // Cập nhật danh sách tiện ích
                    })
                    .catch(error => {
                        console.error("Lỗi khi cập nhật danh sách tiện ích:", error);
                    });
            })
            .catch(error => {
                console.error("Lỗi khi thêm tiện ích:", error);
            });
    };


    const addTienIch = (selectedTienIch) => {
        const tienNghiPhongRequest = {
            loaiPhong: { id: formData.id }, // Gửi đối tượng LoaiPhong với id
            tienIch: { id: selectedTienIch } // Gửi đối tượng TienIch với id
        };
        // Thực hiện thêm tiện ích vào cơ sở dữ liệu và trả về promise
        return addTienIchPhong(tienNghiPhongRequest); // Đảm bảo đây là một promise

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
                                        <label htmlFor="sucChuaLon" className="form-label">Sức chứa lớn</label>
                                        <input type="text" className="form-control" id="sucChuaLon" name="sucChuaLon" value={formData.sucChuaLon} onChange={handleInputChange} required />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="sucChuaNho" className="form-label">Sức chứa nhỏ</label>
                                        <input type="text" className="form-control" id="sucChuaNho" name="sucChuaNho" value={formData.sucChuaNho} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="moTa" className="form-label">Mô tả</label>
                                        <input type="text" className="form-control" id="moTa" name="moTa" value={formData.moTa} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="trangThai" className="form-label">Trạng thái</label>
                                        <input type="text" className="form-control" id="trangThai" name="trangThai" value={formData.trangThai} onChange={handleInputChange} required />
                                    </div>
                                    <br />
                                    <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
                                </div>
                            </div>
                        </form>

                        <hr />
                        <h4>Danh sách tiện ích phòng</h4>


                        <ul className="amenities-list">
                            {ListIDTienIchByIDLoaiPhong.length > 0 ? (
                                ListIDTienIchByIDLoaiPhong.map(ti => (
                                    <li key={ti.id} className="amenity-item">
                                        <span className="icon">
                                            <img src={`../../../../public/images/${ti.tienIch.hinhAnh}`} width="24" alt="Icon tiện ích" />
                                        </span>
                                        <span className="amenity-text">{ti.tienIch.tenTienIch}</span>
                                        <span className="amenity-quantity">
                                            Số lượng: {tienIchCount[ti.id] || 0}
                                        </span>

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
