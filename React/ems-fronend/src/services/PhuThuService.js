import axios from "axios";

const apiAdd = "http://localhost:8080/phu_thu/add";

export const ThemPhuThu = (phuThu) => {
    return axios.post(apiAdd, phuThu);
};