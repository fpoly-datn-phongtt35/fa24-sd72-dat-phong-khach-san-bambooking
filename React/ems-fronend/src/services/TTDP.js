import axios from "axios";
const apiTTDP = "http://localhost:8080/ttdp/hien-thi"
const apiAdd = "http://localhost:8080/ttdp/them-moi"
const apiLoaiPhongKhaDung = "http://localhost:8080/ttdp/loai-phong-kha-dung"
export const getThongTinDatPhong = (idDP, pageable) => {
    return axios.get(apiTTDP, {
        params: {
            idDP: idDP,
            page: pageable.page, 
            size: pageable.size
        }
    });
};
export const addThongTinDatPhong = (TTDPRequest) => {
    return axios.post(apiAdd, TTDPRequest);
};
export const getLoaiPhongKhaDung = (ngayNhanPhong,ngayTraPhong,pageable) => {
    return axios.get(apiLoaiPhongKhaDung, {
        params: {
            ngayNhanPhong: ngayNhanPhong,
            ngayTraPhong: ngayTraPhong,
            page: pageable.page, 
            size: pageable.size
        }
    });
};