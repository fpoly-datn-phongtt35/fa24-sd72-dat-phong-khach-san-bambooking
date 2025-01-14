import axios from "axios";

const apiDP = "http://localhost:8080/dat-phong/hien-thi";
const apiDPAdd = "http://localhost:8080/dat-phong/them-moi";
const apiDPUpdate = "http://localhost:8080/dat-phong/cap-nhat";
const apiNV = "http://localhost:8080/nhan-vien/hien-thi";
const apiKH = "http://localhost:8080/khach-hang/hien-thi";
const apiLoc = "http://localhost:8080/dat-phong/bo-loc";
const apiCreateKH = "http://localhost:8080/khach-hang/create-kh-dp";
const apiDetailDP = "http://localhost:8080/dat-phong/chi-tiet-dat-phong";
const apiGH = "http://localhost:8080/dat-phong/them-gio-hang";
const aptDetail = "http://localhost:8080/dat-phong/chi-tiet";
const apiDS = "http://localhost:8080/dat-phong/danh-sach";


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
export const findDatPhongByMaDatPhong = (maDatPhong) => {
    return axios.get(apiDetailDP, {
        params: {
            maDatPhong: maDatPhong,
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
// export const DatPhongDetail = (id) => {
//     return axios.get(`${apiDetail}/${id}`);
// };

export const CapNhatDatPhong = (DatPhongRequest) => {
    return axios.put(apiDPUpdate, DatPhongRequest);
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
    
    return axios.get(apiLoc, { params: params });
};
export const ThemKhachHangDatPhong = (khachHangRequest) => {
    return axios.post(apiCreateKH, khachHangRequest)
};

export const addDatPhongNgay = async (DatPhongRequest) => {
    return axios.post(apiGH, DatPhongRequest)
    .then(response => response.data) // Trả về dữ liệu JSON từ server
        .catch(error => {
            console.error("Lỗi khi thêm mới giỏ hàng:", error);
            throw error;
        });
};

export const findDatPhongByID = (idDatPhong) => {
    return axios.get(aptDetail, {
        params: { 
            idDatPhong: idDatPhong
        }
    });
};

export const DSDatPhong = (pageable) => {
    return axios.get(apiDS, {
        params: { 
            page: pageable.page, 
            size: pageable.size,
        }
    });
};

