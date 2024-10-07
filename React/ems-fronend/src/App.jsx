import './App.css';
import Header from './components/Header';
import SlideBar from './components/Slidebar';
import TableDichVu from './components/tableDichVu';
import DatPhong from './components/DatPhong/DatPhong';
import TienNghi from './components/TienNghi/TienNghi';
import TableNhanVien from './components/TableNhanVien';
import TienIch from './components/TienIch/TienIch';
import FormSearch from './components/Home';
import Upload from './components/DemoCloudinary';
import HotelBooking from './components/BookingView';
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
              <Route path="/DichVu" element={<TableDichVu />} />
              <Route path="/TienIch" element={<TienIch />} />
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
