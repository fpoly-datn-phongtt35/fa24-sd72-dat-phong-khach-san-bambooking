// // import './App.css';
// // import Header from './components/Header';
// // import SlideBar from './components/Slidebar';
// // import TableDichVu from './components/tableDichVu';
// // import ListNhanVien from './components/nhanvien/ListNhanVien';
// // import TienNghi from './components/TienNghi';
// // import NhanVienComponent from './components/nhanvien/NhanVienComponent';
// // import ListTaiKhoan from './components/taikhoan/ListTaiKhoan';
// // import ListVaiTro from './components/vaitro/ListVaiTro';
// // import TaiKhoanComponent from './components/taikhoan/TaiKhoanComponent';
// // import DatPhong from './components/DatPhong/DatPhong';
// // import ListPhong from './components/Phong/ListPhong';
// // import Phong from './components/Phong/Phong';
// // import ListImage from './components/HinhAnh/ListImage';
// // import HinhAnh from './components/HinhAnh/HinhAnh';
// // import TienIch from './components/TienIch/TienIch';
// // import Login from './components/login/Login';
// // import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// // import { useState, useEffect } from 'react';


// // function App() {
// //   // State để lưu trạng thái đăng nhập
// //   const [isAuthenticated, setIsAuthenticated] = useState(false);

// //   // Kiểm tra trạng thái đăng nhập từ localStorage khi ứng dụng khởi động
// //   useEffect(() => {
// //     const loggedIn = localStorage.getItem('isAuthenticated');
// //     setIsAuthenticated(loggedIn === 'true');
// //   }, []);

// //   // Hàm xử lý khi đăng nhập thành công
// //   const handleLoginSuccess = () => {
// //     localStorage.setItem('isAuthenticated', 'true');
// //     setIsAuthenticated(true);
// //   };

// //   // Hàm xử lý đăng xuất
// //   const handleLogout = () => {
// //     localStorage.removeItem('isAuthenticated');
// //     setIsAuthenticated(false);
// //   };

// //   return (
// //     <BrowserRouter>
// //       <div className="app-container">
// //         {!isAuthenticated ? (
// //           // Nếu chưa đăng nhập, chuyển hướng đến trang Login
// //           <Routes>
// //             <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
// //             <Route path="*" element={<Navigate to="/login" />} />
// //           </Routes>
// //         ) : (
// //           // Nếu đã đăng nhập, hiển thị giao diện chính
// //           <>
// //             <div className="slidebar">
// //               <SlideBar />
// //             </div>
// //             <div className="main-content">
// //               <div className="header">
// //                 <Header onLogout={handleLogout} />
// //               </div>
// //               <Routes>
// //                 <Route path="/NhanVien" element={<ListNhanVien />} />
// //                 <Route path="/TaiKhoan" element={<ListTaiKhoan />} />
// //                 <Route path="/VaiTro" element={<ListVaiTro />} />
// //                 <Route path="/add-nhanvien" element={<NhanVienComponent />} />
// //                 <Route path="/add-taikhoan" element={<TaiKhoanComponent />} />
// //                 <Route path="/update-nhan-vien/:id" element={<NhanVienComponent />} />
// //                 <Route path="/DichVu" element={<TableDichVu />} />
// //                 <Route path="/TienNghi" element={<TienNghi />} />
// //                 <Route path="/DatPhong" element={<DatPhong />} />
// //                 <Route path="/TienIch" element={<TienIch />} />
// //                 <Route path="/phong" element={<ListPhong />} />
// //                 <Route path="/add-phong" element={<Phong />} />
// //                 <Route path="/update-phong/:id" element={<Phong />} />
// //                 <Route path="/hinh-anh" element={<ListImage />} />
// //                 <Route path="/add-hinh-anh" element={<HinhAnh />} />
// //                 <Route path="*" element={<Navigate to="/NhanVien" />} />
// //               </Routes>
// //             </div>
// //           </>
// //         )}
// //       </div>
// //     </BrowserRouter>
// //   );
// // }

// // export default App;




