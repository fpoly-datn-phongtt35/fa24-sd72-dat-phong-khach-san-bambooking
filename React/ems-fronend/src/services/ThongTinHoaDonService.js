import axios from "axios";

const api = "http://localhost:8080/thong-tin-hoa-don"
const apiAdd = "http://localhost:8080/thong-tin-hoa-don/add";

export const listThongTinHoaDon = (pageable, keyword = "") => {
    return axios.get(api, {
        params: {
            page: pageable.page,
            size: pageable.size,
            keyword: keyword || undefined
        }
    });
};

export const ThemThongTinHoaDon = (tthd) => {
    return axios.post(apiAdd, tthd);
};
