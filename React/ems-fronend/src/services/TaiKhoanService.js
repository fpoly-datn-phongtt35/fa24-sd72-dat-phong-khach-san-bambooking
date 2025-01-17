import authorizedAxiosInstance from "../utils/authorizedAxios";

const api = "http://localhost:8080/tai-khoan";

export const listTaiKhoan = ({ keyword = "", page = 0, size = 5 }) =>
  authorizedAxiosInstance.get(`${api}/search`, {
    params: {
      keyword: keyword, // Từ khóa tìm kiếm
      page: page, // Số trang hiện tại
      size: size, // Kích thước trang
    },
  });

export const createTaiKhoan = async (taiKhoan) => {
  return await authorizedAxiosInstance.post(`${api}`, taiKhoan); // Thêm nhân viên mới
};

export const updateTaiKhoan = (taiKhoan) => {
  return authorizedAxiosInstance.put(`${api}/${taiKhoan.id}`, taiKhoan);
};


// Hàm xóa tài khoản
export const deleteTaiKhoan = (id) => {
  return authorizedAxiosInstance.delete(`${api}/${id}`);
};

// Hàm gọi API để lấy danh sách tài khoản
export const getTaiKhoanList = async () => {
  try {
    const response = await authorizedAxiosInstance.get(api);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tài khoản:", error);
    throw error;
  }
};

