import './App.css';
import Header from './components/Header';
import SlideBar from './components/Slidebar';
import DanhSach from './components/DichVu/DanhSach';
import DatPhong from './components/DatPhong/DatPhong';
import TienNghi from './components/TienNghi';
import TableNhanVien from './components/TableNhanVien';
import DanhSachDichVuDiKem from './components/DichVuDikem/DanhSachDichVuDiKem';
import FormSearch from './components/Home';
import Upload from './components/DemoCloudinary';
import HotelBooking from './components/BookingView';
import FormAdd from './components/DichVu/FormAdd';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
              {/* <Upload /> */}
            </div>
            <Routes>
              <Route path="/DichVu" element={<DanhSach />} />
              <Route path="/DichVuDikem" element={<DanhSachDichVuDiKem />} />
              <Route path="/NhanVien" element={<TableNhanVien />} />
              <Route path="/TienNghi" element={<TienNghi />} />
              <Route path="/DatPhong" element={<DatPhong />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
  );
}


export default App;
