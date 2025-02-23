import React, { useEffect, useState } from 'react';
import { DuLieu } from '../../services/DichVuService';
import { CapNhatDichVuSuDung } from '../../services/DichVuSuDungService';
import { AddDichVuSuDung } from '../../services/ViewPhong';

const DVSVDetail = ({ show, handleClose, data, idxp }) => {
    const [ListDichVu, setListDichVu] = useState([]);
    const [formData, setFormData] = useState({
        id: data?.id || '',
        dichVu: { id: data?.dichVu?.id } || '',
        xepPhong: { id: idxp },
        soLuongSuDung: data?.soLuongSuDung || '',
        ngayBatDau: data?.ngayBatDau || '',
        ngayKetThuc: data?.ngayKetThuc || '',
        giaSuDung: data?.giaSuDung || '',
        trangThai: data?.trangThai || 1,
    });

    useEffect(() => {
        DuLieu().then((response) => {
            setListDichVu(response.data);
        });
    }, []);

    // useEffect(() => {
    //     if (data || idxp) {
    //         setFormData({
    //             id: data?.id || '',
    //             idDichVu: data?.idDichVu || '',
    //             idXepPhong: idxp || '',
    //             soLuongSuDung: data?.soLuongSuDung || '',
    //             ngayBatDau: data?.ngayBatDau || '',
    //             ngayKetThuc: data?.ngayKetThuc || '',
    //             giaSuDung: data?.giaSuDung || '',
    //             trangThai: 1,
    //         });
    //     }
    // }, [data, idxp]);



    // Hàm xử lý thay đổi giá trị input
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "dichVu") {
            // Tìm dịch vụ tương ứng theo ID được chọn
            const selectedDichVu = ListDichVu.find(dv => dv.id === parseInt(value, 10));
            setFormData((prevFormData) => ({
                ...prevFormData,
                dichVu: { ...prevFormData.dichVu, id: value },
                giaSuDung: selectedDichVu ? selectedDichVu.donGia : '', // Cập nhật giá sử dụng
            }));
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    };


    // Hàm xử lý submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Giá trị formData:", formData);
        if (data != null) {
            CapNhatDichVuSuDung(formData)
                .then(response => {
                    console.log("Cập nhật thành công:", response.data);
                    handleClose();
                })
                .catch(error => {
                    console.error("Lỗi khi cập nhật:", error);
                });
        } else {
            AddDichVuSuDung(formData)
                .then(() => {
                    console.log("Dữ liệu thêm dịch vụ:", formData);
                    setShowForm(false); // Đóng form sau khi thêm
                })
                .catch((error) => {
                    console.error("Error adding service:", error);
                });
        }

    };

    const HuyDichVu = () => {
        const updatedFormData = {
            ...formData,
            trangThai: 0, // Chuyển trạng thái thành 0
        };

        // Gọi API để cập nhật dịch vụ
        CapNhatDichVuSuDung(updatedFormData)
            .then((response) => {
                console.log("Dịch vụ đã bị hủy:", response.data);
                handleClose(); // Đóng modal sau khi hủy
            })
            .catch((error) => {
                console.error("Lỗi khi hủy dịch vụ:", error);
            });

    }

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex={-1} role="dialog" style={{ backgroundColor: show ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Dịch vụ sử dụng</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            {/* Tên tiện ích */}
                            <div className="mb-3">
                                <label htmlFor="idDichVu" className="form-label">Tên dịch vụ</label>
                                <select
                                    className="form-select"
                                    value={formData.dichVu.id}
                                    name="dichVu"
                                    onChange={handleInputChange}
                                    disabled={data != null}
                                >
                                    <option value="">Chọn dịch</option>
                                    {ListDichVu.map((dv) => (
                                        <option key={dv.id} value={dv.id}>
                                            {dv.tenDichVu}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            <div className="mb-3">
                                <label htmlFor="soLuongSuDung" className="form-label">Số lượng sử dụng</label>
                                <input type="number" className="form-control" id="soLuongSuDung" name="soLuongSuDung" value={formData.soLuongSuDung} onChange={handleInputChange} required />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="ngayBatDau" className="form-label">Ngày bắt đầu</label>
                                <input type="datetime-local" className="form-control" id="ngayBatDau" name="ngayBatDau" value={formData.ngayBatDau} onChange={handleInputChange} required readOnly />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="ngayKetThuc" className="form-label">Ngày kết thúc</label>
                                <input type="datetime-local" className="form-control" id="ngayKetThuc" name="ngayKetThuc" value={formData.ngayKetThuc} onChange={handleInputChange} required />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="giaSuDung" className="form-label">Giá sử dụng</label>
                                <input type="number" className="form-control" id="giaSuDung" name="giaSuDung" value={formData.giaSuDung} onChange={handleInputChange} required readOnly />
                            </div>

                            <div className="modal-footer">
                                {data && ( // Chỉ hiển thị nút Hủy nếu data không null
                                    <button type="button" className="btn btn-danger" onClick={HuyDichVu}>Hủy dịch vụ</button>
                                )}
                                <button type="button" className="btn btn-secondary" onClick={handleClose}>Đóng</button>
                                <button type="submit" className="btn btn-primary">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DVSVDetail;
