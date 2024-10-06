import axios from "axios";
const api = "http://localhost:8080/nhan-vien"

export const listNhanVien = ({ page, size }) => 
    axios.get(`${api}?page=${page}&size=${size}`);


export const createNhanVien = async (nhanVien) => {
    return await axios.post('http://localhost:8080/add/nhan-vien', nhanVien);
};


export const updateNhanVien = (nhanVien) => {
    return axios.put(`http://localhost:8080/update/nhan-vien/${nhanVien.id}`, nhanVien, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};


export const getNhanVienById = (id) => {
    return axios.get(`${api}/${id}`); // Gọi API để lấy thông tin nhân viên theo ID
};


export const deleteNhanVien = (id) => {
    return axios.delete(`http://localhost:8080/delete/${id}`);
};
