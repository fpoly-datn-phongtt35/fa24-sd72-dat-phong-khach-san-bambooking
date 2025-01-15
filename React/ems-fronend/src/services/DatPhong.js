import authorizedAxiosInstance from "../utils/authorizedAxios";

const apiDP = "http://localhost:8080/dat-phong/hien-thi";
const apiDPAdd = "http://localhost:8080/dat-phong/them-moi";
const apiDPUpdate = "http://localhost:8080/dat-phong/cap-nhat";
const apiNV = "http://localhost:8080/nhan-vien/hien-thi";
const apiKH = "http://localhost:8080/khach-hang/hien-thi";
const apiLoc = "http://localhost:8080/dat-phong/bo-loc";
const apiCreateKH = "http://localhost:8080/khach-hang/create-kh-dp";
const apiDetailDP = "http://localhost:8080/dat-phong/chi-tiet-dat-phong";
// Hàm lấy danh sách đặt phòng
export const DanhSachDatPhong = (pageable, trangThai) => {
    return authorizedAxiosInstance.get(apiDP, {
        params: { 
            page: pageable.page, 
            size: pageable.size,
            trangThai: trangThai
        }
    });
};
export const findDatPhongByMaDatPhong = (maDatPhong) => {
    return authorizedAxiosInstance.get(apiDetailDP, {
        params: {
            maDatPhong: maDatPhong,
        }
    });
};
// Hàm lấy danh sách nhân viên
export const DanhSachNhanVien = () => {
    return authorizedAxiosInstance.get(apiNV);
};

// Hàm lấy danh sách khách hàng
export const DanhSachKhachHang = () => {
    return authorizedAxiosInstance.get(apiKH);
};

// Hàm thêm mới đặt phòng (POST)
export const ThemMoiDatPhong = (DatPhongRequest) => {
    return authorizedAxiosInstance.post(apiDPAdd, DatPhongRequest);
};

export const DatPhongDetail = (id) => {
    return authorizedAxiosInstance.get(`${apiDetail}/${id}`);
};

export const CapNhatDatPhong = (DatPhongRequest) => {
    return authorizedAxiosInstance.put(apiDPUpdate, DatPhongRequest);
};

export const HienThiTheoLoc = (pageable, trangThai) => {
    const params = new URLSearchParams({
        page: pageable.page,
        size: pageable.size
    });
    
    // Nếu trangThai là một mảng và có phần tử, thêm chúng vào params
    if (trangThai && trangThai.length > 0) {
        trangThai.forEach((status) => {
            params.append("trangThai", status);
        });
    }
    
    return authorizedAxiosInstance.get(apiLoc, { params: params });
};

export const ThemKhachHangDatPhong = (khachHangRequest) => {
    return authorizedAxiosInstance.post(apiCreateKH, khachHangRequest);
};