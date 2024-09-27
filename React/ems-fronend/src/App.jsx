import './App.css';
import Header from './components/Header';
import SlideBar from './components/Slidebar';
import TableDichVu from './components/tableDichVu';
import TableNhanVien from './components/TableNhanVien';
import TienNghi from './components/TienNghi';
import Upload from './components/DemoCloudinary';
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
              <Upload />
            </div>
            <Routes>
              <Route path="/DichVu" element={<TableDichVu />} />
              <Route path="/NhanVien" element={<TableNhanVien />} />
              <Route path="/TienNghi" element={<TienNghi />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
  );
}


export default App;