// import './App.css';
// import Header from './components/Header';
// import SlideBar from './components/Slidebar';
// import TableDichVu from './components/tableDichVu';
// import ListNhanVien from './components/nhanvien/ListNhanVien';
// import TienNghi from './components/TienNghi';
// import NhanVienComponent from './components/nhanvien/NhanVienComponent';
// import ListTaiKhoan from './components/taikhoan/ListTaiKhoan';
// import ListVaiTro from './components/vaitro/ListVaiTro';
// import TaiKhoanComponent from './components/taikhoan/TaiKhoanComponent';
// import DatPhong from './components/DatPhong/DatPhong';
// import ListPhong from './components/Phong/ListPhong';
// import Phong from './components/Phong/Phong';
// import ListImage from './components/HinhAnh/ListImage';
// import HinhAnh from './components/HinhAnh/HinhAnh';
// import TienIch from './components/TienIch/TienIch';
// import Login from './components/login/Login';
// import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { useState, useEffect } from 'react';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // Kiểm tra trạng thái đăng nhập từ localStorage khi ứng dụng khởi động
//   useEffect(() => {
//     const loggedIn = localStorage.getItem('isAuthenticated');
//     setIsAuthenticated(loggedIn === 'true');
//   }, []);

//   // Hàm xử lý khi đăng nhập thành công
//   const handleLoginSuccess = () => {
//     localStorage.setItem('isAuthenticated', 'true');
//     setIsAuthenticated(true);
//   };

//   // Hàm xử lý đăng xuất
//   const handleLogout = () => {
//     localStorage.removeItem('isAuthenticated');
//     setIsAuthenticated(false);
//   };

//   // Component nhỏ để kiểm tra đường dẫn và điều hướng
//   const RequireAuth = ({ children }) => {
//     const location = useLocation(); // Gọi useLocation() bên trong BrowserRouter context

//     if (!isAuthenticated && location.pathname !== '/login') {
//       return <Navigate to="/login" replace />;
//     }
//     return children;
//   };

//   return (
//     <BrowserRouter>
//       <div className="app-container">
//         {!isAuthenticated ? (
//           // Hiển thị chỉ trang login nếu chưa đăng nhập
//           <Routes>
//             <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
//             <Route path="*" element={<Navigate to="/login" replace />} />
//           </Routes>
//         ) : (
//           // Giao diện chính sau khi đăng nhập
//           <RequireAuth>
//             <div className="slidebar">
//               <SlideBar />
//             </div>
//             <div className="main-content">
//               <div className="header">
//                 <Header onLogout={handleLogout} />
//               </div>
//               <Routes>
//                 <Route path="/NhanVien" element={<ListNhanVien />} />
//                 <Route path="/TaiKhoan" element={<ListTaiKhoan />} />
//                 <Route path="/VaiTro" element={<ListVaiTro />} />
//                 <Route path="/add-nhanvien" element={<NhanVienComponent />} />
//                 <Route path="/add-taikhoan" element={<TaiKhoanComponent />} />
//                 <Route path="/update-nhan-vien/:id" element={<NhanVienComponent />} />
//                 <Route path="/DichVu" element={<TableDichVu />} />
//                 <Route path="/TienNghi" element={<TienNghi />} />
//                 <Route path="/DatPhong" element={<DatPhong />} />
//                 <Route path="/TienIch" element={<TienIch />} />
//                 <Route path="/phong" element={<ListPhong />} />
//                 <Route path="/add-phong" element={<Phong />} />
//                 <Route path="/update-phong/:id" element={<Phong />} />
//                 <Route path="/hinh-anh" element={<ListImage />} />
//                 <Route path="/add-hinh-anh" element={<HinhAnh />} />
//                 <Route path="*" element={<Navigate to="/NhanVien" replace />} />
//               </Routes>
//             </div>
//           </RequireAuth>
//         )}
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;


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
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    localStorage.removeItem('isAuthenticated'); // Xóa trạng thái cũ nếu có
    setIsAuthenticated(false); // Đảm bảo vào đúng trang login
  }, []);
  

  // Kiểm tra trạng thái đăng nhập từ localStorage khi ứng dụng khởi động
  useEffect(() => {
    const loggedIn = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(loggedIn === 'true');
  }, []);



  // Hàm xử lý khi đăng nhập thành công
  const handleLoginSuccess = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  // Component kiểm tra yêu cầu đăng nhập
  const RequireAuth = ({ children }) => {
    const location = useLocation(); // Đảm bảo useLocation trong BrowserRouter

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
            // Hiển thị trang login nếu chưa đăng nhập
            <>
              <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            // Giao diện chính sau khi đăng nhập
            <>
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
                        <Route path="*" element={<Navigate to="/NhanVien" replace />} />
                      </Routes>
                    </div>
                  </RequireAuth>
                }
              />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
