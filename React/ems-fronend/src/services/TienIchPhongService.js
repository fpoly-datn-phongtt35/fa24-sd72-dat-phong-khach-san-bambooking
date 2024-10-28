import axios from "axios";
const api = "http://localhost:8080/tien-ich-phong/index";
const apiadd = "http://localhost:8080/tien-ich-phong/add";
const apiTI = "http://localhost:8080/tien-ich/home";
const apiLP = "http://localhost:8080/loai-phong/home";
const apiUD = "http://localhost:8080/tien-nghi/update";
const apiDE = "http://localhost:8080/tien-ich-phong/delete";

// export const listTienNghi = () => axios.get(api);

export const listTienIchPhong = () => {
    return axios.get(api);
};

export const addTienIchPhong = (tienIchPhongRequest) => {
    return axios.post(apiadd, tienIchPhongRequest);
};

export const DSTienIch = () => {
    return axios.get(apiTI);
};

// Hàm lấy danh sách loại phòng
export const DSLoaiPhong = () => {
    return axios.get(apiLP);
};

export const updateTienIchPhong = (tienIchPhongRequest) => {
    return axios.post(apiUD, tienIchPhongRequest);
};

// Thay đổi hàm delete để truyền vào id và sử dụng phương thức DELETE
export const deleteTienNghiPhong = (id) => {
    return axios.delete(`${apiDE}/${id}`);
};
