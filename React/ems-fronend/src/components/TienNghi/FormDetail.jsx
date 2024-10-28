import React, { useState, useEffect } from 'react';
import { updateTienIchPhong, DSTienIch, DSLoaiPhong, deleteTienNghiPhong } from '../../services/TienIchPhongService';

const FormDetail = ({ show, handleClose, data }) => {
    const [formData, setFormData] = useState({
        id: data?.id || '',
        tienIch: data?.tenTienIch || null,
        loaiPhong: data?.tenLoaiPhong || null,
    });

    const [ListLoaiPhong, setListLoaiPhong] = useState([]); // Danh sách loại phòng
    const [ListTienIch, setListTienIch] = useState([]); // Danh sách tiện ích

    // Lấy danh sách tiện ích và loại phòng
    useEffect(() => {
        DSTienIch()
            .then(response => {
                setListTienIch(response.data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách tiện ích:", error);
            });

        DSLoaiPhong()
            .then(response => {
                setListLoaiPhong(response.data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách loại phòng:", error);
            });
    }, []);

    // Cập nhật formData khi prop data thay đổi
    useEffect(() => {
        if (data) {
            setFormData({
                id: data.id,
                tienIch: data.tienIch || null, // Đảm bảo rằng tiện ích được thiết lập đúng
                loaiPhong: data.loaiPhong || null,
            });
        }
    }, [data]);


    // Xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
    };


    // Xử lý thay đổi tiện ích
    const handleTienIchChange = (e) => {
        const selectedTienIchId = parseInt(e.target.value);
        const selectedTienIch = ListTienIch.find(nv => nv.id === selectedTienIchId);

        setFormData(prevState => ({
            ...prevState,
            tienIch: selectedTienIch // Cập nhật tiện ích đã chọn
        }));
    };





    // Xử lý thay đổi loại phòng
    const handleLoaiPhongChange = (e) => {
        const selectedLoaiPhong = ListLoaiPhong.find(kh => kh.id === parseInt(e.target.value));
        setFormData({
            ...formData,
            loaiPhong: selectedLoaiPhong
        });
    };

    // Xử lý submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        updateTienIchPhong(formData)
            .then(response => {
                console.log("Cập nhật thành công:", response.data);
                console.log("formData.tienIch", formData.tienIch);
                console.log("ListTienIch", ListTienIch);

                handleClose();
            })
            .catch(error => {
                console.error("Lỗi khi cập nhật:", error);
                console.log("formData.tienIch", formData.tienIch);
                console.log("ListTienIch", ListTienIch);

            });
    };

    // Xử lý xóa tiện ích
    const handleDelete = () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tiện ích này không?")) {
            deleteTienNghiPhong(formData.id)
                .then(response => {
                    console.log("Xóa thành công:", response.data);
                    handleClose();
                })
                .catch(error => {
                    console.error("Lỗi khi xóa:", error);
                });
        }
    };

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex={-1} role="dialog" style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Chi tiết tiện ích</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="id" className="form-label">ID</label>
                                <input type="text" className="form-control" id="id" name="id" value={formData.id} onChange={handleInputChange} required />
                            </div>



                            {/* Tiện ích */}
                            <div className="mb-3">
                                <label htmlFor="tienIch" className="form-label">Tiện ích</label>
                                <select
                                    className="form-select"
                                    id="tienIch"
                                    name="tienIch"
                                    value={formData.tienIch?.id || ''} // Sử dụng value từ formData
                                    onChange={handleTienIchChange} // Hàm xử lý khi thay đổi
                                    required
                                >
                                    <option value="">Chọn tiện ích</option>
                                    {ListTienIch.map(nv => (
                                        <option key={nv.id} value={nv.id}>
                                            {nv.tenTienIch}
                                        </option>
                                    ))}
                                </select>
                            </div>






                            {/* Loại phòng */}
                            <div className="mb-3">
                                <label htmlFor="loaiPhong" className="form-label">Loại phòng</label>
                                <select className="form-select" id="loaiPhong" name="loaiPhong" value={formData.loaiPhong?.id || ''} onChange={handleLoaiPhongChange} required  >
                                    <option value="">Chọn loại phòng</option>
                                    {ListLoaiPhong.map(kh => (
                                        <option key={kh.id} value={kh.id}  >
                                            {kh.tenLoaiPhong}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
                            <button type="button" className="btn btn-danger" onClick={handleDelete}>Xóa tiện ích</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormDetail;
