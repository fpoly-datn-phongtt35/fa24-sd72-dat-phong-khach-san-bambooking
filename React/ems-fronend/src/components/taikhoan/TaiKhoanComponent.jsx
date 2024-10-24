import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTaiKhoan } from '../../services/TaiKhoanService';

const TaiKhoanComponent = () => {
    const [tenDangNhap, setTenDangNhap] = useState('');
    const [matKhau, setMatKhau] = useState('');
    const [trangThai, setTrangThai] = useState(true); // Mặc định là 'Active'

    const navigate = useNavigate();

    // Hàm lưu tài khoản
    const saveTaiKhoan = (e) => {
        e.preventDefault();

        const taiKhoan = {
            tenDangNhap,
            matKhau,
            trangThai,
        };

        createTaiKhoan(taiKhoan)
            .then((response) => {
                console.log(response.data);
                navigate("/TaiKhoan"); // Điều hướng về trang danh sách tài khoản
            })
            .catch((error) => {
                console.error("Lỗi khi thêm tài khoản: ", error.response?.data || error.message);
            });
    };

    return (
        <div className="container">
            <br />
            <div className="row">
                <div className="card">
                    <div className="text-center">Thêm Tài Khoản</div>
                    <div className="col-md-6 offset-md-3">
                        <div className="card-body">
                            <form>
                                <div className="form-group mb-2">
                                    <label className="form-label">Tên Đăng Nhập</label>
                                    <input
                                        type="text"
                                        value={tenDangNhap}
                                        className="form-control"
                                        onChange={(e) => setTenDangNhap(e.target.value)}
                                    />
                                </div>

                                <div className="form-group mb-2">
                                    <label className="form-label">Mật Khẩu</label>
                                    <input
                                        type="password"
                                        value={matKhau}
                                        className="form-control"
                                        onChange={(e) => setMatKhau(e.target.value)}
                                    />
                                </div>

                                <div className="form-group mb-2">
                                    <label className="form-label">Trạng Thái</label>
                                    <div className="d-flex">
                                        <div className="form-check me-3">
                                            <input
                                                className="form-check-input-sm"
                                                type="radio"
                                                name="trangThai"
                                                value="true"
                                                checked={trangThai === true}
                                                onChange={() => setTrangThai(true)}
                                            />
                                            <label className="form-check-label">Active</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input-sm"
                                                type="radio"
                                                name="trangThai"
                                                value="false"
                                                checked={trangThai === false}
                                                onChange={() => setTrangThai(false)}
                                            />
                                            <label className="form-check-label">Inactive</label>
                                        </div>
                                    </div>
                                </div>

                                <button className="btn btn-success" onClick={saveTaiKhoan}>
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaiKhoanComponent;
