import authorizedAxiosInstance from '../utils/authorizedAxios';
const apiDetailDP = "http://localhost:8080/ttdp/chi-tiet-dat-phong"
const apiAdd = "http://localhost:8080/ttdp/them-moi"
const apiUpdate = "http://localhost:8080/ttdp/sua"
const apiHienThiQuanLy = "http://localhost:8080/ttdp/hien-thi-quan-ly"
const apiLoaiPhongKhaDung = "http://localhost:8080/ttdp/loai-phong-kha-dung"
const apiTimKiem = "http://localhost:8080/ttdp/tim-kiem"
const apiHuyTTDP = "http://localhost:8080/ttdp/huy-ttdp"
const apiGetTTDP = "http://localhost:8080/ttdp/detail-ttdp"
const apiTimLoaiPhong = "http://localhost:8080/ttdp/tim-kiem-loai-phong2"
const apiTTDP = "http://localhost:8080/ttdp/hien-thi-by-iddp"
const apiXoaTTDP = "http://localhost:8080/ttdp/xoa-ttdp" 
export const getThongTinDatPhong = (idDP) => {
    return authorizedAxiosInstance.get(apiTTDP, {
        params: {
            idDP: idDP
        }
    });
};

export const findTTDPS = (startDate, endDate, key, trangThai, pageable) => {
    const params = {
        trangThai: trangThai || '',
        page: pageable.page ?? 0,
        size: pageable.size ?? 5
    };

    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (key) params.key = key;

    return authorizedAxiosInstance.get(apiTimKiem, { params });
};

export const findTTDPByMaDatPhong = (maDatPhong) => {
    return authorizedAxiosInstance.get(apiDetailDP, {
        params: {
            maDatPhong: maDatPhong
        }
    });
};

export const HienThiQuanLy = (trangThai, pageable) => {
    return authorizedAxiosInstance.get(apiHienThiQuanLy, {
        params: {
            trangThai: trangThai,
            page: pageable.page, 
            size: pageable.size
        }
    });
};

export const addThongTinDatPhong = (TTDPRequest) => {
    return authorizedAxiosInstance.post(apiAdd, TTDPRequest);
};

export const updateThongTinDatPhong = (TTDPRequest) => {
    return authorizedAxiosInstance.put(apiUpdate, TTDPRequest);
};

export const deleteThongTinDatPhong = (idTTDP) => {
    return authorizedAxiosInstance.delete(apiXoaTTDP, idTTDP);
};

export const getLoaiPhongKhaDung = (ngayNhanPhong,ngayTraPhong,soNguoi,soPhong,pageable) => {
    return authorizedAxiosInstance.get(apiLoaiPhongKhaDung, {
        params: {
            ngayNhanPhong: ngayNhanPhong,
            ngayTraPhong: ngayTraPhong,
            soNguoi:soNguoi,
            soPhong: soPhong,
            page: pageable.page, 
            size: pageable.size
        }
    });
};

export const huyTTDP = (maThongTinDatPhong) => {
    return authorizedAxiosInstance.get(apiHuyTTDP, {
        params: {
            maThongTinDatPhong:maThongTinDatPhong
        }
    });
};

export const getTTDPByMaTTDP = (maTTDP) => {
    return authorizedAxiosInstance.get(apiGetTTDP, {
        params: {
            maTTDP: maTTDP
        }
    });
};
export const getTimKiemLoaiPhong = (ngayNhanPhong, ngayTraPhong, soNguoi, soPhong, pageable ) => {
    return authorizedAxiosInstance.get(apiTimLoaiPhong, {
      params: {
        ngayNhanPhong,
        ngayTraPhong,
        soNguoi,
        soPhong,
        page: pageable.page,
        size: pageable.size
      }
    });
  };
  
  