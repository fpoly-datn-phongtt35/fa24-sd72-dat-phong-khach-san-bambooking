import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createKhachHang, getOneKhachHang, updateKhachHang } from '../../services/KhachHangService';

const KhachHangComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ho, setHo] = useState('');
    const [ten, setTen] = useState('');
    const [gioiTinh, setGioiTinh] = useState('Nam');
    const [diaChi, setDiaChi] = useState('');
    const [sdt, setSoDienThoai] = useState('');
    const [email, setEmail] = useState('');
    const [trangThai, setTrangThai] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (id) {
            getOneKhachHang(id).then(response => {
                const { ho, ten, gioiTinh, diaChi, sdt, email, trangThai } = response.data;
                setHo(ho);
                setTen(ten);
                setGioiTinh(gioiTinh);
                setDiaChi(diaChi);
                setSoDienThoai(sdt);
                setEmail(email);
                setTrangThai(trangThai === "Hoạt động");
            }).catch(error => {
                console.log("Có lỗi khi lấy khách hàng: " + error);
            });
        }
    }, [id]);

    const saveOrUpdate = (e) => {
        e.preventDefault();

        const khachHang = {
            ho,
            ten,
            gioiTinh,
            diaChi,
            sdt,
            email,
            trangThai: trangThai ? "Hoạt động" : "Ngừng hoạt động"
        };

        const handleError = (error) => {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
                console.log("Lỗi từ API:", error.response.data);
            } else {
                console.log(error);
            }
        };

        if (id) {
            updateKhachHang(id, khachHang).then(response => {
                console.log("Cập nhật khách hàng thành công: " + response.data.content);
                navigate('/khach-hang');
            }).catch(handleError);
        } else {
            createKhachHang(khachHang).then(response => {
                console.log("Thêm khách hàng thành công: " + response.data.content);
                navigate('/khach-hang');
            }).catch(handleError);
        }
    };

    return (
        <div className='container'>
            <br /><br />
            <div className='row'>
                <div className='card col-md-6 offset-md-3'>
                    <h5 className='text-center' style={{ marginTop: '15px' }}>{id ? "Cập nhật khách hàng" : "Thêm khách hàng"}</h5>
                    <div className='card-body'>
                        <form>
                            <div className='form-group mb-3'>
                                <label className='form-label'>Họ:</label>
                                <input
                                    type="text"
                                    placeholder='Nhập họ'
                                    value={ho}
                                    name='ho'
                                    className={`form-control ${errors.ho ? 'is-invalid' : ''}`}
                                    onChange={(e) => setHo(e.target.value)}
                                />
                                {errors.ho && <div className='invalid-feedback'>{errors.ho}</div>}
                            </div>
                            <div className='form-group mb-3'>
                                <label className='form-label'>Tên:</label>
                                <input
                                    type="text"
                                    placeholder='Nhập tên'
                                    value={ten}
                                    name='ten'
                                    className={`form-control ${errors.ten ? 'is-invalid' : ''}`}
                                    onChange={(e) => setTen(e.target.value)}
                                />
                                {errors.ten && <div className='invalid-feedback'>{errors.ten}</div>}
                            </div>
                            <div className='form-group mb-3'>
                                <label className='form-label'>Giới tính:</label>
                                <div className='col-md-9'>
                                    <div className='form-check form-check-inline'>
                                        <input
                                            type="radio"
                                            id='genderMale'
                                            value='Nam'
                                            checked={gioiTinh === 'Nam'}
                                            className='form-check-input'
                                            onChange={() => setGioiTinh('Nam')}
                                        />
                                        <label htmlFor="genderMale">Nam</label>
                                    </div>
                                    <div className='form-check form-check-inline'>
                                        <input
                                            type="radio"
                                            id='genderFemale'
                                            value='Nữ'
                                            checked={gioiTinh === 'Nữ'}
                                            className='form-check-input'
                                            onChange={() => setGioiTinh('Nữ')}
                                        />
                                        <label htmlFor="genderFemale">Nữ</label>
                                    </div>
                                </div>
                            </div>
                            <div className='form-group mb-3'>
                                <label className='form-label'>Địa chỉ:</label>
                                <input
                                    type="text"
                                    placeholder='Nhập địa chỉ'
                                    value={diaChi}
                                    name='diaChi'
                                    className={`form-control ${errors.diaChi ? 'is-invalid' : ''}`}
                                    onChange={(e) => setDiaChi(e.target.value)}
                                />
                                {errors.diaChi && <div className='invalid-feedback'>{errors.diaChi}</div>}
                            </div>
                            <div className='form-group mb-3'>
                                <label className='form-label'>Số điện thoại:</label>
                                <input
                                    type="text"
                                    placeholder='Nhập số điện thoại'
                                    value={sdt} // Changed here
                                    name='sdt'
                                    className={`form-control ${errors.sdt ? 'is-invalid' : ''}`}
                                    onChange={(e) => setSoDienThoai(e.target.value)} // Changed here
                                />
                                {errors.sdt && <div className='invalid-feedback'>{errors.sdt}</div>}
                            </div>
                            <div className='form-group mb-3'>
                                <label className='form-label'>Email:</label>
                                <input
                                    type="email"
                                    placeholder='Nhập email'
                                    value={email}
                                    name='email'
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
                            </div>
                            <div className='form-group mb-3 row'>
                                <label className='form-label'>Trạng thái:</label>
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
                            <button className='btn btn-success' onClick={saveOrUpdate}>{id ? "Cập nhật" : "Thêm"}</button>
                            <button className='btn btn-outline-primary' style={{ marginLeft: '10px' }} onClick={() => navigate('/khach-hang')}>Quay lại</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KhachHangComponent;
