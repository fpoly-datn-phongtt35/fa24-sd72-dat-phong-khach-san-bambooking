import axios from "axios";

const apiHoaDon = "http://localhost:8080/hoa-don"

export const listHoaDon = (pageable, trangThai = "", keyword = "") => {
    return axios.get(apiHoaDon, {
        params: {
            page: pageable.page,
            size: pageable.size,
            trangThai: trangThai || undefined,
            keyword: keyword || undefined
        }
    });
};