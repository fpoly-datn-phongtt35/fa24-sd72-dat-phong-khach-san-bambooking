import axios from "axios";

const api = "http://localhost:8080/loai-phong/index";
const apiadd = "http://localhost:8080/loai-phong/add";
const apiUD = "http://localhost:8080/loai-phong/update";
const apiDE = "http://localhost:8080/loai-phong/delete";
const apiTNP = "http://localhost:8080/tien-ich-phong/findByIDLoaiPhong";


// export const listTienNghi = () => axios.get(api);

export const listLoaiPhong= (pageable) => {
    return axios.get(api, {
        params: { 
            page: pageable.page, 
            size: pageable.size
        }
    });
};


// Service call trong frontend
export const DanhSachTienNghiPhong = (idLoaiPhong, pageable) => {
    return axios.get(`http://localhost:8080/tien-ich-phong/findByIDLoaiPhong/${idLoaiPhong}`, {
        params: {
            page: pageable.page,
            size: pageable.size,
        }
    });
};



export const addLoaiPhong = (loaiPhongRequest) => {
    return axios.post(apiadd, loaiPhongRequest);
};

export const updateLoaiPhong = (loaiPhongRequest) => {
    return axios.post(apiUD, loaiPhongRequest);
};

// Thay đổi hàm delete để truyền vào id và sử dụng phương thức DELETE
export const deleteLoaiPhong = (id) => {
    return axios.delete(`${apiDE}/${id}`);
};
