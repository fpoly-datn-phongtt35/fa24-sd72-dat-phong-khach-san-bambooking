import axios from "axios";
const api = "http://localhost:8080/tien-ich/index";
const apiadd = "http://localhost:8080/tien-ich/add";
const apiUD = "http://localhost:8080/tien-ich/update";
const apiDE = "http://localhost:8080/tien-ich/delete";
const apiSE = "http://localhost:8080/tien-ich/search";
const apiImage = "http://localhost:8080/tien-ich";

// export const listTienNghi = () => axios.get(api);

export const listTienIch = (pageable) => {
    return axios.get(api, {
        params: { 
            page: pageable.page, 
            size: pageable.size
        }
    });
};

export const addTienIch= (formData) => {
    return axios.post(apiadd, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const updateTienIch = (formData) => {
    return axios.post(apiUD, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// Thay đổi hàm delete để truyền vào id và sử dụng phương thức DELETE
export const deleteTienIch = (id) => {
    return axios.delete(`${apiDE}/${id}`);
};


export const searchTienIch = (tenTienIch, pageable) => {
    return axios.get(apiSE, {
        params: {
            tenTienIch, // Truyền tham số vào params
            page: pageable.page,
            size: pageable.size,
        }
    });
};

export const listImage = (pageable, searchQuery = '') => {
    return axios.get(apiImage + '/search', {
        params: {
            page: pageable.page,
            size: pageable.size,
            keyword: searchQuery
        }
    });
};



