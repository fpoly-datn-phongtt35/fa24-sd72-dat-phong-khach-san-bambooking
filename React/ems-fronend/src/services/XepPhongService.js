import axios from "axios";
const apiAdd = "http://localhost:8080/xep-phong/add"
const apiPDX = "http://localhost:8080/xep-phong/phong-da-xep"
export const addXepPhong = (XepPhongRequest) => {
    return axios.post(apiAdd, XepPhongRequest);
};
export const phongDaXep = (maTTDP) => {
    return axios.get(apiPDX, {
        params: {
            maTTDP: maTTDP
            }
    });
};