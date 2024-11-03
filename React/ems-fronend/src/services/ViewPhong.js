import axios from "axios";

// Đường dẫn API
const apiViewPhong = 'http://localhost:8080/api/view-phong'; // Đường dẫn API cho phòng
const apiPhieuDichVu = "http://localhost:8080/phieu_dich_vu"; // Đường dẫn API cho phiếu dịch vụ
const apiTTDP = "http://localhost:8080/ttdp/all"; // Đường dẫn API cho thông tin đặt phòng

// Hàm tìm kiếm phòng
export const searchRooms = async (tinhTrang, giaMin, giaMax, keyword) => {
    try {
        const response = await axios.get(apiViewPhong, {
            params: {
                tinhTrang,
                giaMin,
                giaMax,
                keyword,
            },
        });
        return response.data; // Trả về dữ liệu phòng tìm kiếm được
    } catch (error) {
        console.error("Lỗi khi tìm kiếm phòng:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

// Hàm lấy thông tin chi tiết phòng theo ID
export const getRoomDetail = async (roomId) => {
    try {
        const response = await axios.get(`${apiViewPhong}/detail/${roomId}`);
        return response.data; // Trả về thông tin chi tiết của phòng
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết phòng:", error.response || error); // In ra thông tin lỗi chi tiết
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

// Hàm lấy phiếu dịch vụ theo ID phòng
export const getServiceBillsByRoomId = async (roomId) => {
    try {
        const response = await axios.get(`${apiPhieuDichVu}/service-bills/${roomId}`);
        return response.data; // Trả về danh sách phiếu dịch vụ
    } catch (error) {
        console.error("Lỗi khi lấy phiếu dịch vụ:", error.response || error); // In ra thông tin lỗi chi tiết
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

// Hàm lấy thông tin đặt phòng
export const getTTDP = async () => {
    try {
        const response = await axios.get(apiTTDP);
        return response.data; // Trả về thông tin đặt phòng
    } catch (error) {
        console.error("Lỗi khi lấy thông tin đặt phòng:", error.response || error); // In ra thông tin lỗi chi tiết
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};
