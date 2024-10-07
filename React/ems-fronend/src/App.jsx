import './App.css';
import Header from './components/Header';
import SlideBar from './components/Slidebar';
import TableDichVu from './components/tableDichVu';
import ListNhanVien from './components/nhanvien/ListNhanVien';
import TienNghi from './components/TienNghi';
import Upload from './components/DemoCloudinary';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NhanVienComponent from './components/nhanvien/NhanVienComponent';
import ListTaiKhoan from './components/taikhoan/ListTaiKhoan';
import ListVaiTro from './components/vaitro/ListVaiTro';
import TaiKhoanComponent from './components/taikhoan/TaiKhoanComponent';
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
            <div className="content">
              {/* <HotelBooking /> */}
              <Upload />
            </div>
            <Routes>
              <Route path="/DichVu" element = {<TableDichVu />} />
              <Route path="/NhanVien" element = {<ListNhanVien />} />
              <Route path="/TaiKhoan" element = {<ListTaiKhoan />} />
              <Route path="/VaiTro" element = {<ListVaiTro />} />
              <Route path='/add-nhanvien' element = {<NhanVienComponent />} />
              <Route path='/add-taikhoan' element = {<TaiKhoanComponent />} />
              <Route path="/TienNghi" element = {<TienNghi />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
  );
}


export default App;
