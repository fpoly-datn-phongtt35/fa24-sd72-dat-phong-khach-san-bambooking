import axios from "axios";

const apiImage = 'http://localhost:8080/image';
const apiPhong = 'http://localhost:8080/phong';
const apiSearchdImg = 'http://localhost:8080/image/searchByIDPhong';

export const listImage = (pageable, searchQuery = '') => {
    return axios.get(apiImage + '/search', {
        params: {
            page: pageable.page,
            size: pageable.size,
            keyword: searchQuery
        }
    });
};

export const searchByIDPhong = (idPhong) => {
    return axios.get(apiSearchdImg, {
        params: {
            keyword: idPhong
        }
    });
};


export const getPhong = () => {
    return axios.get(apiPhong);
}

export const uploadImage = (formData) => {
    return axios.post(`${apiImage}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getImageUrl = (id) => {
    return axios.get(`${apiImage}/${id}/url`);
};

export const deleteImage = (id) => {
    return axios.delete(`${apiImage}/${id}`);
};

