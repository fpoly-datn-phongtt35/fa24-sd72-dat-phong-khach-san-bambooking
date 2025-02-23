import authorizedAxiosInstance from "../utils/authorizedAxios";

// Đường dẫn API cho dịch vụ sử dụng
const apiDichVuSuDung = "http://localhost:8080/dich_vu_su_dung";
const apiAddDichVuSuDung = "http://localhost:8080/dich_vu_su_dung/add";
const apiUpdateDichVuSuDung = "http://localhost:8080/dich_vu_su_dung/update";
const apiDeleteDichVuSuDung = "http://localhost:8080/dich_vu_su_dung/delete";
const apiDichVu = "http://localhost:8080/dich_vu";
const apiXepPhong = "http://localhost:8080/xep-phong"; // Đường dẫn mới cho xếp phòng

// Lấy danh sách dịch vụ sử dụng
export const DuLieuDichVuSuDung = () => authorizedAxiosInstance.get(apiDichVuSuDung);

// Thêm dịch vụ sử dụng
export const ThemDichVuSuDung = (dichVuSuDung) => {
    return authorizedAxiosInstance.post(apiAddDichVuSuDung, dichVuSuDung);
};

// Cập nhật dịch vụ sử dụng
export const CapNhatDichVuSuDung = (dichVuSuDung) => {
    return authorizedAxiosInstance.post(apiUpdateDichVuSuDung, dichVuSuDung);
};

// Xóa dịch vụ sử dụng
export const XoaDichVuSuDung = (id) => {
    return authorizedAxiosInstance.delete(`${apiDeleteDichVuSuDung}/${id}`);
};

// Lấy danh sách dịch vụ
export const DanhSachDichVu = () => {
    return authorizedAxiosInstance.get(apiDichVu);
};

// Lấy danh sách xếp phòng
export const DanhSachXepPhong = () => {
    return authorizedAxiosInstance.get(apiXepPhong); 
};
