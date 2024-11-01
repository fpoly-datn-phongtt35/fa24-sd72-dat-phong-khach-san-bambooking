import axios from "axios";
const apiAdd = "http://localhost:8080/xep-phong/add"
export const addXepPhong = (XepPhongRequest) => {
    return axios.post(apiAdd, XepPhongRequest);
};