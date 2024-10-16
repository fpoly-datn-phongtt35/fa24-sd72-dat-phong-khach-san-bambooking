import './App.css';
import Header from './components/Header';
import SlideBar from './components/Slidebar';
import TableDichVu from './components/tableDichVu';
import DatPhong from './components/DatPhong/DatPhong';
import TienNghi from './components/TienNghi';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListPhong from './components/Phong/ListPhong';
import Phong from './components/Phong/Phong';
import ListImage from './components/HinhAnh/ListImage';
import HinhAnh from './components/HinhAnh/HinhAnh';
import ListKhachHang from './components/KhachHang/ListKhachHang';
import KhachHangComponent from './components/KhachHang/KhachHangComponent';
import ViewPhong from './components/TrangChu/ViewPhong';
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
            <Route path="/DichVu" element={<TableDichVu />} />
            <Route path="/TienNghi" element={<TienNghi />} />
            <Route path="/DatPhong" element={<DatPhong />} />
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
