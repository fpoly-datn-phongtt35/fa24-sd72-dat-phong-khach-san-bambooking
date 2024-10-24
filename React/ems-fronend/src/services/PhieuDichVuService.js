import axios from "axios";

// Đường dẫn API cho phiếu dịch vụ
const apiPhieuDichVu = "http://localhost:8080/phieu_dich_vu";
const apiAddPhieuDichVu = "http://localhost:8080/phieu_dich_vu/add";
const apiUpdatePhieuDichVu = "http://localhost:8080/phieu_dich_vu/update";
const apiDeletePhieuDichVu = "http://localhost:8080/phieu_dich_vu/delete";
const apiDichVu = "http://localhost:8080/dich_vu";
const apiThongTinDatPhong = "http://localhost:8080/thong_tin_dat_phong";

// Lấy danh sách phiếu dịch vụ
export const DuLieuPhieuDichVu = () => axios.get(apiPhieuDichVu);

// Thêm phiếu dịch vụ   
export const ThemPhieuDichVu = (phieuDichVu) => {
    return axios.post(apiAddPhieuDichVu, phieuDichVu);
};

// Cập nhật phiếu dịch vụ
export const CapNhatPhieuDichVu = (phieuDichVu) => {
    return axios.post(`${apiUpdatePhieuDichVu}`, phieuDichVu);
};

// Xóa phiếu dịch vụ
export const XoaPhieuDichVu = (id) => {
    return axios.delete(`${apiDeletePhieuDichVu}/${id}`);
};

// Lấy danh sách dịch vụ
export const DanhSachDichVu = () => {
    return axios.get(apiDichVu);
};

// Lấy danh sách thông tin đặt phòng
export const DanhSachThongTinDatPhong = () => {
    return axios.get(apiThongTinDatPhong); 
};
