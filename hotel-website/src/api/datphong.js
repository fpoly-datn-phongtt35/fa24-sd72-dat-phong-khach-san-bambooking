import axios from "axios";
const api = "http://localhost:8080/loai-phong/index";
const apiLoaiPhongKhaDung = "http://localhost:8080/api/loai-phong-kha-dung";
const apiDPAdd = "http://localhost:8080/api/them-moi-dp";
const apiCreateKH = "http://localhost:8080/api/create-kh-dp";
const apiAdd = "http://localhost:8080/api/them-moi";

export const listLoaiPhong = (pageable) => {
  return axios.get(api, {
    params: {
      page: pageable.page,
      size: pageable.size,
    },
  });
};

export const getLoaiPhongKhaDung = (
  ngayNhanPhong,
  ngayTraPhong,
  idLoaiPhong
) => {
  return axios.get(apiLoaiPhongKhaDung, {
    params: {
      ngayNhanPhong: ngayNhanPhong,
      ngayTraPhong: ngayTraPhong,
      idLoaiPhong: idLoaiPhong,
    },
  });
};

export const ThemMoiDatPhong = (DatPhongRequest) => {
  return axios.post(apiDPAdd, DatPhongRequest);
};
export const ThemKhachHangDatPhong = (khachHangRequest) => {
  return axios.post(apiCreateKH, khachHangRequest);
};
export const addThongTinDatPhong = (TTDPRequest) => {
  return axios.post(apiAdd, TTDPRequest);
};
