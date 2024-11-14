import axios from 'axios'

const apiPhong = 'http://localhost:8080/phong';
const apiLoaiPhong = 'http://localhost:8080/loai-phong';
const apiPhongKhaDung = 'http://localhost:8080/phong/phong-kha-dung';
export const listPhong = (pageable, searchQuery = '') => {
    return axios.get(apiPhong + '/search', {
        params: {
            page: pageable.page,
            size: pageable.size,
            keyword: searchQuery
        }
    });
};

export const createPhong = (phong) => axios.post(apiPhong, phong);
export const getOnePhong = (phongId) => axios.get(apiPhong + '/' + phongId);
export const updatePhong = (phongId, phong) => axios.put(apiPhong + '/' + phongId, phong);

export const updateStatus = (phongId) => {
    return axios.put(`${apiPhong}/status/${phongId}`);
};

export const getLoaiPhong = () => {
    return axios.get(apiLoaiPhong);
}
export const getPhongKhaDung = (idLoaiPhong) => {
    return axios.get(apiPhongKhaDung, {
        params: {
            idLoaiPhong: idLoaiPhong
        }
    });
};