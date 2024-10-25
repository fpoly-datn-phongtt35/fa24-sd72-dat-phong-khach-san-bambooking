import axios from "axios";

// Đường dẫn API cho dịch vụ sử dụng
const apiDichVuSuDung = "http://localhost:8080/dich_vu_su_dung";
const apiAddDichVuSuDung = "http://localhost:8080/dich_vu_su_dung/add";
const apiUpdateDichVuSuDung = "http://localhost:8080/dich_vu_su_dung/update";
const apiDeleteDichVuSuDung = "http://localhost:8080/dich_vu_su_dung/delete";
const apiDichVu = "http://localhost:8080/dich_vu";
const apiXepPhong = "http://localhost:8080/xep_phong"; // Đường dẫn mới cho xếp phòng

// Lấy danh sách dịch vụ sử dụng
export const DuLieuDichVuSuDung = () => axios.get(apiDichVuSuDung);

// Thêm dịch vụ sử dụng
export const ThemDichVuSuDung = (dichVuSuDung) => {
    return axios.post(apiAddDichVuSuDung, dichVuSuDung);
};

// Cập nhật dịch vụ sử dụng
export const CapNhatDichVuSuDung = (dichVuSuDung) => {
    return axios.post(apiUpdateDichVuSuDung, dichVuSuDung);
};

// Xóa dịch vụ sử dụng
export const XoaDichVuSuDung = (id) => {
    return axios.delete(`${apiDeleteDichVuSuDung}/${id}`);
};

// Lấy danh sách dịch vụ
export const DanhSachDichVu = () => {
    return axios.get(apiDichVu);
};

// Lấy danh sách xếp phòng
export const DanhSachXepPhong = () => {
    return axios.get(apiXepPhong); 
};
