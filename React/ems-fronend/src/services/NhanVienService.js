// import authorizedAxiosInstance from "../utils/authorizedAxios";
// const api = "http://localhost:8080/nhan-vien";

// export const searchNhanVien = ({ keyword = "", page = 0, size = 5 }) =>
//   authorizedAxiosInstance.get(`${api}/search`, {
//     params: {
//       keyword: keyword, // Từ khóa tìm kiếm
//       page: page, // Số trang hiện tại
//       size: size, // Kích thước trang
//     },
//   });

// export const createNhanVien = async (nhanVien) => {
//   return await authorizedAxiosInstance.post(`${api}`, nhanVien); // Thêm nhân viên mới
// };

// export const updateNhanVien = (id, data) => {
//   return authorizedAxiosInstance.put(
//     `http://localhost:8080/nhan-vien/${id}`,
//     data
//   );
// };

// export const getNhanVienById = (id) => {
//   return authorizedAxiosInstance.get(`${api}/${id}`); // Lấy thông tin nhân viên theo ID
// };

// export const deleteNhanVien = (id) => {
//   return authorizedAxiosInstance.delete(`${api}/${id}`); // Xóa nhân viên theo ID
// };



import authorizedAxiosInstance from "../utils/authorizedAxios";
import debounce from "lodash/debounce";

const api = "http://localhost:8080/nhan-vien";

// Hàm gọi API tìm kiếm
const performSearchNhanVien = async ({ keyword = "", page = 0, size = 5 }) => {
  return await authorizedAxiosInstance.get(`${api}/search`, {
    params: {
      keyword, // Từ khóa tìm kiếm
      page,    // Số trang hiện tại
      size,    // Kích thước trang
    },
  });
};

// Debounce hàm tìm kiếm (đợi 300ms trước khi gọi lại)
export const searchNhanVien = debounce(performSearchNhanVien, 300);

// Hàm thêm nhân viên mới
export const createNhanVien = async (nhanVien) => {
  return await authorizedAxiosInstance.post(`${api}`, nhanVien);
};

// Hàm cập nhật nhân viên
export const updateNhanVien = (id, data) => {
  return authorizedAxiosInstance.put(`${api}/${id}`, data);
};

// Hàm lấy thông tin nhân viên theo ID
export const getNhanVienById = (id) => {
  return authorizedAxiosInstance.get(`${api}/${id}`);
};

// Hàm xóa nhân viên theo ID
export const deleteNhanVien = (id) => {
  return authorizedAxiosInstance.delete(`${api}/${id}`);
};
