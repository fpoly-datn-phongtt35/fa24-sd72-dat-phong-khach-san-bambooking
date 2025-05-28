import axios from "axios";
import authorizedAxiosInstance from '../utils/authorizedAxios';
const apiAdd = "http://localhost:8080/phu_thu/add";
const apiUpdate = "http://localhost:8080/phu_thu/update";
const apiCheck = "http://localhost:8080/phu_thu/check";
const apiDelete = "http://localhost:8080/phu_thu/delete";
const apiCheckByName = "http://localhost:8080/phu_thu/check-by-name";

export const ThemPhuThu = (phuThu) => {
    return authorizedAxiosInstance.post(apiAdd, phuThu);
};

export const CapNhatPhuThu = (phuThu) => {
    return authorizedAxiosInstance.put(apiUpdate, phuThu);
};

export const XoaPhuThu = (idPhuThu) => {
    return authorizedAxiosInstance.delete(`${apiDelete}/${idPhuThu}`);
};

export const CheckPhuThuExists = (idXepPhong) => {
    return authorizedAxiosInstance.get(`${apiCheck}/${idXepPhong}`);
};

export const CheckPhuThuExistsByName = (idXepPhong, tenPhuThu) => {
    return authorizedAxiosInstance.get(apiCheckByName, {
        params: {
            idXepPhong,
            tenPhuThu,
        }
    });
};