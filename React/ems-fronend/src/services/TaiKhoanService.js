import axios from "axios";
const api = "http://localhost:8080/tai-khoan";

// Hàm lấy danh sách tài khoản với tham số phân trang
export const listTaiKhoan = ({ page, size }) => 
    axios.get(`${api}?page=${page}&size=${size}`);