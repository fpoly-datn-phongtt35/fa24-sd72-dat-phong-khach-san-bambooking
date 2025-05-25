import axios from "axios";
import authorizedAxiosInstance from "../utils/authorizedAxios";
const api = "http://localhost:8080/loai-phong/index";
const apiadd = "http://localhost:8080/loai-phong/add";
const apiUD = "http://localhost:8080/loai-phong/update";
const apiDE = "http://localhost:8080/loai-phong/delete";
const apiTi = "http://localhost:8080/tien-ich-phong/home";
const apiFilter = "http://localhost:8080/loai-phong/filter";
const apiGetAll = "http://localhost:8080/loai-phong";
const apiAdd = "http://localhost:8080/dich_vu_di_kem/add";
const apiKiemTraDon = "http://localhost:8080/loai-phong/kiem-tra-don";
const apiKiemTraDa = "http://localhost:8080/loai-phong/kiem-tra-da";
const apiGetLoaiPhongKhaDungResonse =
  "http://localhost:8080/loai-phong/loai-phong-kha-dung-list";
const apiGetLPKDRL = "http://localhost:8080/loai-phong/lpkdr-list";
const apiGetLoaiPhongById = "http://localhost:8080/loai-phong";

export const ThemDichVuDiKem = (dvDiKem) => {
  return authorizedAxiosInstance.post(apiAdd, dvDiKem);
};
// export const listTienNghi = () => axios.get(api);

export const listLoaiPhong = (pageable) => {
  return authorizedAxiosInstance.get(api, {
    params: {
      page: pageable.page,
      size: pageable.size,
    },
  });
};

export const getAllLoaiPhong = () => {
  return authorizedAxiosInstance.get(apiGetAll);
};

// Service call trong frontend
export const DanhSachVatTuLoaiPhong = (idLoaiPhong) => {
  return authorizedAxiosInstance.get(
    `http://localhost:8080/vat-tu-loai-phong/findByIDLoaiPhong/${idLoaiPhong}`
  );
};
// Service call trong frontend
export const DanhSachDichVuDiKem = (idLoaiPhong, pageable) => {
  return authorizedAxiosInstance.get(
    `http://localhost:8080/dich_vu_di_kem/findByIDLoaiPhong/${idLoaiPhong}`,
    {
      params: {
        page: pageable.page,
        size: pageable.size,
      },
    }
  );
};

export const addLoaiPhong = (loaiPhongRequest) => {
  return authorizedAxiosInstance.post(apiadd, loaiPhongRequest);
};

export const updateLoaiPhong = (loaiPhongRequest) => {
  return authorizedAxiosInstance.post(apiUD, loaiPhongRequest);
};

// Thay đổi hàm delete để truyền vào id và sử dụng phương thức DELETE
export const deleteLoaiPhong = (id) => {
  return authorizedAxiosInstance.delete(`${apiDE}/${id}`);
};

export const TienIchPhongByIDLoaiPhong = (idLoaiPhong, pageable) => {
  return authorizedAxiosInstance.get(`${apiTi}/${idLoaiPhong}`, {
    params: {
      page: pageable.page,
      size: pageable.size,
    },
  });
};

export const filterLoaiPhong = (
  tenLoaiPhong,
  dienTichMin,
  dienTichMax,
  soKhachTieuChuan,
  soKhachToiDa,
  treEmTieuChuan,
  treEmToiDa,
  donGiaMin,
  donGiaMax,
  phuThuNguoiLonMin,
  phuThuNguoiLonMax,
  phuThuTreEmMin,
  phuThuTreEmMax,
  trangThai,
  pageable
) => {
  // Kiểm tra nếu pageable là null hoặc undefined, cung cấp giá trị mặc định
  const page = pageable?.page ?? 0;
  const size = pageable?.size ?? 10;

  // Tạo đối tượng params với các giá trị tìm kiếm và phân trang
  const params = {
    tenLoaiPhong,
    dienTichMin,
    dienTichMax,
    soKhachTieuChuan,
    soKhachToiDa,
    treEmTieuChuan,
    treEmToiDa,
    donGiaMin,
    donGiaMax,
    phuThuNguoiLonMin,
    phuThuNguoiLonMax,
    phuThuTreEmMin,
    phuThuTreEmMax,
    trangThai,
    page,
    size,
  };

  // Loại bỏ các thuộc tính có giá trị null, undefined hoặc rỗng
  Object.keys(params).forEach((key) => {
    if (
      params[key] === "" ||
      params[key] === undefined ||
      params[key] === null
    ) {
      delete params[key]; // Xóa các thuộc tính không cần thiết
    }
  });

  // Gọi API filter với các params hợp lệ
  return authorizedAxiosInstance.get(apiFilter, { params }).catch((error) => {
    console.error("Lỗi khi gọi API filterLoaiPhong:", error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi
  });
};

export const kiemTraDon = (ngayNhanPhong, ngayTraPhong, soNguoi) => {
  return authorizedAxiosInstance.get(apiKiemTraDon, {
    params: {
      ngayNhanPhong,
      ngayTraPhong,
      soNguoi,
    },
  });
};

export const kiemTraDa = (ngayNhanPhong, ngayTraPhong, soNguoi) => {
  return authorizedAxiosInstance.get(apiKiemTraDa, {
    params: {
      ngayNhanPhong,
      ngayTraPhong,
      soNguoi,
    },
  });
};

export const getLoaiPhongKhaDungResponse = (ngayNhanPhong, ngayTraPhong) => {
  return authorizedAxiosInstance.get(apiGetLoaiPhongKhaDungResonse, {
    params: {
      ngayNhanPhong,
      ngayTraPhong,
    },
  });
};

export const getLPKDRL = (
  ngayNhanPhong,
  ngayTraPhong,
  soNguoi,
  soPhong,
  idLoaiPhong
) => {
  return authorizedAxiosInstance.get(apiGetLPKDRL, {
    params: {
      ngayNhanPhong,
      ngayTraPhong,
      soNguoi,
      soPhong,
      idLoaiPhong,
    },
  });
};

export const getLoaiPhongById = (id) => {
  return authorizedAxiosInstance.get(`${apiGetLoaiPhongById}/${id}`);
};
