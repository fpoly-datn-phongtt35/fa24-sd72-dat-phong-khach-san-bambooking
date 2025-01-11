import axios from "axios";

const apiHoaDon = "http://localhost:8080/hoa-don";
const apiThongTinHoaDon = "http://localhost:8080/thong-tin-hoa-don"
const apiDichVuSuDung = "http://localhost:8080/thong-tin-hoa-don/dich-vu-su-dung";


export const getHoaDonById = (idHoaDon) => {
    return axios.get(`${apiHoaDon}/${idHoaDon}`);
};

export const getThongTinHoaDonByHoaDonId = (idHoaDon) => {
    return axios.get(`${apiThongTinHoaDon}/${idHoaDon}`);
};

export const getDichVuSuDung = (idHoaDon) =>{
    return axios.get(`${apiDichVuSuDung}/${idHoaDon}`);
}