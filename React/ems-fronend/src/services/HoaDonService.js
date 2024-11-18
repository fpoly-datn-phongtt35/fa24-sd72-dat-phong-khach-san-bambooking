import axios from "axios";

const apiHoaDon = "http://localhost:8080/hoa-don"
const apiAdd = "http://localhost:8080/hoa-don/add";
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

export const createHoaDon = (hd) => {
    return axios.post(apiAdd, hd);
};

export const DanhSachNhanVien = () => {
    return axios.get(apiNhanVien);
};

export const DanhSachDatPhong = () => {
    return axios.get(apiDatPhong);
};