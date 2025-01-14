import axios from 'axios';

const apiKhachHang = 'http://localhost:8080/khach-hang';

export const listKhachHang = (pageable, searchQuery = '') => {
    return axios.get(apiKhachHang + '/search', {
        params: {
            page: pageable.page,
            size: pageable.size,
            keyword: searchQuery
        }
    });
};

export const createKhachHang = (khachHang) => axios.post(apiKhachHang, khachHang);

export const getOneKhachHang = (khachHangId) => axios.get(`${apiKhachHang}/${khachHangId}`);

export const updateKhachHang = (khachHangId, khachHang) => axios.put(`${apiKhachHang}/${khachHangId}`, khachHang);

export const deleteKhachHang = (khachHangId) => axios.delete(`${apiKhachHang}/${khachHangId}`);
