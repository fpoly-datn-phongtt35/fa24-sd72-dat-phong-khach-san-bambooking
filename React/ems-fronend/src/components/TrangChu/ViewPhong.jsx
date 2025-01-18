import React, { useState, useEffect, useRef } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css"; // Giao diện của Flatpickr
import { searchRooms } from "../../services/ViewPhong";
import { FaCalendarAlt } from "react-icons/fa"; // Import biểu tượng lịch
import { dsPhong } from '../../services/PhongService';
import { ttXepPhong } from '../../services/XepPhongService';
import "./ViewPhong.css"; // CSS để quản lý cuộn

const ViewPhong = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Ngày được chọn mặc định
  const [status, setStatus] = useState({}); // Trạng thái phòng

  const generateHours = () => Array.from({ length: 24 }, (_, i) => (i < 10 ? `0${i}:00` : `${i}:00`));

  const generateDates = (startDate) =>
    Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date.toLocaleDateString("en-CA"); // Định dạng YYYY-MM-DD theo múi giờ trình duyệt
    });

  const [dates, setDates] = useState(generateDates(new Date()));
  const [hours] = useState(generateHours()); // Danh sách giờ cố định

  const scrollContainerRef = useRef(null); // Tham chiếu đến container cuộn chính

  useEffect(() => {
    const fetchRooms = async (searchQuery = "") => {
      try {
        const response = await dsPhong(searchQuery);
        setRooms(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phòng:", error);
      }

      ttXepPhong().then((response) => {
        console.log(response.data);
    });
    };


    // Lấy danh sách phòng ban đầu (không có keyword)
    fetchRooms();
  }, []);



  const handleDateChange = (date) => {
    if (date && date.length > 0) {
      const newDate = date[0].toLocaleDateString("en-CA"); // Định dạng YYYY-MM-DD theo múi giờ trình duyệt

      setSelectedDate(newDate);
      setDates(generateDates(new Date(newDate)));
    }
  };

  const handleWheel = (e) => {
    if (e.target.closest(".scrollable-content")) {
      e.preventDefault();
      const container = scrollContainerRef.current;
      container.scrollLeft += e.deltaY * 0.5;

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScrollLeft && e.deltaY > 0) {
        // Thêm delay trước khi chuyển ngày
        setTimeout(() => {
          const currentIndex = dates.findIndex((date) => date === selectedDate);
          if (currentIndex < dates.length - 1) {
            const nextDate = dates[currentIndex + 1];
            setSelectedDate(nextDate);
            container.scrollLeft = 0; // Quay lại mốc thời gian 0h
          }
        }, 500); // Thời gian delay 500ms
      }
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2>Quản lý tình trạng phòng</h2>

        {/* Hàng đầu tiên - Chọn ngày */}
        <div
          style={{
            display: "flex",
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "#007BFF",
            color: "#fff",
            textAlign: "center",
            padding: "10px",
            fontWeight: "bold",
            width: "100%",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              color: "#007BFF",
              padding: "5px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
            }}
          >
            <Flatpickr
              value={selectedDate}
              onChange={handleDateChange}
              options={{
                dateFormat: "Y-m-d",
              }}
              render={({ defaultValue, ...props }, ref) => (
                <div
                  {...props}
                  ref={ref}
                  style={{ cursor: "pointer" }}
                >
                  <FaCalendarAlt size={20} color="#007BFF" />
                </div>
              )}
            />
          </div>

          {dates.map((date, index) => (
            <div key={index}
              style={{
                backgroundColor: date === selectedDate ? "#f39c12" : "#d3f9d8",
                padding: "5px 10px",
                borderRadius: "5px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => setSelectedDate(date)}
            >
              {date}
            </div>
          ))}
        </div>

        {/* Bảng chính */}
        <div ref={scrollContainerRef} // Gắn tham chiếu cuộn ngang
          onWheel={handleWheel} // Gắn sự kiện lăn chuột
          style={{
            display: "grid",
            gridTemplateColumns: "150px repeat(24, 80px)",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginTop: "0px", // Sát với hàng chọn ngày
            width: "100%",
            overflow: "hidden", // Cho phép cuộn ngang
          }}
        >
          {/* Hàng thứ hai - Hiển thị giờ */}
          <div className="scrollable-content" style={{
            position: "sticky", top: "0px", backgroundColor: "#f0f0f0", gridColumn: "1 / span 25",
            display: "grid", gridTemplateColumns: "150px repeat(24, 80px)", zIndex: 9, borderBottom: "1px solid #ddd",}}>

            <div style={{ textAlign: "center", fontWeight: "bold", padding: "10px", position: "sticky", left: 0, backgroundColor: "#f0f0f0", zIndex: 10, }}>
              Chọn phòng
            </div>
            {hours.map((hour) => (
              <div
                key={hour}
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  padding: "10px",
                }}
              >
                {hour}
              </div>
            ))}
          </div>

          {/* Các phòng */}
          {rooms.map((room) => (
            <React.Fragment key={room.id}>
              {/* Cột đầu tiên */}
              <div style={{ position: "sticky", left: 0, zIndex: 5, backgroundColor: "#f8f9fa", textAlign: "center", padding: "20px", borderRight: "1px solid #ddd", }}>
                {room.maPhong}
              </div>

              <div
                className="scrollable-content"
                style={{
                  display: "flex",
                  gridColumn: "2 / span 24",
                }}
              >
                {hours.map((hour) => {
                  const key = `${room.id}_${selectedDate}_${hour}`;
                  return (
                    <div
                      key={key}
                      title={status[key] === "Occupied" ? "Occupied" : "Empty"}
                      onClick={() => handleStatusChange(room.id, hour)}
                      style={{
                        flex: "0 0 80px",
                        backgroundColor:
                          status[key] === "Occupied"
                            ? "#90ee90"
                            : "#ffcccb",
                        textAlign: "center",
                        cursor: "pointer",
                        border: "1px solid #ddd",
                      }}
                    ></div>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewPhong;
