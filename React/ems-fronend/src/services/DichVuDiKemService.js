import axios from "axios";

const api = "http://localhost:8080/dich_vu_di_kem";
const apiAdd = `${api}/add`;
const apiUpdate = `${api}/update`;
const apiDelete = `${api}/delete`;

export const LayDanhSachDichVuDiKem = () => axios.get(api);
export const ThemDichVuDiKem = (dvDiKem) => axios.post(apiAdd, dvDiKem);
export const CapNhatDichVuDiKem = (dvDiKem) => axios.put(apiUpdate, dvDiKem);
export const XoaDichVuDiKem = (id) => axios.delete(`${apiDelete}/${id}`);
