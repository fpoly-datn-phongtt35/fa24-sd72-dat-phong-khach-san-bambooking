import axios from "axios";

const apiAdd = "http://localhost:8080/hoa-don/add";

//
const apiHoaDon = "http://localhost:8080/hoa-don"
const apiNhanVien = "http://localhost:8080/nhan-vien";
const apiDatPhong = "http://localhost:8080/dat-phong";

export const listHoaDon = (pageable, trangThai = "", keyword = "") => {
    return axios.get(apiHoaDon, {
        params: {
            page: pageable.page,
            size: pageable.size,
            trangThai: trangThai || undefined,
            keyword: keyword || undefined
        }
    });
};

export const taoHoaDon = async (hoaDon) => {
    try {
        const response = await axios.post(`${apiHoaDon}/tao-hoa-don`, hoaDon);
        console.log("Tạo hóa đơn thành công:", response.data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo hóa đơn:", error.response?.data || "Không xác định", error.message);
        throw error;
    }
};

export const listDatPhong = (pageable, keyword = "") => {
    return axios.get(`${apiDatPhong}/findAll`, {
        params: {
            page: pageable.page,
            size: pageable.size,
            keyword: keyword
        }
    });
};

///

export const createHoaDon = (hd) => {
    return axios.post(apiAdd, hd);
};

export const DanhSachNhanVien = () => {
    return axios.get(apiNhanVien);
};

export const DanhSachDatPhong = () => {
    return axios.get(apiDatPhong);
};