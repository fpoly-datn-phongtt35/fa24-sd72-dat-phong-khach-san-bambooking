import authorizedAxiosInstance from "../utils/authorizedAxios";
const apiKhachHang = "http://localhost:8080/khach-hang";
const apiGetKHByKey = "http://localhost:8080/khach-hang/get-by-key";
export const listKhachHang = (pageable, searchQuery = "") => {
  return authorizedAxiosInstance.get(apiKhachHang + "/search", {
    params: {
      page: pageable.page,
      size: pageable.size,
      keyword: searchQuery,
    },
  });
};
export const getKhachHangByKey = (trangThai, keyword, pageable) => {
  return authorizedAxiosInstance.get(apiGetKHByKey, {
    params: {
      trangThai: trangThai,
      keyword: keyword,
      page: pageable.page,
      size: pageable.size,
    },
  });
};
export const createKhachHang = (khachHang) =>
  authorizedAxiosInstance.post(apiKhachHang, khachHang);

export const getOneKhachHang = (khachHangId) =>
  authorizedAxiosInstance.get(`${apiKhachHang}/${khachHangId}`);

export const updateKhachHang = (khachHang) =>
  authorizedAxiosInstance.put(apiKhachHang + "/update-kh-dp", khachHang);

export const deleteKhachHang = (khachHangId) =>
  authorizedAxiosInstance.delete(`${apiKhachHang}/${khachHangId}`);
