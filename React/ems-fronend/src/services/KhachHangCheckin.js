import authorizedAxiosInstance from "../utils/authorizedAxios";

const apiHienThi = "http://localhost:8080/khach-hang-checkin/hien-thi"
const apiThem = "http://localhost:8080/khach-hang-checkin/them"
const apiSua = "http://localhost:8080/khach-hang-checkin/sua";
const apiXoa = "http://localhost:8080/khach-hang-checkin/xoa";
const apiKHLuuTru = "http://localhost:8080/khach-hang-checkin/ds-luu-tru"
const apiGetAll = "http://localhost:8080/khach-hang-checkin/danh-sach"
const apiGetByThongTinDatPhongId = "http://localhost:8080/khach-hang-checkin/thong-tin-dat-phong";

const apiqrCheckIn= "http://localhost:8080/khach-hang-checkin/quet-qr"

export const hienThi = (maThongTinDatPhong) => {
    return authorizedAxiosInstance.get(apiHienThi, {
        params: {
            maThongTinDatPhong: maThongTinDatPhong
            }
    });
};
export const them = (request) => {
    return authorizedAxiosInstance.post(apiThem,request);
};

export const sua = (request) => {
  return authorizedAxiosInstance.put(apiSua, request);
};

export const xoa = (id) => {
  return authorizedAxiosInstance.delete(`${apiXoa}?id=${id}`);
};

export const dsKhachHangLuuTru = (keyword) => {
  return authorizedAxiosInstance.get(apiKHLuuTru, {
      params: {
        keyword: keyword
          }
  });
};

export const DanhSachKHC = () => {
  return authorizedAxiosInstance.get(apiGetAll);
};

export const getKhachHangCheckinByThongTinId = (id) => {
  return authorizedAxiosInstance.get(`${apiGetByThongTinDatPhongId}/${id}`);
};

export const qrCheckIn = (qrParsedData,idTTDP) => {
  return authorizedAxiosInstance.get(apiqrCheckIn,{
    params:{
      idTTDP: idTTDP,
      cmnd: qrParsedData.cmnd,
      diaChi: qrParsedData.diaChi,
      gioiTinh: qrParsedData.gioiTinh,
      hoTen: qrParsedData.hoTen
    }
  });
};