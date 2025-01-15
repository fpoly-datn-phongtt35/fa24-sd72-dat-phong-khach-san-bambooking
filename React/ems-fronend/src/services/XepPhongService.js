import authorizedAxiosInstance from "../utils/authorizedAxios";

const apiAdd = "http://localhost:8080/xep-phong/add"
const apiPDX = "http://localhost:8080/xep-phong/phong-da-xep"
const apiCheckIn = "http://localhost:8080/xep-phong/check-in"

export const addXepPhong = (XepPhongRequest) => {
    return authorizedAxiosInstance.post(apiAdd, XepPhongRequest);
};

export const phongDaXep =(maThongTinDatPhong) => {
    return authorizedAxiosInstance.get(apiPDX, {
        params: {
            maThongTinDatPhong: maThongTinDatPhong
            }
    });
};

export const checkIn = (xepPhongRequest) => {
    return authorizedAxiosInstance.put(apiCheckIn, xepPhongRequest);
};