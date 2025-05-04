import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { dsPhong } from "../../services/PhongService";
import { ttXepPhong } from "../../services/XepPhongService";
import { dsTraPhong } from "../../services/TraPhong";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Popper from "@mui/material/Popper";
import IconButton from "@mui/material/IconButton";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getRoomDetail } from "../../services/ViewPhong";

dayjs.extend(utc);
dayjs.extend(timezone);

const ViewPhong = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [status, setStatus] = useState({});
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const calendarAnchorRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [viewDays, setViewDays] = useState(7);
  const navigate = useNavigate();

  // Tạo danh sách ngày dựa trên ngày bắt đầu và số ngày hiển thị
  const generateDates = (startDate, numDays = viewDays) => {
    return Array.from({ length: numDays }, (_, i) =>
      dayjs(startDate).add(i, "day").format("YYYY-MM-DD")
    );
  };

  const [dates, setDates] = useState(generateDates(dayjs()));

  // Mở/đóng lịch chọn ngày
  const toggleDatePicker = () => {
    setOpenDatePicker((prev) => !prev);
  };

  // Lấy danh sách phòng khi component được mount
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

  // Cập nhật danh sách ngày khi thay đổi ngày được chọn hoặc số ngày hiển thị
  useEffect(() => {
    setDates(generateDates(dayjs(selectedDate), viewDays));
  }, [viewDays, selectedDate]);

  // Lấy trạng thái phòng và cập nhật liên tục mỗi 5 giây
  useEffect(() => {
    const fetchRoomStatus = async () => {
      try {
        const [responseXepPhong, responseTraPhong] = await Promise.all([
          ttXepPhong(),
          dsTraPhong(),
        ]);
        const statusData = responseXepPhong.data;
        const traPhongData = responseTraPhong.data;
        const newStatus = {};
        // Tạo map cho dữ liệu trả phòng
        const traPhongMap = new Map(
          traPhongData.map((tp) => [tp.xepPhong.id, tp])
        );

        // Nhóm các bản ghi xếp phòng theo phòng
        const roomXepPhongMap = new Map();
        statusData.forEach((item) => {
          const roomId = item.phong.id;
          if (!roomXepPhongMap.has(roomId)) {
            roomXepPhongMap.set(roomId, []);
          }
          roomXepPhongMap.get(roomId).push(item);
        });

        // Xử lý trạng thái cho từng phòng
        roomXepPhongMap.forEach((xepPhongList, roomId) => {
          const allIntervalsByDate = new Map();

          // Xử lý từng bản ghi xếp phòng của phòng
          xepPhongList.forEach((item) => {
            const { ngayNhanPhong, ngayTraPhong, phong, trangThai } = item;
            const startTime = dayjs(ngayNhanPhong).tz("Asia/Ho_Chi_Minh");
            const traPhongRecord = traPhongMap.get(item.id);

            let endTime;
            let isReturned = false;

            if (traPhongRecord && traPhongRecord.ngayTraThucTe) {
              const parsedEndTime = dayjs(traPhongRecord.ngayTraThucTe).tz(
                "Asia/Ho_Chi_Minh"
              );
              if (parsedEndTime.isValid()) {
                endTime = parsedEndTime;
                isReturned = true;
              } else {
                endTime = dayjs(ngayTraPhong).tz("Asia/Ho_Chi_Minh");
              }
            } else {
              endTime = dayjs(ngayTraPhong).tz("Asia/Ho_Chi_Minh");
            }

            let currentDate = startTime.startOf("day");
            const endDate = endTime.endOf("day");

            // Tạo các khoảng thời gian trạng thái cho mỗi ngày
            while (
              currentDate.isBefore(endDate) ||
              currentDate.isSame(endDate)
            ) {
              const dateKey = currentDate.format("YYYY-MM-DD");
              if (!allIntervalsByDate.has(dateKey)) {
                allIntervalsByDate.set(dateKey, []);
              }

              let roomStatus = "Empty";
              if (
                startTime.isBefore(currentDate.endOf("day")) &&
                endTime.isAfter(currentDate.startOf("day"))
              ) {
                const intervalStart = startTime.isSame(currentDate, "day")
                  ? startTime
                  : currentDate.startOf("day");
                const intervalEnd = endTime.isSame(currentDate, "day")
                  ? endTime
                  : currentDate.endOf("day");

                if (isReturned) {
                  roomStatus = "CheckedOut";
                } else {
                  if (trangThai === "Đã kiểm tra") {
                    roomStatus = "Checked";
                  } else if (trangThai === "Đang ở") {
                    roomStatus = "Occupied";
                  } else if (trangThai === "Đã xếp") {
                    roomStatus = "Booked";
                  }
                }

                allIntervalsByDate.get(dateKey).push({
                  start: intervalStart.format("HH:mm"),
                  end: intervalEnd.format("HH:mm"),
                  status: roomStatus,
                });
              }

              currentDate = currentDate.add(1, "day");
            }
          });

          // Sắp xếp và lấp đầy khoảng trống cho mỗi ngày
          allIntervalsByDate.forEach((intervals, dateKey) => {
            intervals.sort((a, b) => {
              return (
                dayjs(`2000-01-01 ${a.start}`) - dayjs(`2000-01-01 ${b.start}`)
              );
            });

            const filledIntervals = fillEmptyIntervals(intervals);

            const key = `${roomId}_${dateKey}`;
            newStatus[key] = {
              status: filledIntervals[0].status,
              intervals: filledIntervals,
            };
          });
        });

        setStatus(newStatus);
      } catch (error) {
        console.error("Lỗi khi lấy trạng thái phòng:", error);
      }
    };

    // Gọi lần đầu
    fetchRoomStatus();

    // Thiết lập interval để gọi lại mỗi 5 giây
    const intervalId = setInterval(fetchRoomStatus, 5000);

    // Dọn dẹp interval khi component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Lấp đầy khoảng thời gian trống bằng trạng thái Empty
  const fillEmptyIntervals = (intervals) => {
    if (!intervals || intervals.length === 0) {
      return [{ start: "00:00", end: "23:59", status: "Empty" }];
    }

    const sortedIntervals = intervals.sort((a, b) => {
      return dayjs(`2000-01-01 ${a.start}`) - dayjs(`2000-01-01 ${b.start}`);
    });

    const fullIntervals = [];
    let currentTime = dayjs("2000-01-01 00:00");

    sortedIntervals.forEach((interval, index) => {
      const intervalStart = dayjs(`2000-01-01 ${interval.start}`);
      const intervalEnd = dayjs(`2000-01-01 ${interval.end}`);

      if (currentTime.isBefore(intervalStart)) {
        fullIntervals.push({
          start: currentTime.format("HH:mm"),
          end: intervalStart.subtract(1, "minute").format("HH:mm"),
          status: "Empty",
        });
      }

      fullIntervals.push(interval);

      currentTime = intervalEnd.add(1, "minute");

      if (
        index === sortedIntervals.length - 1 &&
        currentTime.isBefore(dayjs("2000-01-01 23:59"))
      ) {
        fullIntervals.push({
          start: currentTime.format("HH:mm"),
          end: "23:59",
          status: "Empty",
        });
      }
    });

    return fullIntervals;
  };

  // Xử lý thay đổi ngày được chọn
  const handleDateChange = (newValue) => {
    const newDate = newValue.format("YYYY-MM-DD");
    setSelectedDate(newDate);
    setDates(generateDates(dayjs(newDate)));
    setOpenDatePicker(false);
  };

  // Xử lý sự kiện cuộn chuột để thay đổi ngày
  const handleWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (scrollContainerRef.current) {
      const direction = e.deltaY > 0 ? 1 : -1;
      setDates((prevDates) => {
        const firstDate = dayjs(prevDates[0]);
        const newStartDate =
          direction > 0
            ? firstDate.add(1, "day")
            : firstDate.subtract(1, "day");
        return generateDates(newStartDate, viewDays);
      });
    }
  };

  // Thêm sự kiện cuộn chuột khi component mount
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [viewDays]);

  // Xử lý khi click vào phòng hoặc thanh trạng thái
  const handleRoomClick = async (roomId, date, clickTime) => {
    if (!date) {
      console.log("Thiếu ngày, bỏ qua điều hướng.");
      return;
    }

    const formattedDate = clickTime
      ? dayjs(`${date} ${clickTime}`, "YYYY-MM-DD HH:mm").format(
          "YYYY-MM-DDTHH:mm:ss"
        )
      : dayjs(date).format("YYYY-MM-DDTHH:mm:ss");

    console.log("Đã click tại:", formattedDate);

    try {
      const response = await getRoomDetail(roomId, formattedDate);
      if (!response) {
        throw new Error("Không có thông tin chi tiết phòng.");
      }
      const url = `/api/RoomDetail/${roomId}/${formattedDate}`;
      navigate(url);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết phòng:", error);
      alert("Chưa có xếp phòng, không thể xem chi tiết.");
    }
  };

  // Tạo nội dung tooltip cho thanh trạng thái
  const getTooltipContent = (interval) => {
    if (!interval) {
      return "Phòng trống";
    }
    const statusText = {
      Occupied: "Phòng đang ở",
      CheckedOut: "Đã trả phòng",
      Booked: "Phòng đã được xếp",
      Checked: "Phòng đã kiểm tra",
      Empty: "Phòng trống",
    };
    return `${interval.start} - ${interval.end}: ${
      statusText[interval.status] || interval.status
    }`;
  };

  // Vẽ thanh trạng thái cho mỗi phòng và ngày
  const renderStatusBar = (intervals, roomId, date) => {
    const totalMinutes = 24 * 60;

    return (
      <div style={{ display: "flex", width: "100%", height: "10px" }}>
        {intervals.map((interval, index) => {
          const startTime = interval.start.split(":");
          const endTime = interval.end.split(":");
          const startMinutes =
            parseInt(startTime[0]) * 60 + parseInt(startTime[1]);
          let endMinutes = parseInt(endTime[0]) * 60 + parseInt(endTime[1]);

          if (interval.end === "23:59") {
            endMinutes = totalMinutes;
          } else {
            endMinutes += 1;
          }

          const width = ((endMinutes - startMinutes) / totalMinutes) * 100;
          let bgColor = "#B7B7B7";

          switch (interval.status) {
            case "Occupied":
              bgColor = "#00FF33";
              break;
            case "CheckedOut":
              bgColor = "#FF6699";
              break;
            case "Booked":
              bgColor = "#00B2BF";
              break;
            case "Checked":
              bgColor = "#FFFF00";
              break;
            default:
              bgColor = "#B7B7B7";
          }

          return (
            <Tooltip
              key={index}
              title={getTooltipContent(interval)}
              placement="top"
            >
              <div
                style={{
                  width: `${width}%`,
                  backgroundColor: bgColor,
                  height: "10px",
                }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const widthPx = rect.width;
                  const segmentMinutes = endMinutes - startMinutes;
                  const minutesPerPixel = segmentMinutes / widthPx;
                  const clickedMinutesInSegment = Math.round(
                    clickX * minutesPerPixel
                  );
                  const totalClickedMinutes =
                    startMinutes + clickedMinutesInSegment;
                  const hours = Math.floor(totalClickedMinutes / 60);
                  const minutes = totalClickedMinutes % 60;
                  const clickTime = `${hours
                    .toString()
                    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
                  handleRoomClick(roomId, date, clickTime);
                }}
              />
            </Tooltip>
          );
        })}
      </div>
    );
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        width: "100%",
      }}
    >
      <div
        ref={scrollContainerRef}
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#007BFF",
            color: "#fff",
            padding: "10px",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <IconButton
              onClick={toggleDatePicker}
              ref={calendarAnchorRef}
              style={{
                backgroundColor: "#fff",
                color: "#007BFF",
                padding: "5px",
              }}
            >
              <CalendarMonthIcon />
            </IconButton>
            <Popper
              open={openDatePicker}
              anchorEl={calendarAnchorRef.current}
              placement="bottom-start"
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  padding: "10px",
                }}
              >
                <DateCalendar
                  value={dayjs(selectedDate)}
                  onChange={(newValue) => handleDateChange(newValue)}
                />
              </div>
            </Popper>
          </LocalizationProvider>

          <div style={{ marginBottom: "10px", marginLeft: "auto" }}>
            <label
              htmlFor="viewDays"
              style={{ fontWeight: "bold", marginRight: "10px" }}
            >
              Chế độ xem:
            </label>
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
          {rooms.map((room) => (
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
                onClick={() => handleRoomClick(room.id, null)}
              >
                {room.maPhong}
              </div>
              {dates.map((date) => {
                const key = `${room.id}_${date}`;
                const roomStatus = status[key];

                return (
                  <div
                    key={key}
                    style={{
                      margin: "15px 0px 12px 0px",
                      cursor: "pointer",
                      height: "1px",
                    }}
                  >
                    {roomStatus && roomStatus.intervals ? (
                      renderStatusBar(roomStatus.intervals, room.id, date)
                    ) : (
                      <Tooltip
                        title={getTooltipContent({
                          start: "00:00",
                          end: "23:59",
                          status: "Empty",
                        })}
                        placement="top"
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "10px",
                            backgroundColor: "#B7B7B7",
                          }}
                          onClick={() =>
                            handleRoomClick(room.id, date, "00:00")
                          }
                        />
                      </Tooltip>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#00FF33",
                border: "1px solid #000",
              }}
            ></div>
            <span>Phòng đang ở</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#00B2BF",
                border: "1px solid #000",
              }}
            ></div>
            <span>Phòng đã được xếp</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#FFFF00",
                border: "1px solid #000",
              }}
            ></div>
            <span>Phòng đã kiểm tra</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#FF6699",
                border: "1px solid #000",
              }}
            ></div>
            <span>Đã trả phòng</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#B7B7B7",
                border: "1px solid #000",
              }}
            ></div>
            <span>Phòng trống</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPhong;