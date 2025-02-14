import authorizedAxiosInstance from "../utils/authorizedAxios";

const apiCheckOut = "http://localhost:8080/tra-phong/check-out"
const apids = "http://localhost:8080/tra-phong/thong-tin-tra-phong"

export const checkOut = (maThongTinDatPhong) => {
    return authorizedAxiosInstance.get(apiCheckOut, {
        params: {
            maThongTinDatPhong: maThongTinDatPhong
        }
    });
};

export const dsTraPhong = (TraPhongRequest) => {
    return authorizedAxiosInstance.get(apids, TraPhongRequest);
};