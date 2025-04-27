import authorizedAxiosInstance from '../utils/authorizedAxios';
const apiCreateDanhGia = "http://localhost:8080/danh-gia/them-moi"
const apigetAllDanhGia = "http://localhost:8080/danh-gia/hien-thi"
const apigetKhachHang = "http://localhost:8080/danh-gia/getKhachHang"

export const taoDanhGia = (danhGiaRequest) => {
  return authorizedAxiosInstance.post(apiCreateDanhGia, danhGiaRequest);
};

export const getAllDanhGia = () => {
  return authorizedAxiosInstance.get(apigetAllDanhGia);
};

export const getKhachHang = (idKhachHang) => {
  return authorizedAxiosInstance.get(apigetKhachHang,{
    params: {
      idKhachHang: idKhachHang
  }
  });
};