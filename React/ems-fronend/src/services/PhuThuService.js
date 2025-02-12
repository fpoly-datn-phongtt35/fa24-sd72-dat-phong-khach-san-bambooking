import axios from "axios";
import authorizedAxiosInstance from '../utils/authorizedAxios';
const apiAdd = "http://localhost:8080/phu_thu/add";

export const ThemPhuThu = (phuThu) => {
    return authorizedAxiosInstance.post(apiAdd, phuThu);
};