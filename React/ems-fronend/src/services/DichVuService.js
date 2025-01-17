import authorizedAxiosInstance from "../utils/authorizedAxios";
 
const api = "http://localhost:8080/dich_vu";
const apiAdd = "http://localhost:8080/dich_vu/add";
const apiUpdate = "http://localhost:8080/dich_vu/update";
const apiDelete = "http://localhost:8080/dich_vu/delete";

export const DuLieu = () => authorizedAxiosInstance.get(api);

export const ThemDichVu = (dv) => {
    return authorizedAxiosInstance.post(apiAdd, dv);
};
export const CapNhatDichVu = (dv) => {
    return authorizedAxiosInstance.post(`${apiUpdate}`, dv);
};
export const XoaDichVu = (id) => {
    return authorizedAxiosInstance.delete(`${apiDelete}/${id}`);
};
