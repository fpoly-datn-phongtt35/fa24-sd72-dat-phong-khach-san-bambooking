import axios from "axios";
const apiHienThi = "http://localhost:8080/khach-hang-checkin/hien-thi"
const apiThem = "http://localhost:8080/khach-hang-checkin/them"
export const hienThi = (maThongTinDatPhong) => {
    return axios.get(apiHienThi, {
        params: {
            maThongTinDatPhong: maThongTinDatPhong
            }
    });
};
export const them = (request) => {
    return axios.post(apiThem,request);
};