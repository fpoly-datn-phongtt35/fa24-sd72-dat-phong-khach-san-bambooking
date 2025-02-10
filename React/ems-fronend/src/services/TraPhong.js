import authorizedAxiosInstance from "../utils/authorizedAxios";

const apiCheckOut = "http://localhost:8080/tra-phong/check-out"

export const checkOut = (maThongTinDatPhong) => {
    return authorizedAxiosInstance.get(apiCheckOut, {
        params: {
            maThongTinDatPhong: maThongTinDatPhong
        }
    });
};