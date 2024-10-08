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
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListPhong from './components/Phong/ListPhong';
import Phong from './components/Phong/Phong';
import ListImage from './components/HinhAnh/ListImage';
import HinhAnh from './components/HinhAnh/HinhAnh';
import TienIch from './components/TienIch/TienIch';
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
          <Route path="/NhanVien" element = {<ListNhanVien />} />
          <Route path="/TaiKhoan" element = {<ListTaiKhoan />} />
          <Route path="/VaiTro" element = {<ListVaiTro />} />
          <Route path='/add-nhanvien' element = {<NhanVienComponent />} />
          <Route path='/add-taikhoan' element = {<TaiKhoanComponent />} />
              <Route path="/DichVu" element={<TableDichVu />} />
              <Route path="/TienNghi" element={<TienNghi />} />
              <Route path="/DatPhong" element={<DatPhong />} />
              <Route path="/TienIch" element={<TienIch />} />
            {/*Phòng */}
            <Route path='/phong' element={<ListPhong />}></Route>
            <Route path='/add-phong' element={<Phong />}></Route>
            <Route path='/update-phong/:id' element={<Phong />}></Route>

            {/*Image */}
            <Route path='/hinh-anh' element={<ListImage />}></Route>
            <Route path='/add-hinh-anh' element={<HinhAnh />}></Route>
          </Routes>

        </div>
      </div>

      </BrowserRouter>
  );
}


export default App;
