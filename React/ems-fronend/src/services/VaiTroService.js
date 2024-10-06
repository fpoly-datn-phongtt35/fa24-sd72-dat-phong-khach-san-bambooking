import axios from "axios";
const api = "http://localhost:8080/vai-tro";
export const listVaiTro = () => axios.get(api)