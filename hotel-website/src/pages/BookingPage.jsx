// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import '../styles/BookingPage.css';

// const availableServices = [
//   { id: 1, name: 'Breakfast', price: 10 },
//   { id: 2, name: 'Airport Shuttle', price: 20 },
//   { id: 3, name: 'Laundry', price: 15 },
// ];

// export default function BookingPage() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { room } = location.state || {};
//   const [selectedServices, setSelectedServices] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(room ? room.price : 0);
//   const [checkInDate, setCheckInDate] = useState('');
//   const [checkOutDate, setCheckOutDate] = useState('');
//   const [guests, setGuests] = useState(1);
//   const [currentStep, setCurrentStep] = useState(2);

//   // Thêm các state cho form khách hàng
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [country, setCountry] = useState('Việt Nam');

//   useEffect(() => {
//     if (!room) navigate('/'); 
//   }, [room, navigate]);

//   useEffect(() => {
//     if (room) {
//       const servicesCost = selectedServices.reduce((sum, service) => sum + service.price, 0);
//       setTotalPrice(room.price + servicesCost);
//     }
//   }, [selectedServices, room]);

//   const handleServiceChange = (service, isChecked) => {
//     if (isChecked) {
//       setSelectedServices([...selectedServices, service]);
//     } else {
//       setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
//     }
//   };

//   const handleBookingSubmit = (e) => {
//     e.preventDefault();
//     navigate('/payment', {
//       state: { 
//         room, 
//         checkInDate, 
//         checkOutDate, 
//         guests, 
//         selectedServices, 
//         totalPrice,
//         firstName, // Thêm dữ liệu khách hàng vào state khi chuyển sang trang thanh toán
//         lastName,
//         email,
//         phone,
//         country
//       },
//     });
//   };

//   if (!room) return null;

//   return (
//     <div className="booking-page">
//       <div className="booking-container">
//         <header className="booking-header">
//           <h1>Đặt Phòng</h1>
//         </header>

//         <div className="progress-bar">
//           {[1, 2, 3].map((step) => (
//             <div key={step} className={`step ${currentStep >= step ? 'completed' : ''}`}>
//               <div className="circle">{step}</div>
//               <div className="label">{step === 1 ? 'Chọn Phòng' : step === 2 ? 'Chi Tiết Đặt Phòng' : 'Thanh Toán'}</div>
//             </div>
//           ))}
//         </div>

//         <div className="booking-details">
//           <img src={room.imageUrl} alt={room.name} className="booking-image" />
//           <h2>{room.name}</h2>
//           <p>{room.description}</p>
//           <p>Giá: ${room.price} / đêm</p>

//           <form onSubmit={handleBookingSubmit}>
//             {/* Các trường thông tin khách hàng */}
//             <div className="form-group">
//               <label>Tên *</label>
//               <input 
//                 type="text" 
//                 value={firstName} 
//                 onChange={(e) => setFirstName(e.target.value)} 
//               />
//             </div>

//             <div className="form-group">
//               <label>Họ *</label>
//               <input 
//                 type="text" 
//                 value={lastName} 
//                 onChange={(e) => setLastName(e.target.value)} 
                 
//               />
//             </div>

//             <div className="form-group">
//               <label>Email *</label>
//               <input 
//                 type="email" 
//                 value={email} 
//                 onChange={(e) => setEmail(e.target.value)} 
                 
//               />
//             </div>

//             <div className="form-group">
//               <label>Số điện thoại *</label>
//               <input 
//                 type="tel" 
//                 value={phone} 
//                 onChange={(e) => setPhone(e.target.value)} 
                 
//               />
//             </div>

//             <div className="form-group">
//               <label>Quốc gia cư trú *</label>
//               <select 
//                 value={country} 
//                 onChange={(e) => setCountry(e.target.value)} 
                
//               >
//                 <option value="Việt Nam">Việt Nam</option>
//                 <option value="USA">Hoa Kỳ</option>
//                 <option value="UK">Vương quốc Anh</option>
//                 {/* Thêm các quốc gia khác nếu cần */}
//               </select>
//             </div>

//             {/* Các trường ngày và số lượng khách */}
//             <div className="form-group">
//               <label>Ngày Check-in:</label>
//               <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)}  />
//             </div>
            
//             <div className="form-group">
//               <label>Ngày Check-out:</label>
//               <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)}  />
//             </div>
            
//             <div className="form-group">
//               <label>Số lượng khách:</label>
//               <input type="number" min="1" value={guests} onChange={(e) => setGuests(e.target.value)}  />
//             </div>

