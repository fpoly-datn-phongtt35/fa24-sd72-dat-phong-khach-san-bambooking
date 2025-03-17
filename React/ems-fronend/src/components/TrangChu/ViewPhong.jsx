import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { dsPhong } from '../../services/PhongService';
import { ttXepPhong } from '../../services/XepPhongService';
import { dsTraPhong } from "../../services/TraPhong";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Popper from '@mui/material/Popper';
import IconButton from '@mui/material/IconButton';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {  getRoomDetail } from '../../services/ViewPhong';
dayjs.extend(utc);
dayjs.extend(timezone);

const ViewPhong = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [status, setStatus] = useState({});
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const calendarAnchorRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [viewDays, setViewDays] = useState(7);
  const navigate = useNavigate();
  const generateDates = (startDate, numDays = viewDays) => {
    return Array.from({ length: numDays }, (_, i) =>
      dayjs(startDate).add(i, 'day').format("YYYY-MM-DD")
    );
  };



  const [dates, setDates] = useState(generateDates(dayjs()));

  const toggleDatePicker = () => {
    setOpenDatePicker((prev) => !prev);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await dsPhong();
        setRooms(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phòng:", error);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    setDates(generateDates(dayjs(selectedDate), viewDays));
  }, [viewDays, selectedDate]); // Cập nhật khi `viewDays` hoặc `selectedDate` thay đổi



  useEffect(() => {
    const fetchRoomStatus = async () => {
      try {
        const [responseXepPhong, responseTraPhong] = await Promise.all([ttXepPhong(), dsTraPhong()]);
        const statusData = responseXepPhong.data; // Danh sách xếp phòng
        const traPhongData = responseTraPhong.data; // Danh sách trả phòng
        const newStatus = {};

        // Tạo danh sách các idXepPhong đã trả phòng
        const traPhongIds = new Set(traPhongData.map(tp => tp.xepPhong.id));

        // Duyệt danh sách đặt phòng
        statusData.forEach((item) => {
          const { ngayNhanPhong, ngayTraPhong, phong, idXepPhong } = item;
          const startDate = dayjs(ngayNhanPhong).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');
          const endDate = dayjs(ngayTraPhong).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');
          const roomId = phong.id;

          // Kiểm tra xem xếp phòng này có trong danh sách trả phòng không
          const isReturned = traPhongIds.has(item.id);

          let currentDate = dayjs(startDate);
          while (currentDate.isBefore(dayjs(endDate)) || currentDate.isSame(dayjs(endDate))) {
            const dateKey = currentDate.format('YYYY-MM-DD');
            const key = `${roomId}_${dateKey}`;

            newStatus[key] = {
              status: isReturned? "Vacant": "Occupied",
              ngayNhanPhong: startDate
            }

            currentDate = currentDate.add(1, 'day');
          }
        });

        setStatus(newStatus);
      } catch (error) {
        console.error("Lỗi khi lấy trạng thái phòng:", error);
      }
    };

    fetchRoomStatus();
  }, []);



  const handleDateChange = (newValue) => {
    const newDate = newValue.format("YYYY-MM-DD");
    setSelectedDate(newDate);
    setDates(generateDates(dayjs(newDate)));
    setOpenDatePicker(false);
  };

  const handleWheel = (e) => {
    if (scrollContainerRef.current) {
      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1; // Xác định hướng lăn

      setDates((prevDates) => {
        const firstDate = dayjs(prevDates[0]);
        const newStartDate = direction > 0 ? firstDate.add(1, "day") : firstDate.subtract(1, "day");
        return generateDates(newStartDate, viewDays);
      });
    }
  };

  const handleRoomClick = async (roomId) => {
    getRoomDetail(roomId)
      .then((response) => {
        if (!response) {
          throw new Error('Không có thông tin chi tiết phòng.');
        }
        const ngayNhanPhong = new Date(response.thongTinDatPhong.ngayNhanPhong);
        const ngayHienTai = new Date();

        if (ngayNhanPhong.getTime() > ngayHienTai.getTime()) {
          alert(
            `Giờ nhận phòng (${ngayNhanPhong.toLocaleString('vi-VN')}) lớn hơn thời gian hiện tại (${ngayHienTai.toLocaleString('vi-VN')}). Không thể xem chi tiết.`
          );
        } else {
          navigate(`/api/RoomDetail/${roomId}`);
        }
      })
      .catch(() => {
        alert('Chưa có xếp phòng, không thể xem chi tiết.');
      });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", width: "100%" }}>
      <h2 style={{ textAlign: "center" }}>Quản lý tình trạng phòng</h2>

      {/* Khu vực chứa thanh cuộn */}
      <div
        ref={scrollContainerRef}
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }}
        onWheel={handleWheel}
      >
        {/* Bộ chọn ngày */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#007BFF", color: "#fff", padding: "10px" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <IconButton onClick={toggleDatePicker} ref={calendarAnchorRef} style={{ backgroundColor: "#fff", color: "#007BFF", padding: "5px" }}>
              <CalendarMonthIcon />
            </IconButton>
            <Popper open={openDatePicker} anchorEl={calendarAnchorRef.current} placement="bottom-start">
              <div style={{ backgroundColor: "#fff", border: "1px solid #ccc", padding: "10px" }}>
                <DateCalendar value={dayjs(selectedDate)} onChange={(newValue) => handleDateChange(newValue)} />
              </div>
            </Popper>
          </LocalizationProvider>

          <div style={{ marginBottom: "10px", marginLeft: "auto" }}>
            <label htmlFor="viewDays" style={{ fontWeight: "bold", marginRight: "10px" }}>Chế độ xem:</label>
            <select
              id="viewDays"
              value={viewDays}
              onChange={(e) => setViewDays(Number(e.target.value))}
              style={{ padding: "5px", borderRadius: "5px" }}
            >
              <option value={7}>Xem 7 ngày</option>
              <option value={14}>Xem 14 ngày</option>
            </select>
          </div>

        </div>


        {/* Bảng hiển thị phòng */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `150px repeat(${viewDays}, 1fr)`,
            border: "1px solid #ddd",
            borderRadius: "8px",
            width: "100%",

          }}
        >
          <div
            style={{
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
              padding: "10px",
              fontSize: "16px",
              textAlign: "center",
            }}
          >
            Phòng
          </div>
          {dates.map((date) => (
            <div
              key={date}
              style={{
                backgroundColor: "#f0f0f0",
                fontWeight: "bold",
                padding: "10px",
                fontSize: "16px",
              }}
            >
              {date}
            </div>
          ))}
          {rooms.map((room) => {
            let isOccupiedChain = false; // Theo dõi chuỗi ngày đã nhận phòng
            return (
              <React.Fragment key={room.id}>
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "4px",
                    fontWeight: "bold",
                    fontSize: "16px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => handleRoomClick(room.id)}
                >
                  {room.maPhong}
                </div>
                {dates.map((date) => {
                  const key = `${room.id}_${date}`;
                  const isOccupied = status[key]?.status === "Occupied";
                  const today = dayjs().format("YYYY-MM-DD");
                  const isVacant = status[key]?.status === "Vacant";
                  let bgColor = "#B7B7B7"; // Mặc định phòng trống (màu đỏ)

                  if (isOccupied) {
                    const {  ngayNhanPhong } = status[key];
                    bgColor = ngayNhanPhong <= today ? "#00FF33" : "#00B2BF";
                  } else {
                    isOccupiedChain = false; // Nếu gặp ô trống, reset trạng thái
                  } if (isVacant) {
                    bgColor = "#FF6699"; // Phòng đã được trả
                  }

                  return (
                    <div
                      key={key}
                      style={{
                        backgroundColor: bgColor,
                        margin: "15px 0px 12px 0px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleRoomClick(room.id)}
                    ></div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
        {/* Chú thích trạng thái phòng */}
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "20px", height: "20px", backgroundColor: "#00FF33", border: "1px solid #000" }}></div>
            <span>Phòng đang ở</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "20px", height: "20px", backgroundColor: "#00B2BF", border: "1px solid #000" }}></div>
            <span>Phòng đã được đặt</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "20px", height: "20px", backgroundColor: "#FF6699", border: "1px solid #000" }}></div>
            <span>Đã trả phòng</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "20px", height: "20px", backgroundColor: "#B7B7B7", border: "1px solid #000" }}></div>
            <span>Phòng trống</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewPhong;
