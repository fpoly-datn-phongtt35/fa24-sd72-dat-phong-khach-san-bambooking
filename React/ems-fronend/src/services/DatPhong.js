import authorizedAxiosInstance from "../utils/authorizedAxios";
const apiDP = "http://localhost:8080/dat-phong/hien-thi";
const apiDPAdd = "http://localhost:8080/dat-phong/them-moi";
const apiDPUpdate = "http://localhost:8080/dat-phong/cap-nhat";
const apiNV = "http://localhost:8080/nhan-vien/hien-thi";
const apiKH = "http://localhost:8080/khach-hang/hien-thi";
const apiLoc = "http://localhost:8080/dat-phong/bo-loc";
const apiCreateKHDP = "http://localhost:8080/khach-hang/create-kh-dp";
const apiUpdateKHDP = "http://localhost:8080/khach-hang/update-kh-dp";
const apiDetailDP = "http://localhost:8080/dat-phong/chi-tiet-dat-phong";
const apiDeleteKHDP = "http://localhost:8080/khach-hang/delete-kh-dp";
const apiXoaDatPhong = "http://localhost:8080/dat-phong/xoa";
const apiToHopLoaiPhong =
  "http://localhost:8080/dat-phong/to-hop-loai-phong-kha-dung";
const apiFindByKey = "http://localhost:8080/dat-phong/findAll";
const apiFindDatPhongToCheckin =
  "http://localhost:8080/dat-phong/dat-phong-to-checkin";
const apiFindDatPhong = "http://localhost:8080/dat-phong/danh-sach-dat-phong";
const apiHuyDatPhong = "http://localhost:8080/dat-phong/huy-dp";

// Hàm lấy danh sách đặt phòng
export const DanhSachDatPhong = (pageable, trangThai) => {
  return authorizedAxiosInstance.get(apiDP, {
    params: {
      page: pageable.page,
      size: pageable.size,
      trangThai: trangThai,
    },
  });
};
export const findDatPhongByMaDatPhong = (maDatPhong) => {
  return authorizedAxiosInstance.get(apiDetailDP, {
    params: {
      maDatPhong: maDatPhong,
    },
  });
};
// Hàm lấy danh sách nhân viên
export const DanhSachNhanVien = () => {
  return authorizedAxiosInstance.get(apiNV);
};

// Hàm lấy danh sách khách hàng
export const DanhSachKhachHang = () => {
  return authorizedAxiosInstance.get(apiKH);
};

// Hàm thêm mới đặt phòng (POST)
export const ThemMoiDatPhong = (DatPhongRequest) => {
  return authorizedAxiosInstance.post(apiDPAdd, DatPhongRequest);
};

export const DatPhongDetail = (id) => {
  return authorizedAxiosInstance.get(`${apiDetail}/${id}`);
};

export const CapNhatDatPhong = (DatPhongRequest) => {
  return authorizedAxiosInstance.put(apiDPUpdate, DatPhongRequest);
};

export const HienThiTheoLoc = (pageable, trangThai) => {
  const params = new URLSearchParams({
    page: pageable.page,
    size: pageable.size,
  });

  // Nếu trangThai là một mảng và có phần tử, thêm chúng vào params
  if (trangThai && trangThai.length > 0) {
    trangThai.forEach((status) => {
      params.append("trangThai", status);
    });
  }

  return authorizedAxiosInstance.get(apiLoc, { params: params });
};

export const ThemKhachHangDatPhong = (khachHangRequest) => {
  return authorizedAxiosInstance.post(apiCreateKHDP, khachHangRequest);
};

export const SuaKhachHangDatPhong = (khachHangRequest) => {
  return authorizedAxiosInstance.put(apiUpdateKHDP, khachHangRequest);
};

export const XoaKhachHangDatPhong = (khachHang) => {
  return authorizedAxiosInstance.delete(apiDeleteKHDP, khachHang);
};
export const XoaDatPhong = (iddp) => {
  return authorizedAxiosInstance.delete(apiXoaDatPhong, iddp);
};

export const toHopLoaiPhong = async (
  ngayNhanPhong,
  ngayTraPhong,
  soNguoi,
  key,
  tongChiPhiMin,
  tongChiPhiMax,
  tongSucChuaMin,
  tongSucChuaMax,
  tongSoPhongMin,
  tongSoPhongMax,
  loaiPhongChons,
  pageable
) => {
  const response = await authorizedAxiosInstance.post(
    apiToHopLoaiPhong,
    {
      ngayNhanPhong,
      ngayTraPhong,
      soNguoi,
      key,
      tongChiPhiMin: tongChiPhiMin || null,
      tongChiPhiMax: tongChiPhiMax || null,
      tongSucChuaMin: tongSucChuaMin || null,
      tongSucChuaMax: tongSucChuaMax || null,
      tongSoPhongMin: tongSoPhongMin || null,
      tongSoPhongMax: tongSoPhongMax || null,
      loaiPhongChons,
    },
    {
      params: {
        page: pageable.page,
        size: pageable.size,
      },
    }
  );
  return response.data;
};

export const findDatPhongByKey = (keyword, pageable) => {
  return authorizedAxiosInstance.get(apiFindByKey, {
    params: {
      keyword: keyword,
      size: pageable.size,
      page: pageable.page,
    },
  });
};

export const findDatPhongToCheckin = (
  pageable,
  key,
  ngayNhanPhong,
  ngayTraPhong
) => {
  return authorizedAxiosInstance.get(apiFindDatPhongToCheckin, {
    params: {
      size: pageable.size,
      page: pageable.page,
      key: key,
      ngayNhanPhong: ngayNhanPhong ? ngayNhanPhong.format("YYYY-MM-DD") : null,
      ngayTraPhong: ngayTraPhong ? ngayTraPhong.format("YYYY-MM-DD") : null,
    },
  });
};

export const findDatPhong = async ({
  key = "",
  ngayNhanPhong = null,
  ngayTraPhong = null,
  pageable = { page: 0, size: 10 },
} = {}) => {
  try {
    const params = {
      key: key.trim(),
      ngayNhanPhong: ngayNhanPhong,
      ngayTraPhong: ngayTraPhong,
      page: pageable.page,
      size: pageable.size,
    };

    const response = await authorizedAxiosInstance.get(apiFindDatPhong, {
      params,
      paramsSerializer: (params) => {
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          if (value !== null && value !== undefined) {
            searchParams.append(key, value);
          }
        }
        return searchParams.toString();
      },
    });

    return response.data;
  } catch (error) {
    const errorDetails = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      endpoint: "/danh-sach",
    };
    console.error("Error in findDatPhong:", errorDetails);
    throw Object.assign(error, { details: errorDetails });
  }
};

export const huyDatPhong = (maDatPhong) => {
  return authorizedAxiosInstance.get(apiHuyDatPhong, {
    params: {
      maDatPhong: maDatPhong,
    },
  });
};
