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
import ListPhong from './components/Phong/ListPhong';
import Phong from './components/Phong/Phong';
import ListImage from './components/HinhAnh/ListImage';
import HinhAnh from './components/HinhAnh/HinhAnh';
import TienIch from './components/TienIch/TienIch';
import Login from './components/login/Login';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'; // Loại bỏ BrowserRouter
import { useState, useEffect } from 'react';

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
    localStorage.removeItem('isAuthenticated'); // Xóa thông tin đăng nhập
    localStorage.removeItem('user'); // Xóa thông tin người dùng nếu có
    setIsAuthenticated(false); // Cập nhật state
  };

  // Xóa mọi dữ liệu xác thực cũ khi trạng thái thay đổi
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
    }
  }, [isAuthenticated]);

  // Component bảo vệ route
  const RequireAuth = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Lấy đường dẫn hiện tại
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="app-container">
      {!isLoginPage && (
        <div className="slidebar">
          <SlideBar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        </div>
      )}
      <div className="main-content">
        {!isLoginPage && (
          <div className="header">
            <Header onLogout={handleLogout} isAuthenticated={isAuthenticated} />
          </div>
        )}
        <div className="content-area">
          <Routes>
            {/* Route công khai */}
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            {/* Các route được bảo vệ */}
            <Route
              path="/NhanVien"
              element={
                <RequireAuth>
                  <ListNhanVien />
                </RequireAuth>
              }
            />
            <Route
              path="/TaiKhoan"
              element={
                <RequireAuth>
                  <ListTaiKhoan />
                </RequireAuth>
              }
            />
            <Route
              path="/VaiTro"
              element={
                <RequireAuth>
                  <ListVaiTro />
                </RequireAuth>
              }
            />
            <Route
              path="/add-nhanvien"
              element={
                <RequireAuth>
                  <NhanVienComponent />
                </RequireAuth>
              }
            />
            <Route
              path="/add-taikhoan"
              element={
                <RequireAuth>
                  <TaiKhoanComponent />
                </RequireAuth>
              }
            />
            <Route
              path="/update-nhan-vien/:id"
              element={
                <RequireAuth>
                  <NhanVienComponent />
                </RequireAuth>
              }
            />
            <Route
              path="/DichVu"
              element={
                <RequireAuth>
                  <TableDichVu />
                </RequireAuth>
              }
            />
            <Route
              path="/TienNghi"
              element={
                <RequireAuth>
                  <TienNghi />
                </RequireAuth>
              }
            />
            <Route
              path="/DatPhong"
              element={
                <RequireAuth>
                  <DatPhong />
                </RequireAuth>
              }
            />
            <Route
              path="/TienIch"
              element={
                <RequireAuth>
                  <TienIch />
                </RequireAuth>
              }
            />
            <Route
              path="/phong"
              element={
                <RequireAuth>
                  <ListPhong />
                </RequireAuth>
              }
            />
            <Route
              path="/add-phong"
              element={
                <RequireAuth>
                  <Phong />
                </RequireAuth>
              }
            />
            <Route
              path="/update-phong/:id"
              element={
                <RequireAuth>
                  <Phong />
                </RequireAuth>
              }
            />
            <Route
              path="/hinh-anh"
              element={
                <RequireAuth>
                  <ListImage />
                </RequireAuth>
              }
            />
            <Route
              path="/add-hinh-anh"
              element={
                <RequireAuth>
                  <HinhAnh />
                </RequireAuth>
              }
            />
            {/* Redirect các đường dẫn không xác định */}
            <Route
              path="*"
              element={
                isAuthenticated ? (
                  <Navigate to="/NhanVien" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
