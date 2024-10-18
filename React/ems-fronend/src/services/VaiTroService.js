import axios from "axios";
const api = "http://localhost:8080/vai-tro";
export const listVaiTro = () => axios.get(api);

// Hàm gọi API để lấy danh sách vai trò
export const getVaiTroList = async () => {
  try {
    const response = await axios.get(api);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách vai trò:", error);
    throw error;
  }
};
