import './App.css';
import Header from './components/Header';
import SlideBar from './components/Slidebar';
import DanhSach from './components/DichVu/DanhSach';
import DatPhong from './components/DatPhong/DatPhong';
import TienNghi from './components/TienNghi';
import DanhSachDichVuDiKem from './components/DichVuDikem/DanhSachDichVuDiKem';
import TableLoaiPhong from './components/LoaiPhong/TableLoaiPhong';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListPhong from './components/Phong/ListPhong';
import Phong from './components/Phong/Phong';
import LoaiPhong from './components/LoaiPhong/LoaiPhong';
import ListImage from './components/HinhAnh/ListImage';
import HinhAnh from './components/HinhAnh/HinhAnh';
import ListKhachHang from './components/KhachHang/ListKhachHang';
import KhachHangComponent from './components/KhachHang/KhachHangComponent';
import TableNhanVien from './components/TableNhanVien';
import TienIch from './components/TienIch/TienIch';
import DanhSachPhieuDichVu from './components/PhieuDichVu/DanhSachPhieuDichVu';
import FormAddPage from './components/DatPhong/FormAddPage';
import FormAdd from './components/DatPhong/FormAdd';
function App() {
  return (
    <BrowserRouter>
      <div className="app-container">

        <div className="slidebar">
          <SlideBar />
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
            <Route path='/khach-hang' element={<ListKhachHang/>} />
            <Route path='/add-khach-hang' element={<KhachHangComponent/>} />
            <Route path='/update-khach-hang/:id' element={<KhachHangComponent/>} />
          </Routes>
        </div>
      </div>

    </BrowserRouter>
  );
}


export default App;
