import React, { useEffect, useState } from 'react';
import { getPhong, uploadImage } from '../../services/ImageService';
import { useNavigate } from 'react-router-dom';

const HinhAnh = ({ setImages }) => {
    const [file, setFile] = useState(null);
    const [tenAnh, setTenAnh] = useState('');
    const [p, setPhong] = useState([]);
    const [idPhong, setIdPhong] = useState('');
    const [trangThai, setTrangThai] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getPhong()
            .then(response => {
                console.log(response);
                setPhong(response.data.content);
            })
            .catch((error) => {
                console.log("Có lỗi khi lấy phòng: " + error);
            });
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleTenAnhChange = (e) => {
        setTenAnh(e.target.value);
    };

    const saveOrUpdate = (e) => {
        e.preventDefault();

        // Kiểm tra giá trị trangThai
        console.log('Giá trị trangThai trước khi gửi:', trangThai);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('tenAnh', tenAnh);
        formData.append('idPhong', idPhong);
        
        // Gửi giá trị trạng thái dưới dạng boolean
        formData.append('trangThai', trangThai);

        uploadImage(formData)
            .then((response) => {
                console.log('Upload thành công:', response.data);
                // Reset các trường sau khi upload thành công
                setTenAnh('');
                setFile(null);
                setIdPhong('');
                setTrangThai(true);
                navigate('/hinh-anh');
            })
            .catch((error) => {
                console.error('Lỗi khi upload:', error);
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
                                className={`form-select`}
                                value={idPhong}
                                name='idPhong'
                                onChange={(e) => setIdPhong(e.target.value)}
                            >
                                <option value="">Chọn phòng</option>
                                {
                                    p.map((phong) => (
                                        <option
                                            key={phong.id}
                                            value={phong.id}
                                        >
                                            {phong.tenPhong}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="form-group mb-3">
                            <label className='form-label'>Tên Ảnh:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="tenAnh"
                                value={tenAnh}
                                onChange={handleTenAnhChange}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label className='form-label'>Chọn Ảnh:</label>
                            <div className="mb-3">
                                <input
                                    type="file"
                                    className="form-control-file"
                                    id="file"
                                    onChange={handleFileChange}
                                />
                            </div>
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
                                        onChange={() => setTrangThai(true)} // Cập nhật trạng thái khi chọn
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
                                        onChange={() => setTrangThai(false)} // Cập nhật trạng thái khi chọn
                                    />
                                    <label htmlFor="inactive">Ngừng hoạt động</label>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-outline-primary">
                            Upload
                        </button>
                        <button className='btn btn-outline-primary' style={{ marginLeft: "6px" }} onClick={() => navigate('/hinh-anh')}>Quay lại</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HinhAnh;
