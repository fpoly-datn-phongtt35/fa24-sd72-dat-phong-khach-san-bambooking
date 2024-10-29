import axios from "axios";
const apiDetailDP = "http://localhost:8080/ttdp/chi-tiet-dat-phong"
const apiAdd = "http://localhost:8080/ttdp/them-moi"
const apiHienThiQuanLy = "http://localhost:8080/ttdp/hien-thi-quan-ly"
const apiLoaiPhongKhaDung = "http://localhost:8080/ttdp/loai-phong-kha-dung"
export const getThongTinDatPhong = (idDP, pageable) => {
    return axios.get(apiTTDP, {
        params: {
            idDP: idDP,
            page: pageable.page, 
            size: pageable.size
        }
    });
};
export const findTTDPByMaDatPhong = (maDatPhong) => {
    return axios.get(apiDetailDP, {
        params: {
            maDatPhong: maDatPhong,
        }
    });
};
export const HienThiQuanLy = (trangThai, pageable) => {
    return axios.get(apiHienThiQuanLy, {
        params: {
            trangThai: trangThai,
            page: pageable.page, 
            size: pageable.size
        }
    });
};
export const addThongTinDatPhong = (TTDPRequest) => {
    return axios.post(apiAdd, TTDPRequest);
};
export const getLoaiPhongKhaDung = (ngayNhanPhong,ngayTraPhong,pageable) => {
    return axios.get(apiLoaiPhongKhaDung, {
        params: {
            ngayNhanPhong: ngayNhanPhong,
            ngayTraPhong: ngayTraPhong,
            page: pageable.page, 
            size: pageable.size
        }
    });
};