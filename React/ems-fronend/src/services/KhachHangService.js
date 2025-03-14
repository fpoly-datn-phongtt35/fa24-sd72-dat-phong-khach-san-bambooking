import authorizedAxiosInstance from '../utils/authorizedAxios';
const apiKhachHang = 'http://localhost:8080/khach-hang';

export const listKhachHang = (pageable, searchQuery = '') => {
    return authorizedAxiosInstance.get(apiKhachHang + '/search', {
        params: {
            page: pageable.page,
            size: pageable.size,
            keyword: searchQuery
        }
    });
};

export const createKhachHang = (khachHang) => authorizedAxiosInstance.post(apiKhachHang, khachHang);

export const getOneKhachHang = (khachHangId) => authorizedAxiosInstance.get(`${apiKhachHang}/${khachHangId}`);

export const updateKhachHang = (khachHangId, khachHang) => authorizedAxiosInstance.put(`${apiKhachHang}/${khachHangId}`, khachHang);

export const deleteKhachHang = (khachHangId) => authorizedAxiosInstance.delete(`${apiKhachHang}/${khachHangId}`);
