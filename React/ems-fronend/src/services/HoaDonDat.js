import axios from "axios";
const apiFindCheckOut = "http://localhost:8080/tra-phong/check-out";
const apiCheckOut = "http://localhost:8080/tra-phong/Check-out";
const apiGetDatPhong = "http://localhost:8080/dat-phong/chi-tiet-dat-phong";
const apiCreateTTHD = "http://localhost:8080/thong-tin-hoa-don"
export const findCheckOut = (key) => {
    return axios.get(apiFindCheckOut, {
        params: {
            key: key,
        }
    });
};

export const checkOut = (idTraPhong) => {
    return axios.get(apiCheckOut, {
        params: {
            idTraPhong: idTraPhong,
        }
    });
};
export const getDatPhong = (maDatPhong) => {
    return axios.get(apiGetDatPhong, {
        params: {
            maDatPhong: maDatPhong,
        }
    });
};
export const createThongTinHoaDon = (tthdRequest) => {
    return axios.post(apiCreateTTHD, tthdRequest, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

