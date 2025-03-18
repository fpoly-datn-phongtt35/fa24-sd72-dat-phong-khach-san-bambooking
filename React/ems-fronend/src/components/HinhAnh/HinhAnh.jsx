import React, { useEffect, useState } from 'react';
import { getPhong, uploadImage } from '../../services/ImageService';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const HinhAnh = ({ setImages }) => {
    const [file, setFile] = useState(null);
    const [tenAnh, setTenAnh] = useState('');
    const [p, setPhong] = useState([]);
    const [idPhong, setIdPhong] = useState('');
    const [trangThai, setTrangThai] = useState(true);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        getPhong()
            .then(response => {
                setPhong(response.data.content);
            })
            .catch(error => {
                console.log("Có lỗi khi lấy phòng: " + error);
            });
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        if (errors.file) {
            setErrors({ ...errors, file: '' });
        }
    };

    const handleTenAnhChange = (e) => {
        setTenAnh(e.target.value);
        if (errors.tenAnh) {
            setErrors({ ...errors, tenAnh: '' });
        }
    };

    const validateForm = () => {
        let newErrors = {};
        if (!tenAnh.trim()) newErrors.tenAnh = "Vui lòng nhập tên ảnh.";
        if (!file) newErrors.file = "Vui lòng chọn một tệp.";
        if (!idPhong) newErrors.idPhong = "Vui lòng chọn phòng.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const saveOrUpdate = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('tenAnh', tenAnh);
        formData.append('idPhong', idPhong);
        formData.append('trangThai', trangThai);

        uploadImage(formData)
            .then(response => {
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Hình ảnh đã được tải lên thành công.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    setTenAnh('');
                    setFile(null);
                    setIdPhong('');
                    setTrangThai(true);
                    navigate('/hinh-anh');
                });
            })
            .catch(error => {
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Đã xảy ra lỗi khi tải lên hình ảnh. Vui lòng thử lại.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    };

    return (
        <div className="container">
            <h5>Upload Hình Ảnh</h5>
            <div className="card">
                <div className="card-body">
                    <form onSubmit={saveOrUpdate}>
                        <div className='form-group mb-3'>
                            <label className='form-label'>Phòng</label>
                            <select
                                className={`form-select ${errors.idPhong ? 'is-invalid' : ''}`}
                                value={idPhong}
                                name='idPhong'
                                onChange={(e) => setIdPhong(e.target.value)}
                            >
                                <option value="">Chọn phòng</option>
                                {p.map((phong) => (
                                    <option key={phong.id} value={phong.id}>
                                        {phong.tenPhong}
                                    </option>
                                ))}
                            </select>
                            {errors.idPhong && <div className="invalid-feedback">{errors.idPhong}</div>}
                        </div>
                        <div className="form-group mb-3">
                            <label className='form-label'>Tên Ảnh:</label>
                            <input
                                type="text"
                                className={`form-control ${errors.tenAnh ? 'is-invalid' : ''}`}
                                id="tenAnh"
                                value={tenAnh}
                                onChange={handleTenAnhChange}
                            />
                            {errors.tenAnh && <div className="invalid-feedback">{errors.tenAnh}</div>}
                        </div>
                        <div className="form-group mb-3">
                            <label className='form-label'>Chọn Ảnh:</label>
                            <input
                                type="file"
                                className={`form-control ${errors.file ? 'is-invalid' : ''}`}
                                id="file"
                                onChange={handleFileChange}
                            />
                            {errors.file && <div className="invalid-feedback">{errors.file}</div>}
                        </div>
                        <div className='form-group mb-3 row'>
                            <label className='form-label'>Trạng thái</label>
                            <div className='col-md-9'>
                                <div className='form-check form-check-inline'>
                                    <input
                                        type="radio"
                                        id='active'
                                        value={true}
                                        checked={trangThai === true}
                                        className={`form-check-input`}
                                        onChange={() => setTrangThai(true)}
                                    />
                                    <label htmlFor="active">Hoạt động</label>
                                </div>
                                <div className='form-check form-check-inline'>
                                    <input
                                        type="radio"
                                        id='inactive'
                                        value={false}
                                        checked={trangThai === false}
                                        className={`form-check-input`}
                                        onChange={() => setTrangThai(false)}
                                    />
                                    <label htmlFor="inactive">Ngừng hoạt động</label>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-outline-primary">Upload</button>
                        <button className='btn btn-outline-primary' style={{ marginLeft: "6px" }} onClick={() => navigate('/hinh-anh')}>Quay lại</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HinhAnh;
