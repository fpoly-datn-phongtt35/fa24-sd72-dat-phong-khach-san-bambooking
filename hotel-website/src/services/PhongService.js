import authorizedAxiosInstance from '../utils/authorizedAxios';
const apiPhong = 'http://localhost:8080/phong';
const apiLoaiPhong = 'http://localhost:8080/loai-phong';
const apiPhongKhaDung = 'http://localhost:8080/phong/phong-kha-dung';
const apiDSPhong = 'http://localhost:8080/phong/dsphong'

export const listPhong = (pageable, searchQuery = '') => {
    return authorizedAxiosInstance.get(apiPhong + '/search', {
        params: {
            page: pageable.page,
            size: pageable.size,
            keyword: searchQuery
        }
    });
};

export const createPhong = (phong) => authorizedAxiosInstance.post(apiPhong, phong);
export const getOnePhong = (phongId) => authorizedAxiosInstance.get(apiPhong + '/' + phongId);
export const updatePhong = (phongId, phong) => authorizedAxiosInstance.put(apiPhong + '/' + phongId, phong);

export const updateStatus = (phongId) => {
    return authorizedAxiosInstance.put(`${apiPhong}/status/${phongId}`);
};

export const getLoaiPhong = () => {
    return authorizedAxiosInstance.get(apiLoaiPhong);
}
export const getPhongKhaDung = (idLoaiPhong,ngayNhanPhong,ngayTraPhong) => {
    return authorizedAxiosInstance.get(apiPhongKhaDung, {
        params: {
            idLoaiPhong: idLoaiPhong,
            ngayNhanPhong:ngayNhanPhong,
            ngayTraPhong:ngayTraPhong
        }
    });
};

export const dsPhong = ( searchQuery = '') => {
    return authorizedAxiosInstance.get(apiDSPhong, {
        params: {
            keyword: searchQuery
        }
    });
};