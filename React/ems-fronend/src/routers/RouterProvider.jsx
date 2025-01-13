import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import SlideBar from '../components/Slidebar';

import Login from "../components/login/Login";
import LoaiPhong from "../components/LoaiPhong/LoaiPhong";
import ViewPhong from "../components/TrangChu/ViewPhong";
import Header from "../components/Header";
import ListNhanVien from "../components/nhanvien/ListNhanVien";
import NhanVienComponent from "../components/nhanvien/NhanVienComponent";
import { XoaDichVuDiKem } from "../services/DichVuDiKemService";
import DanhSach from "../components/DichVu/DanhSach";
import DanhSachDichVuDiKem from "../components/DichVuDikem/DanhSachDichVuDiKem";
import DanhSachDichVuSuDung from "../components/DichVuSuDung/DanhSachDichVuSuDung";
import TienIch from "../components/TienIch/TienIch";
import ListPhong from "../components/Phong/ListPhong";
import Phong from "../components/Phong/Phong";
import ListImage from "../components/HinhAnh/ListImage";
import HinhAnh from "../components/HinhAnh/HinhAnh";
import QuanLyDatPhong from "../components/DatPhong/QuanLyDatPhong";
import GiaoDienTaoDP from "../components/DatPhong/GiaoDienTaoDP";
import TaoDatPhong from "../components/DatPhong/TaoDatPhong";
import ChiTietDatPhong from "../components/DatPhong/ChiTietDatPhong";
import ListHoaDon from "../components/HoaDon/ListHoaDon";
import HoaDonComponent from "../components/HoaDon/HoaDonComponent";
import TaiKhoanComponent from "../components/taikhoan/TaiKhoanComponent";
import KhachHangComponent from "../components/KhachHang/KhachHangComponent";
import ListTaiKhoan from "../components/taikhoan/ListTaiKhoan";
import ListVaiTro from "../components/vaitro/ListVaiTro";
import { Customer } from "../pages/customer/Customer";
import { NewCustomer } from "../pages/customer/NewCustomer";
import { DetailCustomer } from "../pages/customer/DetailCustomer";

function RouterProvider() {

    const UnauthorizedRoutes = () => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            return <Navigate to="/TrangChu" replace={true} />;
        }
        return (
            <div className="app-container">
                <Outlet />
            </div>
        )
    }

    const ProtectedRoutes = () => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            return <Navigate to="/login" replace={true} />;
        }
        return (
            <div className="app-container">
                <div className="slidebar">
                    <SlideBar onLogout={null} />
                </div>
                <div className="main-content">
                    <div className="header">
                        <Header onLogout={null} isAuthenticated={true} />
                    </div>
                    <div className="content-area">
                        <Outlet />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Routes>
            <Route path="*" element={<Navigate to="/login" replace={true} />} />

            <Route element={<UnauthorizedRoutes />}>
                <Route path="/login" element={<Login />} />
            </Route>

            <Route element={<ProtectedRoutes />}>
                <Route path="/TrangChu" element={<ViewPhong />} />
                <Route path="/LoaiPhong" element={<LoaiPhong />} />
                <Route path="/NhanVien" element={<ListNhanVien />} />
                <Route path="/add-nhanvien" element={<NhanVienComponent />} />
                <Route path="/LoaiPhong" element={<LoaiPhong />} />
                <Route path="/DichVuDikem" element={<XoaDichVuDiKem />} />
                <Route path="/DichVu" element={<DanhSach />} />
                <Route path="/DichVuDiKem" element={<DanhSachDichVuDiKem />} />
                <Route path="/DichVuSuDung" element={<DanhSachDichVuSuDung />} />
                <Route path="/TienIch" element={<TienIch />} />
                <Route path="/phong" element={<ListPhong />} />
                <Route path="/add-phong" element={<Phong />} />
                <Route path="/update-phong/:id" element={<Phong />} />
                <Route path="/hinh-anh" element={<ListImage />} />
                <Route path="/add-hinh-anh" element={<HinhAnh />} />
                <Route path="/TrangChu" element={<ViewPhong />} />
                <Route path="/quan-ly-dat-phong" element={<QuanLyDatPhong />} />
                <Route path="/giao-dien-tao-dp" element={<GiaoDienTaoDP />} />
                <Route path="/tao-dat-phong" element={<TaoDatPhong />} />
                <Route path="/thong-tin-dat-phong" element={<ChiTietDatPhong />} />
                <Route path="/hoa-don" element={<ListHoaDon />} />
                <Route path="/add-hoa-don" element={<HoaDonComponent />} />
                <Route path="/add-taikhoan" element={<TaiKhoanComponent />} />
                {/* <Route path="/update-khach-hang/:id" element={<KhachHangComponent />} /> */}
                <Route path="/update-khach-hang/:id" element={<DetailCustomer />} />
                {/* <Route path="/add-khach-hang" element={<KhachHangComponent />} /> */}
                <Route path="/add-khach-hang" element={<NewCustomer />} />
                {/* <Route path="/khach-hang" element={<ListKhachHang />} /> */}
                <Route path="/khach-hang" element={<Customer />} />
                <Route path="/TaiKhoan" element={<ListTaiKhoan />} />
                <Route path="/VaiTro" element={<ListVaiTro />} />
                <Route path="/" element={<ViewPhong />} />

            </Route>
        </Routes>
    )
}

export default RouterProvider