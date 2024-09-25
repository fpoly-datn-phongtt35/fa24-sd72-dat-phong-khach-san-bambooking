import axios from "axios";
const api = "http://localhost:8080/tien-nghi/home"

export const listTienNghi = () => axios.get(api)