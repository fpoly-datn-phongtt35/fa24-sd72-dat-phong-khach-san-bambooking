import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTaiKhoan } from '../../services/TaiKhoanService';

const TaiKhoanComponent = () => {
    const [nhanVien, setNhanVien] = useState(''); // ID Nhân Viên
    const [vaiTro, setVaiTro] = useState('');     // ID Vai Trò
    const [tenDangNhap, setTenDangNhap] = useState('');
    const [matKhau, setMatKhau] = useState('');
    const [trangThai, setTrangThai] = useState('');

    const navigate = useNavigate();

    // Hàm lưu tài khoản
    const saveTaiKhoan = (e) => {
        e.preventDefault();
    
        const taiKhoan = {
            nhanVien: { id: parseInt(nhanVien) },  // ID Nhân Viên (ở dạng đối tượng)
            vaiTro: { id: parseInt(vaiTro) },      // ID Vai Trò (ở dạng đối tượng)
            tenDangNhap,
            matKhau,
            trangThai
        };
    
        createTaiKhoan(taiKhoan).then((response) => {
            console.log(response.data);
            navigate("/TaiKhoan"); // Điều hướng về trang danh sách tài khoản
        }).catch(error => {
            console.error("Lỗi khi thêm tài khoản: ", error.response?.data || error.message);
        });
    };

    return (
        <div className='container'>
            <br />
            <div className='row'>
                <div className='card'>
                    <div className='text-center'>Thêm Tài Khoản</div>
                    <div className='col-md-6 offset-md-3'>
                        <div className='card-body'>
                            <form>
                                <div className='form-group mb-2'>
                                    <label className='form-label'>Id Nhân Viên</label>
                                    <input type="text" value={nhanVien} className='form-control' onChange={(e) => setNhanVien(e.target.value)} />
                                </div>

                                <div className='form-group mb-2'>
                                    <label className='form-label'>Id Vai Trò</label>
                                    <input type="text" value={vaiTro} className='form-control' onChange={(e) => setVaiTro(e.target.value)} />
                                </div>
                                
                                <div className='form-group mb-2'>
                                    <label className='form-label'>Tên Đăng Nhập</label>
                                    <input type="text" value={tenDangNhap} className='form-control' onChange={(e) => setTenDangNhap(e.target.value)} />
                                </div>

                                <div className='form-group mb-2'>
                                    <label className='form-label'>Mật Khẩu</label>
                                    <input type="password" value={matKhau} className='form-control' onChange={(e) => setMatKhau(e.target.value)} />
                                </div>

                                <div className='form-group mb-2'>
                                    <label className='form-label'>Trạng thái</label>
                                    <input type="text" value={trangThai} className='form-control' onChange={(e) => setTrangThai(e.target.value)} />
                                </div>

                                <button className='btn btn-success' onClick={saveTaiKhoan}>Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaiKhoanComponent;
