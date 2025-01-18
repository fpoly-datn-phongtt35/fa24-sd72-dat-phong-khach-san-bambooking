import axios from "axios";
const api = "http://localhost:8080/xep-phong/thong-tin-xep-phong"
const apiAdd = "http://localhost:8080/xep-phong/add"
const apiPDX = "http://localhost:8080/xep-phong/phong-da-xep"
const apiCheckIn = "http://localhost:8080/xep-phong/check-in"
export const addXepPhong = (XepPhongRequest) => {
    return axios.post(apiAdd, XepPhongRequest);
};

export const ttXepPhong = (XepPhongRequest) => {
    return axios.get(api, XepPhongRequest);
};
export const phongDaXep = (maThongTinDatPhong) => {
    return axios.get(apiPDX, {
        params: {
            maThongTinDatPhong: maThongTinDatPhong
            }
    });
};
export const checkIn = (maThongTinDatPhong) => {
    return axios.get(apiCheckIn, {
        params: {
            maThongTinDatPhong: maThongTinDatPhong
        }
    });
};