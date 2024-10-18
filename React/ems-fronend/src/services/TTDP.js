import axios from "axios";
const apiTTDP = "http://localhost:8080/ttdp/hien-thi"
export const getThongTinDatPhong = (idDP, pageable) => {
    return axios.get(apiTTDP, {
        params: {
            idDP: idDP,
            page: pageable.page, 
            size: pageable.size
        }
    });
};