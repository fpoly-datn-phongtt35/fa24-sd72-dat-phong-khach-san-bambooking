import authorizedAxiosInstance from "../utils/authorizedAxios";

const apiImage = 'http://localhost:8080/image';
const apiPhong = 'http://localhost:8080/phong';
const apiSearchdImg = 'http://localhost:8080/image/searchByIDPhong';

export const listImage = (pageable, searchQuery = '') => {
    return authorizedAxiosInstance.get(apiImage + '/search', {
        params: {
            page: pageable.page,
            size: pageable.size,
            keyword: searchQuery
        }
    });
};

export const searchByIDPhong = (idPhong) => {
    return authorizedAxiosInstance.get(apiSearchdImg, {
        params: {
            keyword: idPhong
        }
    });
};


export const getPhong = () => {
    return authorizedAxiosInstance.get(apiPhong);
}

export const uploadImage = (formData) => {
    return authorizedAxiosInstance.post(`${apiImage}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getImageUrl = (id) => {
    return authorizedAxiosInstance.get(`${apiImage}/${id}/url`);
};

export const deleteImage = (id) => {
    return authorizedAxiosInstance.delete(`${apiImage}/${id}`);
};

