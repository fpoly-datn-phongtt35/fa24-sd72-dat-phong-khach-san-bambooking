import authorizedAxiosInstance from "../utils/authorizedAxios";

const apiHienThi = "http://localhost:8080/khach-hang-checkin/hien-thi"
const apiThem = "http://localhost:8080/khach-hang-checkin/them"
const apiSua = "http://localhost:8080/khach-hang-checkin/sua";
const apiXoa = "http://localhost:8080/khach-hang-checkin/xoa";
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

export const sua = (request) => {
  return authorizedAxiosInstance.put(apiSua, request);
};

export const xoa = (id) => {
  return authorizedAxiosInstance.delete(`${apiXoa}?id=${id}`);
};