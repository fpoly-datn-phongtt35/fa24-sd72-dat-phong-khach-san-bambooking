import authorizedAxiosInstance from '../utils/authorizedAxios';
const api = "http://localhost:8080/vat-tu-loai-phong/index";
const apiadd = "http://localhost:8080/vat-tu-loai-phong/add";
const apiTI = "http://localhost:8080/vat-tu/home";
const apiLP = "http://localhost:8080/loai-phong/home";
const apiUD = "http://localhost:8080/vat-tu-loai-phong/update";
const apiDE = "http://localhost:8080/vat-tu-loai-phong/delete";

// export const listTienNghi = () => axios.get(api);

export const listVatTuLoaiPhong= () => {
    return authorizedAxiosInstance.get(api);
};

export const addVatTuLoaiPhong = (vatTuLoaiPhongRequest) => {
    return authorizedAxiosInstance.post(apiadd, vatTuLoaiPhongRequest);
};

export const DSVatTu = () => {
    return authorizedAxiosInstance.get(apiTI);
};

// Hàm lấy danh sách loại phòng
export const DSLoaiPhong = () => {
    return authorizedAxiosInstance.get(apiLP);
};

export const updateVatTuLoaiPhong = (vatTuLoaiPhongRequest) => {
    return authorizedAxiosInstance.post(apiUD, vatTuLoaiPhongRequest);
};

// Thay đổi hàm delete để truyền vào id và sử dụng phương thức DELETE
export const deleteVatTuLoaiPhong = (id) => {
    return authorizedAxiosInstance.delete(`${apiDE}/${id}`);
};
