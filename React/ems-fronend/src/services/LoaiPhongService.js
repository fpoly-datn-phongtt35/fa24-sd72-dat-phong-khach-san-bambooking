import axios from "axios";
const api = "http://localhost:8080/loai-phong/index";
const apiadd = "http://localhost:8080/loai-phong/add";
const apiUD = "http://localhost:8080/loai-phong/update";
const apiDE = "http://localhost:8080/loai-phong/delete";
const apiTi = "http://localhost:8080/tien-ich-phong/home";
const apiFilter = "http://localhost:8080/loai-phong/filter";

const apiAdd = "http://localhost:8080/dich_vu_di_kem/add";
export const ThemDichVuDiKem = (dvDiKem) => {
    return axios.post(apiAdd, dvDiKem);
};
// export const listTienNghi = () => axios.get(api);

export const listLoaiPhong = (pageable) => {
    return axios.get(api, {
        params: {
            page: pageable.page,
            size: pageable.size
        }
    });
};


// Service call trong frontend
export const DanhSachTienIchPhong = (idLoaiPhong, pageable) => {
    return axios.get(`http://localhost:8080/tien-ich-phong/findByIDLoaiPhong/${idLoaiPhong}`, {
        params: {
            page: pageable.page,
            size: pageable.size,
        }
    });
};
// Service call trong frontend
export const DanhSachDichVuDiKem = (idLoaiPhong, pageable) => {
    return axios.get(`http://localhost:8080/dich_vu_di_kem/findByIDLoaiPhong/${idLoaiPhong}`, {
        params: {
            page: pageable.page,
            size: pageable.size,
        }
    });
};



export const addLoaiPhong = (loaiPhongRequest) => {
    return axios.post(apiadd, loaiPhongRequest);
};

export const updateLoaiPhong = (loaiPhongRequest) => {
    return axios.post(apiUD, loaiPhongRequest);
};

// Thay đổi hàm delete để truyền vào id và sử dụng phương thức DELETE
export const deleteLoaiPhong = (id) => {
    return axios.delete(`${apiDE}/${id}`);
};

export const TienIchPhongByIDLoaiPhong = (idLoaiPhong, pageable) => {
    return axios.get(`${apiTi}/${idLoaiPhong}`, {
        params: {
            page: pageable.page,
            size: pageable.size,
        }
    });
};

export const filterLoaiPhong = (tenLoaiPhong, dienTichMin, dienTichMax, soKhach, donGiaMin,
    donGiaMax, donGiaPhuThuMin, donGiaPhuThuMax, pageable) => {
    // Tạo đối tượng params với các giá trị tìm kiếm và phân trang
    const params = {
        tenLoaiPhong,
        dienTichMin,
        dienTichMax,
        soKhach,
        donGiaMin,
        donGiaMax,
        donGiaPhuThuMin,
        donGiaPhuThuMax,
        page: pageable.page,
        size: pageable.size,
    };

    // Loại bỏ các thuộc tính có giá trị null, undefined hoặc rỗng
    Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === undefined || params[key] === null) {
            delete params[key];  // Dùng 'delete' để xóa các thuộc tính không cần thiết
        }
    });

    // Gọi API filter với các params hợp lệ
    return axios.get(apiFilter, { params });
};



