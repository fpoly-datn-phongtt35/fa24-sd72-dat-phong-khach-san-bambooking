import axios from "axios";
<<<<<<< HEAD
const api = "http://localhost:8080/tien-nghi/home"

export const listTienNghi = () => axios.get(api)
=======
const api = "http://localhost:8080/tien-nghi/home";
const apiadd = "http://localhost:8080/tien-nghi/add";
const apiTI = "http://localhost:8080/tien-ich/home";
const apiLP = "http://localhost:8080/loai-phong/home";
const apiUD = "http://localhost:8080/tien-nghi/update";
const apiDE = "http://localhost:8080/tien-nghi/delete";

// export const listTienNghi = () => axios.get(api);

export const listTienNghi = (pageable) => {
    return axios.get(api, {
        params: { 
            page: pageable.page, 
            size: pageable.size
        }
    });
};

export const addTienNghiPhong = (tienNghiPhongRequest) => {
    return axios.post(apiadd, tienNghiPhongRequest);
};

export const DSTienIch = () => {
    return axios.get(apiTI);
};

// Hàm lấy danh sách loại phòng
export const DSLoaiPhong = () => {
    return axios.get(apiLP);
};

export const updateTienNghiPhong = (tienNghiPhongRequest) => {
    return axios.post(apiUD, tienNghiPhongRequest);
};

// Thay đổi hàm delete để truyền vào id và sử dụng phương thức DELETE
export const deleteTienNghiPhong = (id) => {
    return axios.delete(`${apiDE}/${id}`);
};
>>>>>>> long
