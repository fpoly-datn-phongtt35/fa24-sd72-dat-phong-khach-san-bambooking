import axios from "axios";

const apiDP = "http://localhost:8080/dat-phong/hien-thi";
const apiDPAdd = "http://localhost:8080/dat-phong/them-moi";
const apiNV = "http://localhost:8080/nhan-vien/hien-thi";
const apiKH = "http://localhost:8080/khach-hang/hien-thi";

// Hàm lấy danh sách đặt phòng
export const DanhSachDatPhong = (pageable, trangThai) => {
    return axios.get(apiDP, {
        params: { 
            page: pageable.page, 
            size: pageable.size,
            trangThai: trangThai
        }
    });
};

// Hàm lấy danh sách nhân viên
export const DanhSachNhanVien = () => {
    return axios.get(apiNV);
};

// Hàm lấy danh sách khách hàng
export const DanhSachKhachHang = () => {
    return axios.get(apiKH);
};

// Hàm thêm mới đặt phòng (POST)
export const ThemMoiDatPhong = (DatPhongRequest) => {
    return axios.post(apiDPAdd, DatPhongRequest);
};




