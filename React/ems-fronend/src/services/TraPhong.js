import axios from "axios";
const apiCheckOut = "http://localhost:8080/tra-phong/check-out"
export const checkOut = (maThongTinDatPhong) => {
    return axios.get(apiCheckOut, {
        params: {
            maThongTinDatPhong: maThongTinDatPhong
        }
    });
};