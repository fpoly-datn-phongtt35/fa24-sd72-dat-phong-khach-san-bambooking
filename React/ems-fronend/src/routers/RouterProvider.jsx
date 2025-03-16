import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import Header from '../components/Header';
import Login from '../components/login/Login';
import LoaiPhong from '../components/LoaiPhong/LoaiPhong';
import ViewPhong from '../components/TrangChu/ViewPhong';
import { XoaDichVuDiKem } from '../services/DichVuDiKemService';
import DanhSach from '../components/DichVu/DanhSach';
import DanhSachDichVuDiKem from '../components/DichVuDikem/DanhSachDichVuDiKem';
import DanhSachDichVuSuDung from '../components/DichVuSuDung/DanhSachDichVuSuDung';
import VatTu from '../components/VatTu/VatTu';
import VatTuLoaiPhong from '../components/VatTuLoaiPhong/VatTuLoaiPhong';
import ListPhong from '../components/Phong/ListPhong';
import Phong from '../components/Phong/Phong';
import ListImage from '../components/HinhAnh/ListImage';
import HinhAnh from '../components/HinhAnh/HinhAnh';
import QuanLyDatPhong from '../components/DatPhong/QuanLyDatPhong';
import BookingForm from '../components/DatPhong/BookingForm';
import TaoDatPhong from '../components/DatPhong/TaoDatPhong';
import ChiTietDatPhong from '../components/DatPhong/ChiTietDatPhong';
import ChiTietTTDP from '../components/DatPhong/ChiTietTTDP';
import ListHoaDon from '../components/HoaDon/ListHoaDon';
import TaiKhoanComponent from '../components/taikhoan/TaiKhoanComponent';
import ListTaiKhoan from '../components/taikhoan/ListTaiKhoan';
import { Customer } from '../pages/customer/Customer';
import { NewCustomer } from '../pages/customer/NewCustomer';
import { DetailCustomer } from '../pages/customer/DetailCustomer';
import { Employee } from '../pages/employee/Employee';
import { NewEmployee } from '../pages/employee/NewEmployee';
import { DetailEmployee } from '../pages/employee/DetailEmployee';
import ThanhToanComponent from '../components/ThanhToan/ThanhToanComponent';
import InfoHoaDon from '../components/HoaDon/InfoHoaDon';
import DemoTaoHoaDon from '../components/HoaDon/DemoTaoHoaDon';
import Demo from '../components/HoaDon/Demo';
import UploadQR from '../components/UploadQR';
import QRScannerManual from '../components/QRScannerManual';
import QuanLyPhong from '../components/QuanLyPhong/ViewPhong';
import RoomDetail from '../components/QuanLyPhong/RoomDetail';
import KiemTraPhong from '../components/kiemTraPhong/KiemTraPhong';
import CreateKiemTraPhong from '../components/kiemTraPhong/CreateKiemTraPhong';

function RouterProvider({ isSidebarOpen, setIsSidebarOpen }) {
  const UnauthorizedRoutes = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      return <Navigate to="/TrangChu" replace={true} />;
    }
    return (
      <div className="app-container">
        <Outlet />
      </div>
    );
  };

  const ProtectedRoutes = () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      return <Navigate to="/login" replace={true} />;
    }
    return (
      <div className="app-container">
        <div className="main-content">
          <div className="header">
            <Header onLogout={null} isAuthenticated={true} />
          </div>
          <div className="content-area">
            <Outlet />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Routes>
      <Route path="*" element={<Navigate to="/login" replace={true} />} />

      <Route element={<UnauthorizedRoutes />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoutes />}>
        <Route path="/TrangChu" element={<ViewPhong />} />
        <Route path="/LoaiPhong" element={<LoaiPhong />} />
        <Route path="/NhanVien" element={<Employee />} />
        <Route path="/add-nhan-vien" element={<NewEmployee />} />
        <Route path="/update-nhan-vien/:id" element={<DetailEmployee />} />
        <Route path="/LoaiPhong" element={<LoaiPhong />} />
        <Route path="/DichVuDikem" element={<XoaDichVuDiKem />} />
        <Route path="/DichVu" element={<DanhSach />} />
        <Route path="/DichVuDiKem" element={<DanhSachDichVuDiKem />} />
        <Route path="/DichVuSuDung" element={<DanhSachDichVuSuDung />} />
        <Route path="/VatTu" element={<VatTu />} />
        <Route path="/VatTuLoaiPhong" element={<VatTuLoaiPhong />} />
        <Route path="/phong" element={<ListPhong />} />
        <Route path="/add-phong" element={<Phong />} />
        <Route path="/update-phong/:id" element={<Phong />} />
        <Route path="/hinh-anh" element={<ListImage />} />
        <Route path="/add-hinh-anh" element={<HinhAnh />} />
        <Route path="/TrangChu" element={<ViewPhong />} />
        <Route path="/quan-ly-dat-phong" element={<QuanLyDatPhong />} />
        <Route path="/giao-dien-tao-dp" element={<BookingForm />} />
        <Route path="/tao-dat-phong" element={<TaoDatPhong />} />
        <Route path="/thong-tin-dat-phong" element={<ChiTietDatPhong />} />
        <Route path="/chi-tiet-ttdp" element={<ChiTietTTDP />} />
        <Route path="/api/RoomDetail/:roomId" element={<RoomDetail />} />
        <Route path="/hoa-don" element={<ListHoaDon />} />
        <Route path="/add-taikhoan" element={<TaiKhoanComponent />} />
        <Route path="/update-khach-hang/:id" element={<DetailCustomer />} />
        <Route path="/add-khach-hang" element={<NewCustomer />} />
        <Route path="/khach-hang" element={<Customer />} />
        <Route path="/TaiKhoan" element={<ListTaiKhoan />} />
        <Route path="/" element={<ViewPhong />} />
        <Route path="/test" element={<QRScannerManual />} />
        <Route path="/upload" element={<UploadQR />} />
        <Route path="/quan-ly-phong" element={<QuanLyPhong />} />
        <Route path="thanh-toan/:idHoaDon" element={<ThanhToanComponent />} />
        <Route path="/tra-phong" element={<Demo />} />
        <Route path="/hoa-don/:id" element={<InfoHoaDon />} />
        <Route path="/tao-hoa-don" element={<DemoTaoHoaDon />} />
        <Route path="/kiem-tra-phong" element={<KiemTraPhong />} />
        <Route path="/tao-kiem-tra-phong/:idXepPhong" element={<CreateKiemTraPhong />} />
      </Route>
    </Routes>
  );
}

export default RouterProvider;