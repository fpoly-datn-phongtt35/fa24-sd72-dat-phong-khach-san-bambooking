import axios from "axios";
import authorizedAxiosInstance from '../utils/authorizedAxios';
const apiDetailDP = "http://localhost:8080/ttdp/chi-tiet-dat-phong"
const apiAdd = "http://localhost:8080/ttdp/them-moi"
const apiUpdate = "http://localhost:8080/ttdp/sua"
const apiHienThiQuanLy = "http://localhost:8080/ttdp/hien-thi-quan-ly"
const apiLoaiPhongKhaDung = "http://localhost:8080/ttdp/loai-phong-kha-dung"
const apiTimKiem = "http://localhost:8080/ttdp/tim-kiem"
const apiHuyTTDP = "http://localhost:8080/ttdp/huy-ttdp"
const apiGetTTDP = "http://localhost:8080/ttdp/detail-ttdp"

export const getThongTinDatPhong = (idDP, pageable) => {
    return authorizedAxiosInstance.get(apiTTDP, {
        params: {
            idDP: idDP,
            page: pageable.page, 
            size: pageable.size
        }
    });
};
export const findTTDPS = (startDate, endDate, key, trangThai, pageable) => {
    const params = {
        trangThai: trangThai || '',
        page: pageable.page ?? 0,
        size: pageable.size ?? 5
    };

    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (key) params.key = key;

    return authorizedAxiosInstance.get(apiTimKiem, { params });
};


export const findTTDPByMaDatPhong = (maDatPhong) => {
    return authorizedAxiosInstance.get(apiDetailDP, {
        params: {
            maDatPhong: maDatPhong
        }
    });
};
export const HienThiQuanLy = (trangThai, pageable) => {
    return authorizedAxiosInstance.get(apiHienThiQuanLy, {
        params: {
            trangThai: trangThai,
            page: pageable.page, 
            size: pageable.size
        }
    });
};
export const addThongTinDatPhong = (TTDPRequest) => {
    return authorizedAxiosInstance.post(apiAdd, TTDPRequest);
};

export const updateThongTinDatPhong = (TTDPRequest) => {
    return authorizedAxiosInstance.put(apiUpdate, TTDPRequest);
};
export const getLoaiPhongKhaDung = (ngayNhanPhong,ngayTraPhong,soNguoi,soPhong,pageable) => {
    return authorizedAxiosInstance.get(apiLoaiPhongKhaDung, {
        params: {
            ngayNhanPhong: ngayNhanPhong,
            ngayTraPhong: ngayTraPhong,
            soNguoi:soNguoi,
            soPhong: soPhong,
            page: pageable.page, 
            size: pageable.size
        }
    });
};
export const huyTTDP = (maThongTinDatPhong) => {
    return authorizedAxiosInstance.get(apiHuyTTDP, {
        params: {
            maThongTinDatPhong:maThongTinDatPhong
        }
    });
};

export const getTTDPByMaTTDP = (maTTDP) => {
    return authorizedAxiosInstance.get(apiGetTTDP, {
        params: {
            maTTDP: maTTDP
        }
    });
};