import authorizedAxiosInstance from "../utils/authorizedAxios";

const apiHoaDon = "http://localhost:8080/hoa-don";
const apiThongTinHoaDon = "http://localhost:8080/thong-tin-hoa-don"
const apiDichVuSuDung = "http://localhost:8080/thong-tin-hoa-don/dich-vu-su-dung";


export const getHoaDonById = (idHoaDon) => {
    return authorizedAxiosInstance.get(`${apiHoaDon}/${idHoaDon}`);
};

export const getThongTinHoaDonByHoaDonId = (idHoaDon) => {
    return authorizedAxiosInstance.get(`${apiThongTinHoaDon}/${idHoaDon}`);
};

export const getDichVuSuDung = (idHoaDon) =>{
    return authorizedAxiosInstance.get(`${apiDichVuSuDung}/${idHoaDon}`);
};

export const getPhuThuByHoaDonId = (idHoaDon) =>{
    return authorizedAxiosInstance.get(`http://localhost:8080/thong-tin-hoa-don/phu-thu/${idHoaDon}`)
}