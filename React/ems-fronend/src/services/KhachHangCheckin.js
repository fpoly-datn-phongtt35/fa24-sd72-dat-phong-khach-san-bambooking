import authorizedAxiosInstance from "../utils/authorizedAxios";

const apiHienThi = "http://localhost:8080/khach-hang-checkin/hien-thi"
const apiThem = "http://localhost:8080/khach-hang-checkin/them"
export const hienThi = (maThongTinDatPhong) => {
    return authorizedAxiosInstance.get(apiHienThi, {
        params: {
            maThongTinDatPhong: maThongTinDatPhong
            }
    });
};
export const them = (request) => {
    return authorizedAxiosInstance.post(apiThem,request);
};