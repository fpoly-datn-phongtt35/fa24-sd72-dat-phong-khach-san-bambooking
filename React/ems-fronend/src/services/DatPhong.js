import axios from "axios";
const api = "http://localhost:8080/dat-phong/hien-thi";

// Hàm lấy danh sách đặt phòng, có thể cung cấp giá trị mặc định cho size và tt
export const DanhSachDatPhong = (pageale, trangThai) => {
    return axios.get(api, {
        params: { 
            page: pageale.page, 
            size: pageale.size,
            trangThai: trangThai // true hoặc false - trạng thái sản phẩm
        }
    });
};

