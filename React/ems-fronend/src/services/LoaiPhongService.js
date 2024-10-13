import axios from "axios";

const api = "http://localhost:8080/loai_phong"

export const listLoaiPhong = () => axios.get(api)