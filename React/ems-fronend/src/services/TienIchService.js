import axios from "axios";
const api = "http://localhost:8080/tien-ich/index";
const apiadd = "http://localhost:8080/tien-ich/add";
const apiUD = "http://localhost:8080/tien-ich/update";
const apiDE = "http://localhost:8080/tien-ich/delete";
const apiSE = "http://localhost:8080/tien-ich/search";

// export const listTienNghi = () => axios.get(api);

export const listTienIch = (pageable) => {
    return axios.get(api, {
        params: { 
            page: pageable.page, 
            size: pageable.size
        }
    });
};

export const addTienIch= (tienNghiRequest) => {
    return axios.post(apiadd, tienNghiRequest);
};

export const updateTienIch = (tienNghiRequest) => {
    return axios.post(apiUD, tienNghiRequest);
};

// Thay đổi hàm delete để truyền vào id và sử dụng phương thức DELETE
export const deleteTienIch = (id) => {
    return axios.delete(`${apiDE}/${id}`);
};

// export const searchTienIch = (tenTienIch, pageable) => {
//     return axios.get(`${apiSE}/${tenTienIch}`, {
//         params: {
//             page: pageable.page,
//             size: pageable.size,
//         }
//     });
// };
export const searchTienIch = (tenTienIch, pageable) => {
    return axios.get(apiSE, {
        params: {
            tenTienIch, // Truyền tham số vào params
            page: pageable.page,
            size: pageable.size,
        }
    });
};



