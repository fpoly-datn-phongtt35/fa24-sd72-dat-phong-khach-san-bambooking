import axios from "axios";
const api = "http://localhost:8080/nhan-vien"

export const listNhanVien = () => axios.get(api)