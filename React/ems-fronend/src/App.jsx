import './App.css';
import Header from './components/Header';
import SlideBar from './components/Slidebar';
import TableDichVu from './components/tableDichVu';
import ListNhanVien from './components/nhanvien/ListNhanVien';
import TienNghi from './components/TienNghi';
import NhanVienComponent from './components/nhanvien/NhanVienComponent';
import ListTaiKhoan from './components/taikhoan/ListTaiKhoan';
import ListVaiTro from './components/vaitro/ListVaiTro';
import TaiKhoanComponent from './components/taikhoan/TaiKhoanComponent';
import DatPhong from './components/DatPhong/DatPhong';
import DanhSach from './components/DichVu/DanhSach';
import DanhSachDichVuDiKem from './components/DichVuDikem/DanhSachDichVuDiKem';
import TableLoaiPhong from './components/LoaiPhong/TableLoaiPhong';
import ListPhong from './components/Phong/ListPhong';
import Phong from './components/Phong/Phong';
import LoaiPhong from './components/LoaiPhong/LoaiPhong';
import ListImage from './components/HinhAnh/ListImage';
import HinhAnh from './components/HinhAnh/HinhAnh';
import TienIch from './components/TienIch/TienIch';
import Login from './components/login/Login';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ListKhachHang from './components/KhachHang/ListKhachHang';
import KhachHangComponent from './components/KhachHang/KhachHangComponent';
import ViewPhong from './components/TrangChu/ViewPhong';
import TableNhanVien from './components/TableNhanVien';
import DanhSachPhieuDichVu from './components/PhieuDichVu/DanhSachPhieuDichVu';
import FormAddPage from './components/DatPhong/FormAddPage';
import FormAdd from './components/DatPhong/FormAdd';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const auth = localStorage.getItem('isAuthenticated');
    return auth === 'true'; // Khởi tạo từ localStorage
  });

  // Hàm xử lý khi đăng nhập thành công
  const handleLoginSuccess = () => {
    localStorage.setItem('isAuthenticated', 'true'); // Lưu trạng thái đăng nhập
    setIsAuthenticated(true);
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    // localStorage.removeItem('isAuthenticated'); // Xóa thông tin đăng nhập
    setIsAuthenticated(false); // Cập nhật state

  };

  // Điều hướng về login nếu chưa đăng nhập hoặc backend không hoạt động
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem('isAuthenticated'); // Xóa mọi thông tin cũ
    }
  }, [isAuthenticated]);

  // Component kiểm tra yêu cầu đăng nhập
  const RequireAuth = ({ children }) => {
    const location = useLocation();

    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          {!isAuthenticated ? (
            <>
              {/* Trang login */}
              <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              {/* Giao diện chính sau khi đăng nhập */}
              <Route
                path="/*"
                element={
                  <RequireAuth>
                    <div className="slidebar">
                      <SlideBar />
                    </div>
                    <div className="main-content">
                      <div className="header">
                        <Header onLogout={handleLogout} />
                      </div>
                      <Routes>
                        <Route path="/NhanVien" element={<ListNhanVien />} />
                        <Route path="/TaiKhoan" element={<ListTaiKhoan />} />
                        <Route path="/VaiTro" element={<ListVaiTro />} />
                        <Route path="/add-nhanvien" element={<NhanVienComponent />} />
                        <Route path="/add-taikhoan" element={<TaiKhoanComponent />} />
                        <Route path="/update-nhan-vien/:id" element={<NhanVienComponent />} />
                        <Route path="/DichVu" element={<TableDichVu />} />
                        <Route path="/TienNghi" element={<TienNghi />} />
                        <Route path="/DatPhong" element={<DatPhong />} />
                        <Route path="/TienIch" element={<TienIch />} />
                        <Route path="/phong" element={<ListPhong />} />
                        <Route path="/add-phong" element={<Phong />} />
                        <Route path="/update-phong/:id" element={<Phong />} />
                        <Route path="/hinh-anh" element={<ListImage />} />
                        <Route path="/add-hinh-anh" element={<HinhAnh />} />
                        <Route path="/login" element={<Login />} />

                        {/* <Route path="*" element={<Navigate to="/NhanVien" replace />} /> */}
                      </Routes>
                    </div>
                  </RequireAuth>
                }
              />
            </>
          )}
        </Routes>
      </div>
        <div className="main-content">
          <div className="header">
            <Header />
          </div>
          <Routes>
            {/* Đặt phòng */}
            <Route path="/DatPhong" element={<DatPhong />} />
            <Route path='/tao-dat-phong' element={<FormAddPage />} />
            <Route path='/form-tao' element={<FormAdd />} />
            {/* Dịch vụ */}
            <Route path="/DichVu" element={<TableDichVu />} />
            {/* Nhân viên */}
            <Route path="/NhanVien" element={<TableNhanVien />} />
            {/* Tiện ích */}
            <Route path="/TienNghi" element={<TienNghi />} />
            <Route path="/TienIch" element={<TienIch />} />
               {/* Dịch vụ */}
              <Route path="/DichVu" element={<DanhSach/>} />
              <Route path="/DichVuDikem" element={<DanhSachDichVuDiKem />} />
              <Route path="/PhieuDichVu" element={<DanhSachPhieuDichVu />} />
              <Route path="/LoaiPhong" element={<TableLoaiPhong />} />
            {/*Phòng */}
            <Route path='/phong' element={<ListPhong />}></Route>
            <Route path='/add-phong' element={<Phong />}></Route>
            <Route path='/update-phong/:id' element={<Phong />}></Route>
            {/*Image */}
            <Route path='/hinh-anh' element={<ListImage />}></Route>
            <Route path='/add-hinh-anh' element={<HinhAnh />}></Route>
            {/*Khách hàng */}
            <Route path='/khach-hang' element={<ListKhachHang />} />
            <Route path='/add-khach-hang' element={<KhachHangComponent />} />
            <Route path='/update-khach-hang/:id' element={<KhachHangComponent />} />

            {/*Trang chủ */}
            <Route path='/trang-chu' element={<ViewPhong />} />
          </Routes>
        </div>
      </div>

    </BrowserRouter>
  );
}

export default App;
