// App.js
import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Rooms from "./pages/Rooms";
import History from "./pages/History";
import DetailTTDP from "./components/DetailTTDP";
import TTDP from "./components/TTDP";
import Lookup from "./pages/Lookup";
import LookupHistory from "./components/LookupHistory";
import LookupDetailTTDP from "./components/LookupDetailTTDP";
import LookupTTDP from "./components/LookupTTDP";
import ConfirmBooking from "./components/ConfirmBooking";
import CreateReview from "./components/CreateReview";
import UpdateKhachHang from "./components/UpdateKhachHang";
import Information from "./pages/Information";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import HotelRules from "./pages/HotelRules";
import Signup from "./components/Signup";
import AccountPage from "./pages/AccountPage";

import HotelBookingForm from "./pages/HotelBookingForm";
import HotelBookingConfirmation from "./pages/HotelBookingConfirmation";
import PendingBooking from "./pages/PendingBooking";
import HomePage from "./pages/HomePage";
import Services from "./pages/Services";
import Offers from "./pages/Offers";

function App() {
  const UnauthorizedRoutes = () => {
    // const accessToken = localStorage.getItem("accessToken");
    // if (accessToken) {
    //   return <Navigate to="/" replace={true} />;
    // }
    return (
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <div className="content-area">
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  const ProtectedRoutes = () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      return <Navigate to="/login" replace={true} />;
    }
    return (
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <div className="content-area">
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  // return (
  //   <div className="app-container">
  //     <Navbar />
  //     <div className="main-content">
  //       <div className="content-area">
  //         <Routes>
  //           {/* <Route path="/" element={<Home />} /> */}
  //           <Route path="/rooms" element={<Rooms />} />
  //           <Route path="/register" element={<Register />} />
  //           <Route path="/login" element={<Login />} />
  //           <Route path="/profile" element={<Profile />} />
  //           <Route path="/about" element={<AboutPage />} />
  //           <Route path="/rules" element={<HotelRules />} />
  //         </Routes>
  //       </div>
  //     </div>
  //     <Footer />
  //   </div>
  // );
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/" replace={true} />} />

      <Route element={<UnauthorizedRoutes />}>
        {/* Pages không cần đăng nhập */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/ttdp/:idDatPhong" element={<TTDP />} />
        <Route path="/detail-ttdp/:idDatPhong/:idLoaiPhong" element={<DetailTTDP />} />
        <Route path="/lookup/ttdp/:idDatPhong" element={<LookupTTDP />} />
        <Route path="/lookup/detail-ttdp/:idDatPhong/:idLoaiPhong" element={<LookupDetailTTDP />} />
        <Route path="/lich-su-dat-phong/:email" element={<LookupHistory />} />
        <Route path="/confirm-booking/:iddp" element={<ConfirmBooking />} />
        <Route path="/create-review/:idKhachHang/:idTTDP" element={<CreateReview />} />
        <Route path="/update-kh/:id/:iddp" element={<UpdateKhachHang />} />
        <Route path="/lookup" element={<Lookup />} />
        <Route path="/history" element={<History />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/services" element={<Services />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/information" element={<Information />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/account" element={<AccountPage />} />
        {/* <Route path="/about" element={<AboutPage />} /> */}
        <Route path="/rules" element={<HotelRules />} />
        <Route path="/booking" element={<HotelBookingForm />} />
        <Route
          path="/booking-confirmation"
          element={<HotelBookingConfirmation />}
        />
        <Route path="/pending-booking" element={<PendingBooking />} />
      </Route>

      <Route element={<ProtectedRoutes />}>
        {/* Pages cần đăng nhập */}
        <Route path="/about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}

export default App;
