import authorizedAxiosInstance from '../utils/authorizedAxios';
const api = "http://localhost:8080/xep-phong/thong-tin-xep-phong"
const apiAdd = "http://localhost:8080/xep-phong/add"
const apiPDX = "http://localhost:8080/xep-phong/phong-da-xep"
const apiCheckIn = "http://localhost:8080/xep-phong/check-in"
const apiGetXepPhongByTTDP = "http://localhost:8080/xep-phong/by-thong-tin";
const apiGetXepPhongById = "http://localhost:8080/xep-phong";
const apiGetPhongById = 'http://localhost:8080/xep-phong/get-phong';
const apiUpdate = "http://localhost:8080/xep-phong/update";
export const addXepPhong = (XepPhongRequest) => {
    return authorizedAxiosInstance.post(apiAdd, XepPhongRequest);
};

export const ttXepPhong = (XepPhongRequest) => {
    return authorizedAxiosInstance.get(api, XepPhongRequest);
};
export const phongDaXep = (maThongTinDatPhong) => {
    return authorizedAxiosInstance.get(apiPDX, {
        params: {
            maThongTinDatPhong: maThongTinDatPhong
            }
    });
};

export const checkIn = (xepPhongRequest) => {
    return authorizedAxiosInstance.put(apiCheckIn, xepPhongRequest);
};

export const getXepPhongByThongTinDatPhongId = (idThongTinDatPhong) => {
    return authorizedAxiosInstance.get(`${apiGetXepPhongByTTDP}/${idThongTinDatPhong}`);
};

export const getXepPhongById = (id) => {
    return authorizedAxiosInstance.get(`${apiGetXepPhongById}/${id}`);
};

export const getPhongById = (id) => {
    return authorizedAxiosInstance.get(`${apiGetPhongById}/${id}`);
};

export const updateXepPhong = (XepPhongRequest) => {
  return authorizedAxiosInstance.put(apiUpdate, XepPhongRequest);
};