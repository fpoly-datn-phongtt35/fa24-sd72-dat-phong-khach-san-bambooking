import axios from "axios";
const apiDetailDP = "http://localhost:8080/ttdp/chi-tiet-dat-phong"
const apiAdd = "http://localhost:8080/ttdp/them-moi"
const apiHienThiQuanLy = "http://localhost:8080/ttdp/hien-thi-quan-ly"
const apiLoaiPhongKhaDung = "http://localhost:8080/ttdp/loai-phong-kha-dung"
const apiTimKiem = "http://localhost:8080/ttdp/tim-kiem"
const apiHuyTTDP = "http://localhost:8080/ttdp/huy-ttdp"
const apiXoaTTDP = "http://localhost:8080/ttdp/xoa-ttdp"
const apiLGH = "http://localhost:8080/ttdp/list-gio-hang";
const apiUpdate = "http://localhost:8080/ttdp/update"
// export const getThongTinDatPhong = (idDP, pageable) => {
//     return axios.get(apiTTDP, {
//         params: {
//             idDP: idDP,
//             page: pageable.page, 
//             size: pageable.size
//         }
//     });
// };
export const findTTDPS = (startDate, endDate, key, trangThai, pageable) => {
    const params = {
        trangThai: trangThai || '',
        page: pageable.page ?? 0,
        size: pageable.size ?? 5
    };

    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (key) params.key = key;

    return axios.get(apiTimKiem, { params });
};


export const findTTDPByMaDatPhong = (maDatPhong) => {
    return axios.get(apiDetailDP, {
        params: {
            maDatPhong: maDatPhong
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
export const getLoaiPhongKhaDung = (ngayNhanPhong,ngayTraPhong,soNguoi,pageable) => {
    return axios.get(apiLoaiPhongKhaDung, {
        params: {
            ngayNhanPhong: ngayNhanPhong,
            ngayTraPhong: ngayTraPhong,
            soNguoi:soNguoi,
            page: pageable.page, 
            size: pageable.size
        }
    });
};
export const huyTTDP = (maThongTinDatPhong) => {
    return axios.get(apiHuyTTDP, {
        params: {
            maThongTinDatPhong:maThongTinDatPhong
        }
    });
};

export const ListGioHang = (idDatPhong) => {
    return axios.get(apiLGH, {
        params: {
            idDatPhong: idDatPhong,
        }
    });
};

export const xoaTTDP = (idTTDP) => {
    return axios.get(apiXoaTTDP, {
        params: {
            idTTDP:idTTDP
        }
    });
};

export const updateTTDP = (TTDPRequest) => {
    return axios.post(apiUpdate, TTDPRequest);
};