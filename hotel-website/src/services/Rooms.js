import authorizedAxiosInstance from "../utils/authorizedAxios";

const api = "http://localhost:8080/loai-phong/index";
const apiadd = "http://localhost:8080/loai-phong/add";
const apiUD = "http://localhost:8080/loai-phong/update";
const apiDE = "http://localhost:8080/loai-phong/delete";
const apiTi = "http://localhost:8080/tien-ich-phong/home";
const apiFilter = "http://localhost:8080/loai-phong/filter";
const apiGetAll = "http://localhost:8080/api/loai-phong";
const apiAdd = "http://localhost:8080/dich_vu_di_kem/add";
const apiGetAnhLP = "http://localhost:8080/api/loai-phong/getAnhLP";
export const ThemDichVuDiKem = (dvDiKem) => {
    return authorizedAxiosInstance.post(apiAdd, dvDiKem);
};
// export const listTienNghi = () => axios.get(api);

export const listLoaiPhong = (pageable) => {
    return authorizedAxiosInstance.get(api, {
        params: {
            page: pageable.page,
            size: pageable.size
        }
    });
};

// ../services/Rooms.js
export const getAllLoaiPhong = async () => {
    return authorizedAxiosInstance.get(apiGetAll);
};



// Service call trong frontend
export const DanhSachVatTuLoaiPhong = (idLoaiPhong) => {
    return authorizedAxiosInstance.get(`http://localhost:8080/vat-tu-loai-phong/findByIDLoaiPhong/${idLoaiPhong}`);
};
// Service call trong frontend
export const DanhSachDichVuDiKem = (idLoaiPhong, pageable) => {
    return authorizedAxiosInstance.get(`http://localhost:8080/dich_vu_di_kem/findByIDLoaiPhong/${idLoaiPhong}`, {
        params: {
            page: pageable.page,
            size: pageable.size,
        }
    });
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
    return authorizedAxiosInstance.get(apiFilter, { params });


};

export const getAnhLP = async (idLoaiPhong) => {
    return authorizedAxiosInstance.get(`${apiGetAnhLP}/${idLoaiPhong}`);
};



