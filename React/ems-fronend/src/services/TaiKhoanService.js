import axios from "axios";
const api = "http://localhost:8080/tai-khoan";

export const listTaiKhoan = ({ keyword = '', page = 0, size = 5 }) => 
    axios.get(`${api}/search`, {
        params: {
            keyword: keyword,  // Từ khóa tìm kiếm
            page: page,        // Số trang hiện tại
            size: size         // Kích thước trang
        }
    });


export const createTaiKhoan = async (taiKhoan) => {
        return await axios.post(`${api}`, taiKhoan); // Thêm nhân viên mới
};


export const updateTaiKhoan = (id, taiKhoan) => {
    return axios.put(`${api}/${id}`, taiKhoan);
};


// Hàm xóa tài khoản
export const deleteTaiKhoan = (id) => {
    return axios.delete(`${api}/${id}`);
};
