import React, { useState , useEffect} from 'react'

const HoaDonComponent = () => {
    const [tenDangNhap, setTenDangNhap] = useState('');
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.tenDangNhap) {
            setTenDangNhap(user.tenDangNhap); // Cập nhật tên đăng nhập
        }
    }, []);
  return (
    <div>
        <p>{tenDangNhap}</p>
    </div>
  )
}

export default HoaDonComponent