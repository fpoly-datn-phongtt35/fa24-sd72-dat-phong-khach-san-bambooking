import axios from "axios";
const api = "http://localhost:8080/vat-tu/index";
const apiadd = "http://localhost:8080/vat-tu/add";
const apiUD = "http://localhost:8080/vat-tu/update";
const apiDE = "http://localhost:8080/vat-tu/delete";
const apiSE = "http://localhost:8080/vat-tu/search";
const apiImage = "http://localhost:8080/vat-tu";

// export const listTienNghi = () => axios.get(api);

export const listVatTu = (pageable) => {
    return axios.get(api, {
        params: { 
            page: pageable.page, 
            size: pageable.size
        }
    });
};

export const addVatTu= (formData) => {
    return axios.post(apiadd, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const updateVatTu = (formData) => {
    return axios.post(apiUD, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// Thay đổi hàm delete để truyền vào id và sử dụng phương thức DELETE
export const deleteVatTu = (id) => {
    return axios.delete(`${apiDE}/${id}`);
};


export const searchTienIch = (tenTienIch, pageable) => {
    return authorizedAxiosInstance.get(apiSE, {
        params: {
            tenTienIch, // Truyền tham số vào params
            page: pageable.page,
            size: pageable.size,
        }
    });
};

export const listImage = (pageable, searchQuery = '') => {
    return authorizedAxiosInstance.get(apiImage + '/search', {
        params: {
            page: pageable.page,
            size: pageable.size,
            keyword: searchQuery
        }
    });
};