//             {/* Chọn Dịch Vụ */}
//             <h3>Chọn Dịch Vụ Bổ Sung:</h3>
//             <div className="services-container">
//               {availableServices.map((service) => (
//                 <div className="service-option" key={service.id}>
//                   <input
//                     type="checkbox"
//                     onChange={(e) => handleServiceChange(service, e.target.checked)}
//                   />
//                   {service.name} (+${service.price})
//                 </div>
//               ))}
//             </div>

//             <h3>Tổng Giá: ${totalPrice}</h3>

//             <button type="submit" className="confirm-button">Xác Nhận Đặt Phòng</button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// khi nhấn book now
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/BookingPage.css';

const availableServices = [
  { id: 1, name: 'Breakfast', price: 10 },
  { id: 2, name: 'Airport Shuttle', price: 20 },
  { id: 3, name: 'Laundry', price: 15 },
];

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { room } = location.state || {};
  const [selectedServices, setSelectedServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(room ? room.price : 0);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [currentStep, setCurrentStep] = useState(2);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Việt Nam');

  useEffect(() => {
    if (!room) navigate('/'); 
  }, [room, navigate]);

  useEffect(() => {
    if (room) {
      const servicesCost = selectedServices.reduce((sum, service) => sum + service.price, 0);
      setTotalPrice(room.price + servicesCost);
    }
  }, [selectedServices, room]);

  const handleServiceChange = (service, isChecked) => {
    if (isChecked) {
      setSelectedServices([...selectedServices, service]);
    } else {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    }
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    navigate('/payment', {
      state: { 
        room, 
        checkInDate, 
        checkOutDate, 
        guests, 
        selectedServices, 
        totalPrice,
        firstName,
        lastName,
        email,
        phone,
        country
      },
    });
  };

  if (!room) return null;

  return (
    <div className="booking-page">
      <div className="booking-container">
        <header className="booking-header">
          <h1>Đặt Phòng</h1>
        </header>

        <div className="progress-bar">
          {[1, 2, 3].map((step) => (
            <div key={step} className={`step ${currentStep >= step ? 'completed' : ''}`}>
              <div className="circle">{step}</div>
              <div className="label">{step === 1 ? 'Chọn Phòng' : step === 2 ? 'Chi Tiết Đặt Phòng' : 'Thanh Toán'}</div>
            </div>
          ))}
        </div>

        <div className="booking-details">
          <img src={room.imageUrl} alt={room.name} className="booking-image" />
          <h2>{room.name}</h2>
          <p>{room.description}</p>
          <p>Giá: ${room.price} / đêm</p>

          <form onSubmit={handleBookingSubmit}>
            <div className="form-group">
              <label htmlFor="firstName">Tên *</label>
              <input 
                id="firstName"
                type="text" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Họ *</label>
              <input 
                id="lastName"
                type="text" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input 
                id="email"
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Số điện thoại *</label>
              <input 
                id="phone"
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Quốc gia cư trú *</label>
              <select 
                id="country"
                value={country} 
                onChange={(e) => setCountry(e.target.value)} 
                required
              >
                <option value="Việt Nam">Việt Nam</option>
                <option value="USA">Hoa Kỳ</option>
                <option value="UK">Vương quốc Anh</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="checkIn">Ngày Check-in:</label>
              <input 
                id="checkIn"
                type="date" 
                value={checkInDate} 
                onChange={(e) => setCheckInDate(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="checkOut">Ngày Check-out:</label>
              <input 
                id="checkOut"
                type="date" 
                value={checkOutDate} 
                onChange={(e) => setCheckOutDate(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="guests">Số lượng khách:</label>
              <input 
                id="guests"
                type="number" 
                min="1" 
                value={guests} 
                onChange={(e) => setGuests(e.target.value)}
                required
              />
            </div>

            <h3>Chọn Dịch Vụ Bổ Sung:</h3>
            <div className="services-container">
              {availableServices.map((service) => (
                <div className="service-option" key={service.id}>
                  <input
                    type="checkbox"
                    id={`service-${service.id}`}
                    onChange={(e) => handleServiceChange(service, e.target.checked)}
                  />
                  <label htmlFor={`service-${service.id}`}>
                    {service.name} (+${service.price})
                  </label>
                </div>
              ))}
            </div>

            <div className="total-price">
              <h3>Tổng Giá: ${totalPrice}</h3>
            </div>

            <button type="submit" className="confirm-button">Xác Nhận Đặt Phòng</button>
          </form>
        </div>
      </div>
    </div>
  );
}