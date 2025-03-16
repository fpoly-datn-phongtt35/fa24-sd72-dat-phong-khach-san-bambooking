import authorizedAxiosInstance from "../utils/authorizedAxios";

// Đường dẫn API
const apiViewPhong = 'http://localhost:8080/api/view-phong'; // Đường dẫn API cho phòng
const apiPhieuDichVu = "http://localhost:8080/dich_vu_su_dung/searchByIDXepPhong"; // Đường dẫn API cho phiếu dịch vụ
const apiTTDP = "http://localhost:8080/ttdp/all"; // Đường dẫn API cho thông tin đặt phòng
const apiRoomDetail = 'http://localhost:8080/api/RoomDetail';
const apiADDPhieuDichVu = "http://localhost:8080/dich_vu_su_dung/addDVSD";
const apiAddDVDK = 'http://localhost:8080/api/addDVDK';

// Hàm tìm kiếm phòng
export const searchRooms = async (tinhTrang, giaMin, giaMax, keyword, idLoaiPhong, soTang) => {
    try {
        const params = new URLSearchParams();
        if (tinhTrang) params.append('tinhTrang', tinhTrang);
        if (keyword) params.append('keyword', keyword);
        if (giaMin) params.append('giaMin', giaMin);
        if (giaMax) params.append('giaMax', giaMax);
        if (soTang) params.append('soTang', soTang);
        
        // Thêm từng idLoaiPhong riêng biệt
        if (Array.isArray(idLoaiPhong) && idLoaiPhong.length > 0) {
            idLoaiPhong.forEach(id => params.append('idLoaiPhong', id));
        }

        const response = await authorizedAxiosInstance.get(apiViewPhong, {
            params,
        });

        return response.data;
    } catch (error) {
        console.error("Lỗi khi tìm kiếm phòng:", error);
        throw error;
    }
};

// Hàm lấy xếp phòng theo ID phòng
export const getRoomDetail = async (roomId) => {
        const response = await authorizedAxiosInstance.get(`${apiRoomDetail}/${roomId}`);
        return response.data; // Trả về thông tin chi tiết của phòng
    
};

// Hàm lấy phiếu dịch vụ theo ID xếp phòng
export const getDichVuSuDungByIDXepPhong = async (idXepPhong) => {
    
        const response = await authorizedAxiosInstance.get(`${apiPhieuDichVu}/${idXepPhong}`);
        return response.data; // Trả về danh sách phiếu dịch vụ
    
};

// Hàm lấy thông tin đặt phòng
export const getTTDP = async () => {
    
        const response = await authorizedAxiosInstance.get(apiTTDP);
        return response.data; // Trả về thông tin đặt phòng
    
};

export const AddDichVuSuDung = async (dichVuSuDung) => {
    
        const response = await authorizedAxiosInstance.post(apiADDPhieuDichVu, dichVuSuDung);
        return response.data; // Đúng, trả về dữ liệu phản hồi từ server
    
};

export const AddDVDK = async (idXepPhong) => {
    
        const response = await authorizedAxiosInstance.post(`${apiAddDVDK}/${idXepPhong}`);
        return response.data; // Đúng, trả về dữ liệu phản hồi từ server
    
};

