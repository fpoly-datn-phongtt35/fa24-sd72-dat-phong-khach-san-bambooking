import React, { useState } from 'react'
import { createNhanVien } from '../../services/NhanVienService'
import { useNavigate } from 'react-router-dom'

const NhanVienComponent = () => {
    const [ho, setHo] = useState('')
    const [ten, setTen] = useState('')
    const [gioiTinh, setGioiTinh] = useState('')
    const [quocGia, setQuocGia] = useState('')
    const [sdt, setSdt] = useState('')
    const [email, setEmail] = useState('')
    const [ngayTao, setNgayTao] = useState('') 
    const [ngaySua, setNgaySua] = useState('')
    const [trangThai, setTrangThai] = useState('')

    const navigator = useNavigate();

    function saveNhanVien(e) {
        e.preventDefault();

        if (!/\S+@\S+\.\S+/.test(email)) {
            alert('Email không hợp lệ!');
            return;
        }

        if (sdt.length < 10) {
            alert('Số điện thoại không hợp lệ!');
            return;
        }

        const formattedNgayTao = ngayTao ? new Date(ngayTao).toISOString() : null;
        const formattedNgaySua = ngaySua ? new Date(ngaySua).toISOString() : null;

        const nhanVien = {
            ho,
            ten,
            gioiTinh,
            quocGia,
            sdt,
            email,
            ngayTao: formattedNgayTao,
            ngaySua: formattedNgaySua,
            trangThai
        };

        createNhanVien(nhanVien).then((response) => {
            console.log(response.data);
            navigator("/NhanVien");
        }).catch(error => {
            console.error("Lỗi khi thêm nhân viên: ", error.response?.data || error.message);
        });
    }

    return (
        <div className='container'>
            <br />
            <div className='row'>
                <div className='card'>
                    <div className='text-center'>Thêm Nhân Viên</div>
                    <div className='col-md-6 offset-md-3'>
                        <div className='card-body'>
                            <form>
                                <div className='form-group mb-2'>
                                    <label className='form-lable'>Họ</label>
                                    <input type="text" name='ho' value={ho} className='form-control' onChange={(e) => setHo(e.target.value)} />
                                </div>

                                <div className='form-group mb-2'>
                                    <label className='form-lable'>Tên</label>
                                    <input type="text" name='ten' value={ten} className='form-control' onChange={(e) => setTen(e.target.value)} />
                                </div>

                                <div className='form-group mb-2'>
                                    <label className='form-lable'>Giới tính</label>
                                    <div>
                                        <label>
                                            <input 
                                                type="radio" 
                                                value="Nam" 
                                                checked={gioiTinh === 'Nam'} 
                                                onChange={(e) => setGioiTinh(e.target.value)} 
                                            />
                                            Nam
                                        </label>
                                        <label>
                                            <input 
                                                type="radio" 
                                                value="Nữ" 
                                                checked={gioiTinh === 'Nữ'} 
                                                onChange={(e) => setGioiTinh(e.target.value)} 
                                            />
                                            Nữ
                                        </label>
                                    </div>
                                </div>
                                
                                <div className='form-group mb-2'>
                                    <label className='form-lable'>Quốc gia</label>
                                    <input type="text" name='quocGia' value={quocGia} className='form-control' onChange={(e) => setQuocGia(e.target.value)} />
                                </div>

                                <div className='form-group mb-2'>
                                    <label className='form-lable'>Số điện thoại</label>
                                    <input type="text" name='sdt' value={sdt} className='form-control' onChange={(e) => setSdt(e.target.value)} />
                                </div>

                                <div className='form-group mb-2'>
                                    <label className='form-lable'>Email</label>
                                    <input type="text" name='email' value={email} className='form-control' onChange={(e) => setEmail(e.target.value)} />
                                </div>

                                <div className='form-group mb-2'>
                                    <label className='form-lable'>Ngày tạo</label>
                                    <input type="date" name='ngayTao' value={ngayTao} className='form-control' onChange={(e) => setNgayTao(e.target.value)} />
                                </div>

                                <div className='form-group mb-2'>
                                    <label className='form-lable'>Ngày sửa</label>
                                    <input type="date" name='ngaySua' value={ngaySua} className='form-control' onChange={(e) => setNgaySua(e.target.value)} />
                                </div>

                                <div className='form-group mb-2'>
                                    <label className='form-lable'>Trạng thái</label>
                                    <input type="text" name='trangThai' value={trangThai} className='form-control' onChange={(e) => setTrangThai(e.target.value)} />
                                </div>

                                <button className='btn btn-success' onClick={saveNhanVien}>Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NhanVienComponent


