import axios from "axios";
const api = "http://localhost:8080/nhan-vien";

export const searchNhanVien = ({ keyword = "", page = 0, size = 5 }) =>
  axios.get(`${api}/search`, {
    params: {
      keyword: keyword, // Từ khóa tìm kiếm
      page: page, // Số trang hiện tại
      size: size, // Kích thước trang
    },
  });

export const createNhanVien = async (nhanVien) => {
  return await axios.post(`${api}`, nhanVien); // Thêm nhân viên mới
};


export const updateNhanVien = (id, data) => {
  return axios.put(`http://localhost:8080/nhan-vien/${id}`, data);
};

export const getNhanVienById = (id) => {
  return axios.get(`${api}/${id}`); // Lấy thông tin nhân viên theo ID
};

export const deleteNhanVien = (id) => {
  return axios.delete(`${api}/${id}`); // Xóa nhân viên theo ID
};
