import authorizedAxiosInstance from "../utils/authorizedAxios";

const apiHoaDon = "http://localhost:8080/api/hoa-don";
const apigetHDByidDatPhong = "http://localhost:8080/api/hoa-don/findidHD";
const apiThongTinHoaDon = "http://localhost:8080/api/tthd"
const apiDichVuSuDung = "http://localhost:8080/api/tthd/dich-vu-su-dung";


export const getHoaDonById = (idHoaDon) => {
    return authorizedAxiosInstance.get(`${apiHoaDon}/${idHoaDon}`);
};

export const getThongTinHoaDonByHoaDonId = (idHoaDon) => {
    return authorizedAxiosInstance.get(`${apiThongTinHoaDon}/${idHoaDon}`);
};

export const getDichVuSuDung = (idHoaDon) =>{
    return authorizedAxiosInstance.get(`${apiDichVuSuDung}/${idHoaDon}`);
};

export const getPhuThuByHoaDonId = (idHoaDon) =>{
    return authorizedAxiosInstance.get(`http://localhost:8080/api/tthd/phu-thu/${idHoaDon}`)
}

export const getHDByidDatPhong = (idDatPhong) => {
    return authorizedAxiosInstance.get(`${apigetHDByidDatPhong}/${idDatPhong}`);
};

export const getListVatTuHongThieu =(idHoaDon) =>{
    return authorizedAxiosInstance.get(`http://localhost:8080/api/tthd/list-vat-tu-hong-thieu/${idHoaDon}`)
}


//Không yc xác thực
export const getHoaDonByIdTC = (idHoaDon) => {
    return authorizedAxiosInstance.get(`http://localhost:8080/api/tra-cuu/hoa-don/${idHoaDon}`);
};

export const getThongTinHoaDonByHoaDonIdTC = (idHoaDon) => {
    return authorizedAxiosInstance.get(`http://localhost:8080/api/tra-cuu/tthd/${idHoaDon}`);
};

export const getDichVuSuDungTC = (idHoaDon) =>{
    return authorizedAxiosInstance.get(`http://localhost:8080/api/tra-cuu/tthd/dich-vu-su-dung/${idHoaDon}`);
};

export const getPhuThuByHoaDonIdTC = (idHoaDon) =>{
    return authorizedAxiosInstance.get(`http://localhost:8080/api/tra-cuu/tthd/phu-thu/${idHoaDon}`)
}

export const getHDByidDatPhongTC = (idDatPhong) => {
    return authorizedAxiosInstance.get(`http://localhost:8080/api/tra-cuu/hoa-don/findidHD/${idDatPhong}`);
};

export const getListVatTuHongThieuTC =(idHoaDon) =>{
    return authorizedAxiosInstance.get(`http://localhost:8080/api/tra-cuu/tthd/list-vat-tu-hong-thieu/${idHoaDon}`)
}