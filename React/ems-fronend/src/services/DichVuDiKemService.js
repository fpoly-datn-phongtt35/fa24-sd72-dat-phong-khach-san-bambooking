import axios from "axios";

const api = "http://localhost:8080/dich_vu_di_kem";
const apiAdd = "http://localhost:8080/dich_vu_di_kem/add";
const apiUpdate = "http://localhost:8080/dich_vu_di_kem/update";
const apiDelete = "http://localhost:8080/dich_vu_di_kem/delete";
const apiLoaiPhong = "http://localhost:8080/loai-phong";
const apiDichVu = "http://localhost:8080/dich_vu";

export const LayDanhSachDichVuDiKem = () => axios.get(api);

export const ThemDichVuDiKem = (dvDiKem) => {
    return axios.post(apiAdd, dvDiKem);
};

export const CapNhatDichVuDiKem = (dvDiKem) => {
    return axios.post(apiUpdate, dvDiKem);
};

export const XoaDichVuDiKem = (id) => {
    return axios.delete(`${apiDelete}/${id}`);
};

// Hàm lấy danh sách loại phòng
export const DanhSachLoaiPhong = () => {
    return axios.get(apiLoaiPhong);
};

// Hàm lấy danh sách dịch vụ đi kèm
export const DanhSachDichVu = () => {
    return axios.get(apiDichVu);
};
