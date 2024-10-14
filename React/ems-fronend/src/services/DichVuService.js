import axios from "axios";

const api = "http://localhost:8080/dich_vu";
const apiAdd = "http://localhost:8080/dich_vu/add";
const apiUpdate = "http://localhost:8080/dich_vu/update";
const apiDelete = "http://localhost:8080/dich_vu/delete";

export const DuLieu = () => axios.get(api);

export const ThemDichVu = (dv) => {
    return axios.post(apiAdd, dv);
};
export const CapNhatDichVu = (dv) => {
    return axios.post(`${apiUpdate}`, dv);
};
export const XoaDichVu = (id) => {
    return axios.delete(`${apiDelete}/${id}`);
};
