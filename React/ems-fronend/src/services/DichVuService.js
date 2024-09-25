import axios from "axios";
const api = "http://localhost:8080/dich_vu/home"

export const listDichVu = () => axios.get(api)